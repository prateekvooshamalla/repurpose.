'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { CheckCircle2, Crown, Zap, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const FEATURES = [
  '60 generations per month',
  'All 4 content formats',
  'Brand voice settings',
  'Tone & audience targeting',
  'Export TXT / JSON / MD',
  'Priority support',
  'New features first',
]

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void }
  }
}

interface RazorpayOptions {
  key: string
  subscription_id: string
  name: string
  description: string
  image: string
  handler: (response: { razorpay_payment_id: string; razorpay_subscription_id: string }) => void
  prefill: { name: string; email: string; contact: string }
  theme: { color: string }
  notes: { user_id: string }
}

export default function BillingPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubscribe = async () => {
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      // Get user profile
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user!.id)
        .single()

      // Create Razorpay subscription
      const res = await fetch('/api/billing', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to initialize payment')

      // Load Razorpay script
      if (!window.Razorpay) {
        await new Promise<void>((resolve) => {
          const script = document.createElement('script')
          script.src = 'https://checkout.razorpay.com/v1/checkout.js'
          script.onload = () => resolve()
          document.body.appendChild(script)
        })
      }

      const options: RazorpayOptions = {
        key: data.key_id,
        subscription_id: data.subscription_id,
        name: 'RepurposeAI',
        description: 'Pro Plan — ₹799/month',
        image: '/icon.png',
        handler: async (response) => {
          // Payment successful - webhook will update DB
          // Optionally verify here
          await supabase.from('subscriptions').upsert({
            user_id: user!.id,
            status: 'active',
            plan: 'pro',
            razorpay_subscription_id: response.razorpay_subscription_id,
            razorpay_payment_id: response.razorpay_payment_id,
          })
          window.location.href = '/app?subscribed=true'
        },
        prefill: {
          name: profile?.name || '',
          email: profile?.email || '',
          contact: '',
        },
        theme: { color: '#7C6DFA' },
        notes: { user_id: user!.id },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-md mx-auto">
        <Link href="/app" className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </Link>

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand/20 flex items-center justify-center mx-auto mb-4">
            <Crown className="w-6 h-6 text-accent-amber" />
          </div>
          <h1 className="font-sans text-2xl font-bold text-white mb-2">Upgrade to Pro</h1>
          <p className="text-white/40 text-sm">Unlock 60 generations/month + all features</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 border border-brand/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand/8 blur-3xl rounded-full pointer-events-none" />

          <div className="relative">
            <div className="flex items-end gap-1 mb-6">
              <span className="font-sans text-5xl font-bold text-white">₹799</span>
              <span className="text-white/40 mb-2">/month</span>
            </div>

            <ul className="space-y-3 mb-8">
              {FEATURES.map(f => (
                <li key={f} className="flex items-center gap-3 text-white/70 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-accent-green shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 rounded-xl px-4 py-3 mb-4">
                {error}
              </div>
            )}

            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-brand hover:bg-brand-light text-white font-semibold transition-all disabled:opacity-60"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Subscribe — ₹799/month
                </>
              )}
            </button>

            <p className="text-white/25 text-xs text-center mt-3">
              Cancel anytime. Powered by Razorpay.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
