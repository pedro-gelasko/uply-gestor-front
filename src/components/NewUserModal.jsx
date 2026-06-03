import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Modal, { inputStyle, FormField, SubmitButton, ErrorMsg } from './Modal'
import { createUser } from '../services/authService'

const selectStyle = {
  ...inputStyle,
  cursor: 'pointer',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  paddingRight: '32px',
}

const ROLES = [
  { value: 'ADMIN',  label: 'Administrador', description: 'Acesso completo ao sistema' },
  { value: 'VIEWER', label: 'Visualizador',   description: 'Somente leitura' },
]

export default function NewUserModal({ onClose, onSuccess }) {
  const [form,    setForm]    = useState({ name: '', email: '', password: '', role: 'ADMIN' })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  const [showPwd, setShowPwd] = useState(false)

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }))
  const focus = (e) => { e.target.style.borderColor = 'rgba(255,107,0,0.5)' }
  const blur  = (e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }

  const handleSubmit = async () => {
    if (!form.name.trim())     return setError('Nome é obrigatório.')
    if (!form.email.trim())    return setError('E-mail é obrigatório.')
    if (form.password.length < 6) return setError('Senha deve ter ao menos 6 caracteres.')
    setLoading(true); setError(null)
    try {
      await createUser(form)
      onSuccess()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <Modal title="Novo Usuário" onClose={!loading ? onClose : undefined} width="440px">
        <ErrorMsg msg={error} />

        <FormField label="Nome completo *">
          <input style={inputStyle} placeholder="Ex: Ana Silva" value={form.name} onChange={set('name')} onFocus={focus} onBlur={blur} disabled={loading} />
        </FormField>

        <FormField label="E-mail *">
          <input style={inputStyle} type="email" placeholder="ana@uply.digital" value={form.email} onChange={set('email')} onFocus={focus} onBlur={blur} disabled={loading} />
        </FormField>

        <FormField label="Senha *">
          <div style={{ position: 'relative' }}>
            <input
              style={{ ...inputStyle, paddingRight: '44px' }}
              type={showPwd ? 'text' : 'password'}
              placeholder="Mínimo 6 caracteres"
              value={form.password} onChange={set('password')} onFocus={focus} onBlur={blur} disabled={loading}
            />
            <button type="button" onClick={() => setShowPwd(!showPwd)}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: '11px', padding: '2px' }}>
              {showPwd ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
        </FormField>

        <FormField label="Permissão *">
          <select style={selectStyle} value={form.role} onChange={set('role')} disabled={loading}>
            {ROLES.map(r => <option key={r.value} value={r.value}>{r.label} — {r.description}</option>)}
          </select>
        </FormField>

        {/* Role info */}
        <div style={{ padding: '12px', borderRadius: '9px', background: 'rgba(255,107,0,0.06)', border: '1px solid rgba(255,107,0,0.12)', marginBottom: '16px' }}>
          {ROLES.map(r => (
            <div key={r.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: form.role === r.value ? '#FF6B00' : '#333', flexShrink: 0, transition: 'background 0.2s' }} />
              <span style={{ fontSize: '11px', color: form.role === r.value ? '#FF8C42' : '#555', fontWeight: form.role === r.value ? '600' : '400' }}>
                <strong>{r.label}:</strong> {r.description}
              </span>
            </div>
          ))}
        </div>

        <SubmitButton loading={loading} onClick={handleSubmit}>Criar Usuário</SubmitButton>
      </Modal>
    </AnimatePresence>
  )
}
