import Chord from '@chords-extractor/common/chord'
import { z } from 'zod'

import { usePersistedState } from '@/shared/hooks/usePersistedState'
import { UserPreferencesContext } from '@/shared/user-preferences/UserPreferencesContext'
import { setItemToLocalStorage } from '@/shared/utils/localStorage'

const LOCAL_STORAGE_USER_PREFERENCES_KEY = 'user-preferences'
export const resetUserPreferences = () => setItemToLocalStorage(LOCAL_STORAGE_USER_PREFERENCES_KEY, defaultUserPreferencesState)

const defaultUserPreferencesState = { chordsNotationSystem: Chord.supportedNotationsSystems.english, persistSongVersionsSettings: true, autoScroll: true }

const userPreferencesSchemaValidator = z.object({
  chordsNotationSystem: z.enum(Object.values(Chord.supportedNotationsSystems)).catch(_ => defaultUserPreferencesState.chordsNotationSystem),
  persistSongVersionsSettings: z.boolean().catch(_ => defaultUserPreferencesState.persistSongVersionsSettings),
  autoScroll: z.boolean().catch(_ => defaultUserPreferencesState.autoScroll)
}).catch(defaultUserPreferencesState)

export function UserPreferencesProvider ({ children }) {
  const [{ chordsNotationSystem, autoScroll, persistSongVersionsSettings }, setState] = usePersistedState((persistedState) => {
    return userPreferencesSchemaValidator.parse(persistedState)
  }, LOCAL_STORAGE_USER_PREFERENCES_KEY)

  const updateState = (newState) => setState(prev => ({ ...prev, ...newState }))

  const updateChordsNotationSystem = (newValue) => {
    if (chordsNotationSystem === newValue) return
    updateState({ chordsNotationSystem: newValue })
  }

  const updateAutoScroll = (newValue) => {
    if (autoScroll === newValue) return
    updateState({ autoScroll: newValue })
  }

  const updatePersistSongVersionsSettings = (newValue) => {
    if (persistSongVersionsSettings === newValue) return
    updateState({ persistSongVersionsSettings: newValue })
  }

  const reset = () => {
    updateState(defaultUserPreferencesState)
  }

  return (
    <UserPreferencesContext.Provider value={{
      chordsNotationSystem,
      persistSongVersionsSettings,
      updateChordsNotationSystem,
      updatePersistSongVersionsSettings,
      updateAutoScroll,
      autoScroll,
      reset
    }}
    >
      {children}
    </UserPreferencesContext.Provider>
  )
}
