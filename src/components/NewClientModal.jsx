import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Modal, { inputStyle, FormField, SubmitButton, ErrorMsg } from './Modal'
import { createClient } from '../services/clientService'

export default function NewClientModal({ onClose, onSuccess }) {
  const [form, setForm]     = useState({ name: '', responsibleName: '', email: '', phone: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState(null)

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.name || !form.responsibleName || !form.email) {
      return setError('Preencha nome, responsável e e-mail.')
    }
    setLoading(true); setError(null)
    try {
      await createClient(form)
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
      <Modal title="Novo Cliente" onClose={onClose}>
        <ErrorMsg msg={error} />
        <FormField label="Nome do provedor *">
          <input style={inputStyle} placeholder="Ex: Voa Fibra" value={form.name} onChange={set('name')}
            onFocus={e => e.target.style.borderColor = 'rgba(255,107,0,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
        </FormField>
        <FormField label="Nome do responsável *">
          <input style={inputStyle} placeholder="Ex: Ricardo Oliveira" value={form.responsibleName} onChange={set('responsibleName')}
            onFocus={e => e.target.style.borderColor = 'rgba(255,107,0,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
        </FormField>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <FormField label="E-mail *">
            <input style={inputStyle} type="email" placeholder="contato@empresa.com" value={form.email} onChange={set('email')}
              onFocus={e => e.target.style.borderColor = 'rgba(255,107,0,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </FormField>
          <FormField label="Telefone">
            <input style={inputStyle} placeholder="(11) 99999-9999" value={form.phone} onChange={set('phone')}
              onFocus={e => e.target.style.borderColor = 'rgba(255,107,0,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </FormField>
        </div>
        <FormField label="Observações">
          <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }} placeholder="Notas internas sobre o cliente..." value={form.notes} onChange={set('notes')}
            onFocus={e => e.target.style.borderColor = 'rgba(255,107,0,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
        </FormField>
        <SubmitButton loading={loading} onClick={handleSubmit}>Criar Cliente</SubmitButton>
      </Modal>
    </AnimatePresence>
  )
}
