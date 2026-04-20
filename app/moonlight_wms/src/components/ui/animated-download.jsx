import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Upload, Check, Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

export function AnimatedDownload({ onDownload, label = 'Download', className }) {
  const [state, setState] = useState('idle') // idle | loading | done

  const handleClick = async () => {
    if (state !== 'idle') return
    setState('loading')
    await new Promise(r => setTimeout(r, 900))
    await onDownload?.()
    setState('done')
    setTimeout(() => setState('idle'), 2000)
  }

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.96 }}
      className={cn(
        'relative inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
        state === 'done'
          ? 'bg-brand/20 text-brand border border-brand/30'
          : 'bg-dark-700 text-gray-300 border border-dark-400 hover:border-brand/30 hover:text-white',
        className
      )}
    >
      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
            <Download size={14} />{label}
          </motion.span>
        )}
        {state === 'loading' && (
          <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}>
              <Loader2 size={14} />
            </motion.div>
            Preparing...
          </motion.span>
        )}
        {state === 'done' && (
          <motion.span key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
            <Check size={14} />Done!
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

export function AnimatedUpload({ onUpload, label = 'Upload', accept, className }) {
  const [state, setState] = useState('idle')
  const [fileName, setFileName] = useState('')

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setState('loading')
    await new Promise(r => setTimeout(r, 800))
    await onUpload?.(file)
    setState('done')
    setTimeout(() => { setState('idle'); setFileName('') }, 2500)
  }

  return (
    <label className={cn(
      'relative inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg cursor-pointer transition-colors',
      state === 'done'
        ? 'bg-brand/20 text-brand border border-brand/30'
        : 'bg-dark-700 text-gray-300 border border-dark-400 hover:border-brand/30 hover:text-white',
      className
    )}>
      <input type="file" className="absolute inset-0 w-full opacity-0 cursor-pointer" accept={accept} onChange={handleFile} />
      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
            <Upload size={14} />{label}
          </motion.span>
        )}
        {state === 'loading' && (
          <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}>
              <Loader2 size={14} />
            </motion.div>
            <span className="truncate max-w-[120px]">{fileName || 'Uploading...'}</span>
          </motion.span>
        )}
        {state === 'done' && (
          <motion.span key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
            <Check size={14} />Uploaded!
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  )
}
