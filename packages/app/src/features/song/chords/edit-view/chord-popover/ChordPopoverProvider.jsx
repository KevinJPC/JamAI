import { useCallback, useRef, useState } from 'react'

import { ChordPopoverContext } from '@/features/song/chords/edit-view/chord-popover/ChordPopoverContext'

const initialChordPopoverState = {
  view: null,
  chordAnchor: null,
}

export function ChordPopoverProvider ({ children }) {
  const boundaryRef = useRef()

  const [popoverState, setpopoverState] = useState(() => initialChordPopoverState)

  const updateView = useCallback((view) => {
    setpopoverState(prev => ({
      ...prev,
      view,
    }))
  }, [])

  const updateChordAnchor = useCallback(({ element, beatChordIndex, beatChord }) => {
    setpopoverState(prev => ({
      ...prev,
      chordAnchor: {
        element,
        beatChordIndex,
        beatChord
      }
    }))
  }, [])

  const close = useCallback(() => {
    setpopoverState({ view: null, chordAnchor: null })
  }, [])

  const setBoundary = useCallback((node) => {
    boundaryRef.current = node
  }, [])

  const getBoundary = useCallback(() => {
    return boundaryRef.current
  }, [])

  const isOpen = popoverState.view !== null

  return (
    <ChordPopoverContext.Provider value={{
      setBoundary,
      getBoundary,
      close,
      updateView,
      updateChordAnchor,
      ...popoverState,
      isOpen,
    }}
    >
      {children}
    </ChordPopoverContext.Provider>
  )
}
