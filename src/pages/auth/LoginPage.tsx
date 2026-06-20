import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button, Input } from '@/components/ui'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  function handleLogin() {
    if (!phone.trim() || !password.trim()) {
      setError('Please enter both phone number and password')
      return
    }
    if (phone.replace(/\D/g, '').length !== 10) {
      setError('Phone number must be exactly 10 digits')
      return
    }
    setError('')
    navigate('/app/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-12">
          <img src="/logo.png" alt="Vin Power" className="h-20 w-20 object-contain mb-4" />
          <h1 className="text-2xl font-bold text-text-heading">VIN POWER</h1>
        </div>

        {/* Login card */}
        <div className="bg-card border border-border rounded-radius-card p-6 shadow-card">
          <h2 className="text-xl font-semibold text-text-heading text-center">Welcome Back</h2>
          <p className="text-sm text-text-muted text-center mt-1">Please sign in to continue</p>

          {error && (
            <p className="text-sm text-danger bg-danger/10 rounded-radius-button px-3 py-2 mt-4">{error}</p>
          )}

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-medium text-text-muted mb-1.5 block">Phone Number</label>
              <Input
                placeholder="Enter phone number"
                value={phone}
                onChange={e => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setError('') }}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-text-muted mb-1.5 block">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-heading transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <Button onClick={handleLogin} className="w-full">LOGIN</Button>
            <div className="text-center">
              <button className="text-xs text-text-muted hover:text-text-heading transition-colors cursor-pointer">
                Forgot Password?
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
