'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Sparkles, Chrome } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    setLoading(true)
    setMessage(null)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    setLoading(false)
  }

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setMessage('Enter your email and password.')
      return
    }

    setLoading(true)
    setMessage(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setMessage(error.message)
    }
    setLoading(false)
  }

  const handleEmailSignup = async () => {
    if (!email || !password) {
      setMessage('Enter your email and password.')
      return
    }

    setLoading(true)
    setMessage(null)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Check your email to confirm your account.')
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-[#080810]" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand/12 blur-[100px] rounded-full -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-sans text-2xl font-bold text-white mb-2">Welcome</h1>
          <p className="text-white/40 text-sm">Sign in or create an account</p>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => setMode('login')}
              className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === 'login'
                  ? 'bg-white/12 text-white border border-white/20'
                  : 'bg-transparent text-white/50 border border-white/10'
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === 'signup'
                  ? 'bg-white/12 text-white border border-white/20'
                  : 'bg-transparent text-white/50 border border-white/10'
              }`}
            >
              Sign up
            </button>
          </div>

          <div className="space-y-3">
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="Email address"
              className="w-full px-3.5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-brand/50"
            />
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              placeholder="Password"
              className="w-full px-3.5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-brand/50"
            />
            <button
              onClick={mode === 'login' ? handleEmailLogin : handleEmailSignup}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-brand text-white font-medium transition-all disabled:opacity-50"
            >
              {loading
                ? 'Working...'
                : mode === 'login'
                  ? 'Continue with Email'
                  : 'Create Account'}
            </button>
            {message ? (
              <p className="text-xs text-white/60 text-center">{message}</p>
            ) : null}
          </div>

          <div className="flex items-center gap-3 my-5">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[11px] uppercase tracking-widest text-white/35">or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-white/8 hover:bg-white/12 border border-white/10 text-white font-medium transition-all disabled:opacity-50"
          >
            <Chrome className="w-5 h-5" />
            {loading ? 'Connecting...' : 'Continue with Google'}
          </button>

          <p className="text-white/25 text-xs text-center mt-4">
            By signing in, you agree to our Terms and Privacy Policy
          </p>
        </div>
      </motion.div>
    </main>
  )
}
