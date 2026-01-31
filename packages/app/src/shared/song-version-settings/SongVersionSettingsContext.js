import { createContext } from 'react'

import { useRequiredContext } from '@/shared/hooks/useRequiredContext'

export const SongVersionSettingsContext = createContext()
export const useSongVersionSettings = () => useRequiredContext(SongVersionSettingsContext)
