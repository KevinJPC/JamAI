import './Spinner.css'
export const Spinner = ({ size = 24, thickness = 2, className = '' }) => {
  return (
    <div
      className={`spinner ${className}`}
      style={{
        '--size': `${size}px`,
        '--thickness': `${thickness}px`
      }}
    />
  )
}
