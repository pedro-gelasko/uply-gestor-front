import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Modal from './Modal'
import { AlertTriangle } from 'lucide-react'

export default function ConfirmModal({ title, message, onConfirm, onClose, danger = true }) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try { await onConfirm() } finally { setLoading(false) }
  }

  return (
    <AnimatePresence>
      <Modal title={title} onClose={onClose} width="420px">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px', paddingBottom: '8px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={22} color="#ef4444" />
          </div>
          <p style={{ fontSize: '13px', color: '#B3B3B3', lineHeight: '1.6', margin: 0 }}>{message}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: '9px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#B3B3B3', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
            Cancelar
          </button>
          <button onClick={handleConfirm} disabled={loading}
            style={{ flex: 1, padding: '10px', borderRadius: '9px', border: 'none', background: danger ? '#ef4444' : 'linear-gradient(135deg,#FF6B00,#FF8C42)', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Aguarde...' : 'Confirmar'}
          </button>
        </div>
      </Modal>
    </AnimatePresence>
  )
}
