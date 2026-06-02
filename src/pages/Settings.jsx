import { useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, Palette, Globe, Zap, Bell, Shield, ChevronRight, Check, BarChart2, Pen, MessageCircle, Share } from 'lucide-react'

const sections = [
  {
    id: 'agency',
    title: 'Agência',
    icon: Building2,
    color: '#FF6B00',
    fields: [
      { label: 'Nome da Agência', value: 'Saborr Marketing Digital', type: 'text' },
      { label: 'Email', value: 'contato@saborr.com.br', type: 'email' },
      { label: 'Website', value: 'https://saborr.com.br', type: 'url' },
      { label: 'CNPJ', value: '00.000.000/0001-00', type: 'text' },
    ],
  },
  {
    id: 'appearance',
    title: 'Aparência',
    icon: Palette,
    color: '#3b82f6',
    fields: [
      { label: 'Tema', value: 'Escuro (Dark)', type: 'select', options: ['Escuro (Dark)', 'Claro (Light)', 'Sistema'] },
      { label: 'Cor de Destaque', value: 'Laranja #FF6B00', type: 'select', options: ['Laranja #FF6B00', 'Azul #3B82F6', 'Verde #22C55E'] },
      { label: 'Densidade', value: 'Confortável', type: 'select', options: ['Compacto', 'Confortável', 'Espaçado'] },
    ],
  },
  {
    id: 'language',
    title: 'Idioma e Região',
    icon: Globe,
    color: '#22c55e',
    fields: [
      { label: 'Idioma', value: 'Português (Brasil)', type: 'select', options: ['Português (Brasil)', 'English', 'Español'] },
      { label: 'Fuso Horário', value: 'America/São_Paulo (UTC-3)', type: 'select', options: ['America/São_Paulo (UTC-3)', 'America/New_York (UTC-5)'] },
      { label: 'Formato de Data', value: 'DD/MM/AAAA', type: 'select', options: ['DD/MM/AAAA', 'MM/DD/AAAA', 'AAAA-MM-DD'] },
    ],
  },
  {
    id: 'notifications',
    title: 'Notificações',
    icon: Bell,
    color: '#FF8C42',
    toggles: [
      { label: 'Eventos próximos', description: 'Notificar 24h antes de publicações', defaultOn: true },
      { label: 'Novos clientes', description: 'Alertar ao adicionar cliente', defaultOn: true },
      { label: 'Relatórios semanais', description: 'Resumo de atividades toda segunda-feira', defaultOn: false },
    ],
  },
]

const integrations = [
  { name: 'Meta Business', description: 'Facebook e Instagram — em breve', status: 'Em breve', icon: Share, color: '#1877F2' },
  { name: 'Google Analytics', description: 'Métricas de performance — em breve', status: 'Em breve', icon: BarChart2, color: '#E37400' },
  { name: 'Canva', description: 'Integração de artes — em breve', status: 'Em breve', icon: Pen, color: '#7D2AE8' },
  { name: 'WhatsApp Business', description: 'Notificações automáticas — em breve', status: 'Em breve', icon: MessageCircle, color: '#25D366' },
]

function Toggle({ on, onChange }) {
  return (
    <div
      onClick={() => onChange(!on)}
      style={{
        width: '40px',
        height: '22px',
        borderRadius: '11px',
        background: on ? '#FF6B00' : 'rgba(255,255,255,0.1)',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 0.2s ease',
        flexShrink: 0,
        boxShadow: on ? '0 0 8px rgba(255,107,0,0.4)' : 'none',
      }}
    >
      <motion.div
        animate={{ x: on ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        style={{
          position: 'absolute',
          top: '2px',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }}
      />
    </div>
  )
}

export default function Settings() {
  const [toggleStates, setToggleStates] = useState({ 0: true, 1: true, 2: false })

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '32px' }}>
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#fff', letterSpacing: '-0.03em', marginBottom: '4px' }}>
          Configurações
        </h1>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Personalize sua experiência na plataforma
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        {sections.map((section, si) => {
          const Icon = section.icon
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: si * 0.07 }}
              style={{
                background: 'rgba(26,26,26,0.8)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.07)',
                padding: '20px',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <div
                  style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    background: `${section.color}15`, border: `1px solid ${section.color}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Icon size={15} color={section.color} />
                </div>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>{section.title}</span>
              </div>

              {section.fields && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {section.fields.map((field) => (
                    <div key={field.label}>
                      <div style={{ fontSize: '11px', color: '#555', marginBottom: '5px', fontWeight: '500' }}>
                        {field.label}
                      </div>
                      <input
                        type={field.type === 'select' ? 'text' : field.type}
                        defaultValue={field.value}
                        readOnly={field.type === 'select'}
                        style={{
                          width: '100%',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          color: '#fff',
                          fontSize: '13px',
                          outline: 'none',
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {section.toggles && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {section.toggles.map((toggle, ti) => (
                    <div
                      key={toggle.label}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 12px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '9px',
                        border: '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: '#fff' }}>{toggle.label}</div>
                        <div style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>{toggle.description}</div>
                      </div>
                      <Toggle
                        on={toggleStates[ti] ?? toggle.defaultOn}
                        onChange={(v) => setToggleStates(s => ({ ...s, [ti]: v }))}
                      />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Integrations */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          background: 'rgba(26,26,26,0.8)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.07)',
          padding: '20px',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <div
            style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Zap size={15} color="#FF6B00" />
          </div>
          <div>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>Integrações</span>
            <span style={{ fontSize: '11px', color: '#555', marginLeft: '8px' }}>Em desenvolvimento</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {integrations.map((int) => (
            <div
              key={int.name}
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.06)',
                padding: '14px',
                cursor: 'default',
                opacity: 0.7,
              }}
            >
              <div
                style={{
                  width: '36px', height: '36px', borderRadius: '9px',
                  background: `${int.color}18`, border: `1px solid ${int.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '10px',
                }}
              >
                <int.icon size={18} color={int.color} />
              </div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>{int.name}</div>
              <div style={{ fontSize: '11px', color: '#555', marginBottom: '10px' }}>{int.description}</div>
              <div
                style={{
                  display: 'inline-flex',
                  fontSize: '10px',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: 'rgba(255,107,0,0.08)',
                  border: '1px solid rgba(255,107,0,0.15)',
                  color: '#FF8C42',
                  fontWeight: '500',
                }}
              >
                {int.status}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Save button */}
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            padding: '10px 24px',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, #FF6B00, #FF8C42)',
            color: '#fff',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 2px 12px rgba(255,107,0,0.3)',
          }}
        >
          <Check size={14} strokeWidth={2.5} />
          Salvar Configurações
        </motion.button>
      </div>
    </div>
  )
}
