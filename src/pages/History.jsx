import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit3, Trash2, Share2, Calendar, Filter } from 'lucide-react'
import { getHistory } from '../services/historyService'
import { mapHistory } from '../data/mappers'
import { PageLoading, PageError } from '../components/LoadingState'

const typeConfig = {
  create:   { icon: Plus,     color: '#22c55e', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.2)',   label: 'Criação'         },
  edit:     { icon: Edit3,    color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.2)',  label: 'Edição'          },
  delete:   { icon: Trash2,   color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.2)',   label: 'Remoção'         },
  share:    { icon: Share2,   color: '#FF8C42', bg: 'rgba(255,140,66,0.1)',  border: 'rgba(255,140,66,0.2)',  label: 'Compartilhamento'},
  schedule: { icon: Calendar, color: '#FF6B00', bg: 'rgba(255,107,0,0.1)',   border: 'rgba(255,107,0,0.2)',   label: 'Agendamento'     },
}

const groupByDate = (items) => {
  const groups = {}
  items.forEach((item) => { if (!groups[item.date]) groups[item.date] = []; groups[item.date].push(item) })
  return groups
}

export default function History() {
  const [items,   setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const raw = await getHistory()
      setItems(raw.map(mapHistory))
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  if (loading) return <PageLoading message="Carregando histórico..." />
  if (error)   return <PageError message={error} onRetry={fetch} />

  const grouped = groupByDate(items)

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '32px' }}>
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#fff', letterSpacing: '-0.03em', marginBottom: '4px' }}>Histórico</h1>
            <p style={{ fontSize: '14px', color: '#666' }}>Todas as ações realizadas na plataforma</p>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 14px', borderRadius: '9px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: '#B3B3B3', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
            <Filter size={13} />
            Filtrar
          </button>
        </div>
      </motion.div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#555', padding: '48px', fontSize: '14px' }}>Nenhum registro no histórico.</div>
      ) : (
        Object.entries(grouped).map(([date, dateItems], gIdx) => (
          <motion.div key={date} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gIdx * 0.07 }} style={{ marginBottom: '28px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#888', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
              {date}
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {dateItems.map((item, i) => {
                const config = typeConfig[item.type] || typeConfig.create
                const Icon = config.icon
                return (
                  <motion.div key={item.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: gIdx * 0.07 + i * 0.04 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', background: 'rgba(26,26,26,0.7)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: config.bg, border: `1px solid ${config.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={14} color={config.color} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>{item.action}</div>
                      <div style={{ fontSize: '12px', color: '#888', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.detail}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
                      <div style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '6px', background: config.bg, border: `1px solid ${config.border}`, color: config.color, fontWeight: '500' }}>
                        {config.label}
                      </div>
                      <div style={{ fontSize: '11px', color: '#555' }}>{item.time}</div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        ))
      )}
    </div>
  )
}
