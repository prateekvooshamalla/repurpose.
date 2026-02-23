import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID!
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Create Razorpay subscription via API
    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64')

    // First create a plan (or use existing plan ID)
    const subscriptionRes = await fetch('https://api.razorpay.com/v1/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify({
        plan_id: process.env.RAZORPAY_PLAN_ID, // Set this in env after creating plan
        quantity: 1,
        total_count: 12, // 12 months
        customer_notify: 1,
      }),
    })

    const subscription = await subscriptionRes.json()

    if (!subscriptionRes.ok) {
      throw new Error(subscription.error?.description || 'Failed to create subscription')
    }

    return NextResponse.json({
      subscription_id: subscription.id,
      key_id: RAZORPAY_KEY_ID,
    })
  } catch (error) {
    console.error('Billing error:', error)
    return NextResponse.json({ error: 'Failed to initiate payment' }, { status: 500 })
  }
}
