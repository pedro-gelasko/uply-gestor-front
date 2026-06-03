import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Image, Film, Loader, AlertCircle } from 'lucide-react'
import api from '../services/api'

const ACCEPTED = 'image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm'
const MAX_MB   = 10

export default function FileUpload({ value, onChange, disabled }) {
  const [uploading, setUploading] = useState(false)
  const [error,     setError]     = useState(null)
  const [preview,   setPreview]   = useState(null)
  const [fileType,  setFileType]  = useState(null)
  const inputRef = useRef(null)

  const isVideo = fileType?.startsWith('video') || value?.match(/\.(mp4|mov|webm)$/i)

  const handleFile = async (file) => {
    if (!file) return
    if (file.size > MAX_MB * 1024 * 1024) {
      return setError(`Arquivo muito grande. Máximo ${MAX_MB}MB.`)
    }
    setError(null)
    setFileType(file.type)

    // Preview local imediato
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)

    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const { data } = await api.post('/uploads', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      })
      onChange(data.data.url)
    } catch (err) {
      setError(err.message || 'Erro no upload. Tente novamente.')
      setPreview(null)
      onChange('')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (file) handleFile(file)
  }

  const handleRemove = () => {
    setPreview(null)
    setFileType(null)
    setError(null)
    onChange('')
    if (inputRef.current) inputRef.current.value = ''
  }

  const displayUrl = preview || value

  return (
    <div>
      <AnimatePresence mode="wait">
        {displayUrl ? (
          /* Preview */
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,107,0,0.3)', background: '#1a1a1a' }}
          >
            {isVideo ? (
              <video src={displayUrl} controls style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', display: 'block' }} />
            ) : (
              <img src={displayUrl} alt="Preview" style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', display: 'block' }}
                onError={() => { setPreview(null); setError('Não foi possível carregar a imagem.') }} />
            )}

            {/* Overlay de loading */}
            {uploading && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <Loader size={24} color="#FF6B00" />
                </motion.div>
                <span style={{ fontSize: '12px', color: '#fff' }}>Enviando...</span>
              </div>
            )}

            {/* Botão remover */}
            {!uploading && (
              <button onClick={handleRemove} disabled={disabled}
                style={{ position: 'absolute', top: '8px', right: '8px', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
                <X size={13} />
              </button>
            )}

            {/* Badge tipo */}
            {!uploading && (
              <div style={{ position: 'absolute', bottom: '8px', left: '8px', display: 'flex', alignItems: 'center', gap: '5px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
                {isVideo ? <Film size={11} color="#FF8C42" /> : <Image size={11} color="#FF8C42" />}
                <span style={{ fontSize: '10px', color: '#FF8C42', fontWeight: '500' }}>{isVideo ? 'Vídeo' : 'Imagem'}</span>
              </div>
            )}
          </motion.div>
        ) : (
          /* Drop zone */
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !disabled && inputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,107,0,0.6)'; e.currentTarget.style.background = 'rgba(255,107,0,0.06)' }}
            onDragLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
            style={{
              border: '2px dashed rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '28px 20px',
              textAlign: 'center',
              cursor: disabled ? 'not-allowed' : 'pointer',
              background: 'rgba(255,255,255,0.03)',
              transition: 'all 0.2s ease',
            }}
            whileHover={!disabled ? { borderColor: 'rgba(255,107,0,0.4)', background: 'rgba(255,107,0,0.04)' } : {}}
          >
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Image size={16} color="#FF8C42" />
              </div>
              <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Film size={16} color="#FF8C42" />
              </div>
            </div>
            <div style={{ fontSize: '13px', fontWeight: '500', color: '#B3B3B3', marginBottom: '4px' }}>
              Arraste ou clique para enviar
            </div>
            <div style={{ fontSize: '11px', color: '#555' }}>
              JPG, PNG, MP4, MOV · Máx. {MAX_MB}MB
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Erro */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '12px', color: '#ef4444' }}>
            <AlertCircle size={12} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <input ref={inputRef} type="file" accept={ACCEPTED} onChange={handleChange} style={{ display: 'none' }} disabled={disabled} />
    </div>
  )
}
