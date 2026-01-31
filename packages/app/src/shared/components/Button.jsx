import React, { forwardRef } from 'react'
import classNames from 'classnames'

import { Link } from '@/shared/components/Link'

import './Button.css'

export const BUTTON_TYPES = {
  button: 'button',
  link: 'link'
}

export const BUTTON_VARIANTS = {
  primary: 'primary',
  secondary: 'secondary',
  transparent: 'transparent',
}

const BUTTON_VARIANTS_CLASSNAMES = {
  [BUTTON_VARIANTS.primary]: 'button--primary',
  [BUTTON_VARIANTS.secondary]: 'button--secondary',
  [BUTTON_VARIANTS.transparent]: 'button--transparent',
}

export const Button = forwardRef(({ children, as = BUTTON_TYPES.button, variant = BUTTON_VARIANTS.primary, className, to, onClick, disabled, ...props }, ref) => {
  const type = BUTTON_TYPES[as]
  const variantClassName = BUTTON_VARIANTS_CLASSNAMES[variant]
  if (!type) throw new Error('Unknown button type')
  if (!variantClassName) throw new Error('Unknown variant')

  if (type === BUTTON_TYPES.button) {
    return (
      <button
        ref={ref}
        {...props}
        className={classNames('button', variantClassName, className)}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    )
  }
  return (
    <Link
      ref={ref}
      {...props}
      className={classNames('button', variantClassName, className)}
      to={to}
    >{children}
    </Link>
  )
}
)
