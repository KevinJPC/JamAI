import { forwardRef, useCallback, useDeferredValue, useRef } from 'react'
import classNames from 'classnames'

import { ChordsGrid, MemoizedChord } from '@/features/song/chords/ChordsGrid'
import { AutoScrollControl } from '@/features/song/chords/general-view/toolbar-controls/AutoScrollControl'
import { ChordsAccidentalControl } from '@/features/song/chords/general-view/toolbar-controls/ChordsAccidentalControl'
import { SimplifyChordsControl } from '@/features/song/chords/general-view/toolbar-controls/SimplyChordsControl'
import { TransposeChordsControl } from '@/features/song/chords/general-view/toolbar-controls/TransposeChordsControl'
import { useBeatsContinueScrolling } from '@/features/song/chords/general-view/useBeatsContinueScrolling'
import { SeekToStartControl } from '@/features/song/chords/toolbar-controls/SeekToStartControl'
import { TogglePlayControl } from '@/features/song/chords/toolbar-controls/TogglePlayControl'
import { VolumeControl } from '@/features/song/chords/toolbar-controls/VolumeControl'
import { useCurrentBeatIndex } from '@/features/song/chords/useCurrentBeatIndex'
import { useYoutubePlayerContext } from '@/features/song/youtube-player/YoutubePlayerContext'
import { Toolbar } from '@/shared/components/Toolbar'
import { useCustomizedChords } from '@/shared/hooks/useCustomizedChords'
import { useStableRef } from '@/shared/hooks/useStableRef'
import { useSongVersionSettings } from '@/shared/song-version-settings/SongVersionSettingsContext'
import { useUserPreferences } from '@/shared/user-preferences/UserPreferencesContext'

import '@/features/song/chords/ChordsView.css'

export const GeneralView = ({ version, className, toolbarClassName }) => {
  const toolbarStickyWrapperRef = useRef()

  return (
    <div className={classNames('chords-view', className)}>
      <GeneralViewToolbar className={toolbarClassName} ref={toolbarStickyWrapperRef} />
      <GeneralViewChordsGrid version={version} toolbarStickyWrapperRef={toolbarStickyWrapperRef} />
    </div>
  )
}

const GeneralViewToolbar = forwardRef(({ className }, ref) => {
  return (
    <div className={classNames('chords-view__toolbar-wrapper', className)} ref={ref}>
      <Toolbar>
        <Toolbar.Option>
          <SeekToStartControl />
        </Toolbar.Option>

        <Toolbar.Option>
          <TogglePlayControl />

        </Toolbar.Option>

        <Toolbar.Option>
          <VolumeControl />
        </Toolbar.Option>

        <Toolbar.Option>
          <SimplifyChordsControl />
        </Toolbar.Option>

        <Toolbar.Option>
          <TransposeChordsControl />
        </Toolbar.Option>

        <Toolbar.Option>
          <ChordsAccidentalControl />
        </Toolbar.Option>

        <Toolbar.Option alignRight>
          <AutoScrollControl />
        </Toolbar.Option>
      </Toolbar>
    </div>
  )
})

const GeneralViewChordsGrid = ({ className, version, toolbarStickyWrapperRef }) => {
  const userPreferences = useUserPreferences()
  const songChordsSettings = useSongVersionSettings()
  const currentBeatIndex = useCurrentBeatIndex(version.beatChords)
  const playerContext = useYoutubePlayerContext()

  const viewportTopOffsetFn = useCallback(() => {
    if (!toolbarStickyWrapperRef.current) return 0
    const { top, height } = window.getComputedStyle(toolbarStickyWrapperRef.current)
    return (parseFloat(top) || 0) + (parseFloat(height) || 0)
  }, [])

  const { listRef, scrollIntoView } = useBeatsContinueScrolling({
    shiftListValue: version.shiftViewValue,
    viewportTopOffsetFn,
    currentBeatIndex,
    isEnabled: userPreferences.autoScroll && playerContext.isPlaying
  })

  // prevents from creating a new handleOnClickChord fn when autoScroll changes
  const autoScrollStableRef = useStableRef(userPreferences.autoScroll)

  const handleOnClickChord = useCallback((e, beatIndex) => {
    const chordBeat = version.beatChords[beatIndex]
    const canSeek = playerContext.handleSeek(chordBeat.time)
    if (canSeek && autoScrollStableRef.current) scrollIntoView(e.currentTarget)
  }, [scrollIntoView, playerContext.handleSeek, version])

  const defferedSongChordsSetttings = useDeferredValue(songChordsSettings)

  const customizedChords = useCustomizedChords(
    version.beatChords.map(beatChord => beatChord.chord), {
      notationSystem: userPreferences.chordsNotationSystem,
      accidental: defferedSongChordsSetttings.accidental,
      simplify: defferedSongChordsSetttings.simplify,
      transposeValue: defferedSongChordsSetttings.transposeValue
    })
  return (
    <ChordsGrid
      className={classNames('chords-view__grid-wrapper chords-views__grid', className)}
      beatsPerBar={version.beatsPerBar}
      beatChords={version.beatChords}
      shiftViewValue={version.shiftViewValue}
      ref={listRef}
    >
      {version.beatChords.map((_, index) => {
        return (
          <MemoizedChord
            key={version.beatChords[index].time}
            chord={customizedChords[index]}
            isCurrent={currentBeatIndex === index}
            onClick={handleOnClickChord}
            index={index}
          />
        )
      })}
    </ChordsGrid>
  )
}
