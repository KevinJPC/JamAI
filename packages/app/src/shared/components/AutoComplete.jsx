import { forwardRef, useImperativeHandle, useRef, useState } from 'react'

import { PopOver } from './PopOver'

export const AutoComplete = forwardRef(({
  items = [],
  inputValue = '',
  onInputChange,
  onFocusItem,
  onSelectItem,
  onFocus: onInputFocus,
  inputClassName,
  suggestedItemsListClassName,
  suggestedItemsListItemClassName,
  suggestedItemsPopOverClassName,
  suggestedItemsPopOverOffset = 0,
  suggestedItemsPopOverBoundary,
  suggestedItemsPopOverAnchor,
  suggestedItemsPopOverRootBoundary,
  ...props
}, ref) => {
  const refs = useRef({ inputWrapper: undefined, itemsList: undefined, input: undefined })
  useImperativeHandle(ref, () => refs.current.input, [])

  const [{ showSuggestedItems, focusedItemIndex }, setState] = useState({
    showSuggestedItems: false,
    focusedItemIndex: -1
  })

  const updateState = (newState) => {
    setState(prev => ({ ...prev, ...newState }))
  }

  const handleOnInputChange = (e) => {
    const newInputValue = e.currentTarget.value
    updateState({ showSuggestedItems: true, focusedItemIndex: -1 })
    onInputChange?.(newInputValue)
  }

  const handleOnClose = (e) => {
    updateState({ showSuggestedItems: false, focusedItemIndex: -1 })
  }

  const handleOnSelectItem = (item) => {
    updateState({ showSuggestedItems: false, focusedItemIndex: -1 })
    onSelectItem?.(item)
  }

  const handleOnInputFocus = (e) => {
    onInputFocus?.(e)
    updateState({ showSuggestedItems: true })
  }

  const handleOnInputKeyDown = (e) => {
    if (e.key === 'Enter') return handleOnInputKeyEnter(e)
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') return handleOnInputKeyUpOrDown(e)
  }

  const handleOnInputKeyEnter = (e) => {
    if (focusedItemIndex === -1) return
    e.preventDefault()
    updateState({ showSuggestedItems: false, focusedItemIndex: -1 })
    onSelectItem?.(items[focusedItemIndex])
  }

  const handleOnInputKeyUpOrDown = (e) => {
    e.preventDefault()
    const isArrowDown = e.key === 'ArrowDown'
    const isArrowUp = e.key === 'ArrowUp'

    const itemsElements = refs.current.itemsList?.children
    if (itemsElements === undefined) return

    const lastItemIndex = itemsElements.length - 1
    const isHovering = focusedItemIndex !== -1
    const isOnLastItem = focusedItemIndex === lastItemIndex
    const isOnFirstItem = focusedItemIndex === 0

    let nextItem

    if (isArrowDown) {
      nextItem = !isOnLastItem ? focusedItemIndex + 1 : 0
    } else if (isArrowUp) {
      nextItem = isOnFirstItem || !isHovering ? lastItemIndex : focusedItemIndex - 1
    }

    itemsElements[nextItem]?.scrollIntoView({
      behaviour: 'instant',
      block: 'nearest',
      inline: 'nearest'
    })

    updateState({ focusedItemIndex: nextItem })
    onFocusItem?.(items[nextItem])
  }

  const derivedInputValue = focusedItemIndex > -1 ? items[focusedItemIndex].displayValue : inputValue

  return (
    <>
      <input
        {...props}
        ref={(node) => {
          refs.current.input = node
        }}
        className={inputClassName}
        value={derivedInputValue}
        onFocus={handleOnInputFocus}
        onChange={handleOnInputChange}
        onKeyDown={handleOnInputKeyDown}
        type='text'
        autoComplete='off'
      />

      <PopOver
        className={suggestedItemsPopOverClassName}
        anchor={refs.current?.input}
        isOpen={showSuggestedItems && items.length > 0}
        offset={suggestedItemsPopOverOffset}
        boundary={suggestedItemsPopOverBoundary}
        rootBoundary={suggestedItemsPopOverRootBoundary}
        onIsOpenChange={handleOnClose}
        closeOnInteractWithOutside={e => !refs.current?.input?.contains(e.target)}
      >
        <PopOver.Content>
          <ul
            tabIndex={-1}
            className={suggestedItemsListClassName}
            ref={instance => { refs.current.itemsList = instance }}
          >
            {items.map(({ value, displayValue }, index) => {
              return (
                <li
                  key={value}
                  className={suggestedItemsListItemClassName}
                  tabIndex={-1}
                  onClick={() => handleOnSelectItem({ value, displayValue })}
                  data-is-focused={focusedItemIndex === index ? true : undefined}
                >
                  {displayValue}
                </li>
              )
            })}
          </ul>
        </PopOver.Content>
      </PopOver>
    </>

  )
})
