export function sliceForCursorPagination<T> (items: T[], originalLimit: number) {
  const realLimit = originalLimit - 1
  const hasMore = realLimit > 0 && items.length > realLimit
  if (hasMore) {
    items.pop()
  }
  return {
    items,
    hasMore
  }
}
