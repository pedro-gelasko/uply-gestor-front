import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import ptBrLocale from '@fullcalendar/core/locales/pt-br'
import { ArrowLeft, Plus } from 'lucide-react'
import EventDetailsDrawer from '../components/EventDetailsDrawer'
import { useClientCalendar } from '../hooks/useClientCalendar'
import { PageLoading, PageError } from '../components/LoadingState'

export default function ClientCalendar({ client, onBack }) {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const calendarRef = useRef(null)

  const calendarId = client.calendars?.[0]?.id
  const { events, loading, error, refetch } = useClientCalendar(calendarId)

  const legend = [
    { label: 'Vídeo',     color: '#FF6B00' },
    { label: 'Story',     color: '#FF8C42' },
    { label: 'Criativo',  color: '#555' },
    { label: 'Campanha',  color: '#FF6B00' },
  ]

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      {/* Top bar */}
      <div style={{ padding: '16px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(15,15,15,0.6)', backdropFilter: 'blur(10px)' }}>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.05)', color: '#B3B3B3', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
          <ArrowLeft size={14} />
          Voltar
        </motion.button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: `linear-gradient(135deg, ${client.color}, ${client.color}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: '#fff', flexShrink: 0 }}>
            {client.initials}
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: '#fff' }}>{client.name}</div>
            <div style={{ fontSize: '11px', color: '#666' }}>
              {loading ? 'Carregando...' : `${events.length} eventos`}
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {legend.map((l) => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: l.color }} />
              <span style={{ fontSize: '11px', color: '#888' }}>{l.label}</span>
            </div>
          ))}
        </div>

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '9px', border: 'none', background: 'linear-gradient(135deg, #FF6B00, #FF8C42)', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 10px rgba(255,107,0,0.3)' }}>
          <Plus size={14} strokeWidth={2.5} />
          Novo Evento
        </motion.button>
      </div>

      {/* Calendar body */}
      <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px' }}>
        {loading ? (
          <PageLoading message="Carregando eventos..." />
        ) : error ? (
          <PageError message={error} onRetry={refetch} />
        ) : (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} style={{ height: '100%', minHeight: '600px' }}>
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
              initialView="dayGridMonth"
              locale={ptBrLocale}
              headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth' }}
              buttonText={{ today: 'Hoje', month: 'Mês', week: 'Semana', day: 'Dia', list: 'Lista' }}
              events={events}
              eventClick={(info) => setSelectedEvent(info.event.extendedProps)}
              dayMaxEvents={3}
              fixedWeekCount={false}
              height="100%"
              eventDisplay="block"
            />
          </motion.div>
        )}
      </div>

      {selectedEvent && (
        <EventDetailsDrawer event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  )
}
