import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  Calendar,
  Share2,
  History,
  Settings,
  Zap,
  LogOut,
} from 'lucide-react'
import { logout } from '../services/authService'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'clientes', label: 'Clientes', icon: Users },
  { id: 'calendario', label: 'Calendário', icon: Calendar },
  { id: 'compartilhamentos', label: 'Compartilhamentos', icon: Share2 },
  { id: 'historico', label: 'Histórico', icon: History },
  { id: 'configuracoes', label: 'Configurações', icon: Settings },
]

export default function Sidebar({ activePage, onNavigate, user, onLogout }) {
  const initials = (name = '') => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const handleLogout = () => {
    logout()
    onLogout?.()
  }
  return (
    <aside
      style={{
        width: '220px',
        minWidth: '220px',
        height: '100%',
        background: 'rgba(15, 15, 15, 0.95)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 0',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '16px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <img
            src="/uply.png"
            alt="UPLY Gestor"
            style={{ width: '100%', maxHeight: '48px', objectFit: 'contain', objectPosition: 'left center', display: 'block' }}
            onError={(e) => { e.target.style.display = 'none' }}
          />
        </motion.div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {navItems.map((item, i) => {
          const Icon = item.icon
          const isActive = activePage === item.id
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
                fontSize: '13px',
                fontWeight: isActive ? '600' : '400',
                transition: 'all 0.15s ease',
                background: isActive ? 'rgba(255,107,0,0.12)' : 'transparent',
                color: isActive ? '#FF6B00' : '#B3B3B3',
              }}
              whileHover={{
                background: isActive ? 'rgba(255,107,0,0.15)' : 'rgba(255,255,255,0.05)',
                color: isActive ? '#FF6B00' : '#fff',
              }}
            >
              <Icon
                size={16}
                color={isActive ? '#FF6B00' : 'currentColor'}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  style={{
                    marginLeft: 'auto',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: '#FF6B00',
                  }}
                />
              )}
            </motion.button>
          )
        })}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF6B00, #FF8C42)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: '#fff', flexShrink: 0 }}>
            {initials(user?.name || 'U')}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: '500', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'Usuário'}</div>
            <div style={{ fontSize: '10px', color: '#666' }}>{user?.role === 'SUPERADMIN' ? 'Super Admin' : 'Administrador'}</div>
          </div>
          <button onClick={handleLogout} title="Sair"
            style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#555', flexShrink: 0 }}>
            <LogOut size={12} />
          </button>
        </div>
      </div>
    </aside>
  )
}
