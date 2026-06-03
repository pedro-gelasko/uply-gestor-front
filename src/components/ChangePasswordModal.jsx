import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import Modal, { FormField, SubmitButton, ErrorMsg } from './Modal'
import api from '../services/api'

const inputStyle = {
  width: '100%', padding: '10px 40px 10px 14px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '9px', color: '#fff', fontSize: '13px',
  outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.15s ease',
}

function PasswordInput({ placeholder, value, onChange, disabled }) {
  const [show, setShow] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <input
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value} onChange={onChange} disabled={disabled}
        style={inputStyle}
        onFocus={e => e.target.style.borderColor = 'rgba(255,107,0,0.5)'}
        onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
      />
      <button type="button" onClick={() => setShow(!show)}
        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#555', display: 'flex', padding: '2px' }}>
        {show ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  )
}

export default function ChangePasswordModal({ onClose }) {
  const [form,    setForm]    = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  const [success, setSuccess] = useState(false)

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.currentPassword)                        return setError('Informe a senha atual.')
    if (form.newPassword.length < 6)                  return setError('Nova senha deve ter ao menos 6 caracteres.')
    if (form.newPassword !== form.confirmPassword)     return setError('Nova senha e confirmação não conferem.')
    if (form.newPassword === form.currentPassword)     return setError('A nova senha deve ser diferente da atual.')

    setLoading(true); setError(null)
    try {
      await api.patch('/auth/password', {
        currentPassword: form.currentPassword,
        newPassword:     form.newPassword,
        confirmPassword: form.confirmPassword,
      })
      setSuccess(true)
      setTimeout(onClose, 1800)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <Modal title="Alterar Senha" onClose={!loading ? onClose : undefined} width="400px">
        {success ? (
          <div style={{ textAlign: 'center', padding: '12px 0 8px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>✓</div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: '#22c55e', marginBottom: '6px' }}>Senha alterada!</div>
            <div style={{ fontSize: '12px', color: '#555' }}>Sua senha foi atualizada com sucesso.</div>
          </div>
        ) : (
          <>
            <ErrorMsg msg={error} />

            <FormField label="Senha atual *">
              <PasswordInput placeholder="••••••••" value={form.currentPassword} onChange={set('currentPassword')} disabled={loading} />
            </FormField>

            <FormField label="Nova senha *">
              <PasswordInput placeholder="Mínimo 6 caracteres" value={form.newPassword} onChange={set('newPassword')} disabled={loading} />
            </FormField>

            <FormField label="Confirmar nova senha *">
              <PasswordInput placeholder="Repita a nova senha" value={form.confirmPassword} onChange={set('confirmPassword')} disabled={loading} />
            </FormField>

            {/* Requisitos */}
            <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '16px' }}>
              {[
                { ok: form.newPassword.length >= 6,                        label: 'Ao menos 6 caracteres' },
                { ok: form.newPassword === form.confirmPassword && form.newPassword.length > 0, label: 'Senhas coincidem' },
                { ok: form.newPassword !== form.currentPassword && form.newPassword.length > 0, label: 'Diferente da senha atual' },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '3px 0' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: r.ok ? '#22c55e' : '#333', transition: 'background 0.2s', flexShrink: 0 }} />
                  <span style={{ fontSize: '11px', color: r.ok ? '#22c55e' : '#555', transition: 'color 0.2s' }}>{r.label}</span>
                </div>
              ))}
            </div>

            <SubmitButton loading={loading} onClick={handleSubmit}>Alterar Senha</SubmitButton>
          </>
        )}
      </Modal>
    </AnimatePresence>
  )
}
