import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import Chord from '@chords-extractor/common/chord'

import { CHORD_POPOVER_VIEWS, useChordPopoverContext } from '@/features/song/chords/edit-view/chord-popover/ChordPopoverContext'
import { useEditViewContext } from '@/features/song/chords/edit-view/EditViewContext'
import { useYoutubePlayerContext } from '@/features/song/youtube-player/YoutubePlayerContext'
import { AutoComplete } from '@/shared/components/AutoComplete'
import { Button } from '@/shared/components/Button'
import { CheckIcon, PencilIcon, PlayIcon, XMarkIcon } from '@/shared/components/icons'
import { PopOver } from '@/shared/components/PopOver'
import { useSongVersionSettings } from '@/shared/song-version-settings/SongVersionSettingsContext'
import { useUserPreferences } from '@/shared/user-preferences/UserPreferencesContext'
import { customizeChord } from '@/shared/utils/customizeChord'

import './ChordPopover.css'

export const ChordPopover = () => {
  const popover = useChordPopoverContext()

  const renderPopoverView = () => {
    switch (popover.view) {
      case CHORD_POPOVER_VIEWS.SELECTING:
        return <SelectingView />

      case CHORD_POPOVER_VIEWS.EDITING:
        return <EditingView />

      default:
    }
  }

  return (
    <PopOver
      isOpen={popover.isOpen}
      anchor={popover.chordAnchor?.element}
      boundary={popover.getBoundary()}
      rootBoundary='document'
      offset={8}
      onIsOpenChange={(value) => {
        if (!value) popover.close()
      }}
    >
      <PopOver.Content>
        {renderPopoverView()}
      </PopOver.Content>

    </PopOver>
  )
}

const SelectingView = () => {
  const { draftVersion } = useEditViewContext()
  const popover = useChordPopoverContext()
  const player = useYoutubePlayerContext()

  const handleSeekToAnchorBeatChord = () => {
    if (!popover.chordAnchor) return
    player.handleSeek(popover.chordAnchor.beatChord.time)
  }
  const handleSwitchToEditingView = () => {
    popover.updateView(CHORD_POPOVER_VIEWS.EDITING)
  }

  const handleClearAnchorBeatChord = () => {
    if (!popover.chordAnchor) return
    draftVersion.clearBeatChord(popover.chordAnchor.beatChordIndex)
  }

  return (
    <div className='edit-view-popover'>
      <Button
        variant='transparent'
        onClick={handleSeekToAnchorBeatChord}
      >
        <PlayIcon className='edit-view-popover__button-icon' width={24} />
      </Button>
      <Button
        onClick={handleSwitchToEditingView}
        variant='transparent'
      >
        <PencilIcon className='edit-view-popover__button-icon' width={24} />
      </Button>
      <Button
        onClick={handleClearAnchorBeatChord}
        variant='transparent'
      >
        <XMarkIcon className='edit-view-popover__button-icon' width={24} />
      </Button>
    </div>

  )
}

const EditingView = () => {
  const userPreferences = useUserPreferences()
  const songChordsSettings = useSongVersionSettings()

  const { draftVersion } = useEditViewContext()
  const popover = useChordPopoverContext()

  const inputRefs = useRef([])

  const [editedChord, setEditedChord] = useState(() => {
    const customizedChord = customizeChord(popover.chordAnchor?.beatChord?.chord, {
      fromNotationSystem: Chord.supportedNotationsSystems.english,
      notationSystem: userPreferences.chordsNotationSystem,
      transposeValue: songChordsSettings.transposeValue
    })
    return {
      rootNote: customizedChord?.rootNote ?? '',
      extension: customizedChord?.extension ?? '',
      bassNote: customizedChord?.bassNote ?? '',
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    const chordString = [
      editedChord.rootNote || '',
      editedChord.extension ? `:${editedChord.extension}` : '',
      editedChord.bassNote ? `/${editedChord.bassNote}` : '']
      .join('')

    // apply reversed customization to user input chord
    const decustomizedChord = customizeChord(chordString, {
      fromNotationSystem: userPreferences.chordsNotationSystem,
      notationSystem: Chord.supportedNotationsSystems.english,
      transposeValue: -songChordsSettings.transposeValue
    })

    draftVersion.edit({ index: popover.chordAnchor.beatChordIndex, chordString: decustomizedChord?.symbol ?? null })
    popover.updateView(CHORD_POPOVER_VIEWS.SELECTING)
  }

  const updateRootNote = (newValue) => {
    setEditedChord(prev => ({ ...prev, rootNote: newValue }))
  }
  const updateExtension = (newValue) => {
    setEditedChord(prev => ({ ...prev, extension: newValue }))
  }
  const updateBassNote = (newValue) => {
    setEditedChord(prev => ({ ...prev, bassNote: newValue }))
  }

  const handleSwitchPopoverView = () => {
    popover.updateView(CHORD_POPOVER_VIEWS.SELECTING)
  }

  const focusInput = (index) => {
    const inputToFocus = inputRefs.current[index]
    if (!inputToFocus) return
    inputToFocus.focus({ preventScroll: true })
  }

  const setInputRef = (index) => (node) => {
    inputRefs.current[index] = node
  }

  const filteredRootNotesSuggestions = useMemo(() => {
    return filterSuggestedItems(
      noteSuggestionsByNotationAndAccidental[userPreferences.chordsNotationSystem][songChordsSettings.accidental],
      editedChord.rootNote
    )
  }, [editedChord.rootNote, userPreferences.chordsNotationSystem, songChordsSettings.accidental])

  const filteredExtensionsSuggestions = useMemo(() => {
    return filterSuggestedItems(
      extensionSuggestions,
      editedChord.extension
    )
  }, [editedChord.extension, userPreferences.chordsNotationSystem, songChordsSettings.accidental])

  const filteredBassNotesSuggestions = useMemo(() => {
    return filterSuggestedItems(
      noteSuggestionsByNotationAndAccidental[userPreferences.chordsNotationSystem][songChordsSettings.accidental],
      editedChord.bassNote
    )
  }, [editedChord.bassNote, userPreferences.chordsNotationSystem, songChordsSettings.accidental])

  useEffect(() => {
    // This is done instead of setting the autoFocus property on the input to avoid unintended page scrolling.
    // autoFocus would cause the page to scroll to the input's position (0, 0) due to floating-ui positioning.
    focusInput(0)
  }, [])

  return (
    <form className='edit-view-popover edit-view-popover__form' onSubmit={handleSubmit}>
      <Button
        variant='transparent'
        onClick={handleSwitchPopoverView}
        type='button'
      >
        <PencilIcon width={24} />
      </Button>

      <div className='edit-view-popover__inputs-wrapper'>
        <ChordActionPopOverEditFormInput
          label='Root'
          ref={setInputRef(0)}
          items={filteredRootNotesSuggestions}
          inputValue={editedChord.rootNote}
          onInputChange={updateRootNote}
          onSelectItem={(item) => {
            updateRootNote(item.value)
            focusInput(1)
          }}
          suggestedItemsPopOverBoundary={popover.getBoundary()}
        />
        <ChordActionPopOverEditFormInput
          label='Extension'
          ref={setInputRef(1)}
          items={filteredExtensionsSuggestions}
          inputValue={editedChord.extension}
          onInputChange={updateExtension}
          onSelectItem={(item) => {
            updateExtension(item.value)
            focusInput(2)
          }}
          suggestedItemsPopOverBoundary={popover.getBoundary()}
        />
        <ChordActionPopOverEditFormInput
          label='Bass'
          ref={setInputRef(2)}
          items={filteredBassNotesSuggestions}
          inputValue={editedChord.bassNote}
          onInputChange={updateBassNote}
          onSelectItem={(item) => {
            updateBassNote(item.value)
          }}
          suggestedItemsPopOverBoundary={popover.getBoundary()}
        />
      </div>

      <Button
        variant='transparent'
        type='submit'
      >
        <CheckIcon width={24} />
      </Button>
    </form>
  )
}

const ChordActionPopOverEditFormInput = forwardRef(({ items, inputValue, onInputChange, onSelectItem, onFocusItem, id, popOverBoundary, label }, ref) => {
  return (
    <div className='edit-view-popover__input-wrapper'>
      <label className='edit-view-popover__form-label' htmlFor={label}>{label}</label>
      <AutoComplete
        ref={ref}
        onFocus={(e) => {
          e.target.select()
        }}
        items={items}
        inputValue={inputValue}
        onInputChange={onInputChange}
        onSelectItem={onSelectItem}
        onFocusItem={onFocusItem}
        inputClassName='edit-view-popover__input'
        suggestedItemsPopOverClassName='edit-view-popover__suggested-items-wrapper'
        suggestedItemsListClassName='edit-view-popover__suggested-items-list'
        suggestedItemsListItemClassName='edit-view-popover__suggested-item'
        suggestedItemsPopOverOffset={16}
        suggestedItemsPopOverBoundary={popOverBoundary}
        suggestedItemsPopOverRootBoundary='document'
        id={id}
      />
    </div>
  )
})

const createSuggestedItemsFromSingleValues = (values) =>
  values.map(value => ({ value, displayValue: value }))

const noteSuggestionsByNotationAndAccidental = Object.fromEntries(
  Object.entries(Chord.notesByNotationSystem)
    .map(([notationKey, notesObj]) => {
      const notesEntries = Object.entries(notesObj)
      const notesByAccidental = {
        [Chord.accidentals.sharp]: createSuggestedItemsFromSingleValues(
          notesEntries.filter(([_, englishNote]) =>
            Chord.getNoteAccidental(englishNote, Chord.accidentals.sharp) === Chord.accidentals.sharp).map(([note]) => note)
        ),
        [Chord.accidentals.flat]: createSuggestedItemsFromSingleValues(
          notesEntries.filter(([_, englishNote]) =>
            Chord.getNoteAccidental(englishNote, Chord.accidentals.flat) === Chord.accidentals.flat).map(([note]) => note)
        )
      }
      return [notationKey, notesByAccidental]
    })
)

const MINIMAL_CHORDS_TYPES_SUGGESTIONS = ['m', 'M7', 'dim', 'M9', 'm7', '7', 'sus4', 'add9', 'aug', 'dim7', '6', 'm6']
const extensionSuggestions = createSuggestedItemsFromSingleValues(MINIMAL_CHORDS_TYPES_SUGGESTIONS)

const filterSuggestedItems = (items, filterValue) => {
  if (!filterValue) return items
  return items.filter(suggestedValue => suggestedValue.value.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1)
}
