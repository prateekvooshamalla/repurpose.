'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Download, Film, Twitter, Linkedin, LayoutGrid, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Generation, ReelScript, ReelsOutput, TweetsOutput, LinkedInOutput, CarouselOutput } from '@/types'

const TABS = [
  { id: 'reels', label: 'Reels', icon: Film },
  { id: 'tweets', label: 'Tweets', icon: Twitter },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { id: 'carousel', label: 'Carousel', icon: LayoutGrid },
]

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/6 hover:bg-white/10 text-white/60 hover:text-white text-xs transition-all"
    >
      {copied ? <Check className="w-3 h-3 text-accent-green" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

function ReelCard({ script, index }: { script: ReelScript; index: number }) {
  const fullText = [
    `HOOK: ${script.hook}`,
    `\nBEATS:\n${script.beats.map((b, i) => `${i + 1}. ${b}`).join('\n')}`,
    `\nB-ROLL:\n${script.broll.map((b, i) => `${i + 1}. ${b}`).join('\n')}`,
    `\nON-SCREEN TEXT:\n${script.on_screen_text.map((t, i) => `${i + 1}. ${t}`).join('\n')}`,
    `\nCAPTION:\n${script.caption}`,
    `\nHASHTAGS: ${script.hashtags.join(' ')}`,
  ].join('')

  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-brand/30 flex items-center justify-center text-brand-light text-xs font-bold">
            {index + 1}
          </div>
          <span className="text-white/60 text-xs font-medium uppercase tracking-wide">Reel Script</span>
        </div>
        <CopyButton text={fullText} />
      </div>

      <div className="p-3 rounded-xl bg-white/4 border border-white/6">
        <div className="text-xs text-white/40 uppercase tracking-wide mb-1">Hook</div>
        <div className="text-white font-semibold text-sm leading-relaxed">"{script.hook}"</div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-xs text-white/40 uppercase tracking-wide mb-2">Beats</div>
          <div className="space-y-1.5">
            {script.beats.map((b, i) => (
              <div key={i} className="flex gap-2 text-xs text-white/70">
                <span className="text-brand-light shrink-0">{i + 1}.</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs text-white/40 uppercase tracking-wide mb-2">B-Roll Suggestions</div>
          <div className="space-y-1.5">
            {script.broll.map((b, i) => (
              <div key={i} className="flex gap-2 text-xs text-white/60">
                <span className="text-accent-green shrink-0">▸</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="text-xs text-white/40 uppercase tracking-wide mb-2">On-Screen Text</div>
        <div className="flex flex-wrap gap-2">
          {script.on_screen_text.map((t, i) => (
            <span key={i} className="px-2 py-1 rounded-lg bg-brand/15 text-brand-light text-xs">{t}</span>
          ))}
        </div>
      </div>

      <div className="border-t border-white/6 pt-3">
        <div className="text-xs text-white/40 uppercase tracking-wide mb-1">Caption</div>
        <p className="text-white/70 text-xs leading-relaxed">{script.caption}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {script.hashtags.map((h, i) => (
            <span key={i} className="text-brand/70 text-xs">{h}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ProjectResults({
  generation,
}: {
  project: { title: string }
  generation: Generation | null
}) {
  const [activeTab, setActiveTab] = useState('reels')

  if (!generation || generation.status === 'queued') {
    return (
      <div className="glass rounded-3xl p-16 text-center">
        <Loader2 className="w-8 h-8 text-brand-light animate-spin mx-auto mb-4" />
        <h2 className="font-sans text-lg font-bold text-white mb-2">Generating your content...</h2>
        <p className="text-white/40 text-sm">This usually takes 15–30 seconds. Refresh to see results.</p>
      </div>
    )
  }

  if (generation.status === 'failed') {
    return (
      <div className="glass rounded-3xl p-16 text-center">
        <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-4" />
        <h2 className="font-sans text-lg font-bold text-white mb-2">Generation failed</h2>
        <p className="text-white/40 text-sm">Please try again from the dashboard.</p>
      </div>
    )
  }

  const outputs = generation.outputs || []
  const getOutput = (type: string) => outputs.find(o => o.type === type)

  const downloadAll = () => {
    const content = outputs.map(o => {
      const json = JSON.stringify(o.content_json, null, 2)
      return `=== ${o.type.toUpperCase()} ===\n${json}`
    }).join('\n\n')
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `repurpose-outputs.txt`
    a.click()
  }

  const availableTabs = TABS.filter(t => getOutput(t.id))

  return (
    <div>
      {/* Tab bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1 glass rounded-xl p-1">
          {availableTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                activeTab === tab.id
                  ? 'bg-brand text-white'
                  : 'text-white/50 hover:text-white'
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={downloadAll}
          className="flex items-center gap-2 px-4 py-2 rounded-xl glass glass-hover text-white/60 hover:text-white text-sm transition-all"
        >
          <Download className="w-4 h-4" />
          Export All
        </button>
      </div>

      {/* Tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Reels */}
        {activeTab === 'reels' && (() => {
          const output = getOutput('reels')
          if (!output) return null
          const data = output.content_json as ReelsOutput
          return (
            <div className="space-y-4">
              {data.scripts?.map((script, i) => (
                <ReelCard key={i} script={script} index={i} />
              ))}
            </div>
          )
        })()}

        {/* Tweets */}
        {activeTab === 'tweets' && (() => {
          const output = getOutput('tweets')
          if (!output) return null
          const data = output.content_json as TweetsOutput
          const fullThread = data.tweets?.join('\n\n')
          return (
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <span className="text-white font-sans font-semibold">Tweet Thread ({data.tweets?.length} tweets)</span>
                <CopyButton text={fullThread || ''} />
              </div>
              <div className="space-y-3">
                {data.tweets?.map((tweet, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/4 group">
                    <div className="w-6 h-6 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 text-xs shrink-0 font-bold mt-0.5">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-white/80 text-sm leading-relaxed">{tweet}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={cn('text-xs', tweet.length > 260 ? 'text-red-400' : 'text-white/30')}>
                          {tweet.length}/280
                        </span>
                        <CopyButton text={tweet} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })()}

        {/* LinkedIn */}
        {activeTab === 'linkedin' && (() => {
          const output = getOutput('linkedin')
          if (!output) return null
          const data = output.content_json as LinkedInOutput
          return (
            <div className="space-y-4">
              {data.posts?.map((post, i) => {
                const fullPost = `${post.hook}\n\n${post.body}\n\n${post.cta}`
                return (
                  <div key={i} className="glass rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-white/60 text-xs font-medium uppercase tracking-wide">
                        {i === 0 ? 'Long Form Post' : 'Short Form Post'}
                      </span>
                      <CopyButton text={fullPost} />
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-white/4">
                        <div className="text-xs text-white/40 mb-1">Hook</div>
                        <p className="text-white font-semibold text-sm">{post.hook}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white/4">
                        <div className="text-xs text-white/40 mb-1">Body</div>
                        <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">{post.body}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-brand/10 border border-brand/20">
                        <div className="text-xs text-brand-light/70 mb-1">CTA</div>
                        <p className="text-white text-sm font-medium">{post.cta}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })()}

        {/* Carousel */}
        {activeTab === 'carousel' && (() => {
          const output = getOutput('carousel')
          if (!output) return null
          const data = output.content_json as CarouselOutput
          const allContent = [
            ...data.slides?.map((s, i) => `SLIDE ${i + 1}: ${s.title}\n${s.body}\nVisual: ${s.visual_hint}`) || [],
            `\nCAPTION: ${data.caption}`,
            `CTA: ${data.cta}`,
          ].join('\n\n')
          return (
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <span className="text-white font-sans font-semibold">Carousel ({data.slides?.length} slides)</span>
                <CopyButton text={allContent} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {data.slides?.map((slide, i) => (
                  <div
                    key={i}
                    className={cn(
                      'rounded-xl p-4 aspect-square flex flex-col justify-between border',
                      i === 0 ? 'bg-brand/20 border-brand/40' : 'bg-white/4 border-white/8'
                    )}
                  >
                    <div className="text-xs text-white/40">{i === 0 ? 'Cover' : i === (data.slides.length - 1) ? 'CTA' : `Slide ${i + 1}`}</div>
                    <div>
                      <div className="text-white text-xs font-semibold mb-1 line-clamp-2">{slide.title}</div>
                      <div className="text-white/50 text-xs line-clamp-3">{slide.body}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {data.slides?.map((slide, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/4">
                    <div className="w-6 h-6 rounded bg-brand/20 flex items-center justify-center text-brand-light text-xs shrink-0 mt-0.5 font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">{slide.title}</div>
                      <div className="text-white/60 text-xs mt-1">{slide.body}</div>
                      <div className="text-white/30 text-xs mt-1 italic">Visual: {slide.visual_hint}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 rounded-xl glass border border-white/8">
                <div className="text-xs text-white/40 mb-1">Caption</div>
                <p className="text-white/70 text-sm">{data.caption}</p>
                <div className="text-xs text-accent-green mt-2">{data.cta}</div>
              </div>
            </div>
          )
        })()}
      </motion.div>
    </div>
  )
}
