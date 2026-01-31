import { createContext, useContext, useState } from 'react'
import classNames from 'classnames'

import { Button } from './Button.jsx'

import './CollapsedBox.css'

const CollapsedBoxContext = createContext()
const useCollapsedBoxContext = () => useContext(CollapsedBoxContext)

export function CollapsedBox ({ as: Element, children, className, ...props }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Element {...props} className={classNames('collapsed-box', className)} data-is-open={isOpen}>
      <CollapsedBoxContext.Provider value={{ isOpen, setIsOpen }}>
        {children}
      </CollapsedBoxContext.Provider>
    </Element>
  )
}

CollapsedBox.ToggleButton = ({ className, children, closeContent, openContent, ...props }) => {
  const { isOpen, setIsOpen } = useCollapsedBoxContext()
  return (
    <Button
      {...props}
      variant='transparent'
      className={classNames('collapsed-box__button', className)}
      onClick={() => setIsOpen(!isOpen)}
    >
      {isOpen ? openContent : closeContent}
    </Button>
  )
}
