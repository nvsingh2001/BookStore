export default function Spinner({ size }) {
  const sizeClass = size === 'sm' ? 'spinner-border-sm' : ''
  return (
    <div className={`spinner-border ${sizeClass}`} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  )
}
