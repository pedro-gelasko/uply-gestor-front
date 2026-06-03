import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, Zap } from 'lucide-react'
import { login } from '../services/authService'

const quotes = [
  { text: 'Não existe fracasso, existe aprendizado. O que define o campeão é a capacidade de se reinventar.', author: 'Pablo Marçal', role: 'Empresário e Coach' },
  { text: 'Se você não está disposto a arriscar o ordinário, nunca conseguirá o extraordinário.', author: 'Pablo Marçal', role: 'Empresário e Coach' },
  { text: 'Dinheiro não traz felicidade, mas resolve muitos problemas que a falta de dinheiro cria.', author: 'Flávio Augusto da Silva', role: 'Fundador do Wise Up' },
  { text: 'Sonho sem plano é só desejo. Plano sem ação é só papel.', author: 'Joel Jota', role: 'Empresário e Palestrante' },
  { text: 'Alta performance não é um destino, é um estilo de vida que se constrói todos os dias.', author: 'Joel Jota', role: 'Empresário e Palestrante' },
  { text: 'Inovação é o que distingue um líder de um seguidor.', author: 'Steve Jobs', role: 'Co-fundador da Apple' },
  { text: 'O sucesso é a soma de pequenos esforços repetidos dia após dia.', author: 'Robert Collier', role: 'Autor Empresarial' },
  { text: 'Se você dobrar o número de experimentos que faz por ano, vai dobrar sua inventividade.', author: 'Jeff Bezos', role: 'Fundador da Amazon' },
  { text: 'Trabalhe enquanto eles dormem. Aprenda enquanto eles se divertem.', author: 'Grant Cardone', role: 'Empresário e Autor' },
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

function useQuoteRotation() {
  const [idx,     setIdx]     = useState(0)
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false)
      setTimeout(() => { setIdx(i => (i + 1) % quotes.length); setVisible(true) }, 400)
    }, 5500)
    return () => clearInterval(id)
  }, [])
  return { quote: quotes[idx], idx, visible, setIdx }
}

/* ── Desktop side panel ── */
function DesktopQuotePanel() {
  const { quote, idx, visible, setIdx } = useQuoteRotation()

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '52px', background: 'linear-gradient(145deg, #0A0A0A 0%, #1C0800 55%, #0F0F0F 100%)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-120px', left: '-120px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,0,0.14) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-60px', right: '-60px', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,0,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,107,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,0,0.025) 1px, transparent 1px)', backgroundSize: '44px 44px', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <img src="/uply.png" alt="Uply" style={{ height: '40px', objectFit: 'contain' }} />
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#555', letterSpacing: '0.02em' }}>Gestão de Calendário de Marketing</div>
      </div>

      <AnimatePresence mode="wait">
        {visible && (
          <motion.div key={idx} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.45, ease: 'easeOut' }} style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '11px', color: '#FF6B00', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '18px', height: '1px', background: '#FF6B00' }} />
              Inspiração do dia
            </div>
            <div style={{ fontSize: '22px', fontWeight: '300', color: '#F0F0F0', lineHeight: '1.65', fontStyle: 'italic', marginBottom: '28px', letterSpacing: '-0.01em' }}>
              "{quote.text}"
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#FF6B00,#FF8C42)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: '#fff', flexShrink: 0 }}>
                {quote.author.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#FF8C42' }}>{quote.author}</div>
                <div style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>{quote.role}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', gap: '6px', position: 'relative', zIndex: 1 }}>
        {quotes.map((_, i) => (
          <div key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? '22px' : '6px', height: '5px', borderRadius: '3px', background: i === idx ? '#FF6B00' : 'rgba(255,255,255,0.12)', cursor: 'pointer', transition: 'all 0.35s ease' }} />
        ))}
      </div>
    </div>
  )
}

/* ── Mobile full screen ── */
function MobileLayout({ children }) {
  const { quote, idx, visible } = useQuoteRotation()

  return (
    <div style={{ width: '100vw', minHeight: '100vh', background: '#0A0A0A', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Background */}
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '340px', height: '340px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,0,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '80px', left: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,0,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,107,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,0,0.025) 1px, transparent 1px)', backgroundSize: '36px 36px', pointerEvents: 'none' }} />

      {/* Top — Logo + Quote */}
      <div style={{ padding: '52px 28px 32px', position: 'relative', zIndex: 1, flex: '0 0 auto' }}>
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <img src="/uply.png" alt="Uply" style={{ height: '34px', objectFit: 'contain' }} />
        </motion.div>

        {/* Quote */}
        <div style={{ marginTop: '32px', minHeight: '130px' }}>
          <AnimatePresence mode="wait">
            {visible && (
              <motion.div key={idx} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.35 }}>
                <div style={{ fontSize: '15px', fontWeight: '300', color: 'rgba(255,255,255,0.85)', lineHeight: '1.7', fontStyle: 'italic', marginBottom: '16px' }}>
                  "{quote.text}"
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#FF6B00,#FF8C42)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', color: '#fff', flexShrink: 0 }}>
                    {quote.author.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#FF8C42' }}>{quote.author}</div>
                    <div style={{ fontSize: '11px', color: '#555' }}>{quote.role}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom — Form card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: 'spring', damping: 28, stiffness: 200 }}
        style={{
          flex: 1,
          background: 'rgba(17,17,17,0.97)',
          backdropFilter: 'blur(20px)',
          borderRadius: '28px 28px 0 0',
          border: '1px solid rgba(255,255,255,0.07)',
          borderBottom: 'none',
          padding: '32px 24px 40px',
          position: 'relative', zIndex: 1,
          boxShadow: '0 -20px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Handle */}
        <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.12)', margin: '0 auto 28px' }} />
        {children}
      </motion.div>
    </div>
  )
}

/* ── Main ── */
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
    width: '100%',
    padding: isMobile ? '15px 16px' : '13px 16px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px', color: '#fff',
    fontSize: isMobile ? '16px' : '14px',
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  }

  const form_ui = (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {!isMobile && (
        <div style={{ marginBottom: '8px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#fff', letterSpacing: '-0.03em', marginBottom: '6px' }}>Acesse o painel</h1>
          <p style={{ fontSize: '13px', color: '#666' }}>Entre com suas credenciais para continuar</p>
        </div>
      )}

      {isMobile && (
        <div style={{ marginBottom: '8px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', letterSpacing: '-0.02em', marginBottom: '4px' }}>Entrar na conta</h2>
          <p style={{ fontSize: '13px', color: '#666' }}>Acesso exclusivo para equipe UPLY</p>
        </div>
      )}

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ padding: '11px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '13px' }}>
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <label style={{ fontSize: '11px', color: '#666', fontWeight: '600', display: 'block', marginBottom: '8px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>E-mail</label>
        <input type="email" autoComplete="email" placeholder="seu@email.com"
          value={form.email} onChange={set('email')} style={inputStyle} disabled={loading}
          onFocus={e => e.target.style.borderColor = 'rgba(255,107,0,0.6)'}
          onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
        />
      </div>

      <div>
        <label style={{ fontSize: '11px', color: '#666', fontWeight: '600', display: 'block', marginBottom: '8px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Senha</label>
        <div style={{ position: 'relative' }}>
          <input type={showPwd ? 'text' : 'password'} autoComplete="current-password" placeholder="••••••••"
            value={form.password} onChange={set('password')} style={{ ...inputStyle, paddingRight: '48px' }} disabled={loading}
            onFocus={e => e.target.style.borderColor = 'rgba(255,107,0,0.6)'}
            onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
          <button type="button" onClick={() => setShowPwd(!showPwd)}
            style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#555', padding: '4px', display: 'flex' }}>
            {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <motion.button type="submit"
        whileHover={{ scale: loading ? 1 : 1.01 }}
        whileTap={{ scale: loading ? 1 : 0.97 }}
        disabled={loading}
        style={{
          width: '100%',
          padding: isMobile ? '16px' : '14px',
          borderRadius: '12px', border: 'none',
          background: loading ? 'rgba(255,107,0,0.45)' : 'linear-gradient(135deg, #FF6B00, #FF8C42)',
          color: '#fff',
          fontSize: isMobile ? '16px' : '14px',
          fontWeight: '700',
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          boxShadow: loading ? 'none' : '0 6px 24px rgba(255,107,0,0.35)',
          marginTop: '4px', transition: 'all 0.2s ease',
          letterSpacing: '0.01em',
        }}
      >
        {loading ? 'Entrando...' : <><span>Entrar</span><ArrowRight size={18} strokeWidth={2.5} /></>}
      </motion.button>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', padding: '12px 14px', borderRadius: '10px', background: 'rgba(255,107,0,0.06)', border: '1px solid rgba(255,107,0,0.12)', marginTop: '4px' }}>
        <Zap size={13} color="#FF6B00" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.55' }}>
          Acesso exclusivo para equipe <span style={{ color: '#FF8C42', fontWeight: '700' }}>UPLY</span>.
          Solicite acesso ao administrador.
        </div>
      </div>

      <div style={{ fontSize: '11px', color: '#2e2e2e', textAlign: 'center', marginTop: '4px' }}>
        © 2026 UPLY · Todos os direitos reservados
      </div>
    </form>
  )

  if (isMobile) {
    return <MobileLayout>{form_ui}</MobileLayout>
  }

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', background: '#0F0F0F', overflow: 'hidden' }}>
      <DesktopQuotePanel />
      <div style={{ width: '460px', minWidth: '460px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px', background: '#111', borderLeft: '1px solid rgba(255,255,255,0.06)', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: '360px' }}>{form_ui}</div>
      </div>
    </div>
  )
}
