export function filterObject (obj, cb) {
  return Object.fromEntries(Object.entries(obj).filter(cb))
}
