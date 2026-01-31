import { forwardRef } from 'react'
import classNames from 'classnames'
import { Link as WouterLink } from 'wouter'

import './Link.css'

export const Link = forwardRef(({ external = false, children, to, decorator = false, className: classNameProp, ...props }, ref) => {
  const className = classNames(
    'link',
    classNameProp, {
      'link--decorator': decorator
    }
  )

  if (external) {
    return (
      <a
        {...props}
        href={to}
        className={className}
        target='_blank'
        rel='noreferrer'
        ref={ref}
      >
        {children}
      </a>
    )
  }
  const { replace, transition, preventScrollToTop = false, state, ...restOfProps } = props
  return (
    <WouterLink
      {...restOfProps}
      className={className}
      ref={ref}
      to={to}
      replace={replace}
      transition={transition}
      state={{ ...state, preventScrollToTop }}
    >
      {children}
    </WouterLink>
  )
})
