export const getItemFromSessionStorage = (key) => {
  const value = window.sessionStorage.getItem(key)
  return value ? JSON.parse(value) : null
}

export const setItemToSessionStorage = (key, value) => {
  window.sessionStorage.setItem(key, JSON.stringify(value))
}

export const removeItemFromSessionStorage = (key) => {
  window.sessionStorage.removeItem(key)
}
