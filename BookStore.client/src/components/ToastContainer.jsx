import Toast from './Toast'

export default function ToastContainer({ toasts, onDismiss: onDismiss }) {
  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={() => onDismiss(toast.id)} />
      ))}
    </div>
  )
}
