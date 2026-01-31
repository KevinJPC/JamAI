import { useEffect, useMemo, useRef } from 'react'

import { useYoutubePlayerContext } from '@/features/song/youtube-player/YoutubePlayerContext'
import { findClosestBinarySearch } from '@/shared/utils/findClosestBinarySearch'

export function useCurrentBeatIndex (beatChords) {
  const { currentTime } = useYoutubePlayerContext()

  const currentBeatIndexRef = useRef(0)

  const beatTimes = useMemo(() => beatChords.map(beat => beat.time), [beatChords])

  const currentBeatIndex = useMemo(() => {
    const currentBeatIndex = currentBeatIndexRef.current
    const beatTimeNextToCurrent = beatTimes[currentBeatIndex + 1]?.time
    const beatTimePrevToCurrent = beatTimes[currentBeatIndex - 1]?.time

    const stillInCurrentBeat = (currentTime >= beatTimePrevToCurrent && currentTime < beatTimeNextToCurrent)

    // is in last beat or has not changed of beat
    if (stillInCurrentBeat) return currentBeatIndexRef.current

    // Is a new beatIndex so we search for it
    return findClosestBinarySearch(beatTimes, currentTime)
  }, [beatTimes, currentTime])

  useEffect(() => {
    currentBeatIndexRef.current = currentBeatIndex
  }, [currentBeatIndex])

  return currentBeatIndex
}
