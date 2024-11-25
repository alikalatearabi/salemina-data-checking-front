import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { DataProvider } from './store/dataContext.tsx'

createRoot(document.getElementById('root')!).render(
  <DataProvider>
    <App />
  </DataProvider>,
)
