import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import ClientCalendar from './pages/ClientCalendar'
import GlobalCalendar from './pages/GlobalCalendar'
import Shares from './pages/Shares'
import History from './pages/History'
import Settings from './pages/Settings'
import NewClientModal from './components/NewClientModal'

const pageTransition = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -6 },
  transition: { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] },
}

export default function App() {
  const [activePage,       setActivePage]       = useState('dashboard')
  const [selectedClient,   setSelectedClient]   = useState(null)
  const [showNewClient,    setShowNewClient]     = useState(false)
  const [clientsRefreshKey, setClientsRefreshKey] = useState(0)

  const refreshClients = useCallback(() => setClientsRefreshKey((k) => k + 1), [])

  const handleClientClick = (client) => {
    setSelectedClient(client)
    setActivePage('calendario')
  }

  const handleNavigate = (page) => {
    if (page !== 'calendario') setSelectedClient(null)
    setActivePage(page)
  }

  const renderPage = () => {
    if (activePage === 'calendario' && selectedClient) {
      return (
        <motion.div key="client-calendar" {...pageTransition} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <ClientCalendar
            client={selectedClient}
            onBack={() => { setSelectedClient(null); setActivePage('calendario') }}
            onClientUpdated={refreshClients}
          />
        </motion.div>
      )
    }
    if (activePage === 'calendario' && !selectedClient) {
      return (
        <motion.div key="global-calendar" {...pageTransition} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <GlobalCalendar onClientClick={handleClientClick} />
        </motion.div>
      )
    }
    switch (activePage) {
      case 'dashboard':
        return (
          <motion.div key={`dashboard-${clientsRefreshKey}`} {...pageTransition} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Dashboard onClientClick={handleClientClick} refreshKey={clientsRefreshKey} />
          </motion.div>
        )
      case 'clientes':
        return (
          <motion.div key={`clientes-${clientsRefreshKey}`} {...pageTransition} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Clients onClientClick={handleClientClick} refreshKey={clientsRefreshKey} onRefresh={refreshClients} />
          </motion.div>
        )
      case 'compartilhamentos':
        return (
          <motion.div key="shares" {...pageTransition} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Shares />
          </motion.div>
        )
      case 'historico':
        return (
          <motion.div key="history" {...pageTransition} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <History />
          </motion.div>
        )
      case 'configuracoes':
        return (
          <motion.div key="settings" {...pageTransition} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Settings />
          </motion.div>
        )
      default: return null
    }
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', background: '#0F0F0F', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(255,107,0,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,0,0.015) 1px, transparent 1px)`, backgroundSize: '48px 48px', pointerEvents: 'none' }} />

      <Sidebar activePage={activePage} onNavigate={handleNavigate} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        <Header
          onNewEvent={() => {}}
          onNewClient={() => setShowNewClient(true)}
          currentClientName={selectedClient?.name}
        />
        <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <AnimatePresence mode="wait">{renderPage()}</AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {showNewClient && (
          <NewClientModal
            onClose={() => setShowNewClient(false)}
            onSuccess={refreshClients}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
