import { createContext } from 'react'

import { useRequiredContext } from '@/shared/hooks/useRequiredContext'

export const EditViewContext = createContext(null)

export const useEditViewContext = () => useRequiredContext(EditViewContext)
