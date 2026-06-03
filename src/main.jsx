import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import SharePage from './pages/SharePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ForcePasswordPage from './pages/ForcePasswordPage.jsx'
import { getUser, initAuth, logout } from './services/authService.js'

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
  const handleLogout = () => { logout(); setUser(null) }

  const handlePasswordChanged = () => {
    const updated = { ...user, mustChangePassword: false }
    localStorage.setItem('uply_user', JSON.stringify(updated))
    setUser(updated)
  }

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
          !user
            ? <Navigate to="/login" replace />
            : user.mustChangePassword
              ? <ForcePasswordPage user={user} onPasswordChanged={handlePasswordChanged} />
              : <App user={user} onLogout={handleLogout} />
        } />
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode><Root /></StrictMode>
)
