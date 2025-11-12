// ABOUTME: Application entry point
// ABOUTME: Renders root React component and imports global styles
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/retro-theme.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
