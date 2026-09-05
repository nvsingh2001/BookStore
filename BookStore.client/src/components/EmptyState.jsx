export default function EmptyState({ icon, title, message, actionLabel, onAction }) {
  return (
    <div className="text-center p-5">
      {icon && <div className="mb-3">{icon}</div>}
      <h3>{title}</h3>
      <p className="text-secondary">{message}</p>
      {onAction && (
        <button className="btn btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}
