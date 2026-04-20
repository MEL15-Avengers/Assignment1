import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'
import NeonButton from '../components/ui/neon-button'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(34,197,94,0.06) 0%, transparent 70%)'
      }} />

      <div className="relative z-10 text-center max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Glitching 404 */}
          <div className="relative mb-6">
            <motion.h1
              className="text-[120px] font-black leading-none select-none"
              style={{
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #22c55e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: 'none',
                filter: 'drop-shadow(0 0 30px rgba(34,197,94,0.3))',
              }}
              animate={{ opacity: [1, 0.9, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            >
              404
            </motion.h1>
            {/* Glitch layers */}
            <motion.span
              className="absolute inset-0 text-[120px] font-black leading-none select-none pointer-events-none"
              style={{ color: '#ef4444', clipPath: 'inset(30% 0 40% 0)', left: 2, top: 0 }}
              animate={{ opacity: [0, 0.4, 0, 0.2, 0], x: [0, -3, 0, 2, 0] }}
              transition={{ repeat: Infinity, duration: 4, times: [0, 0.1, 0.15, 0.2, 1] }}
            >
              404
            </motion.span>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
            <p className="text-gray-500 text-sm mb-8">
              The page you're looking for doesn't exist or you don't have permission to access it.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex items-center justify-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <NeonButton variant="secondary" size="md" onClick={() => navigate(-1)}>
            <ArrowLeft size={15} />Go Back
          </NeonButton>
          <NeonButton size="md" onClick={() => navigate('/')}>
            <Home size={15} />Dashboard
          </NeonButton>
        </motion.div>

        {/* Decorative particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-brand/40"
            style={{ left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 25}%` }}
            animate={{ y: [-8, 8, -8], opacity: [0.3, 0.8, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 + i * 0.4, delay: i * 0.3 }}
          />
        ))}
      </div>
    </div>
  )
}
