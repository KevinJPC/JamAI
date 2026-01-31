import { useCallback, useEffect, useRef } from 'react'

import { isIntoView } from '@/shared/utils/isIntoView'

const SCROLL_END_DELAY_MS = 1000
const LIST_SCROLL_MARGIN_BOTTOM = 20
const ROW_TOP_POSITON_MAX_ERROR_MARGIN_PX = 1

const defaultGetItemListFn = (listElement, index) => {
  const listWithoutFakeChords = Array.from(listElement.children).filter(listItem => {
    const isFakeChord = listItem.getAttribute('data-is-fake-chord') === 'true'
    return !isFakeChord
  })
  return listWithoutFakeChords[index]
}

export const useBeatsContinueScrolling = ({
  currentBeatIndex,
  isEnabled = true,
  viewportTopOffsetFn = () => 0,
  marginTop = 50,
  getItemListFn = defaultGetItemListFn
}) => {
  const isScrollingRef = useRef(false)

  useEffect(() => {
    if (!isEnabled) return
    let timeoutId
    const onScroll = () => {
      timeoutId = clearTimeout(timeoutId)
      isScrollingRef.current = true
      timeoutId = setTimeout(() => {
        isScrollingRef.current = false
      }, SCROLL_END_DELAY_MS)
    }
    document.addEventListener('scroll', onScroll, true)

    return () => {
      isScrollingRef.current = false
      document.removeEventListener('scroll', onScroll, true)
    }
  }, [isEnabled])

  //

  const listRef = useRef()

  const rowTop = useRef(0)

  // Custom scroll function

  const scrollIntoView = useCallback((el) => {
    const elRect = el.getBoundingClientRect()
    const viewportTopOffset = viewportTopOffsetFn()
    const elTop = elRect.top + window.scrollY

    if (Math.abs(rowTop.current - elTop) <= ROW_TOP_POSITON_MAX_ERROR_MARGIN_PX && isIntoView(elRect, -viewportTopOffset)) return

    rowTop.current = elTop

    const listRect = listRef.current.getBoundingClientRect()

    const targetScrollTopPosition = elTop - viewportTopOffset - marginTop

    // Ensures the new scroll position doesn't exceed the list's bottom
    const maxScrollPosition = listRect.bottom + window.scrollY - window.innerHeight + LIST_SCROLL_MARGIN_BOTTOM
    const finalScrollTopPosition = Math.min(targetScrollTopPosition, maxScrollPosition)

    window.scrollTo({
      top: finalScrollTopPosition,
      behavior: 'smooth'
    })
  }, [viewportTopOffsetFn])

  useEffect(() => {
    if (listRef.current === undefined || isScrollingRef.current || !isEnabled) return

    const el = getItemListFn(listRef.current, currentBeatIndex)
    if (!el) return
    scrollIntoView(el)
  }, [currentBeatIndex, isEnabled, scrollIntoView])

  return { listRef, scrollIntoView }
}
