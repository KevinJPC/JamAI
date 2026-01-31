import { createContext, useState } from 'react'
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react-dom'

import { useOutsideInteraction } from '../hooks/useOutsideInteraction'
import { useRequiredContext } from '../hooks/useRequiredContext.js'

const PopOverContext = createContext()
const usePopOverContext = () => useRequiredContext(PopOverContext)

export const PopOver = ({
  isOpen: isOpenProp,
  anchor,
  onClose,
  rootBoundary,
  boundary,
  offset: mainAxis = 0,
  placement = 'bottom',
  children,
  className,
  closeOnInteractWithOutside = () => true,
  style,
  strategy = 'absolute',
  flipMainAxis = true,
  shiftMainAxis = true,
  autoUpdate: autoUpdateProp = true,
  onIsOpenChange,
  ...props
}) => {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false)
  const isOpen = isOpenProp ?? uncontrolledIsOpen

  const handleUpdateIsOpen = (value) => {
    if (isOpenProp === undefined) {
      setUncontrolledIsOpen(value)
    } else {
      onIsOpenChange(value)
    }
  }

  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    strategy,
    placement,
    elements: {
      reference: anchor
    },
    whileElementsMounted: (reference, floating, update) => {
      if (autoUpdateProp) {
        return autoUpdate(reference, floating, update)
      } else {
        update()
      }
    },
    middleware: [
      offset({
        mainAxis
      }),
      flip({
        mainAxis: flipMainAxis,
        rootBoundary,
        boundary
      }),
      shift({
        mainAxis: shiftMainAxis,
        rootBoundary,
        boundary
      })
    ]
  })
  const outsideInteractionElementRef = useOutsideInteraction((element, evt) => {
    const isTrigger = refs.reference.current?.contains?.(element)
    if (closeOnInteractWithOutside instanceof Function &&
      closeOnInteractWithOutside(evt) &&
      !isTrigger) {
      // onClose?.()
      handleUpdateIsOpen(false)
    }
  })

  return (
    <PopOverContext.Provider value={{ isOpen, outsideInteractionElementRef, style, refs, floatingStyles, className, props, handleUpdateIsOpen }}>
      {children}
    </PopOverContext.Provider>
  )
}

PopOver.Content = ({ children }) => {
  const { isOpen, outsideInteractionElementRef, style, refs, floatingStyles, className, props } = usePopOverContext()

  if (!isOpen) return null

  return (
    <div
      tabIndex={-1}
      ref={(instance) => {
        outsideInteractionElementRef.current = instance
        refs.setFloating(instance)
      }}
      style={{
        ...style,
        ...floatingStyles
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  )
}

PopOver.Trigger = ({ renderElement }) => {
  const { refs, handleUpdateIsOpen, isOpen } = usePopOverContext()
  return renderElement({ ref: refs.setReference, onClick: () => handleUpdateIsOpen(!isOpen) })
}
