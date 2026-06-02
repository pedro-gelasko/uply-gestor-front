import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function Modal({ title, onClose, children, width = '500px' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 14 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width, maxWidth: '100%',
          background: '#1A1A1A',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.65)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '15px', fontWeight: '600', color: '#fff', letterSpacing: '-0.01em' }}>{title}</span>
          <button onClick={onClose} style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666' }}>
            <X size={13} />
          </button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </motion.div>
    </motion.div>
  )
}

export const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '9px',
  padding: '10px 14px',
  color: '#fff',
  fontSize: '13px',
  outline: 'none',
  transition: 'border-color 0.15s ease',
  boxSizing: 'border-box',
}

export const labelStyle = {
  fontSize: '11px',
  color: '#888',
  fontWeight: '500',
  marginBottom: '6px',
  display: 'block',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

export const fieldStyle = { marginBottom: '16px' }

export function FormField({ label, children }) {
  return (
    <div style={fieldStyle}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  )
}

export function SubmitButton({ loading, children, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        width: '100%', padding: '11px', borderRadius: '10px', border: 'none',
        background: loading ? 'rgba(255,107,0,0.5)' : 'linear-gradient(135deg, #FF6B00, #FF8C42)',
        color: '#fff', fontSize: '13px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
        boxShadow: loading ? 'none' : '0 2px 12px rgba(255,107,0,0.3)',
        transition: 'all 0.2s ease',
      }}
    >
      {loading ? 'Salvando...' : children}
    </button>
  )
}

export function ErrorMsg({ msg }) {
  if (!msg) return null
  return <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '12px', marginBottom: '16px' }}>{msg}</div>
}
