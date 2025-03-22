import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { BrowserRouter } from'react-router-dom' // This gives us access to routing functionalities


import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* ✅ Wrap everything */}
      <AuthProvider>
        <App />
        {/* This componenet listens for toasts and shows them */}
        <Toaster position="top-right" reverseOrder={false}/>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
