import { createRoot } from 'react-dom/client'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/lato/400.css'
import '@fontsource/lato/700.css'
import './styles/index.scss'
import App from './App'

createRoot(document.getElementById('root')).render(<App />)
