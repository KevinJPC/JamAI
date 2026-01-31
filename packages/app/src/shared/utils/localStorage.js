export const getItemFromLocalStorage = (key) => {
  const value = window.localStorage.getItem(key)
  if (value === null) return null
  try {
    return JSON.parse(value)
  } catch (_) { return null }
}

export const setItemToLocalStorage = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value))
}
