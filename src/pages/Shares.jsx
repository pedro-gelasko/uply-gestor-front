import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Share2, Eye, Link, Clock, CheckCircle, XCircle,
  Plus, Copy, ExternalLink, Check, Power, Trash2,
} from 'lucide-react'
import { getShares, toggleShare, deleteShare } from '../services/shareService'
import { mapShare } from '../data/mappers'
import ClientSharePreview from '../components/ClientSharePreview'
import NewShareModal from '../components/NewShareModal'
import ConfirmModal from '../components/ConfirmModal'
import { PageLoading, PageError } from '../components/LoadingState'

export default function Shares() {
  const [shares,        setShares]        = useState([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState(null)
  const [copiedId,      setCopiedId]      = useState(null)
  const [previewShare,  setPreviewShare]  = useState(null)
  const [showNew,       setShowNew]       = useState(false)
  const [deletingShare, setDeletingShare] = useState(null)
  const [togglingId,    setTogglingId]    = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const raw = await getShares()
      setShares(raw.map((s, i) => mapShare(s, i)))
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const handleCopy = (share) => {
    const url = `${window.location.origin}/share/${share.token}`
    navigator.clipboard.writeText(url).catch(() => {
      const el = document.createElement('textarea')
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    })
    setCopiedId(share.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleToggle = async (share) => {
    setTogglingId(share.id)
    try {
      const updated = await toggleShare(share.id)
      setShares(prev => prev.map(s =>
        s.id === share.id
          ? { ...s, status: updated.active ? 'Ativo' : 'Inativo' }
          : s
      ))
    } catch (err) { alert(err.message) }
    finally { setTogglingId(null) }
  }

  const handleDelete = async () => {
    await deleteShare(deletingShare.id)
    setDeletingShare(null)
    fetch()
  }

  if (loading) return <PageLoading message="Carregando compartilhamentos..." />
  if (error)   return <PageError message={error} onRetry={fetch} />

  const activeCount   = shares.filter(s => s.status === 'Ativo').length
  const inactiveCount = shares.filter(s => s.status !== 'Ativo').length

  return (
    <>
      <div style={{ flex: 1, overflow: 'auto', padding: '32px' }}>
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#fff', letterSpacing: '-0.03em', marginBottom: '4px' }}>Compartilhamentos</h1>
              <p style={{ fontSize: '14px', color: '#666' }}>Gerencie os calendários compartilhados com seus clientes</p>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => setShowNew(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 18px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #FF6B00, #FF8C42)', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 12px rgba(255,107,0,0.3)' }}>
              <Plus size={14} strokeWidth={2.5} />
              Novo Compartilhamento
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'Links Ativos',   value: activeCount,    icon: CheckCircle, color: '#22c55e' },
            { label: 'Total de Links', value: shares.length,  icon: Eye,         color: '#FF6B00' },
            { label: 'Links Inativos', value: inactiveCount,  icon: XCircle,     color: '#ef4444' },
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                style={{ background: 'rgba(26,26,26,0.8)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.07)', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${stat.color}15`, border: `1px solid ${stat.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} color={stat.color} />
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#fff', letterSpacing: '-0.03em' }}>{stat.value}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>{stat.label}</div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {shares.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: '#555', fontSize: '14px' }}>
              Nenhum compartilhamento criado. Clique em "Novo Compartilhamento" para começar.
            </div>
          ) : shares.map((share, i) => {
            const isActive   = share.status === 'Ativo'
            const isCopied   = copiedId === share.id
            const isToggling = togglingId === share.id

            return (
              <motion.div key={share.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}
                style={{ background: 'rgba(26,26,26,0.8)', borderRadius: '14px', border: `1px solid ${isActive ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)'}`, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px', opacity: isActive ? 1 : 0.65, transition: 'opacity 0.2s' }}>

                {/* Status icon */}
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: isActive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${isActive ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Share2 size={16} color={isActive ? '#22c55e' : '#ef4444'} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>{share.clientName}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Link size={11} color="#555" />
                    <span style={{ fontSize: '12px', color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {window.location.origin}/share/{share.token}
                    </span>
                  </div>
                </div>

                {/* Meta */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#B3B3B3', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={11} color="#555" />{share.createdAt}
                    </div>
                    <div style={{ fontSize: '10px', color: '#555' }}>criado em</div>
                  </div>

                  {/* Status badge */}
                  <div style={{ padding: '4px 10px', borderRadius: '100px', background: isActive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${isActive ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`, fontSize: '11px', fontWeight: '500', color: isActive ? '#22c55e' : '#ef4444' }}>
                    {share.status}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {/* Copiar */}
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }} onClick={() => handleCopy(share)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 12px', height: '32px', borderRadius: '8px', border: isCopied ? '1px solid rgba(34,197,94,0.35)' : '1px solid rgba(255,255,255,0.08)', background: isCopied ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)', cursor: 'pointer', color: isCopied ? '#22c55e' : '#888', fontSize: '12px', fontWeight: '500', whiteSpace: 'nowrap', transition: 'all 0.2s ease' }}>
                    <AnimatePresence mode="wait">
                      {isCopied ? (
                        <motion.span key="check" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Check size={12} strokeWidth={2.5} /> Copiado!
                        </motion.span>
                      ) : (
                        <motion.span key="copy" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Copy size={12} /> Copiar link
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  {/* Abrir prévia */}
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }} onClick={() => setPreviewShare(share)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 12px', height: '32px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #FF6B00, #FF8C42)', color: '#fff', fontSize: '12px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 8px rgba(255,107,0,0.25)', whiteSpace: 'nowrap' }}>
                    <ExternalLink size={12} /> Prévia
                  </motion.button>

                  {/* Toggle ativo/inativo */}
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }}
                    onClick={() => handleToggle(share)}
                    disabled={isToggling}
                    title={isActive ? 'Desativar link' : 'Ativar link'}
                    style={{ width: '32px', height: '32px', borderRadius: '8px', border: `1px solid ${isActive ? 'rgba(239,68,68,0.25)' : 'rgba(34,197,94,0.25)'}`, background: isActive ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isToggling ? 'not-allowed' : 'pointer', color: isActive ? '#ef4444' : '#22c55e', flexShrink: 0, opacity: isToggling ? 0.5 : 1 }}>
                    <Power size={13} />
                  </motion.button>

                  {/* Excluir */}
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }}
                    onClick={() => setDeletingShare(share)}
                    title="Excluir compartilhamento"
                    style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#555', flexShrink: 0 }}>
                    <Trash2 size={13} />
                  </motion.button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showNew && (
          <NewShareModal onClose={() => setShowNew(false)} onSuccess={fetch} />
        )}
        {previewShare && (
          <ClientSharePreview share={previewShare} onClose={() => setPreviewShare(null)} />
        )}
        {deletingShare && (
          <ConfirmModal
            title="Excluir Compartilhamento"
            message={`Remover o link de compartilhamento de "${deletingShare.clientName}"? O link deixará de funcionar imediatamente.`}
            onConfirm={handleDelete}
            onClose={() => setDeletingShare(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
