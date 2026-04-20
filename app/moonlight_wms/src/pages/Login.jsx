import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, ShoppingCart, ShieldCheck, Settings, Store, UserCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { API_BASE, db } from '../lib/api'

/* ── Auth constants ─────────────────────────────────────────── */
const ROLE_MAP = { Admin: 'Admin', Manager: 'Manager', 'Site Manager': 'Site Manager', Employee: 'Employee' }
const DEST_MAP = { Admin: '/admin/dashboard', 'Site Manager': '/sm/dashboard', Manager: '/dashboard', Employee: '/dashboard' }
const ROLE_OPTIONS = ['Admin', 'Manager', 'Site Manager', 'Employee']
const ROLE_META = {
  Admin:          { Icon: ShieldCheck, accent: '#f59e0b', label: 'Full system control' },
  Manager:        { Icon: Settings,    accent: '#3b82f6', label: 'Operations manager'  },
  'Site Manager': { Icon: Store,       accent: '#f97316', label: 'Site-level access'   },
  Employee:       { Icon: UserCheck,   accent: '#22c55e', label: 'Standard staff access'},
}

/* ── Dark neumorphism tokens ────────────────────────────────── */
const BG        = '#1a1f2e'
const SH_DARK   = '#12161f'
const SH_LIGHT  = '#222840'

const CARD_SH   = `20px 20px 60px ${SH_DARK}, -20px -20px 60px ${SH_LIGHT}`
const IN_SH     = `inset 6px 6px 14px ${SH_DARK}, inset -6px -6px 14px ${SH_LIGHT}`
const IN_SH_FOC = `inset 8px 8px 18px ${SH_DARK}, inset -8px -8px 18px ${SH_LIGHT}`
const BTN_SH    = `6px 6px 18px ${SH_DARK}, -6px -6px 18px ${SH_LIGHT}`
const BTN_ACT   = `inset 4px 4px 10px ${SH_DARK}, inset -4px -4px 10px ${SH_LIGHT}`
const ICON_SH   = `4px 4px 10px ${SH_DARK}, -4px -4px 10px ${SH_LIGHT}`

const TEXT_PRI  = '#e0e5f0'
const TEXT_MUT  = '#6b7280'
const TEXT_SUB  = '#9ca3af'

/* ── Sub-components ─────────────────────────────────────────── */
function NeuInput({ icon: Icon, type = 'text', placeholder, value, onChange, right }) {
  const [focused, setFocused] = useState(false)
  return (
    <div
      className="flex items-center gap-3 px-4 rounded-2xl transition-all duration-200"
      style={{ background: BG, boxShadow: focused ? IN_SH_FOC : IN_SH }}
    >
      <Icon size={17} style={{ color: focused ? '#22c55e' : TEXT_MUT, transition: 'color 0.2s', flexShrink: 0 }} />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="flex-1 bg-transparent py-4 text-sm outline-none placeholder-gray-600"
        style={{ color: TEXT_PRI, fontFamily: 'Nunito, sans-serif', fontWeight: 500 }}
      />
      {right}
    </div>
  )
}

function NeuButton({ children, type = 'button', onClick, disabled, accent }) {
  const [active, setActive] = useState(false)
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      onMouseLeave={() => setActive(false)}
      className="w-full py-4 rounded-2xl font-bold text-sm transition-all duration-150"
      style={{
        background: accent ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : BG,
        color: accent ? '#fff' : TEXT_SUB,
        boxShadow: accent
          ? (active ? '0 2px 8px rgba(34,197,94,0.25)' : '0 6px 24px rgba(34,197,94,0.35), 0 2px 8px rgba(34,197,94,0.2)')
          : (active ? BTN_ACT : BTN_SH),
        transform: active ? 'scale(0.98)' : 'scale(1)',
        opacity: disabled ? 0.55 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'Nunito, sans-serif',
        letterSpacing: '0.02em',
      }}
    >
      {children}
    </button>
  )
}

/* Extracted to avoid hooks-in-map */
function SocialButton({ provider, label, icon, onClick }) {
  const [active, setActive] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      onMouseLeave={() => setActive(false)}
      className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-xs font-bold transition-all duration-150"
      style={{
        background: BG,
        color: TEXT_SUB,
        boxShadow: active ? BTN_ACT : BTN_SH,
        fontFamily: 'Nunito, sans-serif',
      }}
    >
      {icon} {label}
    </button>
  )
}

function DemoButton({ role, email, onClick }) {
  const [active, setActive] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      onMouseLeave={() => setActive(false)}
      className="py-2.5 px-3 rounded-xl text-left transition-all duration-150"
      style={{
        background: BG,
        boxShadow: active ? BTN_ACT : `4px 4px 10px ${SH_DARK}, -4px -4px 10px ${SH_LIGHT}`,
      }}
    >
      <p className="text-xs font-bold" style={{ color: '#22c55e' }}>{role}</p>
      <p className="mt-0.5 truncate" style={{ color: TEXT_MUT, fontSize: '10px' }}>
        {email.split('@')[0]}@…
      </p>
    </button>
  )
}

/* ── Page ─────────────────────────────────────────────────── */
export default function Login() {
  const [role, setRole]         = useState('Employee')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const oauth      = params.get('oauth')
    const oauthError = params.get('oauth_error')
    if (oauthError) { setError(oauthError); window.history.replaceState({}, '', '/login'); return }
    if (!oauth) return
    try {
      const b64 = oauth.replace(/-/g, '+').replace(/_/g, '/')
      const norm = b64.padEnd(b64.length + ((4 - b64.length % 4) % 4), '=')
      const user = JSON.parse(atob(norm))
      login({ name: user.name, email: user.email, role: user.role, site: user.site || 'Melbourne', phone: user.phone, department: user.department, avatar: user.photo })
        .then(() => navigate(DEST_MAP[user.role] || '/dashboard', { replace: true }))
    } catch {
      setError('Social sign-in completed, but session could not be created.')
      window.history.replaceState({}, '', '/login')
    }
  }, [login, navigate])

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    if (password.length < 6)  { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    const mappedRole = ROLE_MAP[role]

    try {
      const { user } = await db.login({ email, password, role: mappedRole })
      await login({ name: user.name, email: user.email, role: user.role, site: user.site || 'Melbourne', phone: user.phone, department: user.department, avatar: user.photo })
      navigate(DEST_MAP[user.role] || '/dashboard')
    } catch {
      setError('Invalid email, password, or role.')
    }
    setLoading(false)
  }

  const handleOAuth = provider => { window.location.href = `${API_BASE}/auth/${provider}` }
  const roleMeta = ROLE_META[role]

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative"
      style={{ background: BG, fontFamily: 'Nunito, sans-serif' }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.08), transparent 65%)' }} />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.06), transparent 65%)' }} />
        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      </div>

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Card */}
        <div className="p-8 rounded-[2rem]" style={{ background: BG, boxShadow: CARD_SH }}>

          {/* Brand */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="mb-5 relative"
            >
              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-3xl animate-ping"
                style={{ background: 'rgba(34,197,94,0.08)', animationDuration: '3s' }} />
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center relative"
                style={{ background: BG, boxShadow: BTN_SH }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', boxShadow: '0 4px 20px rgba(34,197,94,0.4)' }}
                >
                  <ShoppingCart size={26} color="#fff" />
                </div>
              </div>
            </motion.div>

            <h1 className="text-2xl font-black tracking-tight" style={{ color: TEXT_PRI }}>
              Moonlight
            </h1>
            <p className="text-xs font-semibold mt-1 tracking-widest uppercase" style={{ color: TEXT_MUT }}>
              Warehouse Management
            </p>
          </div>

          {/* Role selector */}
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest mb-3 text-center" style={{ color: TEXT_MUT }}>
              Sign in as
            </p>
            <div
              className="grid grid-cols-4 gap-1.5 p-1.5 rounded-2xl"
              style={{ background: BG, boxShadow: IN_SH }}
            >
              {ROLE_OPTIONS.map(r => {
                const active = r === role
                const shortLabel = r === 'Site Manager' ? 'S.Mgr' : r.split(' ')[0]
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => { setRole(r); setError('') }}
                    className="relative py-2.5 rounded-xl flex flex-col items-center gap-1 transition-all duration-200"
                    style={{
                      background: active ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'transparent',
                      color:      active ? '#fff' : TEXT_MUT,
                      boxShadow:  active ? '0 4px 14px rgba(34,197,94,0.4)' : 'none',
                    }}
                  >
                    {(() => { const I = ROLE_META[r].Icon; return <I size={15} style={{ color: active ? '#fff' : ROLE_META[r].accent }} /> })()}
                    <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.01em' }}>{shortLabel}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Role hint badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={role}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-3 mb-6 px-4 py-3 rounded-2xl"
              style={{ background: BG, boxShadow: IN_SH }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${roleMeta.accent}18`, boxShadow: ICON_SH }}
              >
                {(() => { const I = roleMeta.Icon; return <I size={16} style={{ color: roleMeta.accent }} /> })()}
              </div>
              <div>
                <p className="text-xs font-bold" style={{ color: TEXT_PRI }}>{role}</p>
                <p className="text-xs" style={{ color: TEXT_MUT }}>{roleMeta.label}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 px-4 py-3 rounded-2xl flex items-start gap-3"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}
              >
                <AlertCircle size={16} style={{ color: '#ef4444', flexShrink: 0, marginTop: 1 }} />
                <p className="text-xs font-semibold leading-snug" style={{ color: '#f87171' }}>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <NeuInput
              icon={Mail}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
            />

            <NeuInput
              icon={Lock}
              type={showPass ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              right={
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="transition-colors duration-150"
                  style={{ color: TEXT_MUT, flexShrink: 0 }}
                  onMouseEnter={e => (e.currentTarget.style.color = TEXT_SUB)}
                  onMouseLeave={e => (e.currentTarget.style.color = TEXT_MUT)}
                >
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              }
            />

            <div className="flex justify-end">
              <Link
                to="/reset-password"
                className="text-xs font-semibold transition-colors duration-150"
                style={{ color: TEXT_MUT }}
                onMouseEnter={e => (e.currentTarget.style.color = '#22c55e')}
                onMouseLeave={e => (e.currentTarget.style.color = TEXT_MUT)}
              >
                Forgot password?
              </Link>
            </div>

            <NeuButton type="submit" disabled={loading} accent>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <LogIn size={17} color="#fff" />
                  Sign In as {role}
                </span>
              )}
            </NeuButton>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: SH_LIGHT, opacity: 0.5 }} />
            <span className="text-xs font-semibold" style={{ color: TEXT_MUT }}>or continue with</span>
            <div className="flex-1 h-px" style={{ background: SH_LIGHT, opacity: 0.5 }} />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <SocialButton
              provider="google"
              label="Google"
              onClick={() => handleOAuth('google')}
              icon={
                <svg width="15" height="15" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              }
            />
            <SocialButton
              provider="facebook"
              label="Facebook"
              onClick={() => handleOAuth('facebook')}
              icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>}
            />
          </div>

          <p className="text-center text-xs font-medium" style={{ color: TEXT_MUT }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-bold transition-colors duration-150"
              style={{ color: '#22c55e' }}
            >
              Sign up
            </Link>
          </p>
        </div>

      </motion.div>
    </div>
  )
}
