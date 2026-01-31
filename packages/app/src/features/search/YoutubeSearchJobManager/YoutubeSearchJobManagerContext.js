import { createContext } from 'react'

import { useRequiredContext } from '@/shared/hooks/useRequiredContext'

export const YoutubeSearchJobManagerContext = createContext(null)

export function useYoutubeSearchJobManagerContext () {
  return useRequiredContext(YoutubeSearchJobManagerContext)
}
