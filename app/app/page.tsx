import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { Plus, FileText, Clock, ArrowRight } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: projects } = await supabase
    .from('projects')
    .select(`
      *,
      assets(transcript_text),
      generations(id, status, outputs(type))
    `)
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-sans text-2xl font-bold text-white">Projects</h1>
            <p className="text-white/40 text-sm mt-1">Your repurposed content library</p>
          </div>
          <Link
            href="/app/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-light text-white font-medium text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Project
          </Link>
        </div>

        {/* Projects list */}
        {projects && projects.length > 0 ? (
          <div className="space-y-3">
            {projects.map((project) => {
              const generation = project.generations?.[0]
              const outputTypes = generation?.outputs?.map((o: { type: string }) => o.type) || []
              const transcript = project.assets?.[0]?.transcript_text

              return (
                <Link
                  key={project.id}
                  href={`/app/project/${project.id}`}
                  className="group glass glass-hover rounded-2xl p-5 flex items-center gap-4 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand/15 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-brand-light" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-sans font-semibold text-white mb-0.5">{project.title}</div>
                    {transcript && (
                      <div className="text-white/30 text-xs truncate">
                        {transcript.slice(0, 80)}...
                      </div>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1 text-white/30 text-xs">
                        <Clock className="w-3 h-3" />
                        {formatDate(project.created_at)}
                      </div>
                      {outputTypes.length > 0 && (
                        <div className="flex gap-1">
                          {outputTypes.map((type: string) => (
                            <span key={type} className="px-2 py-0.5 rounded-full bg-brand/15 text-brand-light text-xs capitalize">
                              {type}
                            </span>
                          ))}
                        </div>
                      )}
                      {generation?.status === 'queued' && (
                        <span className="px-2 py-0.5 rounded-full bg-accent-amber/15 text-accent-amber text-xs">Generating...</span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors" />
                </Link>
              )
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="glass rounded-3xl p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand/15 flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-brand-light" />
            </div>
            <h2 className="font-sans text-xl font-bold text-white mb-2">No projects yet</h2>
            <p className="text-white/40 text-sm mb-6 max-w-xs mx-auto">
              Paste your first transcript and let AI create all your social content
            </p>
            <Link
              href="/app/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-light text-white font-medium text-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create First Project
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
