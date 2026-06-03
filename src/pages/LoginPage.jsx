import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Zap, ArrowRight, Lock } from 'lucide-react'
import { login } from '../services/authService'

const quotes = [
  { text: 'Não existe fracasso, existe aprendizado. O que define o campeão é a capacidade de se reinventar.', author: 'Pablo Marçal', role: 'Empresário e Coach' },
  { text: 'Se você não está disposto a arriscar o ordinário, nunca conseguirá o extraordinário.', author: 'Pablo Marçal', role: 'Empresário e Coach' },
  { text: 'Dinheiro não traz felicidade, mas resolve muitos problemas que a falta de dinheiro cria.', author: 'Flávio Augusto da Silva', role: 'Fundador do Wise Up' },
  { text: 'Empreender é transformar sonhos em realidade através de muito trabalho e persistência.', author: 'Flávio Augusto da Silva', role: 'Fundador do Wise Up' },
  { text: 'Sonho sem plano é só desejo. Plano sem ação é só papel.', author: 'Joel Jota', role: 'Empresário e Palestrante' },
  { text: 'Alta performance não é um destino, é um estilo de vida que se constrói todos os dias.', author: 'Joel Jota', role: 'Empresário e Palestrante' },
  { text: 'Inovação é o que distingue um líder de um seguidor.', author: 'Steve Jobs', role: 'Co-fundador da Apple' },
  { text: 'Sua única limitação é você mesmo. O único lugar onde sucesso vem antes do trabalho é no dicionário.', author: 'Vidal Sassoon', role: 'Empresário' },
  { text: 'O sucesso é a soma de pequenos esforços repetidos dia após dia.', author: 'Robert Collier', role: 'Autor Empresarial' },
  { text: 'Se você dobrar o número de experimentos que faz por ano, vai dobrar sua inventividade.', author: 'Jeff Bezos', role: 'Fundador da Amazon' },
]

function QuotePanel() {
  const [idx,     setIdx]     = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx(i => (i + 1) % quotes.length)
        setVisible(true)
      }, 600)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const q = quotes[idx]

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      padding: '48px', background: 'linear-gradient(135deg, #0A0A0A 0%, #1A0A00 50%, #0F0F0F 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,0,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,0,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Grid overlay */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,107,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,0,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

      {/* Logo */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/uply.png" alt="Uply" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
        </div>
        <div style={{ marginTop: '12px', fontSize: '13px', color: '#666' }}>Gestão de Calendário de Marketing</div>
      </div>

      {/* Quote */}
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <div style={{ fontSize: '13px', color: '#FF6B00', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px' }}>
              ✦ Inspiração do dia
            </div>
            <div style={{ fontSize: '22px', fontWeight: '300', color: '#fff', lineHeight: '1.6', letterSpacing: '-0.01em', marginBottom: '28px', fontStyle: 'italic' }}>
              "{q.text}"
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#FF8C42' }}>{q.author}</div>
              <div style={{ fontSize: '12px', color: '#555', marginTop: '3px' }}>{q.role}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dots indicator */}
      <div style={{ display: 'flex', gap: '6px', position: 'relative', zIndex: 1 }}>
        {quotes.map((_, i) => (
          <div key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? '20px' : '6px', height: '6px', borderRadius: '3px', background: i === idx ? '#FF6B00' : 'rgba(255,255,255,0.15)', cursor: 'pointer', transition: 'all 0.3s ease' }} />
        ))}
      </div>
    </div>
  )
}

export default function LoginPage({ onLogin }) {
  const [form,    setForm]    = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  const [showPwd, setShowPwd] = useState(false)

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

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
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px', color: '#fff', fontSize: '14px',
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  }

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', background: '#0F0F0F', overflow: 'hidden' }}>
      {/* Left — quotes */}
      <QuotePanel />

      {/* Right — form */}
      <div style={{ width: '480px', minWidth: '480px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px', background: '#111', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ width: '100%', maxWidth: '360px' }}
        >
          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg,#FF6B00,#FF8C42)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(255,107,0,0.3)' }}>
                <Lock size={15} color="#fff" />
              </div>
              <span style={{ fontSize: '13px', color: '#555' }}>Área restrita</span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#fff', letterSpacing: '-0.03em', marginBottom: '8px', lineHeight: 1.2 }}>
              Acesse o painel
            </h1>
            <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.5 }}>
              Entre com suas credenciais para continuar
            </p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ padding: '12px 14px', borderRadius: '9px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', fontSize: '13px', marginBottom: '20px' }}>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#888', fontWeight: '500', display: 'block', marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>E-mail</label>
              <input
                type="email" autoComplete="email"
                value={form.email} onChange={set('email')}
                placeholder="seu@email.com"
                style={inputStyle} disabled={loading}
                onFocus={e => e.target.style.borderColor = 'rgba(255,107,0,0.5)'}
                onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#888', fontWeight: '500', display: 'block', marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Senha</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd ? 'text' : 'password'} autoComplete="current-password"
                  value={form.password} onChange={set('password')}
                  placeholder="••••••••"
                  style={{ ...inputStyle, paddingRight: '44px' }} disabled={loading}
                  onFocus={e => e.target.style.borderColor = 'rgba(255,107,0,0.5)'}
                  onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#555', padding: '2px' }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                borderRadius: '10px', border: 'none',
                background: loading ? 'rgba(255,107,0,0.5)' : 'linear-gradient(135deg, #FF6B00, #FF8C42)',
                color: '#fff', fontSize: '14px', fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(255,107,0,0.35)',
                marginTop: '8px', transition: 'all 0.2s ease',
              }}
            >
              {loading ? 'Entrando...' : (
                <>Entrar <ArrowRight size={16} /></>
              )}
            </motion.button>
          </form>

          <div style={{ marginTop: '32px', padding: '14px', borderRadius: '10px', background: 'rgba(255,107,0,0.06)', border: '1px solid rgba(255,107,0,0.12)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <Zap size={14} color="#FF6B00" style={{ flexShrink: 0, marginTop: '1px' }} />
            <div style={{ fontSize: '11px', color: '#666', lineHeight: 1.5 }}>
              Acesso exclusivo para equipe <span style={{ color: '#FF8C42', fontWeight: '600' }}>UPLY</span>. Entre em contato com o administrador para solicitar acesso.
            </div>
          </div>
        </motion.div>

        <div style={{ marginTop: 'auto', paddingTop: '32px', fontSize: '11px', color: '#333', textAlign: 'center' }}>
          © 2026 UPLY · Todos os direitos reservados
        </div>
      </div>
    </div>
  )
}
