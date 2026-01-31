import classNames from 'classnames'

import './SwitchButton.css'

export const SwitchButton = ({ children, wrapperClassName, className, onChange, value }) => {
  return (
    <label className={classNames('switch-button-wrapper', wrapperClassName)}>
      <input type='checkbox' className='switch-button__input' checked={value} onChange={(e) => onChange(e.currentTarget.checked)} />
      <div className={classNames('switch-button', className)}>{children}</div>
    </label>
  )
}
