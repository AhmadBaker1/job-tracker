import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'


import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
      {/* This componenet listens for toasts and shows them */}
      <Toaster position="top-right" reverseOrder={false}/>
    </AuthProvider>
  </StrictMode>,
);
