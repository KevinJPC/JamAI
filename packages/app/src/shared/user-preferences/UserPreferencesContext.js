import { createContext } from 'react'

import { useRequiredContext } from '../hooks/useRequiredContext.js'

export const UserPreferencesContext = createContext()

export const useUserPreferences = () => useRequiredContext(UserPreferencesContext)
