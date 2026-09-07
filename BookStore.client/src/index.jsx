import { createRoot } from 'react-dom/client'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/lato/400.css'
import '@fontsource/lato/700.css'
import './styles/index.scss'
import App from './App'
import { Provider } from 'react-redux'
import { store } from './app/store'
import { ToastProvider } from './context/ToastContext'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ToastProvider>
      <App />
    </ToastProvider>
  </Provider>,
)
