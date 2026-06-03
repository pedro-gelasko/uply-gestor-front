import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, Lock, Zap } from 'lucide-react'
import { login } from '../services/authService'

const quotes = [
  { text: 'Não existe fracasso, existe aprendizado. O que define o campeão é a capacidade de se reinventar.', author: 'Pablo Marçal', role: 'Empresário e Coach' },
  { text: 'Se você não está disposto a arriscar o ordinário, nunca conseguirá o extraordinário.', author: 'Pablo Marçal', role: 'Empresário e Coach' },
  { text: 'Dinheiro não traz felicidade, mas resolve muitos problemas que a falta de dinheiro cria.', author: 'Flávio Augusto da Silva', role: 'Fundador do Wise Up' },
  { text: 'Empreender é transformar sonhos em realidade através de muito trabalho e persistência.', author: 'Flávio Augusto da Silva', role: 'Fundador do Wise Up' },
  { text: 'Sonho sem plano é só desejo. Plano sem ação é só papel.', author: 'Joel Jota', role: 'Empresário e Palestrante' },
  { text: 'Alta performance não é um destino, é um estilo de vida que se constrói todos os dias.', author: 'Joel Jota', role: 'Empresário e Palestrante' },
  { text: 'Inovação é o que distingue um líder de um seguidor.', author: 'Steve Jobs', role: 'Co-fundador da Apple' },
  { text: 'O sucesso é a soma de pequenos esforços repetidos dia após dia.', author: 'Robert Collier', role: 'Autor Empresarial' },
  { text: 'Se você dobrar o número de experimentos que faz por ano, vai dobrar sua inventividade.', author: 'Jeff Bezos', role: 'Fundador da Amazon' },
  { text: 'Trabalhe enquanto eles dormem. Aprenda enquanto eles se divertem. Economize enquanto eles gastam.', author: 'Grant Cardone', role: 'Empresário e Autor' },
]

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return mobile
}

function QuoteSlider({ compact }) {
  const [idx,     setIdx]     = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false)
      setTimeout(() => { setIdx(i => (i + 1) % quotes.length); setVisible(true) }, 500)
    }, 6000)
    return () => clearInterval(id)
  }, [])

  const q = quotes[idx]

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0A0A0A 0%, #1A0A00 60%, #0F0F0F 100%)',
      position: 'relative', overflow: 'hidden',
      ...(compact
        ? { padding: '28px 24px', borderRadius: '0' }
        : { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px' }),
    }}>
      {/* Glow */}
      <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,0,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,107,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,0,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

      {/* Logo — apenas no desktop */}
      {!compact && (
        <div style={{ position: 'relative', zIndex: 1 }}>
          <img src="/uply.png" alt="Uply" style={{ height: '38px', objectFit: 'contain' }} />
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#555' }}>Gestão de Calendário de Marketing</div>
        </div>
      )}

      {/* Quote */}
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div key={idx}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            style={{ position: 'relative', zIndex: 1, ...(compact ? {} : {}) }}
          >
            {!compact && (
              <div style={{ fontSize: '12px', color: '#FF6B00', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
                ✦ Inspiração do dia
              </div>
            )}
            <div style={{ fontSize: compact ? '14px' : '21px', fontWeight: '300', color: '#fff', lineHeight: '1.65', fontStyle: 'italic', marginBottom: compact ? '12px' : '24px' }}>
              "{q.text}"
            </div>
            <div>
              <div style={{ fontSize: compact ? '13px' : '14px', fontWeight: '700', color: '#FF8C42' }}>{q.author}</div>
              <div style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>{q.role}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dots */}
      {!compact && (
        <div style={{ display: 'flex', gap: '6px', position: 'relative', zIndex: 1 }}>
          {quotes.map((_, i) => (
            <div key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? '18px' : '6px', height: '6px', borderRadius: '3px', background: i === idx ? '#FF6B00' : 'rgba(255,255,255,0.15)', cursor: 'pointer', transition: 'all 0.3s ease' }} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function LoginPage({ onLogin }) {
  const isMobile = useIsMobile()
  const [form,    setForm]    = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  const [showPwd, setShowPwd] = useState(false)

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }))

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!form.email || !form.password) return setError('Preencha e-mail e senha.')
    setLoading(true); setError(null)
    try {
      const result = await login(form.email, form.password)
      onLogin(result.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '13px 16px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px', color: '#fff', fontSize: '14px',
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  }

  const FormPanel = (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: '#111',
      ...(isMobile
        ? { padding: '32px 24px 40px', flex: 1 }
        : { width: '460px', minWidth: '460px', padding: '48px', borderLeft: '1px solid rgba(255,255,255,0.06)' }),
    }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: '360px' }}>

        {/* Mobile logo */}
        {isMobile && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
            <img src="/uply.png" alt="Uply" style={{ height: '36px', objectFit: 'contain' }} />
          </div>
        )}

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '7px', background: 'linear-gradient(135deg,#FF6B00,#FF8C42)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(255,107,0,0.3)' }}>
              <Lock size={13} color="#fff" />
            </div>
            <span style={{ fontSize: '12px', color: '#555' }}>Área restrita</span>
          </div>
          <h1 style={{ fontSize: isMobile ? '24px' : '26px', fontWeight: '700', color: '#fff', letterSpacing: '-0.03em', marginBottom: '6px', lineHeight: 1.2 }}>
            Acesse o painel
          </h1>
          <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.5 }}>
            Entre com suas credenciais para continuar
          </p>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ padding: '11px 14px', borderRadius: '9px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', fontSize: '13px', marginBottom: '18px' }}>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '11px', color: '#888', fontWeight: '600', display: 'block', marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>E-mail</label>
            <input type="email" autoComplete="email" placeholder="seu@email.com"
              value={form.email} onChange={set('email')} style={inputStyle} disabled={loading}
              onFocus={e => e.target.style.borderColor = 'rgba(255,107,0,0.5)'}
              onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', color: '#888', fontWeight: '600', display: 'block', marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Senha</label>
            <div style={{ position: 'relative' }}>
              <input type={showPwd ? 'text' : 'password'} autoComplete="current-password" placeholder="••••••••"
                value={form.password} onChange={set('password')} style={{ ...inputStyle, paddingRight: '44px' }} disabled={loading}
                onFocus={e => e.target.style.borderColor = 'rgba(255,107,0,0.5)'}
                onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#555', padding: '4px' }}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <motion.button type="submit"
            whileHover={{ scale: loading ? 1 : 1.01 }} whileTap={{ scale: loading ? 1 : 0.98 }}
            disabled={loading}
            style={{
              width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
              background: loading ? 'rgba(255,107,0,0.5)' : 'linear-gradient(135deg, #FF6B00, #FF8C42)',
              color: '#fff', fontSize: '14px', fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(255,107,0,0.3)',
              marginTop: '4px', transition: 'all 0.2s ease',
            }}
          >
            {loading ? 'Entrando...' : <><span>Entrar</span><ArrowRight size={16} /></>}
          </motion.button>
        </form>

        <div style={{ marginTop: '24px', padding: '12px 14px', borderRadius: '10px', background: 'rgba(255,107,0,0.06)', border: '1px solid rgba(255,107,0,0.12)', display: 'flex', alignItems: 'flex-start', gap: '9px' }}>
          <Zap size={13} color="#FF6B00" style={{ flexShrink: 0, marginTop: '1px' }} />
          <div style={{ fontSize: '11px', color: '#666', lineHeight: 1.5 }}>
            Acesso exclusivo para equipe <span style={{ color: '#FF8C42', fontWeight: '600' }}>UPLY</span>. Entre em contato com o administrador para solicitar acesso.
          </div>
        </div>

        <div style={{ marginTop: '24px', fontSize: '11px', color: '#333', textAlign: 'center' }}>
          © 2026 UPLY · Todos os direitos reservados
        </div>
      </motion.div>
    </div>
  )

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: isMobile ? 'column' : 'row', background: '#0F0F0F', overflow: isMobile ? 'auto' : 'hidden' }}>
      <QuoteSlider compact={isMobile} />
      {FormPanel}
    </div>
  )
}
