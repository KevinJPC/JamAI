export function swapKeyValueObj (obj) {
  return Object.entries(obj).reduce((newObj, [key, value]) => {
    newObj[value] = key
    return newObj
  }, {})
}
