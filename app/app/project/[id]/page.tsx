import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProjectResults from '@/components/ProjectResults'

interface PageProps {
  params: { id: string }
}

export default async function ProjectPage({ params }: PageProps) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: project } = await supabase
    .from('projects')
    .select('*, assets(*)')
    .eq('id', params.id)
    .eq('user_id', user!.id)
    .single()

  if (!project) notFound()

  const { data: generation } = await supabase
    .from('generations')
    .select('*, outputs(*)')
    .eq('project_id', params.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="font-sans text-2xl font-bold text-white">{project.title}</h1>
          <p className="text-white/40 text-sm mt-1">
            {project.assets?.[0]?.transcript_text
              ? `${project.assets[0].transcript_text.split(' ').filter(Boolean).length} words • `
              : ''}
            Generated {generation ? new Date(generation.created_at).toLocaleDateString('en-IN') : '...'}
          </p>
        </div>

        <ProjectResults
          project={project}
          generation={generation}
        />
      </div>
    </div>
  )
}
