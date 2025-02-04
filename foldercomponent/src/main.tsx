import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import FileBrowser from './FileBrowser'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FileBrowser />
  </StrictMode>,
)
