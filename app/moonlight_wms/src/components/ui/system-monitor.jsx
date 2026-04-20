import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, X, ChevronDown, ChevronUp, Cpu, HardDrive, Wifi, Layers } from 'lucide-react'

const MAX_POINTS = 30

function useSparkline(getValue, interval = 1000) {
  const [data, setData] = useState(() => Array(MAX_POINTS).fill(0))
  useEffect(() => {
    const id = setInterval(() => {
      setData(prev => [...prev.slice(1), getValue()])
    }, interval)
    return () => clearInterval(id)
  }, [])
  return data
}

function Sparkline({ data, color, height = 36 }) {
  const max = Math.max(...data, 1)
  const w = 100
  const h = height
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - (v / max) * (h - 2) - 1
    return `${x},${y}`
  }).join(' ')

  return (
    <svg viewBox={`0 0 100 ${h}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={`sg-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${points} 100,${h}`} fill={`url(#sg-${color})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

function MetricCard({ icon: Icon, label, data, color, unit = '%' }) {
  const current = data[data.length - 1]
  return (
    <div className="bg-dark-900 rounded-lg p-2.5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <Icon size={11} style={{ color }} />
          <span className="text-xs text-gray-500 font-medium">{label}</span>
        </div>
        <span className="text-xs font-bold" style={{ color }}>{current.toFixed(0)}{unit}</span>
      </div>
      <Sparkline data={data} color={color} height={32} />
    </div>
  )
}

// Simulated metric generators
const rand = (min, max) => Math.random() * (max - min) + min
let cpuBase = 35, gpuBase = 45, ramBase = 60, netBase = 20

export default function SystemMonitor() {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)

  const cpuData = useSparkline(() => { cpuBase = Math.max(5, Math.min(95, cpuBase + rand(-8, 8))); return cpuBase })
  const gpuData = useSparkline(() => { gpuBase = Math.max(10, Math.min(95, gpuBase + rand(-6, 6))); return gpuBase })
  const ramData = useSparkline(() => { ramBase = Math.max(40, Math.min(90, ramBase + rand(-3, 3))); return ramBase })
  const netData = useSparkline(() => { netBase = Math.max(0, Math.min(100, netBase + rand(-15, 15))); return netBase }, 800)

  return (
    <div className="fixed bottom-5 left-5 z-50">
      <AnimatePresence>
        {open && !minimized && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-2 w-64 bg-dark-800 border border-dark-400 rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-dark-500">
              <div className="flex items-center gap-2">
                <Activity size={13} className="text-brand" />
                <span className="text-xs font-bold text-white tracking-wide">SYSTEM MONITOR</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setMinimized(true)} className="w-5 h-5 flex items-center justify-center rounded hover:bg-dark-600 text-gray-500 hover:text-white transition-colors">
                  <ChevronDown size={12} />
                </button>
                <button onClick={() => setOpen(false)} className="w-5 h-5 flex items-center justify-center rounded hover:bg-dark-600 text-gray-500 hover:text-white transition-colors">
                  <X size={12} />
                </button>
              </div>
            </div>
            <div className="p-2.5 grid grid-cols-2 gap-2">
              <MetricCard icon={Cpu} label="CPU" data={cpuData} color="#22c55e" />
              <MetricCard icon={Layers} label="GPU" data={gpuData} color="#3b82f6" />
              <MetricCard icon={HardDrive} label="RAM" data={ramData} color="#a855f7" />
              <MetricCard icon={Wifi} label="Net" data={netData} color="#f59e0b" unit=" MB/s" />
            </div>
          </motion.div>
        )}
        {open && minimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-2 bg-dark-800 border border-dark-400 rounded-xl px-3 py-2 flex items-center gap-3 shadow-xl"
          >
            <Activity size={13} className="text-brand" />
            <span className="text-xs text-gray-400">CPU: <span className="text-brand font-bold">{cpuData[cpuData.length-1]?.toFixed(0)}%</span></span>
            <span className="text-xs text-gray-400">RAM: <span className="text-purple-400 font-bold">{ramData[ramData.length-1]?.toFixed(0)}%</span></span>
            <button onClick={() => setMinimized(false)} className="text-gray-500 hover:text-white"><ChevronUp size={12} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => { setOpen(o => !o); setMinimized(false) }}
        className="w-11 h-11 rounded-full bg-dark-700 border border-dark-400 flex items-center justify-center shadow-lg hover:border-brand/40 hover:shadow-[0_0_16px_rgba(34,197,94,0.2)] transition-all"
      >
        <Activity size={18} className={open ? 'text-brand' : 'text-gray-400'} />
      </motion.button>
    </div>
  )
}
