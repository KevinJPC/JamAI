import React, { forwardRef } from 'react'
import ChordLib from '@chords-extractor/common/chord'
import { BEATS_PER_BAR } from '@chords-extractor/common/constants'
import classNames from 'classnames'

import './ChordsGrid.css'

const BEATS_PER_BAR_CLASSNAMES = {
  [BEATS_PER_BAR[4]]: 'chords-grid--time-signature-4-4',
  [BEATS_PER_BAR[3]]: 'chords-grid--time-signature-3-4'
}

const defaultBeatsPerBar = BEATS_PER_BAR[4]

export const ChordsGrid = forwardRef(({ className, shiftViewValue = 0, beatsPerBar = defaultBeatsPerBar, children }, ref) => {
  const beatsPerBarClassName = BEATS_PER_BAR_CLASSNAMES[beatsPerBar] ?? BEATS_PER_BAR_CLASSNAMES[defaultBeatsPerBar]

  return (
    <ul
      className={classNames('chords-grid', beatsPerBarClassName, className)} ref={ref}
    >
      {new Array(shiftViewValue).fill(null).map((_, index) => <FakeChord key={`fake-chord-${index}`} />)}
      {children}
    </ul>
  )
})

export const Chord = ({
  chord,
  isCurrent,
  onClick,
  isEditing,
  onDoubleClick,
  index
}) => {
  const detailedChord = buildDetailedChord(chord)
  return (
    <li
      className={classNames('chord', {
        'chord--current': isCurrent,
        'chord--editing': isEditing
      })}
      onClick={(e) => onClick?.(e, index)}
      onDoubleClick={(e) => onDoubleClick?.(e, index)}
    >
      {detailedChord && detailedChord.root &&
        <div className='chord__wrapper'>
          <span>
            {detailedChord.root.note}
            {detailedChord.root.accidental && <span className='chord__signature'>{detailedChord.root.accidental}</span>}
            {detailedChord.isMinor && <span className='chord__type'>m</span>}
            {detailedChord.extension && <sup className='chord__descriptor'>{detailedChord.extension}</sup>}
          </span>

          {detailedChord.bass && (
            <span className='bass-note-divisor'>
              {detailedChord.bass.note}
              {detailedChord.bass.accidental && <span className='chord__signature'>{detailedChord.bass.accidental}</span>}
            </span>
          )}
        </div>}
    </li>
  )
}

export const ChordSkeleton = () => {
  return (
    <li className='chord chord--skeleton' />
  )
}

const FakeChord = () => <li className='chord chord--fake' data-is-fake-chord />

export const MemoizedChord = React.memo(Chord, (prevProps, nextProps) =>
  (prevProps.chord?.symbol === nextProps.chord?.symbol &&
   prevProps.index === nextProps.index &&
   prevProps.isCurrent === nextProps.isCurrent &&
   prevProps.isEditing === nextProps.isEditing &&
   prevProps.onClick === nextProps.onClick &&
   prevProps.onDoubleClick === nextProps.onDoubleClick
  )
)

export const generateChordKey = (index) => `chord-${index}`

const accidentalSymbols = [ChordLib.accidentals.sharp, ChordLib.accidentals.flat]

const noteRegexDivisor = new RegExp(`(.*?)(${accidentalSymbols.join('|')})?$`)
const minorExtensionRegexDivisor = /(m|min)?(.*)?/

function buildDetailedChord (parsedChord) {
  if (!parsedChord) return null

  const [, rootNote, rootNoteAccidental] = parsedChord.rootNote?.match(noteRegexDivisor) ?? []
  const [, minorSymbol, restOfExtension] = parsedChord.extension?.match(minorExtensionRegexDivisor) ?? []
  const [, bassNote, bassNoteAccidental] = parsedChord.bassNote?.match(noteRegexDivisor) ?? []

  if (!rootNote) return null

  return {
    root: {
      note: rootNote,
      accidental: rootNoteAccidental ?? null
    },
    isMinor: !!minorSymbol,
    extension: restOfExtension ?? null,
    bass: bassNote
      ? {
          note: bassNote,
          accidental: bassNoteAccidental ?? null
        }
      : null
  }
}
