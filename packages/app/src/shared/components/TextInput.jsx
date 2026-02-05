import classNames from 'classnames'

import { FieldErrors } from '@/shared/components/FieldErrors'

import './TextInput.css'

const inputTypes = {
  text: 'text',
  email: 'email',
  password: 'password',
  number: 'number',
}

export function TextInput ({
  id,
  name,
  label,
  value,
  defaultValue,
  onChange,
  placeholder,
  type,
  disabled,
  classNames: {
    wrapper: wrapperClassName,
    input: inputClassName,
    label: labelClassName
  } = {},
  errorMessages,
  ...props
}) {
  const parsedInputType = inputTypes[type]
  if (!parsedInputType) throw new Error('Invalid input type for component')
  const hasError = errorMessages?.length > 0
  return (
    <div className={classNames('text-input', wrapperClassName)} aria-invalid={hasError}>
      {label && <label htmlFor={id} className={classNames('text-input__label', labelClassName)}>{label}</label>}
      <input
        {...props}
        id={id}
        name={name}
        placeholder={placeholder}
        type={parsedInputType}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        className={classNames('text-input__input', inputClassName)}
        disabled={disabled}
      />
      <FieldErrors errorMessages={errorMessages} />
    </div>

  )
}
