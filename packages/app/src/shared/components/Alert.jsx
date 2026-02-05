import classNames from 'classnames'

import { ExclamationCircle } from '@/shared/components/icons'

import './Alert.css'

export const alertType = {
  error: 'error',
  info: 'info'
}

const alertIconContentByType = {
  [alertType.error]: (props) => <ExclamationCircle {...props} />,
  [alertType.info]: (props) => <ExclamationCircle {...props} />
}

export function Alert ({
  title, message, type, iconContent, classNames: {
    wrapper: wrapperClassName,
    icon: iconClassName,
    title: titleClassName,
    message: messageClassName,
  } = {}
}) {
  const parsedType = alertType[type]
  if (!parsedType) throw new Error('Invalid type for component')
  const renderIcon = iconContent || alertIconContentByType[parsedType]
  return (
    <div className={classNames('alert', wrapperClassName)} role='alert' data-alert-type={parsedType}>
      {renderIcon({ size: 18, strokeWidth: 2, className: classNames('alert__icon', iconClassName) })}
      <p className={classNames('alert__title', titleClassName)}>{title}</p>
      {message && <p className={classNames('alert__message', messageClassName)}>{message}</p>}
    </div>
  )
}
