import React, { createContext, forwardRef, useContext, useImperativeHandle, useTransition } from 'react'
import classNames from 'classnames'

import { Button } from './Button.jsx'

import './Tabs.css'

const TabsContext = createContext({
  activeTab: 0,
  updateActiveTab: () => {}
})

export const useTabsContext = () => useContext(TabsContext)

export const Tabs = forwardRef(({ children, activeTab, setActiveTab }, ref) => {
  const [isSwitching, startTransition] = useTransition()

  const updateActiveTab = (nextTab) => {
    startTransition(() => {
      setActiveTab(nextTab)
    })
  }

  useImperativeHandle(ref, () => ({
    getActiveTab: () => activeTab,
    updateActiveTab
  }), [activeTab, updateActiveTab])

  return (
    <TabsContext.Provider value={{ activeTab, updateActiveTab, isSwitching }}>
      {children}
    </TabsContext.Provider>
  )
})

Tabs.Labels = forwardRef(({ children, className = '' }, ref) => {
  return (
    <nav ref={ref} className={`tabs__labels ${className}`}>
      {children}
    </nav>
  )
})

Tabs.Label = ({ id, children, onSwitch, className, disabled }) => {
  const { activeTab, updateActiveTab, isSwitching } = useTabsContext(Tabs)
  const isActive = activeTab === id
  return (
    <Button
      variant='transparent'
      className={classNames('tabs__label-button', className)}
      onClick={() => {
        if (onSwitch instanceof Function) {
          return onSwitch()
        }
        updateActiveTab(id)
      }}
      disabled={disabled}
      data-active={isActive ? true : undefined}
      data-pending={isSwitching ? true : undefined}
    >
      {children}
    </Button>
  )
}

Tabs.Views = ({ children }) => {
  return children
}

Tabs.View = ({ id, children }) => {
  const { activeTab } = useTabsContext(Tabs)
  if (id === activeTab) return children
  return null
}
