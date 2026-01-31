import { useCallback, useEffect, useRef, useState } from 'react'
import { z } from 'zod'

import { useStableRef } from '@/shared/hooks/useStableRef.js'
import { getItemFromLocalStorage, setItemToLocalStorage } from '@/shared/utils/localStorage.js'

import {
  COMMIT_PLAYER_TIME_UPDATE_DELAY_MS,
  DEFAULT_VOLUME,
  MIN_AUDIBLE_VOLUME,
  PLAYER_ERROR_CODES,
  PLAYER_ERROR_CODES_BY_YOUTUBE_INTERNAL_ERRORS,
  PLAYER_LOADING_STATUS,
  RELEASE_IS_SEEKING_LOCK_MS,
  UPDATE_CURRENT_TIME_FREQUENCY_MS
} from './constans.js'
import { YoutubePlayerContext } from './YoutubePlayerContext.js'

const PERSISTED_PLAYER_VOLUME_STORAGE_KEY = 'player-volume'

const persistedVolumeSchema = z.object({
  previous: z.number(),
  current: z.number()
})

const getPersistedVolume = () => {
  const persistedVolume = getItemFromLocalStorage(PERSISTED_PLAYER_VOLUME_STORAGE_KEY)
  const parsedVolume = persistedVolumeSchema.safeParse(persistedVolume).data
  return parsedVolume ?? DEFAULT_VOLUME
}

const setPersistedVolume = (newVal) => {
  setItemToLocalStorage(PERSISTED_PLAYER_VOLUME_STORAGE_KEY, newVal)
}

const getInitialPlayerState = () => ({
  isPlaying: false,
  currentTime: 0,
  errorCode: null,
  loadingStatus: PLAYER_LOADING_STATUS.LOADING,
  volume: getPersistedVolume()
})

function getNoCookieYoutubeSrcFromVideoId (videoId) {
  return `https://youtube-nocookie.com/embed/${videoId}`
}

// TODO: think about using setState in render body to reset state instead of letting caller doing it using key prop
// TODO: refactor but keep current implementation idea

export const YoutubePlayerProvider = ({
  youtubeId,
  children
}) => {
  const playerRef = useRef()
  const scheduledPlayerTimeCommitTimeoutId = useRef(null)

  const [{
    isPlaying,
    loadingStatus,
    currentTime,
    currentYoutubeId,
    errorCode,
    volume
  }, setPlayerState] =
  useState(() => ({ ...getInitialPlayerState(), currentYoutubeId: youtubeId }))

  if (currentYoutubeId !== youtubeId) {
    clearTimeout(scheduledPlayerTimeCommitTimeoutId.current)
    setPlayerState({ ...getInitialPlayerState(), currentYoutubeId: youtubeId })
  }

  const onCurrentTimeChange = (newTime) => {
    setPlayerState(prev => ({ ...prev, currentTime: newTime }))
  }

  const hasPendingPlayerTimeCommit = () => !!scheduledPlayerTimeCommitTimeoutId.current

  const { pauseHfTimeUpdates, scheduleResumeHfTimeUpdates } =
   useHighFrequencyTimeUpdater({
     playerRef,
     currentTime,
     onCurrentTimeChange,
     isPlaying,
     hasPendingPlayerTimeCommit
   })

  const isMuted = volume.current === 0

  const src = getNoCookieYoutubeSrcFromVideoId(youtubeId)

  const schedulePlayerTimeCommit = useCallback((newTime) => {
    clearTimeout(scheduledPlayerTimeCommitTimeoutId.current)

    scheduledPlayerTimeCommitTimeoutId.current = setTimeout(() => {
      if (!playerRef.current) return
      playerRef.current.currentTime = newTime
      scheduledPlayerTimeCommitTimeoutId.current = null
    }, COMMIT_PLAYER_TIME_UPDATE_DELAY_MS)
  }, [])

  const handleSeek = useCallback((newTime) => {
    if (!playerRef.current || loadingStatus !== PLAYER_LOADING_STATUS.LOADED) return false
    window.requestAnimationFrame(() => {
      setPlayerState(prev => ({ ...prev, currentTime: newTime, isPlaying: true }))
      pauseHfTimeUpdates()
      schedulePlayerTimeCommit(newTime)
    })
    return true
  }, [loadingStatus, pauseHfTimeUpdates, schedulePlayerTimeCommit])

  const handlePlay = useCallback(() => {
    setPlayerState((prev) => {
      if (prev.isPlaying || prev.loadingStatus !== PLAYER_LOADING_STATUS.LOADED) return prev
      return { ...prev, isPlaying: true }
    })
  }, [])

  const handlePause = useCallback(() => {
    setPlayerState((prev) => {
      if (!prev.isPlaying || prev.loadingStatus !== PLAYER_LOADING_STATUS.LOADED) return prev
      return { ...prev, isPlaying: false }
    })
  }, [])

  const handleVolumeChange = useCallback((newVolume) => {
    setPlayerState(prev => ({ ...prev, volume: { current: newVolume, previous: prev.volume.current } }))
  }, [])

  const handleMute = useCallback(() => {
    handleVolumeChange(0)
  }, [handleVolumeChange])

  const handleUnmute = useCallback(() => {
    const restoredVolume = isMuted ? Math.max(volume.previous, MIN_AUDIBLE_VOLUME) : 0
    handleVolumeChange(restoredVolume)
  }, [handleVolumeChange, volume])

  const handleSeeked = useCallback(() => {
    scheduleResumeHfTimeUpdates()
  }, [scheduleResumeHfTimeUpdates])

  const handleInitialLoad = useCallback(() => {
    setPlayerState(prev => {
      if (prev.loadingStatus !== PLAYER_LOADING_STATUS.LOADING) return prev
      return ({ ...prev, loadingStatus: PLAYER_LOADING_STATUS.LOADED })
    })
  }, [])

  const handleError = useCallback((e) => {
    const error = e.target.error
    console.error(error.message)
    setPlayerState(prev => ({
      ...prev,
      loadingStatus: PLAYER_LOADING_STATUS.ERROR,
      errorCode: PLAYER_ERROR_CODES_BY_YOUTUBE_INTERNAL_ERRORS[error.code] ?? PLAYER_ERROR_CODES.UNKNOWN
    }))
  }, [])

  useEffect(() => {
    // syncs volume on change
    setPersistedVolume(volume)
  }, [volume])

  return (
    <YoutubePlayerContext.Provider
      value={{
        playerRef,
        src,
        youtubeId,
        loadingStatus,
        isPlaying,
        currentTime,
        duration: 0,
        isMuted,
        errorCode,
        volume,
        handleMute,
        handleUnmute,
        handlePlay,
        handlePause,
        handleSeek,
        handleSeeked,
        handleVolumeChange,
        handleInitialLoad,
        handleError,
      }}
    >
      {children}
    </YoutubePlayerContext.Provider>
  )
}

/**
 * We use a high-frequency (HF) time updater instead of relying on ReactPlayer’s
 * time callbacks because their update rate is inconsistent and not suitable for
 * music or beat-level synchronization.
 *
 * This player uses YouTube as the underlying media source. ReactPlayer does not
 * expose a true high-frequency time change event; its time updates are derived
 * indirectly (e.g. via postMessage polling or internal intervals), which results
 * in variable and sometimes coarse update rates.
 *
 * Even when using the YouTube IFrame API directly, time updates remain
 * inconsistent for this use case. This behavior may be related to the same
 * constraints described by the HTMLMediaElement `timeupdate` event, whose
 * firing rate is intentionally throttled and varies with system load.
 * See for more: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event
 *
 * Such variability is acceptable for UI progress updates, but it causes drift
 * and jitter for music-sync logic. The HF updater provides predictable,
 * controlled updates, along with a mechanism to gate updates during
 * programmatic time commits to avoid stale updates and visible jitter.
 */

function useHighFrequencyTimeUpdater ({ playerRef, currentTime, onCurrentTimeChange, hasPendingPlayerTimeCommit, isPlaying }) {
  // HF time updates are gated imperatively via refs because using state + useEffect
  // would introduce render latency and stale windows, causing visible time jitter
  // during seeking and programmatic time commits.
  // This is not needed for play / pause, which is a stable playback state that
  // does not change at high frequency (unlike currentTime) and can safely be
  // handled via React state and effects.

  const scheduledResumeHfTimeUpdatesTimeoutIdRef = useRef(null)
  const isHfTimeUpdatesPausedRef = useRef(false)

  const currentTimeStableRef = useStableRef(currentTime)
  const hasPendingPlayerTimeCommitStableRef = useStableRef(hasPendingPlayerTimeCommit)
  const onCurrentTimeChangeStableRef = useStableRef(onCurrentTimeChange)

  useEffect(() => {
    if (!isPlaying) return

    let highFrecuencyTimeUpdaterAnimationFrameId = null

    const startHighFrecuencyTimeUpdater = () => {
      if (highFrecuencyTimeUpdaterAnimationFrameId) return
      const pullTimeAndUpdate = () => {
        if (!playerRef.current ||
          isHfTimeUpdatesPausedRef.current ||
          hasPendingPlayerTimeCommitStableRef.current()) return

        const newCurrentTime = playerRef.current.currentTime

        if (currentTimeStableRef.current === newCurrentTime) return
        onCurrentTimeChangeStableRef.current(newCurrentTime)
      }
      let lastTime = 0
      const frameRequestCallback = (time) => {
        const delta = time - lastTime
        if (delta >= UPDATE_CURRENT_TIME_FREQUENCY_MS) {
          lastTime = time
          pullTimeAndUpdate()
        }
        highFrecuencyTimeUpdaterAnimationFrameId = window.requestAnimationFrame(frameRequestCallback)
      }
      highFrecuencyTimeUpdaterAnimationFrameId = window.requestAnimationFrame(frameRequestCallback)
    }

    const stopHighFrecuencyTimeUpdater = () => {
      window.cancelAnimationFrame(highFrecuencyTimeUpdaterAnimationFrameId)
      highFrecuencyTimeUpdaterAnimationFrameId = null
    }

    startHighFrecuencyTimeUpdater()

    return () => {
      stopHighFrecuencyTimeUpdater()
    }
  }, [isPlaying])

  const pauseHfTimeUpdates = useCallback(() => {
    clearTimeout(scheduledResumeHfTimeUpdatesTimeoutIdRef.current)
    isHfTimeUpdatesPausedRef.current = true
  }, [])

  const scheduleResumeHfTimeUpdates = useCallback(() => {
    clearTimeout(scheduledResumeHfTimeUpdatesTimeoutIdRef.current)
    scheduledResumeHfTimeUpdatesTimeoutIdRef.current = setTimeout(() => {
      if (hasPendingPlayerTimeCommitStableRef.current()) return
      isHfTimeUpdatesPausedRef.current = false
      scheduledResumeHfTimeUpdatesTimeoutIdRef.current = null
    }, RELEASE_IS_SEEKING_LOCK_MS)
  }, [])

  return { pauseHfTimeUpdates, scheduleResumeHfTimeUpdates }
}
