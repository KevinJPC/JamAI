import { forwardRef, useLayoutEffect, useRef, useState } from 'react'
import classNames from 'classnames'

import { Button, BUTTON_VARIANTS } from '@/shared/components/Button'
import { ChevronLeftIcon, ChevronRightIcon } from '@/shared/components/icons'
import { SwitchButton } from '@/shared/components/SwitchButton'
import { ValueAdjuster } from '@/shared/components/ValueAdjuster'

import './Toolbar.css'

export const Toolbar = forwardRef(({ children, className }, ref) => {
  const { scrollPosition, isInitialScrollCalculation, scrollableElementRef } = useHorizontalScrollPosition()
  const handleScrollMenu = (backward = false) => {
    scrollableElementRef.current.scrollBy({
      left: backward === true ? -50 : 50,
      behavior: 'smooth'
    })
  }

  return (
    <menu
      ref={ref}
      className={classNames('toolbar', className)}
    >
      <div className='toolbar__inner-wrapper' ref={scrollableElementRef}>
        <button
          className={classNames('toolbar__arrow-scroller toolbar__arrow-scroller--left', {
            'toolbar__arrow-scroller--no-transition': !isInitialScrollCalculation,
            'toolbar__arrow-scroller--hidden': scrollPosition === SCROLL_POSTION.START || scrollPosition === null
          })}
          onClick={() => handleScrollMenu(true)}
        >
          <ChevronLeftIcon width={16} strokeWidth={3} />
        </button>
        <ul className='toolbar__list'>
          {children}
        </ul>
        <button
          className={classNames('toolbar__arrow-scroller toolbar__arrow-scroller--right', {
            'toolbar__arrow-scroller--no-transition': !isInitialScrollCalculation,
            'toolbar__arrow-scroller--hidden': scrollPosition === SCROLL_POSTION.END || scrollPosition === null
          })}
          onClick={handleScrollMenu}
        >
          <ChevronRightIcon width={16} strokeWidth={3} />
        </button>
      </div>
    </menu>
  )
})

Toolbar.Option = ({ children, className, alignRight }) => {
  return (
    <li className={classNames('toolbar__option', className, {
      'toolbar__option--right': alignRight
    })}
    >
      {children}
    </li>
  )
}

Toolbar.ButtonControl = ({ children, title, onClick, className, ...props }) => {
  return (
    <Button
      {...props}
      className={classNames('toolbar__control', className)}
      variant={BUTTON_VARIANTS.transparent}
      onClick={onClick}
    >
      <span className='toolbar__inner-control'>
        {children}
      </span>
      {title && <span className='toolbar__control-title'>{title}</span>}
    </Button>
  )
}

Toolbar.IncreaserControl = ({ onIncrease, onDecrease, displayValue, title, increaseContent, decreaseContent }) => {
  return (
    <div className='toolbar__control'>
      <ValueAdjuster
        className='toolbar__inner-control'
        displayValue={displayValue}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
        increaseContent={increaseContent}
        decreaseContent={decreaseContent}
      />
      {title && <span className='toolbar__control-title'>{title}</span>}
    </div>
  )
}

Toolbar.SwitchControl = ({ onChange, value, title, children }) => {
  return (
    <SwitchButton
      onChange={onChange}
      value={value}
      className='toolbar__control'
    >
      <span className='toolbar__inner-control'>
        {children}
      </span>
      {title && <span className='toolbar__control-title'>{title}</span>}
    </SwitchButton>
  )
}

Toolbar.Separator = ({ className }) => <li className={classNames('toolbar__option toolbar__separator', className)} />

const SCROLL_THRESHOLD = 1

function useHorizontalScrollPosition () {
  const scrollableElementRef = useRef()

  const [[scrollPosition, isInitialScrollCalculation], setScrollPosition] = useState([null, true])
  useLayoutEffect(() => {
    if (!scrollableElementRef.current) return
    scrollableElementRef.current.scrollTo(0, 0)
    const updateScrollPosition = (e) => {
      const scrollWidth = scrollableElementRef.current.scrollWidth
      const clientWidth = scrollableElementRef.current.clientWidth

      if (Math.floor(scrollWidth - clientWidth) === 0) return setScrollPosition([null, !!e])

      const scrollLeft = scrollableElementRef.current.scrollLeft
      if (scrollLeft === 0) return setScrollPosition([SCROLL_POSTION.START, !!e])

      if (Math.abs(Math.floor(scrollLeft + clientWidth) - scrollWidth) <= SCROLL_THRESHOLD) {
        return setScrollPosition([SCROLL_POSTION.END, !!e])
      }

      setScrollPosition([SCROLL_POSTION.MIDDLE, !!e])
    }
    scrollableElementRef.current.addEventListener('scroll', updateScrollPosition)
    window.addEventListener('resize', updateScrollPosition)
    updateScrollPosition()
    return () => {
      scrollableElementRef.current?.removeEventListener('scroll', updateScrollPosition)
      window.removeEventListener('resize', updateScrollPosition)
    }
  }, [])
  return { scrollPosition, isInitialScrollCalculation, scrollableElementRef }
}

const SCROLL_POSTION = {
  START: 'START',
  END: 'END',
  MIDDLE: 'MIDDLE'
}
