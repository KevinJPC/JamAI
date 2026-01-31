import { createContext } from 'react'

import { useRequiredContext } from '@/shared/hooks/useRequiredContext'

export const AuthContext = createContext(null)
export function useAuth () {
  return useRequiredContext(AuthContext)
}
