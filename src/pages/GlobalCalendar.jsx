import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import ptBrLocale from '@fullcalendar/core/locales/pt-br'
import { Calendar, Users } from 'lucide-react'
import { useAllEvents } from '../hooks/useAllEvents'
import { PageLoading, PageError } from '../components/LoadingState'
import EventDetailsDrawer from '../components/EventDetailsDrawer'
import { mapEvent } from '../data/mappers'

export default function GlobalCalendar({ onClientClick }) {
  const calendarRef = useRef(null)
  const [selectedEvent,  setSelectedEvent]  = useState(null)
  const [activeFilter,   setActiveFilter]   = useState(null)
  const { fcEvents, clients, loading, error, refetch } = useAllEvents()

  const filtered = activeFilter
    ? fcEvents.filter(e => e.extendedProps.clientName === activeFilter)
    : fcEvents

  const handleEventClick = (info) => {
    const props = info.event.extendedProps
    setSelectedEvent(mapEvent(props))
  }

  if (loading) return <PageLoading message="Carregando todos os eventos..." />
  if (error)   return <PageError message={error} onRetry={refetch} />

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      {/* Top bar */}
      <div style={{
        padding: '16px 28px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', gap: '16px',
        background: 'rgba(15,15,15,0.6)', backdropFilter: 'blur(10px)',
        flexShrink: 0,
      }}>
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(255,107,0,0.12)', border: '1px solid rgba(255,107,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={16} color="#FF6B00" />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: '#fff' }}>Calendário Global</div>
            <div style={{ fontSize: '11px', color: '#666' }}>
              {fcEvents.length} eventos · {clients.length} clientes
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* Client legend / filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Todos */}
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => setActiveFilter(null)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '5px 12px', borderRadius: '100px',
              border: `1px solid ${!activeFilter ? 'rgba(255,107,0,0.5)' : 'rgba(255,255,255,0.1)'}`,
              background: !activeFilter ? 'rgba(255,107,0,0.12)' : 'rgba(255,255,255,0.04)',
              color: !activeFilter ? '#FF8C42' : '#888',
              fontSize: '11px', fontWeight: '500', cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Users size={11} />
            Todos
          </motion.button>

          {clients.map((client) => (
            <motion.button
              key={client.id}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => setActiveFilter(f => f === client.name ? null : client.name)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '5px 12px', borderRadius: '100px',
                border: `1px solid ${activeFilter === client.name ? client.clientColor + '80' : 'rgba(255,255,255,0.08)'}`,
                background: activeFilter === client.name ? client.clientColor + '18' : 'rgba(255,255,255,0.04)',
                color: activeFilter === client.name ? client.clientColor : '#888',
                fontSize: '11px', fontWeight: '500', cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: client.clientColor, flexShrink: 0 }} />
              {client.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px' }}>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ height: '100%', minHeight: '600px' }}
        >
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView="dayGridMonth"
            locale={ptBrLocale}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,listMonth',
            }}
            buttonText={{ today: 'Hoje', month: 'Mês', week: 'Semana', list: 'Lista' }}
            events={filtered}
            eventClick={handleEventClick}
            dayMaxEvents={4}
            fixedWeekCount={false}
            height="100%"
            eventDisplay="block"
            eventContent={(arg) => (
              <div style={{ padding: '1px 4px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '11px', fontWeight: '500' }}>
                <span style={{ opacity: 0.75, marginRight: '4px', fontSize: '10px' }}>
                  {arg.event.extendedProps.clientInitials}
                </span>
                {arg.event.title}
              </div>
            )}
          />
        </motion.div>
      </div>

      {/* Event drawer */}
      {selectedEvent && (
        <EventDetailsDrawer
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onUpdate={() => { setSelectedEvent(null); refetch() }}
          onDelete={() => { setSelectedEvent(null); refetch() }}
        />
      )}
    </div>
  )
}
