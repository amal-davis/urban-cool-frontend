import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* basename mirrors Vite's `base` (vite.config.ts) so routes match once
        the app is served from a subpath, e.g. GitHub Pages project sites
        at https://<user>.github.io/<repo>/ rather than the domain root. */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
