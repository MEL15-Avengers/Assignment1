import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Bot, User, Sparkles, RotateCcw } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const SUGGESTIONS = [
  'What items are low on stock?',
  'Show me active alerts',
  'What is the total inventory value?',
  'List recent stock movements',
]

function TypingDots() {
  return (
    <div className="flex gap-1 items-center h-4 px-1">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-dark-400"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-2 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center
        ${isUser ? 'bg-brand-500/20 text-brand-400' : 'bg-purple-500/20 text-purple-400'}`}>
        {isUser ? <User size={13} /> : <Bot size={13} />}
      </div>
      <div className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap
        ${isUser
          ? 'bg-brand-500 text-white rounded-tr-sm'
          : 'bg-dark-700 text-dark-100 border border-dark-600/70 rounded-tl-sm'
        }`}>
        {msg.content}
      </div>
    </motion.div>
  )
}

const INITIAL_MESSAGE = (name) =>
  `Hi${name ? ` ${name.split(' ')[0]}` : ''}! I'm your Moonlight WMS AI assistant.\n\nI can answer questions about inventory levels, alerts, stock movements, products, and more. How can I help?`

export default function AIChatbot({ user }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(() => [
    { role: 'assistant', content: INITIAL_MESSAGE(user?.name) },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 250)
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(text) {
    const trimmed = (text || input).trim()
    if (!trimmed || loading) return

    const userMsg = { role: 'user', content: trimmed }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updated.slice(-12),
          userRole: user?.role || 'Employee',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Request failed')
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }])
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    sendMessage()
  }

  function reset() {
    setMessages([{ role: 'assistant', content: INITIAL_MESSAGE(user?.name) }])
    setError(null)
    setInput('')
  }

  const showSuggestions = messages.length === 1 && !loading

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-80 sm:w-[22rem] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
            style={{
              height: '500px',
              background: 'linear-gradient(180deg, #1a2035 0%, #111827 100%)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500/30 to-purple-500/30 border border-white/10 flex items-center justify-center">
                <Sparkles size={15} className="text-brand-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-none">Moonlight AI</p>
                <p className="text-xs text-dark-400 mt-0.5">Inventory Assistant</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={reset}
                  title="New conversation"
                  className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-dark-400 hover:text-white transition-colors"
                >
                  <RotateCcw size={13} />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-dark-400 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
              {messages.map((msg, i) => (
                <Message key={i} msg={msg} />
              ))}

              {/* Suggestions */}
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-wrap gap-2 pt-1"
                >
                  {SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-xs px-3 py-1.5 rounded-full border border-brand-500/30 text-brand-400 hover:bg-brand-500/10 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}

              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2"
                >
                  <div className="w-7 h-7 rounded-full flex-shrink-0 bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Bot size={13} />
                  </div>
                  <div className="bg-dark-700 border border-dark-600/70 rounded-2xl rounded-tl-sm px-3 py-2">
                    <TypingDots />
                  </div>
                </motion.div>
              )}

              {error && (
                <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                  {error}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="p-3 border-t border-white/5 flex gap-2"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about inventory..."
                disabled={loading}
                className="flex-1 rounded-xl px-3 py-2 text-sm text-white placeholder-dark-400 outline-none transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(34,197,94,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors flex-shrink-0"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={() => setOpen(v => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-colors"
        style={{
          background: open
            ? 'linear-gradient(135deg, #16a34a, #15803d)'
            : 'linear-gradient(135deg, #22c55e, #16a34a)',
          boxShadow: '0 4px 20px rgba(34,197,94,0.35)',
        }}
        title={open ? 'Close AI Chat' : 'Open AI Chat'}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={20} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageSquare size={20} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
