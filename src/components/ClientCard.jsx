import { motion } from 'framer-motion'
import { Calendar, ChevronRight, Activity } from 'lucide-react'

const categoryColors = {
  'Vídeo': '#FF6B00',
  'Story': '#FF8C42',
  'Reels': '#FF6B00',
  'Criativo': '#888',
  'Campanha': '#FF6B00',
  'Institucional': '#666',
}

export default function ClientCard({ client, onClick, index }) {
  const typeFromTitle = (title) => {
    if (title?.includes('Vídeo') || title?.includes('Video')) return 'Vídeo'
    if (title?.includes('Story')) return 'Story'
    if (title?.includes('Reels')) return 'Reels'
    if (title?.includes('Criativo')) return 'Criativo'
    if (title?.includes('Campanha')) return 'Campanha'
    return 'Criativo'
  }

  const nextType = typeFromTitle(client.nextPublicationTitle)
  const typeColor = categoryColors[nextType] || '#888'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        background: 'rgba(26,26,26,0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.07)',
        padding: '22px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)'
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(255,107,0,0.12)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Subtle bg glow */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${client.color}18, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: `linear-gradient(135deg, ${client.color}, ${client.color}99)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: '700',
              color: '#fff',
              boxShadow: `0 4px 12px ${client.color}35`,
              flexShrink: 0,
            }}
          >
            {client.initials}
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: '#fff', letterSpacing: '-0.01em' }}>
              {client.name}
            </div>
            <div style={{ fontSize: '11px', color: '#666', marginTop: '1px' }}>
              {client.segment}
            </div>
          </div>
        </div>
        <ChevronRight size={16} color="#444" />
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        <div
          style={{
            flex: 1,
            background: 'rgba(255,107,0,0.08)',
            borderRadius: '10px',
            padding: '10px 12px',
            border: '1px solid rgba(255,107,0,0.12)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <Activity size={12} color="#FF6B00" />
            <span style={{ fontSize: '10px', color: '#B3B3B3', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Ações</span>
          </div>
          <div style={{ fontSize: '22px', fontWeight: '700', color: '#fff', lineHeight: 1, letterSpacing: '-0.03em' }}>
            {client.actionsCount}
          </div>
          <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>programadas</div>
        </div>
      </div>

      {/* Next publication */}
      <div
        style={{
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '10px',
          padding: '10px 12px',
          border: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <Calendar size={14} color="#555" style={{ flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '10px', color: '#555', fontWeight: '500', marginBottom: '2px' }}>Próxima publicação</div>
          <div style={{ fontSize: '12px', color: '#B3B3B3', fontWeight: '400' }}>
            <span style={{ color: '#fff', fontWeight: '600' }}>{client.nextPublicationDate}</span>
            {' — '}
            <span>{client.nextPublicationTitle}</span>
          </div>
        </div>
        <div
          style={{
            fontSize: '10px',
            padding: '3px 8px',
            borderRadius: '6px',
            background: `${typeColor}18`,
            color: typeColor,
            border: `1px solid ${typeColor}30`,
            fontWeight: '500',
            flexShrink: 0,
          }}
        >
          {nextType}
        </div>
      </div>
    </motion.div>
  )
}
