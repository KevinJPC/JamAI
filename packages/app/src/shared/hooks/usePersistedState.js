import { useEffect, useState } from 'react'

import { getItemFromLocalStorage, setItemToLocalStorage } from '@/shared/utils/localStorage'

export const usePersistedState = (initialValue, key, { autoPersist = true, persisterFn } = {}) => {
  const getPersistedValue = () => getItemFromLocalStorage(key)
  const [value, setValue] = useState(() => {
    const persistedValue = getPersistedValue()
    if (initialValue instanceof Function) return initialValue(persistedValue)
    if (persistedValue === undefined) return initialValue
    return persistedValue
  })

  const persister = () => {
    const persistedValue = persisterFn?.(value) ?? value
    setItemToLocalStorage(key, persistedValue)
  }

  useEffect(() => {
    if (autoPersist === false) return
    persister()
  }, [value, autoPersist])

  return [value, setValue, persister, getPersistedValue]
}
