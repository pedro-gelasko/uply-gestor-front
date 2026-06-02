import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import ptBrLocale from '@fullcalendar/core/locales/pt-br'
import {
  X, Calendar, Zap, ExternalLink, Tag, Clock,
  Paperclip, Video, Image, FileText, Film, Tv, Megaphone, Lock,
} from 'lucide-react'
import { getPublicShare } from '../services/shareService'
import { mapEventToFC, mapEvent, CATEGORY_COLORS } from '../data/mappers'

const statusColors = {
  PUBLISHED:        { bg: 'rgba(34,197,94,0.12)',  color: '#22c55e', border: 'rgba(34,197,94,0.25)'  },
  PLANNED:          { bg: 'rgba(255,107,0,0.12)',  color: '#FF8C42', border: 'rgba(255,107,0,0.25)'  },
  IN_PRODUCTION:    { bg: 'rgba(234,179,8,0.12)',  color: '#eab308', border: 'rgba(234,179,8,0.25)'  },
  WAITING_APPROVAL: { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', border: 'rgba(59,130,246,0.25)' },
  CANCELLED:        { bg: 'rgba(239,68,68,0.12)',  color: '#ef4444', border: 'rgba(239,68,68,0.25)'  },
}

const categoryIconMap = {
  VIDEO: Video, REELS: Film, STORY: Image,
  CREATIVE: Image, CAMPAIGN: Megaphone, INSTITUTIONAL: Tv,
  COMMEMORATIVE: Calendar, OTHER: Tag,
}

const fileIconMap = {
  '.mp4': Film, '.jpg': Image, '.jpeg': Image, '.png': Image,
  '.psd': Image, '.ai': Image, '.pdf': FileText, '.docx': FileText, '.doc': FileText,
}

function getFileIcon(filename) {
  const ext = '.' + filename.split('.').pop().toLowerCase()
  return fileIconMap[ext] || FileText
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  })
}

const legend = [
  { label: 'Vídeo',    color: '#FF6B00' },
  { label: 'Story',    color: '#FF8C42' },
  { label: 'Criativo', color: '#555555' },
  { label: 'Campanha', color: '#FF6B00', gradient: true },
  { label: 'Reels',    color: '#FF6B00' },
]

/* ── Read-only event detail panel ── */
function EventReadPanel({ event, onClose }) {
  const status   = statusColors[event.status] || statusColors['PLANNED']
  const CatIcon  = categoryIconMap[event.category] || Tag
  const catColor = (CATEGORY_COLORS[event.category] || CATEGORY_COLORS.OTHER).bg

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ type: 'spring', damping: 30, stiffness: 340 }}
      style={{
        width: '300px',
        minWidth: '300px',
        borderLeft: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(18,18,18,0.98)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Panel header */}
      <div style={{
        padding: '16px 16px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'flex-start', gap: '10px',
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '9px', flexShrink: 0,
          background: `${catColor}18`, border: `1px solid ${catColor}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <CatIcon size={16} color={catColor} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', lineHeight: 1.35, letterSpacing: '-0.01em' }}>
            {event.title}
          </div>
          <div style={{ fontSize: '11px', color: '#555', marginTop: '3px', textTransform: 'capitalize' }}>
            {event.category}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            width: '26px', height: '26px', borderRadius: '6px', flexShrink: 0,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#666',
          }}
        >
          <X size={12} />
        </button>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        {/* Status pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '4px 10px', borderRadius: '100px', marginBottom: '16px',
          background: status.bg, border: `1px solid ${status.border}`,
        }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: status.color }} />
          <span style={{ fontSize: '11px', fontWeight: '500', color: status.color }}>{event.status}</span>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '10px', color: '#444', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>
            Descrição
          </div>
          <div style={{ fontSize: '12px', color: '#999', lineHeight: '1.65' }}>
            {event.description}
          </div>
        </div>

        {/* Meta */}
        <div style={{
          background: 'rgba(255,255,255,0.03)', borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: '16px',
        }}>
          {[
            { icon: Calendar, label: 'Data',        value: formatDate(event.start) },
            { icon: Tag,      label: 'Categoria',   value: event.category, color: catColor, capitalize: true },
            event.platform && { icon: ExternalLink, label: 'Plataforma', value: event.platform },
          ].filter(Boolean).map((row, i, arr) => (
            <div key={row.label} style={{
              padding: '10px 12px',
              borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                <row.icon size={11} color="#444" />
                <span style={{ fontSize: '11px', color: '#555' }}>{row.label}</span>
              </div>
              <span style={{
                fontSize: '11px', fontWeight: '500',
                color: row.color || '#B3B3B3',
                textAlign: 'right',
                textTransform: row.capitalize ? 'capitalize' : 'none',
              }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>

        {/* Files */}
        {event.files?.length > 0 && (
          <div>
            <div style={{
              fontSize: '10px', color: '#444', fontWeight: '600', textTransform: 'uppercase',
              letterSpacing: '0.07em', marginBottom: '8px',
              display: 'flex', alignItems: 'center', gap: '5px',
            }}>
              <Paperclip size={10} color="#444" />
              Arquivos
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {event.files.map((file, i) => {
                const FileIcon = getFileIcon(file)
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '8px 10px',
                    background: 'rgba(255,255,255,0.03)', borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <FileIcon size={12} color="#FF8C42" style={{ flexShrink: 0 }} />
                    <span style={{
                      fontSize: '11px', color: '#888',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {file}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Read-only badge */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
      }}>
        <Lock size={11} color="#444" />
        <span style={{ fontSize: '11px', color: '#444' }}>Somente visualização</span>
      </div>
    </motion.div>
  )
}

/* ── Main component ── */
export default function ClientSharePreview({ share, onClose }) {
  const calendarRef = useRef(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [shareData, setShareData]         = useState(null)
  const [fcEvents,  setFcEvents]          = useState([])
  const [loadingShare, setLoadingShare]   = useState(true)

  useEffect(() => {
    if (!share?.token) return
    setLoadingShare(true)
    getPublicShare(share.token)
      .then((data) => {
        setShareData(data)
        const allEvents = data.client?.calendars?.flatMap((c) => c.events || []) || []
        setFcEvents(allEvents.map(mapEventToFC))
      })
      .catch(() => {})
      .finally(() => setLoadingShare(false))
  }, [share?.token])

  const client = shareData?.client

  return (
    <AnimatePresence>
      {share && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 300,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
          }}
        >
          {/* Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 14 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: '1100px',
              height: 'min(740px, calc(100vh - 48px))',
              background: '#111',
              borderRadius: '18px',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 48px 120px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,107,0,0.06)',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* ── Browser chrome ── */}
            <div style={{
              background: 'rgba(22,22,22,0.98)',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              padding: '11px 16px',
              display: 'flex', alignItems: 'center', gap: '12px',
              flexShrink: 0,
              backdropFilter: 'blur(10px)',
            }}>
              <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FF5F57', boxShadow: '0 0 0 1px rgba(0,0,0,0.3)' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FFBD2E', boxShadow: '0 0 0 1px rgba(0,0,0,0.3)' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27C840', boxShadow: '0 0 0 1px rgba(0,0,0,0.3)' }} />
              </div>

              <div style={{
                flex: 1, background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px', padding: '6px 14px',
                display: 'flex', alignItems: 'center', gap: '8px',
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
                <span style={{ fontSize: '12px', color: '#666', letterSpacing: '0.01em', flex: 1 }}>
                  saborr.app{share.link}
                </span>
                <Lock size={11} color="#444" />
              </div>

              <button
                onClick={onClose}
                style={{
                  width: '30px', height: '30px', borderRadius: '8px', flexShrink: 0,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#555',
                }}
              >
                <X size={13} />
              </button>
            </div>

            {/* ── Content row ── */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              {/* Main page */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0D0D0D' }}>
                {/* Client header */}
                <div style={{
                  padding: '20px 28px 16px',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  flexShrink: 0,
                  background: 'linear-gradient(180deg, rgba(20,20,20,0.9) 0%, rgba(13,13,13,0) 100%)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {/* Logo Saborr */}
                    <div style={{
                      width: '30px', height: '30px', borderRadius: '8px',
                      background: 'linear-gradient(135deg,#FF6B00,#FF8C42)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 3px 10px rgba(255,107,0,0.35)',
                    }}>
                      <Zap size={14} color="#fff" strokeWidth={2.5} />
                    </div>

                    <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.08)' }} />

                    {/* Client identity */}
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '9px',
                      background: 'linear-gradient(135deg,#FF6B00,#FF8C42)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: '700', color: '#fff',
                      boxShadow: '0 3px 10px rgba(255,107,0,0.35)',
                      flexShrink: 0,
                    }}>
                      {(client?.name || share.clientName || '??').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff', letterSpacing: '-0.02em' }}>
                        {share.clientName}
                      </div>
                      <div style={{ fontSize: '11px', color: '#444', marginTop: '1px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={10} color="#444" />
                        Calendário de Conteúdo · Junho 2026
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {legend.map((l) => (
                      <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{
                          width: '8px', height: '8px', borderRadius: '2px',
                          background: l.gradient ? 'linear-gradient(135deg,#FF6B00,#FF8C42)' : l.color,
                        }} />
                        <span style={{ fontSize: '10px', color: '#555' }}>{l.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Calendar */}
                <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px 24px' }}>
                  <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, listPlugin]}
                    initialView="dayGridMonth"
                    locale={ptBrLocale}
                    headerToolbar={{
                      left: 'prev,next today',
                      center: 'title',
                      right: 'dayGridMonth,listMonth',
                    }}
                    buttonText={{ today: 'Hoje', month: 'Mês', list: 'Lista' }}
                    events={fcEvents}
                    initialDate="2026-06-01"
                    dayMaxEvents={3}
                    fixedWeekCount={false}
                    height="100%"
                    eventDisplay="block"
                    editable={false}
                    selectable={false}
                    eventClick={(info) => setSelectedEvent(info.event.extendedProps)}
                  />
                </div>

                {/* Footer */}
                <div style={{
                  padding: '10px 24px',
                  borderTop: '1px solid rgba(255,255,255,0.04)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                  flexShrink: 0,
                }}>
                  <Zap size={10} color="#FF6B00" />
                  <span style={{ fontSize: '10px', color: '#333' }}>
                    Powered by{' '}
                    <span style={{ color: '#FF6B00', fontWeight: '600' }}>UPLY Gestor</span>
                  </span>
                </div>
              </div>

              {/* Event detail panel */}
              <AnimatePresence>
                {selectedEvent && (
                  <EventReadPanel
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
