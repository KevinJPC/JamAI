import classNames from 'classnames'

import { Button } from './Button.jsx'

import './ErrorDisplay.css'

export function ErrorDisplay ({ refetcher, error, className, size = 'md' }) {
  return (
    <div className={classNames('error-display', className)} data-size={size}>
      <span className='error-display__message'>{error?.message ?? 'An error happend'}</span>
      <Button
        variant='secondary'
        className='error-display__button'
        onClick={() => refetcher?.()}
      >
        Try again
      </Button>
    </div>
  )
}
