
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppWithWorkingChatbot from './AppWithWorkingChatbot.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithWorkingChatbot />
  </StrictMode>,
)
