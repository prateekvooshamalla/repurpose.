'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, CheckCircle2, Sparkles, Play, Twitter, Linkedin, Layout, Film } from 'lucide-react'

const FEATURES = [
  { icon: Film, label: '3 Reel Scripts', desc: 'Hook + beats + B-roll + captions' },
  { icon: Twitter, label: 'Tweet Thread', desc: '10 high-engagement tweets' },
  { icon: Linkedin, label: '2 LinkedIn Posts', desc: 'Short + long form variants' },
  { icon: Layout, label: 'Carousel', desc: '8 slides ready to design' },
]

const PLATFORMS = ['Reels', 'TikTok', 'Twitter', 'LinkedIn', 'Instagram', 'YouTube Shorts']

const PRICING_FEATURES = [
  '60 generations per month',
  'All 4 content types',
  'Brand voice settings',
  'Tone & audience targeting',
  'Export to TXT / JSON',
  'Priority support',
]

const EXAMPLES = [
  { platform: 'Reel Hook', color: 'from-purple-500/20 to-pink-500/10', text: '"Nobody told me building in public would ACTUALLY get me clients. Here\'s what happened in 90 days..."' },
  { platform: 'Tweet Thread', color: 'from-sky-500/20 to-blue-500/10', text: '"I went from 0 → ₹4L/mo with one simple framework. Thread 🧵\n\n1/ Most creators fail because..."' },
  { platform: 'LinkedIn', color: 'from-blue-600/20 to-indigo-500/10', text: '"I almost quit coaching last year.\n\nNot because of clients. Not because of money.\n\nBecause I forgot why I started..."' },
]

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#080810]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent-green/5 blur-[100px] rounded-full" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-sans font-bold text-white text-lg">RepurposeAI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="#pricing" className="text-white/50 hover:text-white text-sm transition-colors">Pricing</Link>
          <Link href="/login" className="px-4 py-2 rounded-xl bg-brand hover:bg-brand-light text-white text-sm font-medium transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-brand/30 text-brand-light text-xs font-medium mb-8">
            <Zap className="w-3 h-3" />
            AI-Powered Content Engine
          </div>

          <h1 className="font-sans text-5xl sm:text-7xl font-bold text-white leading-[1.1] mb-6">
            One transcript.{' '}
            <span className="gradient-text">Everything</span>
            {' '}you need.
          </h1>

          <p className="text-white/50 text-xl max-w-2xl mx-auto mb-10 font-light">
            Paste your transcript. Get Reel scripts, Tweet threads, LinkedIn posts, and Carousels — in under 30 seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="group flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-brand hover:bg-brand-light text-white font-semibold transition-all glow-brand"
            >
              Start Repurposing Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center gap-2 text-white/40 text-sm">
              <CheckCircle2 className="w-4 h-4 text-accent-green" />
              No credit card required to start
            </div>
          </div>
        </motion.div>

        {/* Platform badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2 mt-16"
        >
          {PLATFORMS.map((p) => (
            <span key={p} className="px-3 py-1 rounded-full glass text-white/50 text-xs border border-white/5">
              {p}
            </span>
          ))}
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-5 text-center hover:border-brand/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-brand/15 flex items-center justify-center mx-auto mb-3">
                  <f.icon className="w-5 h-5 text-brand-light" />
                </div>
                <div className="font-sans font-semibold text-white text-sm mb-1">{f.label}</div>
                <div className="text-white/40 text-xs">{f.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Outputs */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-sans text-3xl font-bold text-white text-center mb-3">
            See what gets generated
          </h2>
          <p className="text-white/40 text-center mb-12">Real outputs from a single coaching session transcript</p>

          <div className="grid sm:grid-cols-3 gap-4">
            {EXAMPLES.map((ex, i) => (
              <motion.div
                key={ex.platform}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`rounded-2xl p-6 bg-gradient-to-br ${ex.color} border border-white/8 glass`}
              >
                <div className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">{ex.platform}</div>
                <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line font-light italic">
                  {ex.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-sans text-3xl font-bold text-white mb-12">3 steps. 30 seconds.</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { n: '01', title: 'Paste transcript', desc: 'Drop your video transcript, podcast notes, or any text content' },
              { n: '02', title: 'Set your brand', desc: 'Choose tone, audience, and your preferred CTA style' },
              { n: '03', title: 'Get everything', desc: 'Reels, tweets, LinkedIn posts, carousels — all in one click' },
            ].map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="text-5xl font-sans font-bold text-white/5 mb-3">{step.n}</div>
                <h3 className="font-sans font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-white/40 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-md mx-auto">
          <h2 className="font-sans text-3xl font-bold text-white text-center mb-4">Simple pricing</h2>
          <p className="text-white/40 text-center mb-10">One plan. Everything included.</p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 border border-brand/25 glow-brand relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand/10 blur-3xl rounded-full" />
            <div className="relative">
              <div className="inline-block px-3 py-1 rounded-full bg-brand/20 text-brand-light text-xs font-semibold mb-4">
                PRO PLAN
              </div>
              <div className="flex items-end gap-1 mb-1">
                <span className="font-sans text-5xl font-bold text-white">₹799</span>
                <span className="text-white/40 mb-2">/month</span>
              </div>
              <p className="text-white/40 text-sm mb-8">Billed monthly. Cancel anytime.</p>

              <ul className="space-y-3 mb-8">
                {PRICING_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-white/70 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-accent-green shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/login"
                className="block w-full text-center py-3.5 rounded-2xl bg-brand hover:bg-brand-light text-white font-semibold transition-colors"
              >
                Start Free → Upgrade Anytime
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-white/5 text-center">
        <p className="text-white/30 text-sm">
          © 2024 RepurposeAI. Made for creators who don&apos;t have time to waste.
        </p>
      </footer>
    </main>
  )
}
