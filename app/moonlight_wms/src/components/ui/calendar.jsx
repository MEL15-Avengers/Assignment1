import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa']

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

function parseDate(str) {
  if (!str) return null
  const d = new Date(str)
  return isNaN(d) ? null : d
}

function formatDisplay(date) {
  if (!date) return ''
  return date.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatValue(date) {
  if (!date) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default function Calendar({ value, onChange, placeholder = 'Pick a date', className, minDate, maxDate }) {
  const [open, setOpen] = useState(false)
  const selected = parseDate(value)
  const today = new Date()
  const [view, setView] = useState({ year: selected?.getFullYear() || today.getFullYear(), month: selected?.getMonth() || today.getMonth() })
  const containerRef = useRef(null)

  useEffect(() => {
    function onClick(e) {
      if (!containerRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const prevMonth = () => setView(v => v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 })
  const nextMonth = () => setView(v => v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 })

  const daysInMonth = getDaysInMonth(view.year, view.month)
  const firstDay = getFirstDayOfMonth(view.year, view.month)

  const selectDay = (day) => {
    const d = new Date(view.year, view.month, day)
    onChange?.(formatValue(d))
    setOpen(false)
  }

  const isSelected = (day) => selected && selected.getFullYear() === view.year && selected.getMonth() === view.month && selected.getDate() === day
  const isToday = (day) => today.getFullYear() === view.year && today.getMonth() === view.month && today.getDate() === day

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={cn(
          'input w-full flex items-center gap-2 text-left',
          !value && 'text-gray-500'
        )}
      >
        <CalIcon size={14} className="text-gray-500 flex-shrink-0" />
        <span className="flex-1 text-sm">{value ? formatDisplay(parseDate(value)) : placeholder}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-full mt-1.5 left-0 bg-dark-800 border border-dark-400 rounded-xl shadow-xl p-4 w-72"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <button type="button" onClick={prevMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-dark-600 text-gray-400 hover:text-white transition-colors">
                <ChevronLeft size={14} />
              </button>
              <span className="text-sm font-semibold text-white">{MONTHS[view.month]} {view.year}</span>
              <button type="button" onClick={nextMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-dark-600 text-gray-400 hover:text-white transition-colors">
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Day labels */}
            <div className="grid grid-cols-7 mb-1">
              {DAYS.map(d => (
                <div key={d} className="text-center text-xs text-gray-600 font-medium py-1">{d}</div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-0.5">
              {Array(firstDay).fill(null).map((_, i) => <div key={`e${i}`} />)}
              {Array(daysInMonth).fill(null).map((_, i) => {
                const day = i + 1
                const sel = isSelected(day)
                const tod = isToday(day)
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => selectDay(day)}
                    className={cn(
                      'w-full aspect-square flex items-center justify-center text-xs rounded-lg transition-colors',
                      sel ? 'bg-brand text-white font-bold shadow-[0_0_8px_rgba(34,197,94,0.4)]' :
                      tod ? 'text-brand font-semibold hover:bg-brand/20' :
                      'text-gray-300 hover:bg-dark-600'
                    )}
                  >
                    {day}
                  </button>
                )
              })}
            </div>

            <div className="mt-3 pt-3 border-t border-dark-500 flex justify-end">
              <button type="button" onClick={() => { onChange?.(''); setOpen(false) }} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Clear</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
