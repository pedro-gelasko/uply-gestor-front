import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import Modal, { inputStyle, FormField, SubmitButton, ErrorMsg } from './Modal'
import { createShare } from '../services/shareService'
import { getClients } from '../services/clientService'

const selectStyle = {
  ...inputStyle,
  cursor: 'pointer',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  paddingRight: '32px',
}

export default function NewShareModal({ onClose, onSuccess }) {
  const [clients,   setClients]   = useState([])
  const [form,      setForm]      = useState({ clientId: '', expiresAt: '' })
  const [loading,   setLoading]   = useState(false)
  const [loadingClients, setLoadingClients] = useState(true)
  const [error,     setError]     = useState(null)

  useEffect(() => {
    getClients()
      .then((raw) => {
        setClients(raw)
        if (raw.length > 0) setForm(f => ({ ...f, clientId: String(raw[0].id) }))
      })
      .catch(() => setError('Erro ao carregar clientes'))
      .finally(() => setLoadingClients(false))
  }, [])

  const handleSubmit = async () => {
    if (!form.clientId) return setError('Selecione um cliente.')
    setLoading(true); setError(null)
    try {
      const payload = { clientId: Number(form.clientId) }
      if (form.expiresAt) payload.expiresAt = new Date(form.expiresAt + 'T23:59:59.000Z').toISOString()
      await createShare(payload)
      onSuccess()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const focus = (e) => { e.target.style.borderColor = 'rgba(255,107,0,0.5)' }
  const blur  = (e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }

  return (
    <AnimatePresence>
      <Modal title="Novo Compartilhamento" onClose={!loading ? onClose : undefined} width="420px">
        <ErrorMsg msg={error} />

        <FormField label="Cliente *">
          {loadingClients ? (
            <div style={{ ...inputStyle, color: '#555' }}>Carregando clientes...</div>
          ) : (
            <select
              style={selectStyle}
              value={form.clientId}
              onChange={e => setForm(f => ({ ...f, clientId: e.target.value }))}
              disabled={loading}
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
        </FormField>

        <FormField label="Expiração (opcional)">
          <input
            style={inputStyle} type="date"
            value={form.expiresAt}
            onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))}
            onFocus={focus} onBlur={blur}
            disabled={loading}
            min={new Date().toISOString().slice(0, 10)}
          />
          <div style={{ fontSize: '11px', color: '#555', marginTop: '5px' }}>
            Deixe em branco para link sem expiração
          </div>
        </FormField>

        <SubmitButton loading={loading} onClick={handleSubmit}>
          Gerar Link de Compartilhamento
        </SubmitButton>
      </Modal>
    </AnimatePresence>
  )
}
