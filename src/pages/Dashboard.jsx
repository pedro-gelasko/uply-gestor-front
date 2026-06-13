import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity, TrendingUp, Calendar, Users } from 'lucide-react'
import ClientCard from '../components/ClientCard'
import { useClients } from '../hooks/useClients'
import { PageLoading, PageError } from '../components/LoadingState'
import api from '../services/api'

let _statsCache = null
let _statsCacheTime = 0

export default function Dashboard({ onClientClick }) {
  const { clients, loading, error, refetch } = useClients()
  const [dashStats, setDashStats] = useState(_statsCache || { publishRate: null, actions: null })

  useEffect(() => {
    if (_statsCache && (Date.now() - _statsCacheTime) < 60_000) return
    api.get('/stats')
      .then(r => { _statsCache = r.data.data; _statsCacheTime = Date.now(); setDashStats(r.data.data) })
      .catch(() => {})
  }, [])

  if (loading) return <PageLoading message="Carregando clientes..." />
  if (error)   return <PageError message={error} onRetry={refetch} />

  const totalEvents = clients.reduce((a, c) => a + c.actionsCount, 0)

  const publishRateLabel = dashStats.publishRate !== null ? `${dashStats.publishRate}%` : '—'
  const actionsLabel     = dashStats.actions     !== null ? String(dashStats.actions)   : '—'

  const stats = [
    { label: 'Total de Clientes',   value: String(clients.length),  icon: Users,      change: 'clientes ativos',         color: '#FF6B00' },
    { label: 'Eventos Programados', value: String(totalEvents),     icon: Calendar,   change: 'em todos os calendários',  color: '#FF8C42' },
    { label: 'Taxa de Publicação',  value: publishRateLabel,        icon: TrendingUp, change: 'eventos publicados',       color: '#22c55e' },
    { label: 'Ações Realizadas',    value: actionsLabel,            icon: Activity,   change: 'Últimos 30 dias',          color: '#3b82f6' },
  ]

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '32px' }}>
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#fff', letterSpacing: '-0.03em', marginBottom: '4px' }}>
          Dashboard
        </h1>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Gestão de Calendário de Marketing para Provedores de Internet
        </p>
      </motion.div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{ background: 'rgba(26,26,26,0.8)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.07)', padding: '18px 20px' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: `${stat.color}15`, border: `1px solid ${stat.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} color={stat.color} />
                </div>
              </div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: '12px', color: '#B3B3B3', marginTop: '4px' }}>{stat.label}</div>
              <div style={{ fontSize: '11px', color: (stat.color === '#22c55e' && stat.value !== '—') ? '#22c55e' : '#555', marginTop: '6px' }}>{stat.change}</div>
            </motion.div>
          )
        })}
      </div>

      {/* Clients grid */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#fff', letterSpacing: '-0.01em' }}>Clientes Ativos</h2>
          <p style={{ fontSize: '12px', color: '#555', marginTop: '2px' }}>Clique em um cliente para abrir o calendário de marketing</p>
        </div>
        <div style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '6px', background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.2)', color: '#FF8C42', fontWeight: '500' }}>
          {clients.length} clientes
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {clients.map((client, i) => (
          <ClientCard key={client.id} client={client} index={i} onClick={() => onClientClick(client)} />
        ))}
      </div>
    </div>
  )
}
