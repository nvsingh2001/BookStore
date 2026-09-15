import { createContext, useContext, useState } from 'react'
import AuthModal from '../components/AuthModal'

const AuthModalContext = createContext(null)

export function AuthModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <AuthModalContext.Provider value={{ open: () => setIsOpen(true) }}>
      {children}
      <AuthModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </AuthModalContext.Provider>
  )
}

export function useAuthModal() {
  return useContext(AuthModalContext).open
}
