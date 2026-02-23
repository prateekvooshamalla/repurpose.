import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { title, transcript_text } = body

  if (!title || !transcript_text) {
    return NextResponse.json({ error: 'Title and transcript required' }, { status: 400 })
  }

  // Create project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({ user_id: user.id, title, source_type: 'transcript' })
    .select()
    .single()

  if (projectError) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }

  // Create asset
  await supabase
    .from('assets')
    .insert({ project_id: project.id, transcript_text })

  return NextResponse.json({ project })
}

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: projects } = await supabase
    .from('projects')
    .select('*, assets(*), generations(id, status)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return NextResponse.json({ projects })
}
