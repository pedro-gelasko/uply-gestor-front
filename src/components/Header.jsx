import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, X, Calendar, ChevronRight, Clock } from 'lucide-react'
import { getClients } from '../services/clientService'

const CLIENT_COLORS = ['#FF6B00', '#3b82f6', '#22c55e', '#a855f7', '#ef4444', '#eab308']

function useUpcomingEvents() {
  const [events,  setEvents]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    getClients()
      .then((clients) => {
        const all = []
        clients.forEach((client, idx) => {
          const color = CLIENT_COLORS[idx % CLIENT_COLORS.length]
          client.calendars?.forEach((cal) => {
            cal.events?.forEach((ev) => {
              const d = new Date(ev.eventDate)
              if (d >= today) {
                all.push({ ...ev, clientName: client.name, clientColor: color })
              }
            })
          })
        })
        all.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
        setEvents(all.slice(0, 10))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { events, loading }
}

function formatRelative(dateStr) {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const d     = new Date(dateStr); d.setHours(0, 0, 0, 0)
  const diff  = Math.round((d - today) / 86400000)
  if (diff === 0) return 'Hoje'
  if (diff === 1) return 'Amanhã'
  if (diff <= 7)  return `Em ${diff} dias`
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

function NotificationPanel({ onClose }) {
  const { events, loading } = useUpcomingEvents()
  const panelRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ type: 'spring', damping: 28, stiffness: 320 }}
      style={{
        position: 'absolute',
        top: '52px',
        right: '24px',
        width: '340px',
        background: 'rgba(20,20,20,0.98)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        zIndex: 200,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ padding: '16px 18px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>Próximos Eventos</div>
          <div style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>
            {loading ? 'Carregando...' : `${events.length} eventos agendados`}
          </div>
        </div>
        <button onClick={onClose} style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666' }}>
          <X size={12} />
        </button>
      </div>

      {/* List */}
      <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
        {loading ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#555', fontSize: '13px' }}>Carregando...</div>
        ) : events.length === 0 ? (
          <div style={{ padding: '32px 24px', textAlign: 'center' }}>
            <Calendar size={28} color="#333" style={{ marginBottom: '10px' }} />
            <div style={{ fontSize: '13px', color: '#555' }}>Nenhum evento futuro</div>
          </div>
        ) : (
          events.map((ev, i) => {
            const isToday    = formatRelative(ev.eventDate) === 'Hoje'
            const isTomorrow = formatRelative(ev.eventDate) === 'Amanhã'
            const urgent     = isToday || isTomorrow

            return (
              <div
                key={ev.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 18px',
                  borderBottom: i < events.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  transition: 'background 0.15s ease',
                  cursor: 'default',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Color dot */}
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: ev.clientColor, flexShrink: 0, boxShadow: urgent ? `0 0 6px ${ev.clientColor}` : 'none' }} />

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {ev.title}
                  </div>
                  <div style={{ fontSize: '11px', color: '#666', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {ev.clientName}
                  </div>
                </div>

                {/* Date */}
                <div style={{
                  fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '6px', flexShrink: 0,
                  background: urgent ? `${ev.clientColor}20` : 'rgba(255,255,255,0.05)',
                  color: urgent ? ev.clientColor : '#666',
                  border: `1px solid ${urgent ? ev.clientColor + '40' : 'rgba(255,255,255,0.07)'}`,
                }}>
                  {formatRelative(ev.eventDate)}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Footer */}
      {!loading && events.length > 0 && (
        <div style={{ padding: '10px 18px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', color: '#555', fontSize: '11px' }}>
          <Clock size={11} />
          Próximos {events.length} eventos de todos os clientes
        </div>
      )}
    </motion.div>
  )
}

export default function Header({ currentClientName }) {
  const [searchValue,        setSearchValue]        = useState('')
  const [showNotifications,  setShowNotifications]  = useState(false)
  const { events: upcoming } = useUpcomingEvents()

  const urgentCount = upcoming.filter(e => {
    const diff = Math.round((new Date(e.eventDate) - new Date()) / 86400000)
    return diff <= 2
  }).length

  return (
    <header
      style={{
        height: '60px',
        background: 'rgba(15,15,15,0.92)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: '16px',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        position: 'relative',
        zIndex: 100,
      }}
    >
      {/* Page context */}
      {currentClientName && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '8px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF6B00' }} />
          <span style={{ fontSize: '13px', fontWeight: '500', color: '#B3B3B3' }}>{currentClientName}</span>
        </div>
      )}

      {/* Search */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ flex: 1, maxWidth: '360px', position: 'relative' }}>
        <Search size={14} color="#555" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        <input
          type="text"
          placeholder="Buscar eventos, clientes..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '8px 12px 8px 34px', color: '#fff', fontSize: '13px', outline: 'none', transition: 'border-color 0.2s ease' }}
          onFocus={(e) => { e.target.style.borderColor = 'rgba(255,107,0,0.4)'; e.target.style.background = 'rgba(255,255,255,0.07)' }}
          onBlur={(e)  => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.05)' }}
        />
        {searchValue && (
          <button onClick={() => setSearchValue('')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#555', padding: '2px' }}>
            <X size={12} />
          </button>
        )}
      </motion.div>

      <div style={{ flex: 1 }} />

      {/* Notification bell */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowNotifications(!showNotifications)}
        style={{
          width: '36px', height: '36px', borderRadius: '9px',
          border: showNotifications ? '1px solid rgba(255,107,0,0.4)' : '1px solid rgba(255,255,255,0.08)',
          background: showNotifications ? 'rgba(255,107,0,0.1)' : 'rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', position: 'relative', color: '#B3B3B3',
          transition: 'all 0.15s ease',
        }}
      >
        <Bell size={15} color={showNotifications ? '#FF6B00' : '#B3B3B3'} />
        {urgentCount > 0 && (
          <div style={{
            position: 'absolute', top: '-4px', right: '-4px',
            minWidth: '16px', height: '16px', borderRadius: '8px',
            background: '#FF6B00', border: '2px solid #0F0F0F',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '9px', fontWeight: '700', color: '#fff', padding: '0 3px',
          }}>
            {urgentCount}
          </div>
        )}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {showNotifications && (
          <NotificationPanel onClose={() => setShowNotifications(false)} />
        )}
      </AnimatePresence>
    </header>
  )
}
