import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-service';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const service = createServiceClient();
  const currentMonth = new Date().toISOString().slice(0, 7);

  const { data: usage } = await service
    .from('usage')
    .select('credits_used, credits_limit')
    .eq('user_id', session.user.id)
    .eq('month', currentMonth)
    .single();

  return NextResponse.json({ usage: usage || { credits_used: 0, credits_limit: 3 } });
}
