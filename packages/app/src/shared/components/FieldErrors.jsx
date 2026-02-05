import './FieldErrors.css'

export function FieldErrors ({ errorMessages }) {
  if (!errorMessages || errorMessages.length === 0) return null
  return (
    errorMessages?.map((message, index) => (
      <p
        key={message}
        className='field-error'
      >{message}
      </p>
    ))
  )
}
