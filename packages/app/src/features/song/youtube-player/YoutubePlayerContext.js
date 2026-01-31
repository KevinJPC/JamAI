import { createContext } from 'react'

import { useRequiredContext } from '@/shared/hooks/useRequiredContext'

export const YoutubePlayerContext = createContext(null)

export const useYoutubePlayerContext = () => useRequiredContext(YoutubePlayerContext)
