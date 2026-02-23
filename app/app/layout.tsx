import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user profile and subscription
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  const currentMonth = new Date().toISOString().slice(0, 7)
  const { data: usage } = await supabase
    .from('usage')
    .select('*')
    .eq('user_id', user.id)
    .eq('month', currentMonth)
    .single()

  return (
    <div className="flex h-screen overflow-hidden bg-[#080810]">
      <Sidebar
        user={profile || { email: user.email, name: user.email?.split('@')[0] }}
        subscription={subscription}
        usage={usage || { credits_used: 0, credits_limit: subscription ? 60 : 5 }}
      />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
