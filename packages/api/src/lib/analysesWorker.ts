import { Job, Worker } from 'bullmq'
import { jamAIMongoDB } from '../lib/db/JamAIMongoDB.js'
import Chord from '@chords-extractor/common/chord'
import Key from '@chords-extractor/common/key'
import { BEATS_PER_BAR } from '@chords-extractor/common/constants'
import { ObjectId, StrictFilter } from 'mongodb'
import config from '../config.js'
import { fetch, Agent } from 'undici'
import { AnalysesJobData, AnalysesJobResult, AnalysesJobType } from './analysesQueue.js'
import { VersionDocument } from './db/documents/VersionDocument.js'
import { Redis } from 'ioredis'

type AnalysesWorker = Worker<AnalysesJobData, AnalysesJobResult, AnalysesJobType>

let _analysesWorker: AnalysesWorker | null = null

export function analysesWorker (): AnalysesWorker {
  if (!_analysesWorker) throw new Error('worker has not been setup, make sure you call `run` function first')
  return _analysesWorker
}

export function setupAnalysesWorker ({ url, clientPrefix }: { url: string, clientPrefix: string }): void {
  _analysesWorker = new Worker('analyses-queue', processorFn, {
    connection: new Redis(url, { maxRetriesPerRequest: null }),
    // use bullmq prefix option instead of ioredis contructor keyPrefix option
    // as mention here: https://docs.bullmq.io/guide/connections#queue
    prefix: clientPrefix,
    concurrency: 1,
    autorun: true
  })

  _analysesWorker.on('ready', () => {
    console.log('Worker is ready')
  })
  _analysesWorker.on('active', (job) => {
    console.log(`Job [${job.id}] active.`)
  })

  _analysesWorker.on('completed', (job) => {
    console.log(
      `Job [${job.id}] completed in ${((job.finishedOn ?? 0) - (job.processedOn ?? 0)) / 1000
      } seconds.`
    )
  })

  _analysesWorker.on('failed', (job, err) => {
    console.log(`Job [${job?.id ?? 'Uknown'}] failed. ${err.message}`)
    console.error(err)
  })

  _analysesWorker.on('error', (err) => {
    console.log(`Analyses worker error. ${err.message}`)
    console.error(err)
  })
}

async function processorFn (job: Job<AnalysesJobData, AnalysesJobResult, AnalysesJobType>): Promise<AnalysesJobResult> {
  // Discard job if audio song already exists

  const video = job.data.video
  const overrideSystemVersionIfSongExists = job.data.overrideIfExists ?? false

  const songAlreadyExists = !!(await jamAIMongoDB()
    .songs()
    .findOne({ youtubeId: video.id }, { projection: { _id: 1 } }))

  // every song is expected to have a system generated version under versions collection
  if (songAlreadyExists && !overrideSystemVersionIfSongExists) throw Error('SONG_ALREADY_EXIST')

  const musicalAnalysisResult = await analyzeYoutubeAudioMusically(video.id)

  return await jamAIMongoDB().withTransaction(async (session) => {
    const currentDate = new Date().toISOString()

    let song = await jamAIMongoDB().songs().findOne({ youtubeId: video.id, })

    let version = song
      ? await jamAIMongoDB().versions().findOne({
        songId: song._id,
        isSystemVersion: true,
      } as StrictFilter<VersionDocument>) // strict filter allows to have type safe dot notation, but its experimental
      : null

    if (song && version && version.isDefault) {
      song.defaultVersion = {
        ...song.defaultVersion,
        bpm: musicalAnalysisResult.bpm,
        key: musicalAnalysisResult.key
      }
      song.modifiedAt = currentDate
    }

    const versionId = version?._id ?? new ObjectId()

    if (!song) {
      song = {
        _id: new ObjectId(),
        title: video.title,
        youtubeId: video.id,
        duration: video.duration,
        youtubeChannel: {
          id: video.channel.id,
          name: video.channel.name
        },
        favoritesCount: 0,
        defaultVersion: {
          id: versionId,
          key: musicalAnalysisResult.key,
          bpm: musicalAnalysisResult.bpm,
        },
        createdAt: currentDate,
        modifiedAt: currentDate
      }
    }

    if (version) {
      version = {
        ...version,
        key: musicalAnalysisResult.key,
        bpm: musicalAnalysisResult.bpm,
        beatChords: musicalAnalysisResult.beatChords,
        beatsCount: musicalAnalysisResult.beatsCount,
        beatsPerBar: musicalAnalysisResult.beatsPerBar,
        shiftViewValue: musicalAnalysisResult.shiftViewValue,
        modifiedAt: currentDate
      }
    }

    if (!version) {
      version = {
        _id: versionId,
        songId: song._id,
        isDefault: true,
        key: musicalAnalysisResult.key,
        bpm: musicalAnalysisResult.bpm,
        beatChords: musicalAnalysisResult.beatChords,
        beatsCount: musicalAnalysisResult.beatsCount,
        beatsPerBar: musicalAnalysisResult.beatsPerBar,
        shiftViewValue: musicalAnalysisResult.shiftViewValue,
        user: null,
        ratings: [],
        ratingCount: 0,
        ratingAverage: 0,
        createdAt: currentDate,
        modifiedAt: currentDate,
        isSystemVersion: true
      }
    }

    await jamAIMongoDB().songs().replaceOne({ _id: song._id }, song, { upsert: true, session, })

    await jamAIMongoDB().versions().replaceOne({ _id: version._id }, version, { upsert: true, session })

    const result: AnalysesJobResult = {
      id: song._id.toHexString(),
      youtubeId: song.youtubeId,
      title: song.title,
      duration: song.duration,
      youtubeChannel: {
        id: song.youtubeChannel.id,
        name: song.youtubeChannel.name,
      },
      defaultVersion: {
        id: song.defaultVersion.id.toHexString(),
        bpm: song.defaultVersion.bpm,
        key: {
          mode: song.defaultVersion.key.mode,
          pitchClass: song.defaultVersion.key.pitchClass
        }
      }
    }

    return result
  })
};

/**
 * Custom Undici Agent used for calling the analyzer API.
 * Node's fetch uses Undici internally, but creating a custom Agent
 * allows to increase the headersTimeout.
 * We set the value to be 600 seconds (600_000 ms), instead of 300 seconds as per default, so the API has more time to respond,
 * while leaving rest of the config with the default values.
 *
 * see the docs
 * Agent:https://undici.nodejs.org/#/docs/api/Agent.md which extends from Dispatcher: https://undici.nodejs.org/#/docs/api/Dispatcher?id=parameter-dispatchoptions
 */
const analyzerApiCustomAgent = new Agent({
  headersTimeout: 600_000 // 600 seconds
})

type PythonAnalysisResponse = {
  key: {
    pitch_class: keyof typeof Key.dictionaries.PITCH_CLASSES,
    mode: keyof typeof Key.dictionaries.KEY_MODES
  },
  bpm: number,
  beat_chords: { time: number, number: number, chord: string | null }[]
  beats_per_bar: keyof typeof BEATS_PER_BAR
}

async function analyzeYoutubeAudioMusically (youtubeId: string) {
  const res = await fetch(`${config.pythonAnalyzerApi.url}/api/analyze`, {
    dispatcher: analyzerApiCustomAgent,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.pythonAnalyzerApi.apiKey}`
    },
    body: JSON.stringify({
      youtube_id: youtubeId
    })

  })
  if (!res.ok) throw new Error('Error analyzing youtube audio', { cause: res })

  const pythonAnalysisResult = await res.json() as PythonAnalysisResponse

  const unknownChordsStrings: string[] = []
  const parsedBeatChords = pythonAnalysisResult.beat_chords.map((beatChord) => {
    if (!beatChord.chord) return beatChord
    let parsedChordString: string | null = null
    try {
      let parsedChord = Chord.parseChordString(beatChord.chord)
      parsedChord = Chord.modifyAccidental(parsedChord, Chord.accidentals.sharp)
      parsedChordString = parsedChord.symbol
    } catch (_) {
      unknownChordsStrings.push(beatChord.chord)
    }
    beatChord.chord = parsedChordString
    return beatChord
  })

  if (unknownChordsStrings.length > 0) {
    console.warn(`Could not parsed all chord strings.\n Unknown chords strings ${unknownChordsStrings}`)
  }

  const firstBeatNumber = parsedBeatChords[0]?.number ?? 1
  // Count of placeholder chords required so the first real chord lands on the downbeat
  const shiftViewValue = (firstBeatNumber - 1) % pythonAnalysisResult.beats_per_bar

  return {
    key: {
      pitchClass: pythonAnalysisResult.key.pitch_class,
      mode: pythonAnalysisResult.key.mode
    },
    bpm: pythonAnalysisResult.bpm,
    beatChords: parsedBeatChords,
    beatsPerBar: pythonAnalysisResult.beats_per_bar,
    beatsCount: pythonAnalysisResult.beat_chords.length,
    shiftViewValue
  }
}
