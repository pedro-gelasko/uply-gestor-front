import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Modal, { inputStyle, FormField, SubmitButton, ErrorMsg } from './Modal'
import { createEvent, updateEvent } from '../services/eventService'

const CATEGORIES = [
  { value: 'VIDEO',         label: 'Vídeo' },
  { value: 'REELS',         label: 'Reels' },
  { value: 'STORY',         label: 'Story' },
  { value: 'CREATIVE',      label: 'Criativo' },
  { value: 'CAMPAIGN',      label: 'Campanha' },
  { value: 'INSTITUTIONAL', label: 'Institucional' },
  { value: 'COMMEMORATIVE', label: 'Comemorativo' },
  { value: 'OTHER',         label: 'Outro' },
]

const STATUSES = [
  { value: 'PLANNED',          label: 'Planejado' },
  { value: 'IN_PRODUCTION',    label: 'Em Produção' },
  { value: 'WAITING_APPROVAL', label: 'Aguardando Aprovação' },
  { value: 'PUBLISHED',        label: 'Publicado' },
  { value: 'CANCELLED',        label: 'Cancelado' },
]

const selectStyle = {
  ...inputStyle,
  cursor: 'pointer',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  paddingRight: '32px',
}

export default function NewEventModal({ calendarId, event, onClose, onSuccess }) {
  const isEdit = !!event

  const toDateInput = (iso) => {
    if (!iso) return ''
    return new Date(iso).toISOString().slice(0, 10)
  }

  const [form, setForm] = useState({
    title:       event?.title       || '',
    description: event?.description || '',
    category:    event?.category    || 'VIDEO',
    status:      event?.status      || 'PLANNED',
    eventDate:   toDateInput(event?.eventDate || event?.start) || '',
    eventTime:   event?.eventTime   || '',
    imageUrl:    event?.imageUrl    || '',
  })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.title || !form.category || !form.eventDate) {
      return setError('Preencha título, categoria e data.')
    }
    setLoading(true); setError(null)
    try {
      const payload = {
        ...form,
        eventDate: new Date(form.eventDate + 'T12:00:00.000Z').toISOString(),
        calendarId: isEdit ? undefined : calendarId,
      }
      if (isEdit) {
        await updateEvent(event.id, payload)
      } else {
        await createEvent(payload)
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
      <Modal title={isEdit ? 'Editar Evento' : 'Novo Evento'} onClose={onClose}>
        <ErrorMsg msg={error} />

        <FormField label="Título *">
          <input style={inputStyle} placeholder="Ex: Vídeo Promocional 600MB" value={form.title} onChange={set('title')}
            onFocus={e => e.target.style.borderColor = 'rgba(255,107,0,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
        </FormField>

        <FormField label="Descrição">
          <textarea style={{ ...inputStyle, height: '72px', resize: 'vertical' }} placeholder="Detalhes do evento..." value={form.description} onChange={set('description')}
            onFocus={e => e.target.style.borderColor = 'rgba(255,107,0,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
        </FormField>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <FormField label="Categoria *">
            <select style={selectStyle} value={form.category} onChange={set('category')}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </FormField>
          <FormField label="Status">
            <select style={selectStyle} value={form.status} onChange={set('status')}>
              {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </FormField>
        </div>

        <FormField label="URL da Imagem">
          <input style={inputStyle} placeholder="https://..." value={form.imageUrl} onChange={set('imageUrl')}
            onFocus={e => e.target.style.borderColor = 'rgba(255,107,0,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
        </FormField>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <FormField label="Data *">
            <input style={inputStyle} type="date" value={form.eventDate} onChange={set('eventDate')}
              onFocus={e => e.target.style.borderColor = 'rgba(255,107,0,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </FormField>
          <FormField label="Horário">
            <input style={inputStyle} type="time" value={form.eventTime} onChange={set('eventTime')}
              onFocus={e => e.target.style.borderColor = 'rgba(255,107,0,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </FormField>
        </div>

        <SubmitButton loading={loading} onClick={handleSubmit}>
          {isEdit ? 'Salvar Alterações' : 'Criar Evento'}
        </SubmitButton>
      </Modal>
    </AnimatePresence>
  )
}
