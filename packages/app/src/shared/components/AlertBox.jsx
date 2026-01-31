import classNames from 'classnames'

import { ExclamationCircle } from '@/shared/components/icons'

import './AlertBox.css'

export function AlertBox ({ title, message, iconContent = ExclamationCircle, wrapperClassName }) {
  return (
    <div className={classNames('alert-wrapper', wrapperClassName)}>
      <div className='alert'>
        {iconContent({ className: 'alert__icon' })}

        <p className='alert__title'>{title}</p>
        <p className='alert__message'>{message}</p>
      </div>
    </div>
  )
}
