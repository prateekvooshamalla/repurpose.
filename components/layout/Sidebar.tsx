'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Sparkles, Plus, LayoutDashboard, LogOut, Zap, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  user: { email?: string; name?: string; avatar_url?: string }
  subscription: { status: string } | null
  usage: { credits_used: number; credits_limit: number }
}

export default function Sidebar({ user, subscription, usage }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const isActive = subscription?.status === 'active'
  const usagePercent = Math.min((usage.credits_used / usage.credits_limit) * 100, 100)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="w-64 shrink-0 flex flex-col h-full glass border-r border-white/6 p-4">
      {/* Logo */}
      <Link href="/app" className="flex items-center gap-2.5 mb-6 px-2">
        <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="font-sans font-bold text-white text-lg">RepurposeAI</span>
      </Link>

      {/* New Project Button */}
      <Link
        href="/app/new"
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-brand hover:bg-brand-light text-white font-medium text-sm transition-colors mb-4"
      >
        <Plus className="w-4 h-4" />
        New Project
      </Link>

      {/* Nav */}
      <nav className="space-y-1">
        <Link
          href="/app"
          className={cn(
            'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors',
            pathname === '/app'
              ? 'bg-white/10 text-white'
              : 'text-white/50 hover:text-white hover:bg-white/5'
          )}
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Link>
      </nav>

      <div className="flex-1" />

      {/* Usage */}
      <div className="glass rounded-xl p-4 mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/50 text-xs">Credits this month</span>
          <span className="text-white text-xs font-medium">
            {usage.credits_used}/{usage.credits_limit}
          </span>
        </div>
        <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand to-accent-green rounded-full transition-all"
            style={{ width: `${usagePercent}%` }}
          />
        </div>
        {!isActive && (
          <Link
            href="/app/billing"
            className="mt-3 flex items-center gap-1.5 text-accent-amber text-xs font-medium hover:underline"
          >
            <Crown className="w-3 h-3" />
            Upgrade to Pro — ₹799/mo
          </Link>
        )}
      </div>

      {/* User */}
      <div className="flex items-center gap-3 px-2">
        <div className="w-8 h-8 rounded-full bg-brand/30 flex items-center justify-center text-white text-sm font-medium shrink-0">
          {(user.name || user.email || 'U')[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white text-xs font-medium truncate">{user.name}</div>
          <div className="text-white/30 text-xs truncate">{user.email}</div>
        </div>
        <button
          onClick={handleLogout}
          className="text-white/30 hover:text-white transition-colors p-1"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>

      {isActive && (
        <div className="flex items-center gap-1 justify-center mt-2">
          <Zap className="w-3 h-3 text-accent-green" />
          <span className="text-accent-green text-xs font-medium">Pro Active</span>
        </div>
      )}
    </aside>
  )
}
