import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Tag, Clock, Paperclip, Edit3, Trash2, Share2, Video, Image, FileText, Film, Tv, Megaphone } from 'lucide-react'

const statusColors = {
  'Publicado': { bg: 'rgba(34,197,94,0.12)', color: '#22c55e', border: 'rgba(34,197,94,0.25)' },
  'Agendado': { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', border: 'rgba(59,130,246,0.25)' },
  'Produção': { bg: 'rgba(234,179,8,0.12)', color: '#eab308', border: 'rgba(234,179,8,0.25)' },
  'Planejado': { bg: 'rgba(255,107,0,0.12)', color: '#FF8C42', border: 'rgba(255,107,0,0.25)' },
}

const categoryIconMap = {
  video: Video,
  story: Image,
  criativo: Image,
  campanha: Megaphone,
  institucional: Tv,
  reels: Film,
}

const categoryColorMap = {
  video: '#FF6B00',
  story: '#FF8C42',
  criativo: '#888',
  campanha: '#FF6B00',
  institucional: '#666',
  reels: '#FF6B00',
}

const fileIconMap = {
  '.mp4': Film,
  '.jpg': Image,
  '.jpeg': Image,
  '.png': Image,
  '.psd': Image,
  '.ai': Image,
  '.pdf': FileText,
  '.docx': FileText,
  '.doc': FileText,
}

function getFileIcon(filename) {
  const ext = '.' + filename.split('.').pop().toLowerCase()
  return fileIconMap[ext] || FileText
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function EventDetailsDrawer({ event, onClose }) {
  if (!event) return null

  const status = statusColors[event.status] || statusColors['Planejado']
  const CatIcon = categoryIconMap[event.category?.toLowerCase()] || Tag
  const catColor = categoryColorMap[event.category?.toLowerCase()] || '#888'

  return (
    <AnimatePresence>
      {event && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
              zIndex: 200,
            }}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: '360px',
              background: 'rgba(20,20,20,0.98)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              borderLeft: '1px solid rgba(255,255,255,0.08)',
              zIndex: 201,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '20px 20px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: `${catColor}18`,
                  border: `1px solid ${catColor}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CatIcon size={18} color={catColor} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '15px', fontWeight: '600', color: '#fff', lineHeight: 1.3, letterSpacing: '-0.01em' }}>
                  {event.title}
                </div>
                <div style={{ fontSize: '11px', color: '#666', marginTop: '4px', textTransform: 'capitalize' }}>
                  {event.category}
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '7px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#888',
                  flexShrink: 0,
                }}
              >
                <X size={13} />
              </button>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
              {/* Status */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: '100px',
                  background: status.bg,
                  border: `1px solid ${status.border}`,
                  marginBottom: '20px',
                }}
              >
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: status.color }} />
                <span style={{ fontSize: '12px', fontWeight: '500', color: status.color }}>
                  {event.status}
                </span>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', color: '#555', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                  Descrição
                </div>
                <div style={{ fontSize: '13px', color: '#B3B3B3', lineHeight: '1.6' }}>
                  {event.description}
                </div>
              </div>

              {/* Meta info */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.06)',
                  overflow: 'hidden',
                  marginBottom: '20px',
                }}
              >
                <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={13} color="#555" />
                    <span style={{ fontSize: '12px', color: '#888' }}>Data</span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#fff', fontWeight: '500' }}>{formatDate(event.start)}</span>
                </div>
                <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Tag size={13} color="#555" />
                    <span style={{ fontSize: '12px', color: '#888' }}>Categoria</span>
                  </div>
                  <span style={{ fontSize: '12px', color: catColor, fontWeight: '500', textTransform: 'capitalize' }}>{event.category}</span>
                </div>
                {event.platform && (
                  <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Share2 size={13} color="#555" />
                      <span style={{ fontSize: '12px', color: '#888' }}>Plataforma</span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#fff', fontWeight: '500' }}>{event.platform}</span>
                  </div>
                )}
                {event.responsible && (
                  <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={13} color="#555" />
                      <span style={{ fontSize: '12px', color: '#888' }}>Responsável</span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#fff', fontWeight: '500' }}>{event.responsible}</span>
                  </div>
                )}
              </div>

              {/* Files */}
              {event.files?.length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', color: '#555', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Paperclip size={11} color="#555" />
                    Arquivos
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {event.files.map((file, i) => {
                      const FileIcon = getFileIcon(file)
                      return (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 12px',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '9px',
                            border: '1px solid rgba(255,255,255,0.06)',
                            cursor: 'pointer',
                            transition: 'background 0.15s ease',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,107,0,0.06)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                        >
                          <FileIcon size={14} color="#FF8C42" style={{ flexShrink: 0 }} />
                          <span style={{ fontSize: '12px', color: '#B3B3B3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {file}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div
              style={{
                padding: '16px 20px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                gap: '8px',
              }}
            >
              <button
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '9px',
                  borderRadius: '9px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#B3B3B3',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                <Edit3 size={13} />
                Editar
              </button>
              <button
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '9px',
                  borderRadius: '9px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #FF6B00, #FF8C42)',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(255,107,0,0.25)',
                }}
              >
                <Share2 size={13} />
                Compartilhar
              </button>
              <button
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '9px',
                  border: '1px solid rgba(239,68,68,0.2)',
                  background: 'rgba(239,68,68,0.08)',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
