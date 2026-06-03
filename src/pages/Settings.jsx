import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, Palette, Globe, Zap, Bell, Check, BarChart2, Pen, MessageCircle, Share, CheckCircle } from 'lucide-react'

const STORAGE_KEY = 'uply_settings'

const defaultSettings = {
  agency: {
    name:    'Uply',
    email:   'contato@uply.digital',
    website: 'https://www.uply.digital',
    cnpj:    '',
  },
  appearance: {
    theme:   'Escuro (Dark)',
    accent:  'Laranja #FF6B00',
    density: 'Confortável',
  },
  language: {
    lang:     'Português (Brasil)',
    timezone: 'America/São_Paulo (UTC-3)',
    dateFormat: 'DD/MM/AAAA',
  },
  notifications: { 0: true, 1: true, 2: false },
}

const load = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultSettings }
  catch { return defaultSettings }
}

const integrations = [
  { name: 'Meta Business',     description: 'Facebook e Instagram — em breve', status: 'Em breve', icon: Share,        color: '#1877F2' },
  { name: 'Google Analytics',  description: 'Métricas de performance — em breve', status: 'Em breve', icon: BarChart2, color: '#E37400' },
  { name: 'Canva',             description: 'Integração de artes — em breve', status: 'Em breve', icon: Pen,           color: '#7D2AE8' },
  { name: 'WhatsApp Business', description: 'Notificações automáticas — em breve', status: 'Em breve', icon: MessageCircle, color: '#25D366' },
]

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '8px',
  padding: '8px 12px',
  color: '#fff',
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s ease',
}

const selectStyle = {
  ...inputStyle,
  cursor: 'pointer',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
  paddingRight: '28px',
}

const labelStyle = { fontSize: '11px', color: '#555', marginBottom: '5px', fontWeight: '500', display: 'block' }

function Toggle({ on, onChange }) {
  return (
    <div onClick={() => onChange(!on)} style={{ width: '40px', height: '22px', borderRadius: '11px', background: on ? '#FF6B00' : 'rgba(255,255,255,0.1)', position: 'relative', cursor: 'pointer', transition: 'background 0.2s ease', flexShrink: 0, boxShadow: on ? '0 0 8px rgba(255,107,0,0.4)' : 'none' }}>
      <motion.div animate={{ x: on ? 20 : 2 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} style={{ position: 'absolute', top: '2px', width: '18px', height: '18px', borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
    </div>
  )
}

function SectionCard({ icon: Icon, color, title, children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: 'rgba(26,26,26,0.8)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.07)', padding: '20px', backdropFilter: 'blur(20px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${color}15`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={15} color={color} />
        </div>
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>{title}</span>
      </div>
      {children}
    </motion.div>
  )
}

export default function Settings() {
  const [settings, setSettings] = useState(load)
  const [saved,    setSaved]    = useState(false)

  const setAgency = (field) => (e) =>
    setSettings(s => ({ ...s, agency: { ...s.agency, [field]: e.target.value } }))

  const setAppearance = (field) => (e) =>
    setSettings(s => ({ ...s, appearance: { ...s.appearance, [field]: e.target.value } }))

  const setLanguage = (field) => (e) =>
    setSettings(s => ({ ...s, language: { ...s.language, [field]: e.target.value } }))

  const setNotif = (i, v) =>
    setSettings(s => ({ ...s, notifications: { ...s.notifications, [i]: v } }))

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const focus = (e) => { e.target.style.borderColor = 'rgba(255,107,0,0.5)' }
  const blur  = (e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)' }

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '32px' }}>
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#fff', letterSpacing: '-0.03em', marginBottom: '4px' }}>Configurações</h1>
        <p style={{ fontSize: '14px', color: '#666' }}>Personalize sua experiência na plataforma</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>

        {/* Agência */}
        <SectionCard icon={Building2} color="#FF6B00" title="Agência">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Nome da Agência</label>
              <input style={inputStyle} value={settings.agency.name} onChange={setAgency('name')} onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={labelStyle}>E-mail</label>
              <input style={inputStyle} type="email" value={settings.agency.email} onChange={setAgency('email')} onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={labelStyle}>Website</label>
              <input style={inputStyle} value={settings.agency.website} onChange={setAgency('website')} onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={labelStyle}>CNPJ</label>
              <input style={inputStyle} placeholder="00.000.000/0001-00" value={settings.agency.cnpj} onChange={setAgency('cnpj')} onFocus={focus} onBlur={blur} />
            </div>
          </div>
        </SectionCard>

        {/* Aparência */}
        <SectionCard icon={Palette} color="#3b82f6" title="Aparência">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Tema</label>
              <select style={selectStyle} value={settings.appearance.theme} onChange={setAppearance('theme')}>
                {['Escuro (Dark)', 'Claro (Light)', 'Sistema'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Cor de Destaque</label>
              <select style={selectStyle} value={settings.appearance.accent} onChange={setAppearance('accent')}>
                {['Laranja #FF6B00', 'Azul #3B82F6', 'Verde #22C55E'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Densidade</label>
              <select style={selectStyle} value={settings.appearance.density} onChange={setAppearance('density')}>
                {['Compacto', 'Confortável', 'Espaçado'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
        </SectionCard>

        {/* Idioma */}
        <SectionCard icon={Globe} color="#22c55e" title="Idioma e Região">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Idioma</label>
              <select style={selectStyle} value={settings.language.lang} onChange={setLanguage('lang')}>
                {['Português (Brasil)', 'English', 'Español'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Fuso Horário</label>
              <select style={selectStyle} value={settings.language.timezone} onChange={setLanguage('timezone')}>
                {['America/São_Paulo (UTC-3)', 'America/New_York (UTC-5)'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Formato de Data</label>
              <select style={selectStyle} value={settings.language.dateFormat} onChange={setLanguage('dateFormat')}>
                {['DD/MM/AAAA', 'MM/DD/AAAA', 'AAAA-MM-DD'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
        </SectionCard>

        {/* Notificações */}
        <SectionCard icon={Bell} color="#FF8C42" title="Notificações">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Eventos próximos',   description: 'Notificar 24h antes de publicações' },
              { label: 'Novos clientes',     description: 'Alertar ao adicionar cliente' },
              { label: 'Relatórios semanais',description: 'Resumo de atividades toda segunda-feira' },
            ].map((t, i) => (
              <div key={t.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '9px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: '#fff' }}>{t.label}</div>
                  <div style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>{t.description}</div>
                </div>
                <Toggle on={settings.notifications[i] ?? (i < 2)} onChange={(v) => setNotif(i, v)} />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Integrações */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{ background: 'rgba(26,26,26,0.8)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.07)', padding: '20px', backdropFilter: 'blur(20px)', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={15} color="#FF6B00" />
          </div>
          <div>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>Integrações</span>
            <span style={{ fontSize: '11px', color: '#555', marginLeft: '8px' }}>Em desenvolvimento</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {integrations.map((int) => (
            <div key={int.name} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', padding: '14px', opacity: 0.7 }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: `${int.color}18`, border: `1px solid ${int.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                <int.icon size={18} color={int.color} />
              </div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>{int.name}</div>
              <div style={{ fontSize: '11px', color: '#555', marginBottom: '10px' }}>{int.description}</div>
              <div style={{ display: 'inline-flex', fontSize: '10px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(255,107,0,0.08)', border: '1px solid rgba(255,107,0,0.15)', color: '#FF8C42', fontWeight: '500' }}>
                {int.status}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Salvar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px' }}>
        <AnimatePresence>
          {saved && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#22c55e', fontWeight: '500' }}>
              <CheckCircle size={14} />
              Configurações salvas!
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleSave}
          style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 24px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #FF6B00, #FF8C42)', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 12px rgba(255,107,0,0.3)' }}>
          <Check size={14} strokeWidth={2.5} />
          Salvar Configurações
        </motion.button>
      </div>
    </div>
  )
}
