import { useState, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'

export default function AnimatedGlowingSearchBar({ value, onChange, placeholder = 'Search...', className }) {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)

  return (
    <motion.div
      className={cn('relative flex items-center', className)}
      animate={focused ? { scale: 1.01 } : { scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Glow layer */}
      <AnimatePresence>
        {focused && (
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              background: 'transparent',
              boxShadow: '0 0 0 1px rgba(34,197,94,0.5), 0 0 18px rgba(34,197,94,0.2), 0 0 36px rgba(34,197,94,0.08)',
            }}
          />
        )}
      </AnimatePresence>

      <div
        className={cn(
          'relative flex items-center w-full rounded-xl transition-all duration-200',
          'bg-dark-700 border',
          focused ? 'border-brand/50' : 'border-dark-400 hover:border-dark-300'
        )}
      >
        <motion.div
          className="pl-3 flex-shrink-0"
          animate={{ color: focused ? '#22c55e' : '#6b7280' }}
          transition={{ duration: 0.2 }}
        >
          <Search size={15} />
        </motion.div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-2.5 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none"
        />

        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              onClick={() => { onChange?.(''); inputRef.current?.focus() }}
              className="pr-3 text-gray-500 hover:text-gray-300 flex-shrink-0"
            >
              <X size={13} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
