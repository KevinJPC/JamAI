import { forwardRef } from 'react'
import classNames from 'classnames'

import './Slider.css'

export const Slider = forwardRef(({ max, value, min, className, style, ...props }, ref) => {
  const currentPorcentage = (value / max) * 100
  return (
    <input
      {...props}
      style={{ ...style, '--value': `${currentPorcentage}%` }}
      className={classNames('slider', className)}
      ref={ref}
      type='range'
      max={max}
      min={min}
      value={value}
    />
  )
})
