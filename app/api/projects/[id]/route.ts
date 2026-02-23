import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-service';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const service = createServiceClient();

    const { data: project } = await service
      .from('projects')
      .select('*, assets(*)')
      .eq('id', params.id)
      .eq('user_id', session.user.id)
      .single();

    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    const { data: generations } = await service
      .from('generations')
      .select('id, status')
      .eq('project_id', params.id)
      .order('created_at', { ascending: false })
      .limit(1);

    let outputs: any[] = [];
    if (generations?.[0]) {
      const { data } = await service
        .from('outputs')
        .select('*')
        .eq('generation_id', generations[0].id);
      outputs = data || [];
    }

    return NextResponse.json({ project, outputs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const service = createServiceClient();

    if (body.video_url) {
      await service.from('assets').update({ video_url: body.video_url })
        .eq('project_id', params.id);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
