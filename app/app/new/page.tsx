'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Upload, FileText, Sparkles, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const TONES = [
  { id: 'educational', label: 'Educational', desc: 'Informative & clear' },
  { id: 'bold', label: 'Bold', desc: 'Punchy & direct' },
  { id: 'calm', label: 'Calm', desc: 'Measured & thoughtful' },
  { id: 'funny', label: 'Funny', desc: 'Witty & playful' },
]

const AUDIENCES = [
  { id: 'creators', label: 'Creators' },
  { id: 'coaches', label: 'Coaches' },
  { id: 'founders', label: 'Founders' },
]

const CTA_STYLES = [
  'Comment \'GUIDE\' for details',
  'DM me for the free resource',
  'Link in bio',
  'Save this for later',
  'Share with someone who needs this',
]

const PLATFORMS = [
  { id: 'reels', label: 'Reel Scripts', desc: '3 scripts' },
  { id: 'tweets', label: 'Tweet Thread', desc: '10 tweets' },
  { id: 'linkedin', label: 'LinkedIn Posts', desc: '2 variants' },
  { id: 'carousel', label: 'Carousel', desc: '8 slides' },
]

export default function NewProjectPage() {
  const router = useRouter()
  const supabase = createClient()
  const [title, setTitle] = useState('')
  const [transcript, setTranscript] = useState('')
  const [tone, setTone] = useState('bold')
  const [audience, setAudience] = useState('creators')
  const [ctaStyle, setCtaStyle] = useState(CTA_STYLES[0])
  const [platforms, setPlatforms] = useState<string[]>(['reels', 'tweets', 'linkedin', 'carousel'])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const togglePlatform = (id: string) => {
    setPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const handleSubmit = async () => {
    if (!transcript.trim()) {
      setError('Please add your transcript')
      return
    }
    if (!title.trim()) {
      setError('Please add a project title')
      return
    }
    if (platforms.length === 0) {
      setError('Select at least one platform')
      return
    }
    setError('')
    setLoading(true)

    try {
      // Create project
      const projectRes = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, transcript_text: transcript }),
      })
      const { project } = await projectRes.json()
      if (!projectRes.ok) throw new Error('Failed to create project')

      // Start generation
      const genRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: project.id,
          tone,
          audience,
          cta_style: ctaStyle,
          platforms,
        }),
      })
      if (!genRes.ok) {
        const data = await genRes.json()
        throw new Error(data.error || 'Generation failed')
      }

      router.push(`/app/project/${project.id}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="font-sans text-2xl font-bold text-white">New Project</h1>
          <p className="text-white/40 text-sm mt-1">Paste your transcript and configure your content</p>
        </div>

        <div className="space-y-5">
          {/* Title */}
          <div className="glass rounded-2xl p-5">
            <label className="text-white/60 text-xs font-medium uppercase tracking-wide block mb-3">
              Project Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. 'My Productivity Framework Podcast Ep 12'"
              className="w-full bg-transparent text-white placeholder-white/20 text-sm outline-none"
            />
          </div>

          {/* Transcript */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <label className="text-white/60 text-xs font-medium uppercase tracking-wide">
                Transcript
              </label>
              <div className="flex items-center gap-1.5 text-white/30 text-xs">
                <FileText className="w-3 h-3" />
                {transcript.split(' ').filter(Boolean).length} words
              </div>
            </div>
            <textarea
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
              placeholder="Paste your transcript, podcast notes, video script, or any content you want to repurpose..."
              rows={10}
              className="w-full bg-transparent text-white/80 placeholder-white/20 text-sm outline-none resize-none leading-relaxed"
            />
            {transcript.length === 0 && (
              <div className="border-t border-white/5 pt-3 mt-3">
                <p className="text-white/25 text-xs">Tip: Works best with 300–3000 words of content</p>
              </div>
            )}
          </div>

          {/* Tone */}
          <div className="glass rounded-2xl p-5">
            <label className="text-white/60 text-xs font-medium uppercase tracking-wide block mb-3">Tone</label>
            <div className="grid grid-cols-4 gap-2">
              {TONES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={cn(
                    'rounded-xl p-3 text-center transition-all border',
                    tone === t.id
                      ? 'bg-brand/20 border-brand/50 text-white'
                      : 'border-white/5 text-white/40 hover:border-white/15 hover:text-white/70'
                  )}
                >
                  <div className="text-sm font-medium">{t.label}</div>
                  <div className="text-xs opacity-60 mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Audience + CTA */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-2xl p-5">
              <label className="text-white/60 text-xs font-medium uppercase tracking-wide block mb-3">Audience</label>
              <div className="space-y-2">
                {AUDIENCES.map(a => (
                  <button
                    key={a.id}
                    onClick={() => setAudience(a.id)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg text-sm transition-all',
                      audience === a.id
                        ? 'bg-brand/20 text-white'
                        : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                    )}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-5">
              <label className="text-white/60 text-xs font-medium uppercase tracking-wide block mb-3">CTA Style</label>
              <div className="space-y-2">
                {CTA_STYLES.map(cta => (
                  <button
                    key={cta}
                    onClick={() => setCtaStyle(cta)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg text-xs transition-all',
                      ctaStyle === cta
                        ? 'bg-brand/20 text-white'
                        : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                    )}
                  >
                    {cta}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Platforms */}
          <div className="glass rounded-2xl p-5">
            <label className="text-white/60 text-xs font-medium uppercase tracking-wide block mb-3">Generate For</label>
            <div className="grid grid-cols-4 gap-2">
              {PLATFORMS.map(p => (
                <button
                  key={p.id}
                  onClick={() => togglePlatform(p.id)}
                  className={cn(
                    'rounded-xl p-3 text-center transition-all border',
                    platforms.includes(p.id)
                      ? 'bg-brand/20 border-brand/50 text-white'
                      : 'border-white/5 text-white/40 hover:border-white/15 hover:text-white/70'
                  )}
                >
                  <div className="text-sm font-medium">{p.label}</div>
                  <div className="text-xs opacity-60 mt-0.5">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-brand hover:bg-brand-light text-white font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating your content...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Content (1 credit)
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
