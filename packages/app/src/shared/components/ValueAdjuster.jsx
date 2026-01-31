import classNames from 'classnames'

import { Button } from './Button.jsx'

import './ValueAdjuster.css'

export const ValueAdjuster = ({
  increaseContent = '+',
  decreaseContent = '-',
  onIncrease,
  onDecrease,
  displayValue,
  className,
  buttonClassName,
  displayValueClassName,
  displayValueSize = 30
}) => {
  return (
    <div
      className={classNames('value-adjuster', className)}
      style={{ '--display-value-width': `${displayValueSize}px` }}
    >
      <Button
        variant='transparent'
        className={classNames('value-adjuster__button', buttonClassName)}
        onClick={onDecrease}
      >
        {decreaseContent}
      </Button>
      <span className={classNames('value-adjuster__display-value', displayValueClassName)}>{displayValue}</span>
      <Button
        variant='transparent'
        className={classNames('value-adjuster__button', buttonClassName)}
        onClick={onIncrease}
      >
        {increaseContent}
      </Button>
    </div>
  )
}
