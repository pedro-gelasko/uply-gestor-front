import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import SharePage from './pages/SharePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import { isAuthenticated, getUser, initAuth } from './services/authService.js'

initAuth()

function Root() {
  const [user,        setUser]        = useState(getUser)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    setUser(getUser())
    setAuthChecked(true)
  }, [])

  if (!authChecked) return null

  const handleLogin  = (u) => setUser(u)
  const handleLogout = () => { setUser(null) }

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública de compartilhamento — sem login */}
        <Route path="/share/:token" element={<SharePage />} />

        {/* Login */}
        <Route path="/login" element={
          user ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />
        } />

        {/* App protegido */}
        <Route path="/*" element={
          user
            ? <App user={user} onLogout={handleLogout} />
            : <Navigate to="/login" replace />
        } />
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode><Root /></StrictMode>
)
