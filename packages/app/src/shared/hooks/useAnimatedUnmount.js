import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

export function useAnimatedUnmount (isOpen) {
  const [isVisible, setIsVisible] = useState(isOpen)
  const elementRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      return setIsVisible(true)
    }

    if (!elementRef.current) return

    const animationName = window.getComputedStyle(elementRef.current).animationName || 'none'

    if (animationName === 'none') return setIsVisible(false)

    // The 'animationend' event has a slight delay before it triggers,
    // which can cause timing issues when trying to unmount elements immediately after the animation ends.
    // For example, see this issue: https://github.com/reactjs/react-transition-group/issues/816
    // This issue was resolved in React Transition Group by using `flushSync`,
    // which ensures state updates are flushed synchronously, preventing a delay in unmounting:
    // See the fix here: https://github.com/otomad/react-transition-group/commit/c9a68db5c8d6843b6e4fb2f10987fba58395f46d
    const handleAnimationEnd = () => {
      flushSync(() => {
        setIsVisible(false)
      })
    }

    elementRef.current.addEventListener('animationend', handleAnimationEnd, { once: true })

    return () => {
      elementRef.current?.removeEventListener('animationend', handleAnimationEnd)
    }
  }, [isOpen])

  // mark it as visible as soon as its isOpen its true but wait for animation to mark it as not visible
  const derivedIsVisible = isOpen || isVisible

  return { isVisible: derivedIsVisible, elementRef }
}
