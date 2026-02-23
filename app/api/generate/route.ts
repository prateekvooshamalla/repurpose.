import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { openai, buildRepurposePrompt, PROMPT_VERSION } from '@/lib/openai'
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentMonth } from '@/lib/utils'

const FREE_TRIAL_CREDITS = 3
const PRO_CREDITS = 60

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const adminSupabase = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { project_id, tone, audience, cta_style, platforms } = body

  if (!project_id || !platforms?.length) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Verify project belongs to user
  const { data: project } = await supabase
    .from('projects')
    .select('*, assets(*)')
    .eq('id', project_id)
    .eq('user_id', user.id)
    .single()

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }

  const transcript = project.assets?.[0]?.transcript_text
  if (!transcript) {
    return NextResponse.json({ error: 'No transcript found' }, { status: 400 })
  }

  // Check subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  const isSubscribed = !!subscription
  const creditLimit = isSubscribed ? PRO_CREDITS : FREE_TRIAL_CREDITS
  const currentMonth = getCurrentMonth()

  // Get or create usage record
  const { data: existingUsage } = await supabase
    .from('usage')
    .select('*')
    .eq('user_id', user.id)
    .eq('month', currentMonth)
    .single()

  const creditsUsed = existingUsage?.credits_used || 0

  if (creditsUsed >= creditLimit) {
    return NextResponse.json(
      { error: isSubscribed ? 'Monthly credit limit reached' : 'Free trial limit reached. Please subscribe to continue.' },
      { status: 429 }
    )
  }

  // Create generation record
  const { data: generation, error: genError } = await adminSupabase
    .from('generations')
    .insert({
      project_id,
      user_id: user.id,
      status: 'queued',
      prompt_version: PROMPT_VERSION,
      tone,
      audience,
      cta_style,
      platforms,
    })
    .select()
    .single()

  if (genError) {
    return NextResponse.json({ error: 'Failed to create generation' }, { status: 500 })
  }

  try {
    // Call OpenAI
    const prompt = buildRepurposePrompt(transcript, tone, audience, cta_style, platforms)

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.85,
      max_tokens: 4000,
    })

    const rawContent = completion.choices[0].message.content
    if (!rawContent) throw new Error('Empty response from OpenAI')

    const generatedContent = JSON.parse(rawContent)

    // Save outputs
    const outputsToInsert = platforms.map((platform: string) => ({
      generation_id: generation.id,
      type: platform,
      content_json: generatedContent[platform] || {},
    }))

    await adminSupabase.from('outputs').insert(outputsToInsert)

    // Update generation status
    await adminSupabase
      .from('generations')
      .update({ status: 'done' })
      .eq('id', generation.id)

    // Update usage
    if (existingUsage) {
      await adminSupabase
        .from('usage')
        .update({ credits_used: creditsUsed + 1 })
        .eq('user_id', user.id)
        .eq('month', currentMonth)
    } else {
      await adminSupabase
        .from('usage')
        .insert({
          user_id: user.id,
          month: currentMonth,
          credits_used: 1,
          credits_limit: creditLimit,
        })
    }

    return NextResponse.json({ generation_id: generation.id, success: true })

  } catch (error) {
    console.error('Generation error:', error)

    // Mark as failed
    await adminSupabase
      .from('generations')
      .update({ status: 'failed', error_message: String(error) })
      .eq('id', generation.id)

    return NextResponse.json({ error: 'Generation failed. Please try again.' }, { status: 500 })
  }
}
