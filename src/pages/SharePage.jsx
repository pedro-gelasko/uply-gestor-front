import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import ptBrLocale from '@fullcalendar/core/locales/pt-br'
import { Zap, Calendar, Lock, X, Tag, Clock, Paperclip, Video, Image, FileText, Film, Tv, Megaphone } from 'lucide-react'
import { getPublicShare } from '../services/shareService'
import { mapEventToFC, mapEvent, CATEGORY_COLORS, CATEGORY_LABELS, STATUS_LABELS } from '../data/mappers'

const statusColors = {
  PUBLISHED:        { bg: 'rgba(34,197,94,0.12)',  color: '#22c55e', border: 'rgba(34,197,94,0.25)'  },
  PLANNED:          { bg: 'rgba(255,107,0,0.12)',  color: '#FF8C42', border: 'rgba(255,107,0,0.25)'  },
  IN_PRODUCTION:    { bg: 'rgba(234,179,8,0.12)',  color: '#eab308', border: 'rgba(234,179,8,0.25)'  },
  WAITING_APPROVAL: { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', border: 'rgba(59,130,246,0.25)' },
  CANCELLED:        { bg: 'rgba(239,68,68,0.12)',  color: '#ef4444', border: 'rgba(239,68,68,0.25)'  },
}

const catIconMap = { VIDEO: Video, REELS: Film, STORY: Image, CREATIVE: Image, CAMPAIGN: Megaphone, INSTITUTIONAL: Tv, COMMEMORATIVE: Calendar, OTHER: Tag }
const fileIconMap = { '.mp4': Film, '.jpg': Image, '.jpeg': Image, '.png': Image, '.pdf': FileText, '.docx': FileText }
const getFileIcon = (f) => fileIconMap['.' + f.split('.').pop().toLowerCase()] || FileText

function EventPanel({ event, onClose }) {
  const status   = statusColors[event.status] || statusColors.PLANNED
  const CatIcon  = catIconMap[event.category] || Tag
  const catColor = (CATEGORY_COLORS[event.category] || CATEGORY_COLORS.OTHER).bg

  return (
    <div style={{ width: '300px', minWidth: '300px', borderLeft: '1px solid rgba(255,255,255,0.07)', background: 'rgba(18,18,18,0.98)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '9px', flexShrink: 0, background: `${catColor}18`, border: `1px solid ${catColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CatIcon size={16} color={catColor} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', lineHeight: 1.35 }}>{event.title}</div>
          <div style={{ fontSize: '11px', color: '#555', marginTop: '3px', textTransform: 'capitalize' }}>{CATEGORY_LABELS[event.category]}</div>
        </div>
        <button onClick={onClose} style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666', flexShrink: 0 }}>
          <X size={12} />
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '100px', marginBottom: '16px', background: status.bg, border: `1px solid ${status.border}` }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: status.color }} />
          <span style={{ fontSize: '11px', fontWeight: '500', color: status.color }}>{STATUS_LABELS[event.status]}</span>
        </div>

        {event.imageUrl && (
          <img src={event.imageUrl} alt={event.title} style={{ width: '100%', borderRadius: '10px', objectFit: 'cover', maxHeight: '140px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.07)' }} onError={e => e.target.style.display = 'none'} />
        )}

        {event.description && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '10px', color: '#444', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>Descrição</div>
            <div style={{ fontSize: '12px', color: '#999', lineHeight: '1.65' }}>{event.description}</div>
          </div>
        )}

        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: '16px' }}>
          <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={11} color="#444" /><span style={{ fontSize: '11px', color: '#555' }}>Data</span></div>
            <span style={{ fontSize: '11px', color: '#B3B3B3', fontWeight: '500' }}>{new Date(event.eventDate || event.start).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
          </div>
          {event.eventTime && (
            <div style={{ padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={11} color="#444" /><span style={{ fontSize: '11px', color: '#555' }}>Horário</span></div>
              <span style={{ fontSize: '11px', color: '#B3B3B3', fontWeight: '500' }}>{event.eventTime}</span>
            </div>
          )}
        </div>

        {event.files?.length > 0 && (
          <div>
            <div style={{ fontSize: '10px', color: '#444', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Paperclip size={10} color="#444" /> Arquivos
            </div>
            {event.files.map((file, i) => {
              const FileIcon = getFileIcon(file)
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '5px' }}>
                  <FileIcon size={12} color="#FF8C42" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '11px', color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
        <Lock size={11} color="#444" />
        <span style={{ fontSize: '11px', color: '#444' }}>Somente visualização</span>
      </div>
    </div>
  )
}

export default function SharePage() {
  const { token } = useParams()
  const calendarRef = useRef(null)
  const [shareData, setShareData] = useState(null)
  const [fcEvents,  setFcEvents]  = useState([])
  const [selected,  setSelected]  = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)

  useEffect(() => {
    if (!token) return
    getPublicShare(token)
      .then((data) => {
        setShareData(data)
        const all = data.client?.calendars?.flatMap((c) => c.events || []) || []
        setFcEvents(all.map(mapEventToFC))
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [token])

  const client = shareData?.client
  const initials = (name = '') => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F0F0F', flexDirection: 'column', gap: '16px' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid rgba(255,107,0,0.2)', borderTopColor: '#FF6B00', animation: 'spin 1s linear infinite' }} />
      <span style={{ fontSize: '13px', color: '#555' }}>Carregando calendário...</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  if (error) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F0F0F', flexDirection: 'column', gap: '12px' }}>
      <span style={{ fontSize: '14px', color: '#ef4444' }}>Link inválido ou expirado</span>
      <span style={{ fontSize: '12px', color: '#555' }}>{error}</span>
    </div>
  )

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0D0D0D', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '16px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(15,15,15,0.9)', backdropFilter: 'blur(10px)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'linear-gradient(135deg,#FF6B00,#FF8C42)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(255,107,0,0.3)' }}>
              <Zap size={13} color="#fff" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#FF6B00', letterSpacing: '-0.01em' }}>SABORR</span>
          </div>

          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.08)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg,#FF6B00,#FF8C42)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: '#fff' }}>
              {initials(client?.name)}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>{client?.name}</div>
              <div style={{ fontSize: '11px', color: '#555', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={10} color="#555" /> Calendário de Conteúdo · Junho 2026
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {[{ label: 'Vídeo', color: '#FF6B00' }, { label: 'Story', color: '#FF8C42' }, { label: 'Criativo', color: '#555' }, { label: 'Campanha', color: '#FF6B00' }].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: l.color }} />
              <span style={{ fontSize: '10px', color: '#555' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflow: 'auto', padding: '24px 32px' }}>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, listPlugin]}
            initialView="dayGridMonth"
            locale={ptBrLocale}
            headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,listMonth' }}
            buttonText={{ today: 'Hoje', month: 'Mês', list: 'Lista' }}
            events={fcEvents}
            dayMaxEvents={3}
            fixedWeekCount={false}
            height="100%"
            eventDisplay="block"
            editable={false}
            selectable={false}
            eventClick={(info) => setSelected(mapEvent(info.event.extendedProps))}
          />
        </div>

        {selected && <EventPanel event={selected} onClose={() => setSelected(null)} />}
      </div>

      {/* Footer */}
      <div style={{ padding: '10px 32px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', flexShrink: 0 }}>
        <Zap size={10} color="#FF6B00" />
        <span style={{ fontSize: '10px', color: '#333' }}>Powered by <span style={{ color: '#FF6B00', fontWeight: '600' }}>SABORR CRM</span></span>
      </div>
    </div>
  )
}
