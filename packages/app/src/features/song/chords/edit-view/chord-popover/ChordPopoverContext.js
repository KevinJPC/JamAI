import { createContext } from 'react'

import { useRequiredContext } from '@/shared/hooks/useRequiredContext'

export const ChordPopoverContext = createContext()
export const useChordPopoverContext = () => useRequiredContext(ChordPopoverContext)

export const CHORD_POPOVER_VIEWS = {
  EDITING: 'EDITING',
  SELECTING: 'SELECTING'
}
