import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw } from 'lucide-react'

export function LoadingSpinner({ size = 24 }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      style={{
        width: size, height: size, borderRadius: '50%',
        border: `2px solid rgba(255,107,0,0.2)`,
        borderTopColor: '#FF6B00',
      }}
    />
  )
}

export function PageLoading({ message = 'Carregando...' }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <LoadingSpinner size={36} />
      <span style={{ fontSize: '13px', color: '#555' }}>{message}</span>
    </div>
  )
}

export function PageError({ message, onRetry }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AlertCircle size={22} color="#ef4444" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>Erro ao carregar</div>
        <div style={{ fontSize: '12px', color: '#666' }}>{message}</div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,107,0,0.3)', background: 'rgba(255,107,0,0.1)', color: '#FF8C42', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
        >
          <RefreshCw size={13} />
          Tentar novamente
        </button>
      )}
    </div>
  )
}
