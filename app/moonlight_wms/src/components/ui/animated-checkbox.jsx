import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

export default function AnimatedCheckbox({ checked, onChange, label, className, disabled }) {
  return (
    <label className={cn('flex items-center gap-2.5 cursor-pointer select-none group', disabled && 'opacity-50 cursor-not-allowed', className)}>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange?.(!checked)}
        className={cn(
          'relative w-4.5 h-4.5 rounded flex items-center justify-center flex-shrink-0 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50',
          checked
            ? 'bg-brand border-brand shadow-[0_0_8px_rgba(34,197,94,0.4)]'
            : 'bg-dark-700 border border-dark-400 group-hover:border-brand/50'
        )}
        style={{ width: 18, height: 18 }}
      >
        <motion.svg
          width="10" height="8" viewBox="0 0 10 8" fill="none"
          initial={false}
          animate={checked ? { opacity: 1, pathLength: 1 } : { opacity: 0, pathLength: 0 }}
        >
          <motion.path
            d="M1 4L3.5 6.5L9 1"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: checked ? 1 : 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          />
        </motion.svg>
      </button>
      {label && <span className="text-sm text-gray-300">{label}</span>}
    </label>
  )
}
