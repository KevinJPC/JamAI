import classNames from 'classnames'

import { ExclamationCircle } from '@/shared/components/icons'

import './PlaceholderContent.css'

export function PlaceholderContent ({ title, message, iconContent = ExclamationCircle, wrapperClassName }) {
  return (
    <div className={classNames('placeholder-content-wrapper', wrapperClassName)}>
      <div className='placeholder-content'>
        {iconContent({ className: 'placeholder-content__icon' })}

        <p className='placeholder-content__title'>{title}</p>
        <p className='placeholder-content__message'>{message}</p>
      </div>
    </div>
  )
}
