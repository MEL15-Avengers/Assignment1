import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Moon, CheckCircle } from 'lucide-react'

export default function ResetPassword() {
  const [form, setForm] = useState({ email: '', password: '', confirm: '' })
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    if (!form.email || !form.password || !form.confirm) { setError('All fields required.'); return }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    setDone(true)
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-brand flex items-center justify-center mb-4">
            <Moon size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          <p className="text-sm text-gray-500 mt-1">Set a new password for your account</p>
        </div>

        <div className="card p-6">
          {done ? (
            <div className="flex flex-col items-center py-4 text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/15 flex items-center justify-center">
                <CheckCircle size={24} className="text-green-400" />
              </div>
              <div>
                <p className="font-semibold text-white">Password Updated</p>
                <p className="text-sm text-gray-500 mt-1">Your password has been reset successfully.</p>
              </div>
              <Link to="/login" className="btn-primary">Back to Sign In</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5 text-sm text-red-400">{error}</div>}
              <div>
                <label className="label">Email Address</label>
                <input type="email" className="input" placeholder="you@example.com" value={form.email} onChange={set('email')} />
              </div>
              <div>
                <label className="label">New Password</label>
                <input type="password" className="input" placeholder="New password" value={form.password} onChange={set('password')} />
              </div>
              <div>
                <label className="label">Confirm New Password</label>
                <input type="password" className="input" placeholder="Repeat new password" value={form.confirm} onChange={set('confirm')} />
              </div>
              <button type="submit" className="btn-primary w-full justify-center py-2.5">Reset Password</button>
              <p className="text-center text-sm text-gray-500">
                <Link to="/login" className="text-brand hover:text-brand-light transition-colors">Back to Sign In</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
