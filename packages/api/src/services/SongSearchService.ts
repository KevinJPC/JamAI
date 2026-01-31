import { jamAIMongoDB } from '../lib/db/JamAIMongoDB.js'
import { YoutubeSearchResultResponseSchema } from '../schemas/songsSearch.js'
import { youtubeClient } from '../lib/YoutubeClient.js'
import { parseKnown } from '../utils/parseKnown.js'
import { SearchWithYoutubeQuery, YoutubeSearchResultResponse } from '../types/songsSearch.js'

export class SongSearchService {
  static async searchWithYoutube (query: SearchWithYoutubeQuery): Promise<YoutubeSearchResultResponse[]> {
    const musicalVideosSearchResults = await youtubeClient().searchMusicalVideos({ query: query.q })

    if (musicalVideosSearchResults.length === 0) return []

    const youtubeIds = musicalVideosSearchResults.map(({ id }) => id)

    const alreadyAnalayzedSongsInSearchResults = await jamAIMongoDB().songs().find({ youtubeId: { $in: youtubeIds } }).toArray()

    const youtubeSearchResultsResponse = musicalVideosSearchResults.map<YoutubeSearchResultResponse>(youtubeVideo => {
      const songDoc = alreadyAnalayzedSongsInSearchResults.find(song => {
        return youtubeVideo.id === song.youtubeId
      })

      const youtubeMetadata: YoutubeSearchResultResponse['youtube'] = {
        id: youtubeVideo.id,
        title: youtubeVideo.title,
        channel: {
          id: youtubeVideo.channel.id,
          name: youtubeVideo.channel.name
        }
      }

      if (!songDoc) return parseKnown(YoutubeSearchResultResponseSchema, { isAnalyzed: false, youtube: youtubeMetadata })

      const { _id, defaultVersion, ...restOfSongDoc } = songDoc

      return parseKnown(YoutubeSearchResultResponseSchema, {
        isAnalyzed: true,
        youtube: youtubeMetadata,
        song: {
          ...restOfSongDoc,
          id: _id.toHexString(),
          defaultVersion: {
            ...defaultVersion,
            id: defaultVersion.id.toHexString(),
          },
        }
      })
    })
    return youtubeSearchResultsResponse
  }

  // static async findById ({ id }) {
  //   const videoPromise = youtubeClient().listVideos({ youtubeIds: [id] })
  //   const songPromise = jamAIMongoDB().songs()
  //     .findOne({
  //       youtubeId: id
  //     })
  //   const [video, song] = await Promise.all(videoPromise, songPromise)
  //   if (!video || youtubeClient().isMusicalVideo(video)) throw new NotFoundError('Video not found')
  //   return this.#serialize(video, song)
  // }

  // static #serialize (youtubeResult, song) {
  //   return {
  //     id: youtubeResult.id,
  //     title: youtubeResult.title,
  //     channel: {
  //       id: youtubeResult.channel.id,
  //       name: youtubeResult.channel.name
  //     },
  //     song: song
  //       ? {
  //           _id: song._id,
  //           defaultVersion: {
  //             creatorId: song.defaultVersion.creatorId,
  //             chordsSummary: song.defaultVersion.chordsSummary,
  //             bpm: song.defaultVersion.bpm
  //           }
  //         }
  //       : null
  //   }
  // }
}
