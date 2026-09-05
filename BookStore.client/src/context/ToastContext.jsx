import { createContext, useContext, useState } from 'react'
import ToastContainer from '../components/ToastContainer'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  function showToast(message, variant = 'success') {
    const id = Date.now()
    setToasts((current) => [...current, { id, message, variant }])
    setTimeout(() => removeToast(id), 4000)
  }

  function removeToast(id) {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext).showToast
}
