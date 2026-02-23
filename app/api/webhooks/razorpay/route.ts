import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('x-razorpay-signature')

  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex')

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const event = JSON.parse(body)
  const adminSupabase = createAdminClient()

  const payload = event.payload?.subscription?.entity
  const paymentPayload = event.payload?.payment?.entity

  if (!payload) {
    return NextResponse.json({ received: true })
  }

  // Map event to subscription status
  const statusMap: Record<string, string> = {
    'subscription.activated': 'active',
    'subscription.charged': 'active',
    'subscription.cancelled': 'canceled',
    'subscription.completed': 'canceled',
    'subscription.expired': 'canceled',
  }

  const newStatus = statusMap[event.event]
  if (!newStatus) {
    return NextResponse.json({ received: true })
  }

  const razorpaySubscriptionId = payload.id
  const currentPeriodEnd = payload.current_end
    ? new Date(payload.current_end * 1000).toISOString()
    : null

  // Find or create subscription record
  const { data: existingSub } = await adminSupabase
    .from('subscriptions')
    .select('*')
    .eq('razorpay_subscription_id', razorpaySubscriptionId)
    .single()

  if (existingSub) {
    await adminSupabase
      .from('subscriptions')
      .update({
        status: newStatus,
        current_period_end: currentPeriodEnd,
        razorpay_payment_id: paymentPayload?.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingSub.id)
  } else if (newStatus === 'active' && payload.customer_id) {
    // Try to find user by razorpay customer details
    // This is simplified - in production, store customer_id on subscription creation
    const notes = payload.notes || {}
    const userId = notes.user_id

    if (userId) {
      await adminSupabase.from('subscriptions').insert({
        user_id: userId,
        status: newStatus,
        plan: 'pro',
        current_period_end: currentPeriodEnd,
        razorpay_subscription_id: razorpaySubscriptionId,
        razorpay_payment_id: paymentPayload?.id,
      })
    }
  }

  return NextResponse.json({ received: true })
}
