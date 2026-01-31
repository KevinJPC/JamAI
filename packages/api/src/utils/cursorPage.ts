export type CursorPage<T> = {
  items: T[]
  itemsCount: number,
  hasMore: boolean,
  nextContinuationToken: string | null,
}
export function createCursorPage<TItem> (): CursorPage<TItem>
export function createCursorPage<TItem> (items: TItem[], hasMore: boolean, nextContinuationToken: string | null): CursorPage<TItem>
export function createCursorPage<TItem> (items?: TItem[], hasMore?: boolean, nextContinuationToken?: string | null): CursorPage<TItem> {
  // handles no params overload
  if (items === undefined || hasMore === undefined || nextContinuationToken === undefined) {
    return {
      items: [],
      itemsCount: 0,
      hasMore: false,
      nextContinuationToken: null
    }
  }

  // handles 3 params overdload
  return {
    items,
    itemsCount: items.length,
    hasMore,
    nextContinuationToken
  }
}
