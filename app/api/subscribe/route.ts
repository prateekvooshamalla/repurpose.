import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-service';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = body;

    // Verify signature
    const crypto = require('crypto');
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const service = createServiceClient();

    // Fetch subscription details from Razorpay API
    const rzpRes = await fetch(
      `https://api.razorpay.com/v1/subscriptions/${razorpay_subscription_id}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64')}`,
        },
      }
    );
    const rzpData = await rzpRes.json();

    // Upsert subscription
    await service.from('subscriptions').upsert({
      user_id: session.user.id,
      status: 'active',
      plan: 'pro_799',
      razorpay_subscription_id,
      razorpay_payment_id,
      current_period_end: new Date(rzpData.current_end * 1000).toISOString(),
    }, { onConflict: 'user_id' });

    // Update usage limit
    const currentMonth = new Date().toISOString().slice(0, 7);
    await service.from('usage').upsert({
      user_id: session.user.id,
      month: currentMonth,
      credits_limit: 60,
      credits_used: 0,
    }, { onConflict: 'user_id,month' });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
