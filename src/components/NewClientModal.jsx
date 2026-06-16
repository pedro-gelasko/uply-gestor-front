import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Modal, { inputStyle, FormField, SubmitButton, ErrorMsg } from './Modal'
import { createClient, updateClient } from '../services/clientService'
import FileUpload from './FileUpload'

const focus = (e) => { e.target.style.borderColor = 'rgba(255,107,0,0.5)' }
const blur  = (e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }

export default function NewClientModal({ client: existing, onClose, onSuccess }) {
  const isEdit = !!existing

  const [form, setForm] = useState({
    name:            existing?.name            || '',
    responsibleName: existing?.contactName     || existing?.responsibleName || '',
    email:           existing?.contactEmail    || existing?.email           || '',
    phone:           existing?.phone           || '',
    notes:           existing?.description     || existing?.notes           || '',
    logoPath:        existing?.logoPath        || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.name || !form.responsibleName) {
      return setError('Preencha nome e responsável.')
    }
    setLoading(true); setError(null)
    try {
      const payload = {
        name:            form.name.trim(),
        responsibleName: form.responsibleName.trim(),
        email:           form.email.trim(),
        phone:           form.phone.trim() || undefined,
        notes:           form.notes.trim() || undefined,
        logoPath:        form.logoPath     || undefined,
      }
      if (isEdit) {
        await updateClient(existing.id, payload)
      } else {
        await createClient(payload)
      }
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
      <Modal title={isEdit ? 'Editar Cliente' : 'Novo Cliente'} onClose={!loading ? onClose : undefined}>
        <ErrorMsg msg={error} />

        <FormField label="Logo do provedor (opcional)">
          <FileUpload
            value={form.logoPath}
            onChange={(url) => setForm(f => ({ ...f, logoPath: url }))}
            disabled={loading}
            imageOnly
          />
        </FormField>

        <FormField label="Nome do provedor *">
          <input style={inputStyle} placeholder="Ex: Voa Fibra"
            value={form.name} onChange={set('name')}
            onFocus={focus} onBlur={blur} disabled={loading} />
        </FormField>

        <FormField label="Nome do responsável *">
          <input style={inputStyle} placeholder="Ex: Ricardo Oliveira"
            value={form.responsibleName} onChange={set('responsibleName')}
            onFocus={focus} onBlur={blur} disabled={loading} />
        </FormField>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <FormField label="E-mail">
            <input style={inputStyle} type="email" placeholder="contato@empresa.com"
              value={form.email} onChange={set('email')}
              onFocus={focus} onBlur={blur} disabled={loading} />
          </FormField>
          <FormField label="Telefone">
            <input style={inputStyle} placeholder="(11) 99999-9999"
              value={form.phone} onChange={set('phone')}
              onFocus={focus} onBlur={blur} disabled={loading} />
          </FormField>
        </div>

        <FormField label="Observações">
          <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }}
            placeholder="Notas internas sobre o cliente..."
            value={form.notes} onChange={set('notes')}
            onFocus={focus} onBlur={blur} disabled={loading} />
        </FormField>

        <SubmitButton loading={loading} onClick={handleSubmit}>
          {isEdit ? 'Salvar Alterações' : 'Criar Cliente'}
        </SubmitButton>
      </Modal>
    </AnimatePresence>
  )
}
