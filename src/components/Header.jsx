import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, UserPlus, Bell, X } from 'lucide-react'

export default function Header({ onNewEvent, onNewClient, currentClientName }) {
  const [searchValue, setSearchValue] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header
      style={{
        height: '60px',
        background: 'rgba(15,15,15,0.92)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: '16px',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        position: 'relative',
        zIndex: 100,
      }}
    >
      {/* Page context */}
      {currentClientName && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '8px' }}>
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#FF6B00',
            }}
          />
          <span style={{ fontSize: '13px', fontWeight: '500', color: '#B3B3B3' }}>
            {currentClientName}
          </span>
        </div>
      )}

      {/* Search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          flex: 1,
          maxWidth: '360px',
          position: 'relative',
        }}
      >
        <Search
          size={14}
          color="#555"
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
        />
        <input
          type="text"
          placeholder="Buscar eventos, clientes..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            padding: '8px 12px 8px 34px',
            color: '#fff',
            fontSize: '13px',
            outline: 'none',
            transition: 'border-color 0.2s ease',
          }}
          onFocus={(e) => { e.target.style.borderColor = 'rgba(255,107,0,0.4)'; e.target.style.background = 'rgba(255,255,255,0.07)' }}
          onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.05)' }}
        />
        {searchValue && (
          <button
            onClick={() => setSearchValue('')}
            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#555', padding: '2px' }}
          >
            <X size={12} />
          </button>
        )}
      </motion.div>

      <div style={{ flex: 1 }} />

      {/* Notification bell */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowNotifications(!showNotifications)}
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '9px',
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
          color: '#B3B3B3',
        }}
      >
        <Bell size={15} />
        <div
          style={{
            position: 'absolute',
            top: '7px',
            right: '7px',
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: '#FF6B00',
            border: '2px solid #0F0F0F',
          }}
        />
      </motion.button>

      {/* Novo Evento */}
      <motion.button
        whileHover={{ scale: 1.02, background: 'rgba(255,107,0,0.2)' }}
        whileTap={{ scale: 0.97 }}
        onClick={onNewEvent}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          padding: '8px 14px',
          borderRadius: '9px',
          border: '1px solid rgba(255,107,0,0.3)',
          background: 'rgba(255,107,0,0.12)',
          color: '#FF8C42',
          fontSize: '13px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
      >
        <Plus size={14} strokeWidth={2.5} />
        Novo Evento
      </motion.button>

      {/* Novo Cliente */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={onNewClient}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          padding: '8px 14px',
          borderRadius: '9px',
          border: 'none',
          background: 'linear-gradient(135deg, #FF6B00, #FF8C42)',
          color: '#fff',
          fontSize: '13px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 2px 12px rgba(255,107,0,0.3)',
          transition: 'all 0.15s ease',
        }}
      >
        <UserPlus size={14} strokeWidth={2.5} />
        Novo Cliente
      </motion.button>
    </header>
  )
}
