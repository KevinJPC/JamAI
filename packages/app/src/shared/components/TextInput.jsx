import classNames from 'classnames'

import './TextInput.css'

export function TextInput ({ inputProps, labelProps, label, name, value, defaultValue, onChange, placeholder, type, disabled, className, inputClassName }) {
  return (
    <label
      {...labelProps}
      className={classNames('text-input__label', className)}
    >
      {label}
      <input
        {...inputProps}
        name={name}
        placeholder={placeholder}
        type={type}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        className={classNames('text-input__input', inputClassName)}
        disabled={disabled}
      />
    </label>
  )
}
