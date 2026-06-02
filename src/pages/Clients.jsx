import { motion } from 'framer-motion'
import { UserPlus, Mail, MapPin } from 'lucide-react'
import { useClients } from '../hooks/useClients'
import { PageLoading, PageError } from '../components/LoadingState'
import { STATUS_LABELS } from '../data/mappers'

export default function Clients({ onClientClick }) {
  const { clients, loading, error, refetch } = useClients()

  if (loading) return <PageLoading message="Carregando clientes..." />
  if (error)   return <PageError message={error} onRetry={refetch} />

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '32px' }}>
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#fff', letterSpacing: '-0.03em', marginBottom: '4px' }}>Clientes</h1>
            <p style={{ fontSize: '14px', color: '#666' }}>{clients.length} clientes ativos na plataforma</p>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 18px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #FF6B00, #FF8C42)', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 12px rgba(255,107,0,0.3)' }}>
            <UserPlus size={14} strokeWidth={2.5} />
            Novo Cliente
          </motion.button>
        </div>
      </motion.div>

      <div style={{ background: 'rgba(26,26,26,0.8)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 0.8fr 0.8fr', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)' }}>
          {['Cliente', 'Contato', 'E-mail', 'Eventos', 'Status'].map((h) => (
            <div key={h} style={{ fontSize: '11px', color: '#555', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</div>
          ))}
        </div>

        {clients.map((client, i) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onClientClick(client)}
            style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 0.8fr 0.8fr', padding: '16px 20px', borderBottom: i < clients.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', cursor: 'pointer', alignItems: 'center' }}
            whileHover={{ background: 'rgba(255,107,0,0.04)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: `linear-gradient(135deg, ${client.color}, ${client.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: '#fff', boxShadow: `0 3px 10px ${client.color}30`, flexShrink: 0 }}>
                {client.initials}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>{client.name}</div>
                <div style={{ fontSize: '11px', color: '#555', marginTop: '1px' }}>{client.segment}</div>
              </div>
            </div>

            <div style={{ fontSize: '12px', color: '#B3B3B3', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Mail size={11} color="#555" />
              {client.contactName}
            </div>

            <div style={{ fontSize: '11px', color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {client.contactEmail}
            </div>

            <div>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#FF8C42', background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.2)', borderRadius: '7px', padding: '3px 10px', display: 'inline-block' }}>
                {client.actionsCount}
              </span>
            </div>

            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '100px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', fontSize: '11px', color: '#22c55e', fontWeight: '500' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e' }} />
                {client.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
