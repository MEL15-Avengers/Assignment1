import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import MIcon from '../components/ui/MIcon'
import { validateCode, submitRegistration } from '../lib/registrationStore'

/* ── Constants ─────────────────────────────────────────────── */
const DEPARTMENTS  = ['Inventory', 'Warehouse Operations', 'Purchasing', 'Sales', 'Dispatch', 'Quality Control', 'Administration']
const WAREHOUSES   = ['Melbourne Ambient Store', 'Sydney Cold Storage', 'Brisbane Dry Goods Depot', 'Perth Distribution Centre']
const WAREHOUSE_CODES = { 'Melbourne Ambient Store': 'WH-MEL', 'Sydney Cold Storage': 'WH-SYD', 'Brisbane Dry Goods Depot': 'WH-BNE', 'Perth Distribution Centre': 'WH-PER' }
const ZONES  = ['Zone A — Fresh Produce', 'Zone B — Dairy & Eggs', 'Zone C — Dry Goods', 'Zone D — Frozen', 'Zone E — Beverages', 'Zone F — Dispatch']
const SHIFTS = ['Morning (6am–2pm)', 'Afternoon (2pm–10pm)', 'Night (10pm–6am)', 'Rotating']
const ACCESS_LEVELS = { Admin: 'Admin Access', Manager: 'Manager Access', Employee: 'Standard Employee Access' }
const ROLES = ['Admin', 'Manager', 'Employee']
const STEPS = [
  { label: 'Personal',   icon: 'person'          },
  { label: 'Login',      icon: 'lock'             },
  { label: 'Role',       icon: 'badge'            },
  { label: 'Warehouse',  icon: 'warehouse'        },
  { label: 'Security',   icon: 'verified_user'    },
]

/* ── Dark neumorphism tokens ───────────────────────────────── */
const BG       = '#1a1f2e'
const SH_DARK  = '#12161f'
const SH_LIGHT = '#222840'
const CARD_SH  = `20px 20px 60px ${SH_DARK}, -20px -20px 60px ${SH_LIGHT}`
const IN_SH    = `inset 6px 6px 14px ${SH_DARK}, inset -6px -6px 14px ${SH_LIGHT}`
const BTN_SH   = `6px 6px 18px ${SH_DARK}, -6px -6px 18px ${SH_LIGHT}`
const BTN_ACT  = `inset 4px 4px 10px ${SH_DARK}, inset -4px -4px 10px ${SH_LIGHT}`
const T_PRI    = '#e0e5f0'
const T_MUT    = '#6b7280'
const T_SUB    = '#9ca3af'

function passwordStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '' }
  let score = 0
  if (pw.length >= 8)          score++
  if (/[A-Z]/.test(pw))        score++
  if (/[0-9]/.test(pw))        score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 1) return { score: 1, label: 'Weak',   color: '#ef4444' }
  if (score === 2) return { score: 2, label: 'Fair',   color: '#f59e0b' }
  if (score === 3) return { score: 3, label: 'Good',   color: '#3b82f6' }
  return              { score: 4, label: 'Strong', color: '#22c55e' }
}

/* ── Reusable dark neu input ───────────────────────────────── */
function NeuInput({ icon, type = 'text', placeholder, value, onChange, error, right, readOnly }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <div
        className="flex items-center gap-3 px-4 rounded-2xl transition-all duration-200"
        style={{
          background: readOnly ? '#151929' : BG,
          boxShadow: focused ? `inset 8px 8px 18px ${SH_DARK}, inset -8px -8px 18px ${SH_LIGHT}` : IN_SH,
          border: error ? '1px solid #fca5a5' : `1px solid ${focused ? 'rgba(34,197,94,0.25)' : 'transparent'}`,
        }}
      >
        <MIcon name={icon} size={18} style={{ color: focused ? '#22c55e' : T_MUT, transition: 'color 0.2s', flexShrink: 0 }} />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent py-3.5 text-sm outline-none placeholder-[#4b5563]"
          style={{ color: T_PRI, fontFamily: 'Nunito, sans-serif', fontWeight: 500, cursor: readOnly ? 'not-allowed' : undefined }}
        />
        {right}
      </div>
      {error && (
        <p className="flex items-center gap-1 mt-1 text-xs font-medium" style={{ color: '#ef4444' }}>
          <AlertCircle size={10} />{error}
        </p>
      )}
    </div>
  )
}

function NeuSelect({ icon, value, onChange, children, error }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <div
        className="flex items-center gap-3 px-4 rounded-2xl"
        style={{
          background: BG,
          boxShadow: focused ? `inset 8px 8px 18px ${SH_DARK}, inset -8px -8px 18px ${SH_LIGHT}` : IN_SH,
          border: error ? '1px solid #fca5a5' : `1px solid ${focused ? 'rgba(34,197,94,0.25)' : 'transparent'}`,
        }}
      >
        <MIcon name={icon} size={18} style={{ color: focused ? '#22c55e' : T_MUT, transition: 'color 0.2s', flexShrink: 0 }} />
        <select
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent py-3.5 text-sm outline-none appearance-none"
          style={{ color: value ? T_PRI : T_MUT, fontFamily: 'Nunito, sans-serif', fontWeight: 500 }}
        >
          {children}
        </select>
        <MIcon name="expand_more" size={18} style={{ color: T_MUT, flexShrink: 0 }} />
      </div>
      {error && (
        <p className="flex items-center gap-1 mt-1 text-xs font-medium" style={{ color: '#ef4444' }}>
          <AlertCircle size={10} />{error}
        </p>
      )}
    </div>
  )
}

function NeuButton({ children, onClick, type = 'button', disabled, accent, outline }) {
  const [active, setActive] = useState(false)
  const [hov, setHov] = useState(false)
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      onMouseLeave={() => { setActive(false); setHov(false) }}
      onMouseEnter={() => setHov(true)}
      className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-150"
      style={{
        background: accent ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                  : outline ? 'transparent'
                  : BG,
        color: accent ? '#fff' : outline ? '#22c55e' : T_SUB,
        boxShadow: accent
          ? (active ? '0 2px 8px rgba(34,197,94,0.2)' : '0 6px 20px rgba(34,197,94,0.3)')
          : outline ? 'none'
          : (active ? BTN_ACT : BTN_SH),
        border: outline ? '2px solid #22c55e' : 'none',
        opacity: disabled ? 0.45 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transform: active ? 'scale(0.97)' : 'scale(1)',
        fontFamily: 'Nunito, sans-serif',
      }}
    >
      {children}
    </button>
  )
}

function NeuCheckbox({ checked, onChange, label, error }) {
  return (
    <div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="flex items-start gap-3 w-full text-left"
      >
        <div
          className="w-6 h-6 rounded-lg flex-shrink-0 mt-0.5 flex items-center justify-center transition-all duration-200"
          style={{
            background: checked ? 'linear-gradient(135deg, #22c55e, #16a34a)' : BG,
            boxShadow: checked ? '0 3px 10px rgba(34,197,94,0.35)' : IN_SH,
            borderRadius: '8px',
          }}
        >
          {checked && <MIcon name="check" size={14} style={{ color: '#fff' }} />}
        </div>
        <span className="text-xs font-medium leading-relaxed" style={{ color: T_SUB }}>{label}</span>
      </button>
      {error && <p className="text-xs mt-1 ml-9 flex items-center gap-1" style={{ color: '#ef4444' }}><AlertCircle size={10} />{error}</p>}
    </div>
  )
}

/* ── Left panel (feature showcase) ────────────────────────── */
function LeftPanel() {
  const features = [
    { icon: 'inventory_2',         label: 'Stock Control',   color: '#22c55e' },
    { icon: 'qr_code_scanner',     label: 'Barcode Scan',    color: '#3b82f6' },
    { icon: 'layers',              label: 'Batch Track',     color: '#8b5cf6' },
    { icon: 'corporate_fare',      label: 'Multi-Site',      color: '#f59e0b' },
    { icon: 'admin_panel_settings',label: 'RBAC Security',   color: '#ef4444' },
    { icon: 'sync',                label: 'Real-time',       color: '#06b6d4' },
  ]
  return (
    <div
      className="hidden lg:flex flex-col justify-between h-full p-10 relative overflow-hidden"
      style={{ background: BG }}
    >
      {/* Ambient glow blobs */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%)' }} />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)' }} />

      <div className="relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 6px 20px rgba(34,197,94,0.35)' }}
          >
            <MIcon name="local_grocery_store" size={22} style={{ color: '#fff' }} />
          </div>
          <div>
            <p className="font-black text-sm leading-tight" style={{ color: T_PRI, fontFamily: 'Nunito, sans-serif' }}>Moonlight WMS</p>
            <p className="text-xs" style={{ color: T_MUT }}>Grocery Management</p>
          </div>
        </div>

        <h2 className="text-3xl font-black leading-tight mb-4" style={{ color: T_PRI, fontFamily: 'Nunito, sans-serif' }}>
          Manage Your<br />
          <span style={{ color: '#22c55e' }}>Warehouse</span><br />
          Smarter
        </h2>
        <p className="text-sm leading-relaxed mb-8" style={{ color: T_MUT }}>
          Register to manage grocery stock, warehouse operations, inventory movement, and staff access across all sites.
        </p>

        <div className="grid grid-cols-3 gap-3">
          {features.map(({ icon, label, color }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl"
              style={{ background: BG, boxShadow: `6px 6px 16px ${SH_DARK}, -6px -6px 16px ${SH_LIGHT}` }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${color}18`, boxShadow: `3px 3px 8px ${SH_DARK}, -3px -3px 8px ${SH_LIGHT}` }}
              >
                <MIcon name={icon} size={20} style={{ color }} />
              </div>
              <span className="text-xs font-bold text-center leading-tight" style={{ color: T_SUB }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="relative z-10 p-4 rounded-2xl"
        style={{ background: BG, boxShadow: IN_SH }}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <MIcon name="security" size={15} style={{ color: '#22c55e' }} />
          <p className="text-xs font-bold" style={{ color: T_PRI }}>Security Notice</p>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: T_MUT }}>
          Only authorised users may access this system. A valid{' '}
          <span style={{ color: '#22c55e', fontWeight: 700 }}>Registration Code</span>{' '}
          issued by your administrator is required.
        </p>
      </div>
    </div>
  )
}

/* ── Main component ────────────────────────────────────────── */
export default function Register() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [photo, setPhoto] = useState(null)
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const fileRef = useRef(null)

  const [form, setForm] = useState({
    full_name: '', email: '', phone: '',
    username: '', password: '', confirm_password: '',
    role: 'Employee', staff_id: '', department: '',
    warehouse_location: '', warehouse_code: '', assigned_zone: '', shift: '',
    reg_code: '', twofa: false, terms: false, privacy: false, confirm_info: false,
  })

  const set   = (key, val) => setForm(f => ({ ...f, [key]: val }))
  const setE  = key => e => set(key, e.target.value)
  const strength = passwordStrength(form.password)

  const handlePhoto = e => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setPhoto(ev.target.result)
    reader.readAsDataURL(file)
  }

  const validateStep = async () => {
    const e = {}
    if (step === 0) {
      if (!form.full_name.trim()) e.full_name = 'Full name is required.'
      if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required.'
      if (!form.phone.trim()) e.phone = 'Phone number is required.'
    }
    if (step === 1) {
      if (!form.username.trim())       e.username = 'Username is required.'
      if (form.password.length < 8)    e.password = 'Password must be at least 8 characters.'
      if (form.password !== form.confirm_password) e.confirm_password = 'Passwords do not match.'
    }
    if (step === 2) {
      if (!form.role)              e.role = 'Select a role.'
      if (!form.staff_id.trim())   e.staff_id = 'Staff ID is required.'
      if (!form.department)        e.department = 'Select a department.'
    }
    if (step === 3) {
      if (!form.warehouse_location) e.warehouse_location = 'Select a warehouse.'
      if (!form.assigned_zone)      e.assigned_zone = 'Select a zone.'
      if (!form.shift)              e.shift = 'Select a shift.'
    }
    if (step === 4) {
      if (!form.reg_code.trim()) e.reg_code = 'Registration code is required.'
      else {
        const { valid, reason } = await validateCode(form.reg_code, form.role)
        if (!valid) e.reg_code = reason
      }
      if (!form.terms)        e.terms = 'You must accept the terms.'
      if (!form.privacy)      e.privacy = 'You must accept the privacy policy.'
      if (!form.confirm_info) e.confirm_info = 'Please confirm your information is accurate.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = async () => { if (await validateStep()) setStep(s => Math.min(s + 1, STEPS.length - 1)) }
  const back = () => { setErrors({}); setStep(s => Math.max(s - 1, 0)) }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!(await validateStep())) return
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1200))
    await submitRegistration({ ...form, photo, access_level: ACCESS_LEVELS[form.role] || 'Standard Employee Access', account_status: 'Pending Approval' })
    setSubmitting(false)
    setSubmitted(true)
  }

  /* Success screen */
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: BG, fontFamily: 'Nunito, sans-serif' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          className="p-10 rounded-[2rem] text-center max-w-sm w-full"
          style={{ background: BG, boxShadow: CARD_SH }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 8px 30px rgba(34,197,94,0.4)' }}
          >
            <MIcon name="check_circle" size={40} style={{ color: '#fff' }} />
          </div>
          <h2 className="text-xl font-black mb-2" style={{ color: T_PRI }}>Request Submitted!</h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: T_MUT }}>
            Account request submitted.<br />
            <span style={{ color: '#22c55e', fontWeight: 700 }}>Please wait for admin approval.</span><br />
            You'll be notified once activated.
          </p>
          <NeuButton accent onClick={() => navigate('/login')}>
            <MIcon name="login" size={18} style={{ color: '#fff' }} />
            Back to Login
          </NeuButton>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: BG, fontFamily: 'Nunito, sans-serif' }}>

      {/* Left panel */}
      <div className="w-[400px] flex-shrink-0" style={{ background: BG }}>
        <LeftPanel />
      </div>

      {/* Right panel */}
      <div className="flex-1 overflow-y-auto flex items-start justify-center p-8">
        <div className="w-full max-w-lg py-6">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-black" style={{ color: T_PRI }}>Create Your Account</h1>
            <p className="text-sm mt-1" style={{ color: T_MUT }}>Register to manage grocery stock and warehouse operations.</p>
          </div>

          {/* Step progress */}
          <div className="flex items-center gap-2 mb-8">
            {STEPS.map((s, i) => (
              <div key={s.label} className="flex items-center gap-2 flex-1 min-w-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  style={{
                    background: i < step ? 'linear-gradient(135deg, #22c55e, #16a34a)' : BG,
                    boxShadow: i < step
                      ? '0 4px 14px rgba(34,197,94,0.4)'
                      : i === step
                        ? `4px 4px 10px ${SH_DARK}, -4px -4px 10px ${SH_LIGHT}`
                        : IN_SH,
                    border: i === step ? '2px solid #22c55e' : '2px solid transparent',
                  }}
                >
                  {i < step
                    ? <MIcon name="check" size={15} style={{ color: '#fff' }} />
                    : <MIcon name={s.icon} size={15} style={{ color: i === step ? '#22c55e' : T_MUT }} />
                  }
                </div>
                <span className="text-xs font-bold truncate hidden sm:block" style={{ color: i === step ? T_PRI : T_MUT }}>{s.label}</span>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-0.5 mx-1 rounded-full transition-all duration-300"
                    style={{ background: i < step ? '#22c55e' : SH_LIGHT, opacity: i < step ? 0.8 : 0.5 }} />
                )}
              </div>
            ))}
          </div>

          {/* Step card */}
          <div
            className="rounded-[1.5rem] p-6 mb-6"
            style={{ background: BG, boxShadow: CARD_SH }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 4px 14px rgba(34,197,94,0.35)' }}
                  >
                    <MIcon name={STEPS[step].icon} size={20} style={{ color: '#fff' }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black" style={{ color: T_PRI }}>
                      Step {step + 1} — {STEPS[step].label}
                    </h3>
                    <p className="text-xs" style={{ color: T_MUT }}>
                      {step + 1} of {STEPS.length}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Step 0 — Personal */}
                  {step === 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="relative">
                          <div
                            className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center"
                            style={{ background: BG, boxShadow: IN_SH }}
                          >
                            {photo
                              ? <img src={photo} alt="profile" className="w-full h-full object-cover" />
                              : <MIcon name="person" size={28} style={{ color: T_MUT }} />}
                          </div>
                          <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 2px 8px rgba(34,197,94,0.3)' }}
                          >
                            <MIcon name="camera_alt" size={13} style={{ color: '#fff' }} />
                          </button>
                          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                        </div>
                        <div>
                          <p className="text-sm font-bold" style={{ color: T_PRI }}>Profile Photo</p>
                          <button type="button" onClick={() => fileRef.current?.click()} className="text-xs font-semibold" style={{ color: '#22c55e' }}>
                            Upload (optional)
                          </button>
                        </div>
                      </div>
                      <NeuInput icon="person"  type="text"  placeholder="Full Name *"     value={form.full_name} onChange={setE('full_name')} error={errors.full_name} />
                      <NeuInput icon="email"   type="email" placeholder="Email Address *" value={form.email}     onChange={setE('email')}     error={errors.email} />
                      <NeuInput icon="phone"   type="text"  placeholder="Phone Number *"  value={form.phone}     onChange={setE('phone')}     error={errors.phone} />
                    </div>
                  )}

                  {/* Step 1 — Login */}
                  {step === 1 && (
                    <div className="space-y-4">
                      <NeuInput icon="alternate_email" placeholder="Username *" value={form.username} onChange={setE('username')} error={errors.username} />
                      <div>
                        <NeuInput
                          icon="lock" type={showPass ? 'text' : 'password'}
                          placeholder="Password (min. 8 chars) *"
                          value={form.password} onChange={setE('password')} error={errors.password}
                          right={
                            <button type="button" onClick={() => setShowPass(v => !v)} style={{ color: T_MUT }}>
                              <MIcon name={showPass ? 'visibility_off' : 'visibility'} size={18} />
                            </button>
                          }
                        />
                        {form.password && (
                          <div className="flex items-center gap-2 mt-2 px-1">
                            <div className="flex gap-1 flex-1">
                              {[1,2,3,4].map(i => (
                                <div key={i} className="h-1.5 flex-1 rounded-full transition-all duration-300"
                                  style={{ background: i <= strength.score ? strength.color : '#2d3452' }} />
                              ))}
                            </div>
                            <span className="text-xs font-bold" style={{ color: strength.color }}>{strength.label}</span>
                          </div>
                        )}
                      </div>
                      <NeuInput
                        icon="lock_reset" type={showConfirm ? 'text' : 'password'}
                        placeholder="Confirm Password *"
                        value={form.confirm_password} onChange={setE('confirm_password')} error={errors.confirm_password}
                        right={
                          <button type="button" onClick={() => setShowConfirm(v => !v)} style={{ color: T_MUT }}>
                            <MIcon name={showConfirm ? 'visibility_off' : 'visibility'} size={18} />
                          </button>
                        }
                      />
                      {form.confirm_password && form.password === form.confirm_password && (
                        <p className="flex items-center gap-1 text-xs font-semibold px-1" style={{ color: '#22c55e' }}>
                          <MIcon name="check_circle" size={13} style={{ color: '#22c55e' }} /> Passwords match
                        </p>
                      )}
                    </div>
                  )}

                  {/* Step 2 — Role */}
                  {step === 2 && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-bold mb-2" style={{ color: T_MUT }}>Role *</p>
                        <div
                          className="flex gap-2 p-2 rounded-2xl"
                          style={{ background: BG, boxShadow: IN_SH }}
                        >
                          {ROLES.map(r => {
                            const isActive = form.role === r
                            return (
                              <button
                                key={r}
                                type="button"
                                onClick={() => set('role', r)}
                                className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200"
                                style={{
                                  background: isActive ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'transparent',
                                  color: isActive ? '#fff' : T_MUT,
                                  boxShadow: isActive ? '0 4px 14px rgba(34,197,94,0.35)' : 'none',
                                }}
                              >
                                {r}
                              </button>
                            )
                          })}
                        </div>
                        {errors.role && <p className="text-xs mt-1 flex items-center gap-1" style={{ color: '#ef4444' }}><AlertCircle size={10} />{errors.role}</p>}
                      </div>
                      <NeuInput icon="badge" placeholder="Staff / Employee ID *" value={form.staff_id} onChange={setE('staff_id')} error={errors.staff_id} />
                      <NeuSelect icon="corporate_fare" value={form.department} onChange={setE('department')} error={errors.department}>
                        <option value="" style={{ background: '#1a1f2e' }}>Select department…</option>
                        {DEPARTMENTS.map(d => <option key={d} style={{ background: '#1a1f2e' }}>{d}</option>)}
                      </NeuSelect>
                      <div className="p-3 rounded-2xl text-xs" style={{ background: BG, boxShadow: IN_SH, color: T_MUT }}>
                        Access level: <span style={{ color: '#22c55e', fontWeight: 700 }}>{ACCESS_LEVELS[form.role]}</span>
                      </div>
                    </div>
                  )}

                  {/* Step 3 — Warehouse */}
                  {step === 3 && (
                    <div className="space-y-4">
                      <NeuSelect
                        icon="warehouse"
                        value={form.warehouse_location}
                        onChange={e => { set('warehouse_location', e.target.value); set('warehouse_code', WAREHOUSE_CODES[e.target.value] || '') }}
                        error={errors.warehouse_location}
                      >
                        <option value="" style={{ background: '#1a1f2e' }}>Select warehouse…</option>
                        {WAREHOUSES.map(w => <option key={w} style={{ background: '#1a1f2e' }}>{w}</option>)}
                      </NeuSelect>
                      <NeuInput icon="qr_code" placeholder="Warehouse Code (auto-filled)" value={form.warehouse_code} readOnly />
                      <NeuSelect icon="access_time" value={form.shift} onChange={setE('shift')} error={errors.shift}>
                        <option value="" style={{ background: '#1a1f2e' }}>Select shift…</option>
                        {SHIFTS.map(s => <option key={s} style={{ background: '#1a1f2e' }}>{s}</option>)}
                      </NeuSelect>
                      <NeuSelect icon="location_on" value={form.assigned_zone} onChange={setE('assigned_zone')} error={errors.assigned_zone}>
                        <option value="" style={{ background: '#1a1f2e' }}>Select zone / aisle…</option>
                        {ZONES.map(z => <option key={z} style={{ background: '#1a1f2e' }}>{z}</option>)}
                      </NeuSelect>
                    </div>
                  )}

                  {/* Step 4 — Security */}
                  {step === 4 && (
                    <div className="space-y-4">
                      <div>
                        <NeuInput
                          icon="key"
                          placeholder="REGISTRATION CODE (XXXX-XXXX)"
                          value={form.reg_code}
                          onChange={e => set('reg_code', e.target.value.toUpperCase())}
                          error={errors.reg_code}
                        />
                        <p className="text-xs mt-1 px-1" style={{ color: T_MUT }}>Obtain this code from your system administrator.</p>
                      </div>

                      <div className="space-y-3">
                        <NeuCheckbox
                          checked={form.twofa}
                          onChange={v => set('twofa', v)}
                          label="Enable Two-Factor Authentication (recommended)"
                        />
                        <NeuCheckbox
                          checked={form.terms}
                          onChange={v => set('terms', v)}
                          label={<span>I agree to the <span style={{ color: '#22c55e', fontWeight: 700 }}>Terms and Conditions</span></span>}
                          error={errors.terms}
                        />
                        <NeuCheckbox
                          checked={form.privacy}
                          onChange={v => set('privacy', v)}
                          label={<span>I accept the <span style={{ color: '#22c55e', fontWeight: 700 }}>Privacy Policy</span></span>}
                          error={errors.privacy}
                        />
                        <NeuCheckbox
                          checked={form.confirm_info}
                          onChange={v => set('confirm_info', v)}
                          label="I confirm all information provided is accurate."
                          error={errors.confirm_info}
                        />
                      </div>

                      <div
                        className="flex items-center gap-3 p-3 rounded-2xl"
                        style={{ background: BG, boxShadow: IN_SH }}
                      >
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center"
                          style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)' }}
                        >
                          <MIcon name="verified_user" size={18} style={{ color: '#22c55e' }} />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold" style={{ color: T_PRI }}>Verified Human</p>
                          <p className="text-xs" style={{ color: T_MUT }}>Security verification passed</p>
                        </div>
                        <MIcon name="check_circle" size={18} style={{ color: '#22c55e' }} />
                      </div>
                    </div>
                  )}
                </form>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <NeuButton type="button" onClick={back} disabled={step === 0}>
              <MIcon name="arrow_back" size={18} style={{ color: T_SUB }} /> Back
            </NeuButton>

            {/* Dot progress */}
            <div className="flex items-center gap-1.5">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === step ? 20 : 8,
                    height: 8,
                    background: i <= step ? '#22c55e' : SH_LIGHT,
                    opacity: i < step ? 0.6 : 1,
                  }}
                />
              ))}
            </div>

            {step < STEPS.length - 1 ? (
              <NeuButton type="button" onClick={next} accent>
                Next <MIcon name="arrow_forward" size={18} style={{ color: '#fff' }} />
              </NeuButton>
            ) : (
              <NeuButton type="button" onClick={handleSubmit} disabled={submitting} accent>
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting…
                  </span>
                ) : (
                  <><MIcon name="how_to_reg" size={18} style={{ color: '#fff' }} /> Create Account</>
                )}
              </NeuButton>
            )}
          </div>

          <div className="mt-5 text-center">
            <p className="text-sm" style={{ color: T_MUT }}>
              Already have an account?{' '}
              <Link to="/login" className="font-bold transition-colors" style={{ color: '#22c55e' }}>Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
