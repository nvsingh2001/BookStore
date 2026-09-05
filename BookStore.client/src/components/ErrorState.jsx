export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="text-center p-4">
      <p className="text-danger">{message}</p>
      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}
