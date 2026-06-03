import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Lock, ArrowRight, CheckCircle } from 'lucide-react'
import api from '../services/api'
import { logout } from '../services/authService'

function PasswordInput({ label, placeholder, value, onChange, disabled }) {
  const [show, setShow] = useState(false)
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ fontSize: '11px', color: '#888', fontWeight: '600', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          style={{
            width: '100%', padding: '13px 44px 13px 16px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px', color: '#fff', fontSize: '15px',
            outline: 'none', boxSizing: 'border-box',
            transition: 'border-color 0.2s ease',
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(255,107,0,0.6)'}
          onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
        />
        <button type="button" onClick={() => setShow(!show)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#555', display: 'flex', padding: '4px' }}>
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  )
}

export default function ForcePasswordPage({ user, onPasswordChanged }) {
  const [form,    setForm]    = useState({ newPassword: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  const [success, setSuccess] = useState(false)

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }))

  const checks = [
    { ok: form.newPassword.length >= 6,                                            label: 'Ao menos 6 caracteres' },
    { ok: /[A-Z]/.test(form.newPassword),                                          label: 'Uma letra maiúscula' },
    { ok: form.newPassword === form.confirmPassword && form.newPassword.length > 0, label: 'Senhas coincidem' },
  ]
  const allOk = checks.every(c => c.ok)

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!allOk) return setError('Preencha todos os requisitos antes de continuar.')
    setLoading(true); setError(null)
    try {
      await api.patch('/auth/password', {
        currentPassword: form.newPassword,
        newPassword:     form.newPassword,
        confirmPassword: form.confirmPassword,
        force:           true,
      })
      setSuccess(true)
      setTimeout(() => onPasswordChanged(), 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: 'linear-gradient(145deg, #0A0A0A 0%, #1A0A00 50%, #0F0F0F 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Background effects */}
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,0,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,0,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,107,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,0,0.025) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        style={{
          width: '100%', maxWidth: '420px',
          background: 'rgba(17,17,17,0.95)',
          backdropFilter: 'blur(30px)',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
          overflow: 'hidden',
          position: 'relative', zIndex: 1,
        }}
      >
        {/* Top bar */}
        <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <img src="/uply.png" alt="Uply" style={{ height: '28px', objectFit: 'contain' }} />
          <button
            onClick={() => { logout(); window.location.href = '/login' }}
            style={{ fontSize: '11px', color: '#555', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px' }}
          >
            Sair
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {success ? (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: 'center', padding: '24px 0 16px' }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}>
                <CheckCircle size={52} color="#22c55e" style={{ margin: '0 auto 16px' }} />
              </motion.div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>Senha criada!</div>
              <div style={{ fontSize: '13px', color: '#666' }}>Bem-vindo ao UPLY Gestor. Redirecionando...</div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Icon */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg,#FF6B00,#FF8C42)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(255,107,0,0.3)', flexShrink: 0 }}>
                  <Lock size={20} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff', letterSpacing: '-0.02em' }}>
                    Crie sua senha
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                    Olá, {user?.name?.split(' ')[0]}! Defina sua senha antes de continuar.
                  </div>
                </div>
              </div>

              {/* Alert */}
              <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(255,107,0,0.08)', border: '1px solid rgba(255,107,0,0.2)', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF6B00', marginTop: '5px', flexShrink: 0 }} />
                <div style={{ fontSize: '12px', color: '#B3B3B3', lineHeight: 1.6 }}>
                  Por segurança, você precisa <strong style={{ color: '#FF8C42' }}>criar uma senha pessoal</strong> antes de acessar o sistema. Esta tela não pode ser ignorada.
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ padding: '11px 14px', borderRadius: '9px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '13px', marginBottom: '16px' }}>
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <PasswordInput label="Nova senha *" placeholder="Crie uma senha forte" value={form.newPassword} onChange={set('newPassword')} disabled={loading} />
              <PasswordInput label="Confirmar senha *" placeholder="Repita a nova senha" value={form.confirmPassword} onChange={set('confirmPassword')} disabled={loading} />

              {/* Requirements */}
              <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '20px' }}>
                <div style={{ fontSize: '10px', color: '#555', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Requisitos</div>
                {checks.map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '3px 0' }}>
                    <motion.div animate={{ scale: c.ok ? 1.2 : 1, background: c.ok ? '#22c55e' : '#2a2a2a' }}
                      style={{ width: '7px', height: '7px', borderRadius: '50%', flexShrink: 0, transition: 'all 0.2s' }} />
                    <span style={{ fontSize: '12px', color: c.ok ? '#22c55e' : '#555', transition: 'color 0.2s', fontWeight: c.ok ? '500' : '400' }}>{c.label}</span>
                  </div>
                ))}
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: loading || !allOk ? 1 : 1.01 }}
                whileTap={{ scale: loading || !allOk ? 1 : 0.97 }}
                disabled={loading || !allOk}
                style={{
                  width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                  background: allOk && !loading ? 'linear-gradient(135deg,#FF6B00,#FF8C42)' : 'rgba(255,107,0,0.2)',
                  color: allOk && !loading ? '#fff' : '#666',
                  fontSize: '14px', fontWeight: '700', cursor: allOk && !loading ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: allOk && !loading ? '0 4px 20px rgba(255,107,0,0.3)' : 'none',
                  transition: 'all 0.25s ease',
                }}
              >
                {loading ? 'Salvando...' : <><span>Definir senha e entrar</span><ArrowRight size={16} /></>}
              </motion.button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
