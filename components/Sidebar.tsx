'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Sparkles, Plus, LayoutDashboard, LogOut, ChevronRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  user: { email?: string; user_metadata?: { full_name?: string; avatar_url?: string } };
  usage?: { credits_used: number; credits_limit: number } | null;
  subscription?: { status: string; plan: string } | null;
}

export default function Sidebar({ user, usage, subscription }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push('/login');
  };

  const creditsUsed = usage?.credits_used || 0;
  const creditsLimit = usage?.credits_limit || 3;
  const creditsPercent = Math.min((creditsUsed / creditsLimit) * 100, 100);
  const isPro = subscription?.status === 'active';

  return (
    <aside className="w-64 flex-shrink-0 h-screen glass border-r border-white/5 flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-white/5">
        <Link href="/app" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base" style={{fontFamily:'Syne,sans-serif'}}>RepurposeAI</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        <Link href="/app"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            pathname === '/app' ? 'bg-white/8 text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/5'
          }`}>
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Link>
        <Link href="/app/new"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            pathname === '/app/new' ? 'bg-white/8 text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/5'
          }`}>
          <Plus className="w-4 h-4" />
          New project
        </Link>
      </nav>

      {/* Usage */}
      <div className="p-4 border-t border-white/5">
        <div className="glass rounded-xl p-4 mb-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-xs font-medium text-white/70">Credits</span>
            </div>
            <span className="text-xs text-white/40">{creditsUsed}/{creditsLimit}</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${creditsPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${creditsPercent > 80 ? 'bg-red-500' : 'bg-gradient-to-r from-violet-600 to-cyan-500'}`}
            />
          </div>
          {!isPro && (
            <Link href="/#pricing"
              className="block w-full text-center text-xs py-2 rounded-lg bg-gradient-to-r from-violet-600/30 to-cyan-600/20 border border-violet-500/20 text-violet-300 hover:opacity-80 transition-opacity">
              Upgrade to Pro — ₹799/mo
            </Link>
          )}
          {isPro && (
            <div className="text-center text-xs text-white/30">
              Pro plan active ✓
            </div>
          )}
        </div>

        {/* User */}
        <div className="flex items-center gap-3 px-2">
          {user.user_metadata?.avatar_url ? (
            <img src={user.user_metadata.avatar_url} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center text-xs font-bold text-white">
              {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white/80 truncate">{user.user_metadata?.full_name || 'User'}</p>
            <p className="text-xs text-white/30 truncate">{user.email}</p>
          </div>
          <button onClick={handleLogout} disabled={loggingOut}
            className="text-white/30 hover:text-white/60 transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
