export default function Toast({ message, variant, onDismiss }) {
  return (
    <div className={`toast show align-items-center text-bg-${variant} border-0`}>
      <div className="d-flex">
        <div className="toast-body">{message}</div>
        <button className="btn-close btn-close-white me-2 m-auto" onClick={onDismiss}></button>
      </div>
    </div>
  )
}
