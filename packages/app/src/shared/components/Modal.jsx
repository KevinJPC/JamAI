import { createContext, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import classNames from 'classnames'

import { Button } from '@/shared/components/Button'
import { XMarkIcon } from '@/shared/components/icons'
import { useAnimatedUnmount } from '@/shared/hooks/useAnimatedUnmount'
import { useRequiredContext } from '@/shared/hooks/useRequiredContext'

import './Modal.css'

const ModalContext = createContext()

const useModalContext = () => useRequiredContext(ModalContext)

export const Modal = ({ children, defaultIsOpen = false, isOpen: controlledIsOpen, onIsOpenChange, onExit }) => {
  const isControlled = controlledIsOpen !== undefined
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(() => isControlled ? controlledIsOpen : defaultIsOpen)
  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen

  const updateIsOpen = (newIsOpen) => {
    if (isControlled) {
      onIsOpenChange(newIsOpen)
    } else {
      setUncontrolledIsOpen(newIsOpen)
    }
  }

  const { isVisible: contentIsVisible, elementRef: contentRef } = useAnimatedUnmount(isOpen)
  const { isVisible: backdropIsVisible, elementRef: backdropRef } = useAnimatedUnmount(isOpen)

  useEffect(() => {
    if (isOpen) {
      hideScrollbar()
    } else if (!contentIsVisible && !backdropIsVisible) {
      onExit?.()
      showScrollbar()
    }
  }, [contentIsVisible, backdropIsVisible, isOpen])

  useEffect(() => {
    return () => showScrollbar()
  }, [])

  return (
    <ModalContext.Provider value={{ isOpen, updateIsOpen, contentIsVisible, contentRef, backdropIsVisible, backdropRef }}>
      {children}
    </ModalContext.Provider>
  )
}

Modal.Trigger = ({ renderElement }) => {
  const { updateIsOpen } = useModalContext()
  return renderElement({ onClick: () => updateIsOpen(true) })
}

Modal.Backdrop = ({ className, closeOnClick = true }) => {
  const { updateIsOpen, backdropIsVisible, backdropRef, isOpen } = useModalContext()
  if (!backdropIsVisible) return null
  return (
    createPortal(
      <div
        ref={backdropRef}
        data-is-open={isOpen}
        className={`modal-backdrop ${className}`}
        onClick={() => {
          if (!closeOnClick) return
          updateIsOpen(false)
        }}
      />
      , document.body)
  )
}

Modal.Content = ({ children, className }) => {
  const { isOpen, contentIsVisible, contentRef } = useModalContext()
  if (!contentIsVisible) return null
  return createPortal(
    <section className={classNames('modal', className)} data-is-open={isOpen} ref={contentRef}>
      {children}
    </section>
    , document.body)
}

Modal.Header = ({ children, className }) => {
  return (
    <header className={classNames('modal__header', className)}>
      {children}
    </header>
  )
}

Modal.Title = ({ children }) => {
  return (
    <h2 className='modal__title'>
      {children}
    </h2>
  )
}

Modal.Body = ({ children, className }) => {
  return (
    <div className={classNames('modal__body', className)}>
      {children}
    </div>
  )
}

Modal.CloseButton = ({ className, disabled = false }) => {
  const { updateIsOpen } = useModalContext()
  return (
    <Button
      disabled={disabled}
      variant='transparent'
      className={classNames('modal__close-button', className)}
      onClick={() => updateIsOpen(false)}
    >
      <XMarkIcon width={18} />
    </Button>
  )
}

const hideScrollbar = () => {
  const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
  document.body.style.overflow = 'hidden'
  document.body.style.paddingRight = `${scrollBarWidth}px`
}

const showScrollbar = () => {
  document.body.style.overflow = 'auto'
  document.body.style.paddingRight = '0'
}
