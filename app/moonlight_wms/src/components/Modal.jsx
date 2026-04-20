import { X } from 'lucide-react'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Modal({ title, onClose, children, width = 'max-w-lg' }) {
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          className="absolute inset-0 bg-black/65 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          className={`relative w-full ${width} card shadow-elevated mx-0 sm:mx-auto rounded-b-none sm:rounded-2xl`}
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {/* Handle bar (mobile) */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 rounded-full bg-dark-400" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-dark-600/50">
            <h2 className="text-base font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="btn-icon-sm ml-2"
              aria-label="Close modal"
            >
              <X size={15} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
