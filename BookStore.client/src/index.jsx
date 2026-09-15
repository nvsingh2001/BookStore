import { createRoot } from 'react-dom/client'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/lato/400.css'
import '@fontsource/lato/700.css'
import './styles/index.scss'
import App from './App'
import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { store } from './app/store'
import { queryClient } from './app/queryClient'
import { ToastProvider } from './context/ToastContext'
import { AuthModalProvider } from './context/AuthModalContext'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthModalProvider>
          <App />
        </AuthModalProvider>
      </ToastProvider>
    </QueryClientProvider>
  </Provider>,
)
