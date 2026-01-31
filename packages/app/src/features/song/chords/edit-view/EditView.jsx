import { useCallback } from 'react'
import classNames from 'classnames'

import { ChordsGrid, MemoizedChord } from '@/features/song/chords/ChordsGrid'
import { ChordPopover } from '@/features/song/chords/edit-view/chord-popover/ChordPopover'
import { CHORD_POPOVER_VIEWS, useChordPopoverContext } from '@/features/song/chords/edit-view/chord-popover/ChordPopoverContext'
import { ChordPopoverProvider } from '@/features/song/chords/edit-view/chord-popover/ChordPopoverProvider'
import { useEditViewContext } from '@/features/song/chords/edit-view/EditViewContext'
import { EditViewProvider } from '@/features/song/chords/edit-view/EditViewProvider'
import { DeleteVersionButton } from '@/features/song/chords/edit-view/toolbar-controls/DeleteVersionButton'
import { SaveVersionButton } from '@/features/song/chords/edit-view/toolbar-controls/SaveVersionButton'
import { ShiftViewControl } from '@/features/song/chords/edit-view/toolbar-controls/ShiftViewControl'
import { ToggleBeatsPerBarControl } from '@/features/song/chords/edit-view/toolbar-controls/ToggleBeatsPerBarButton'
import { SeekToStartControl } from '@/features/song/chords/toolbar-controls/SeekToStartControl'
import { TogglePlayControl } from '@/features/song/chords/toolbar-controls/TogglePlayControl'
import { VolumeControl } from '@/features/song/chords/toolbar-controls/VolumeControl'
import { useCurrentBeatIndex } from '@/features/song/chords/useCurrentBeatIndex'
import { Toolbar } from '@/shared/components/Toolbar.jsx'
import { useCustomizedChords } from '@/shared/hooks/useCustomizedChords'
import { useStableRef } from '@/shared/hooks/useStableRef'
import { useSongVersionSettings } from '@/shared/song-version-settings/SongVersionSettingsContext'
import { useUserPreferences } from '@/shared/user-preferences/UserPreferencesContext'

import '@/features/song/chords/ChordsViews.css'

export const EditView = ({ version, className, userVersionId, toolbarClassName }) => {
  return (
    <EditViewProvider
      key={version.id}
      originalVersion={version}
      userVersionId={userVersionId}
    >
      <div className={classNames('chords-view', className)}>
        <EditViewToolbar className={toolbarClassName} />
        <ChordPopoverProvider>
          <EditViewChordsGrid />
          <ChordPopover />
        </ChordPopoverProvider>
      </div>
    </EditViewProvider>
  )
}

const EditViewToolbar = ({ className }) => {
  return (
    <div className={classNames('chords-view__toolbar-wrapper', className)}>
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
          <ToggleBeatsPerBarControl />
        </Toolbar.Option>

        <Toolbar.Option>
          <ShiftViewControl />
        </Toolbar.Option>

        <Toolbar.Option alignRight>
          <DeleteVersionButton />
        </Toolbar.Option>

        <Toolbar.Option>
          <SaveVersionButton />
        </Toolbar.Option>

      </Toolbar>
    </div>

  )
}

const EditViewChordsGrid = () => {
  const userPreferences = useUserPreferences()
  const songChordsSettings = useSongVersionSettings()
  const { draftVersion } = useEditViewContext()

  const popover = useChordPopoverContext()

  const currentBeatIndex = useCurrentBeatIndex(draftVersion.beatChords)

  const popOverIsOpenStableRef = useStableRef(popover.isOpen)

  const handleOnClickChord = useCallback((e, index) => {
    const beatChord = draftVersion.beatChords[index]
    if (!beatChord) return

    if (popOverIsOpenStableRef.current) return popover.close()

    popover.updateView(CHORD_POPOVER_VIEWS.SELECTING)
    popover.updateChordAnchor({ element: e.currentTarget, beatChord, beatChordIndex: index })
  }, [popover.updateView, popover.updateChordAnchor, popover.close])

  const handleOnDoubleClickChord = useCallback((e, index) => {
    const beatChord = draftVersion.beatChords[index]
    if (!beatChord) return

    popover.updateView(CHORD_POPOVER_VIEWS.EDITING)
    popover.updateChordAnchor({ element: e.currentTarget, beatChord, beatChordIndex: index })
  }, [popover.updateView, popover.updateChordAnchor])

  const customizedChords = useCustomizedChords(
    draftVersion.beatChords.map(beatChord => beatChord.chord), {
      notationSystem: userPreferences.chordsNotationSystem,
      accidental: songChordsSettings.accidental,
      transposeValue: songChordsSettings.transposeValue
    })

  return (

    <ChordsGrid
      className='chords-view__grid-wrapper chords-views__grid'
      beatsPerBar={draftVersion.beatsPerBar}
      beatChords={draftVersion.beatChords}
      shiftViewValue={draftVersion.shiftViewValue}
      ref={popover.setBoundary}
    >
      {draftVersion.beatChords.map((_, index) => {
        return (
          <MemoizedChord
            key={draftVersion.beatChords[index].time}
            chord={customizedChords[index]}
            isCurrent={currentBeatIndex === index}
            onClick={handleOnClickChord}
            onDoubleClick={handleOnDoubleClickChord}
            index={index}
            isEditing={popover.chordAnchor?.beatChordIndex === index}
          />
        )
      })}
    </ChordsGrid>
  )
}
