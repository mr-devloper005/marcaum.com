'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, FileText, ImageIcon, Lock, PlusCircle, Send, Sparkles } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc, editablePalette as palette } from '@/editable/layouts/design-contract'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const taskIcon: Record<string, typeof FileText> = {
  article: FileText,
  listing: Sparkles,
  classified: PlusCircle,
  image: ImageIcon,
  profile: Sparkles,
  pdf: FileText,
  sbm: ArrowRight,
}

const fieldClass = `h-12 w-full rounded-lg border ${palette.border} ${palette.surfaceBg} px-4 text-sm font-medium ${palette.pageText} outline-none transition placeholder:text-[var(--slot4-muted-text)] focus:border-[var(--slot4-accent)]`
const textAreaClass = `w-full rounded-lg border ${palette.border} ${palette.surfaceBg} px-4 py-3 text-sm font-medium ${palette.pageText} outline-none transition placeholder:text-[var(--slot4-muted-text)] focus:border-[var(--slot4-accent)]`

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled && task.key !== 'listing' && task.key !== 'classified'), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className={dc.shell.page}>
          <section className={`${dc.shell.section} ${dc.shell.sectionY}`}>
            <div className={`grid gap-10 rounded-xl border ${palette.border} ${palette.surfaceBg} ${palette.shadow} p-7 md:grid-cols-[0.9fr_1.1fr] md:p-10`}>
              <div className={`flex h-full min-h-72 items-center justify-center rounded-lg ${palette.panelBg}`}>
                <Lock className={`h-16 w-16 ${palette.mutedText}`} />
              </div>
              <div className="self-center">
                <p className={dc.type.eyebrow}>{pagesContent.create.locked.badge}</p>
                <h1 className={`mt-4 max-w-xl ${dc.type.heroTitle}`}>{pagesContent.create.locked.title}</h1>
                <p className={`mt-5 max-w-lg text-base leading-7 ${palette.mutedText}`}>{pagesContent.create.locked.description}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/login" className={dc.button.primary}>Login <ArrowRight className="h-4 w-4" /></Link>
                  <Link href="/signup" className={dc.button.secondary}>Sign up</Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className={dc.shell.page}>
        <section className={`${dc.shell.section} ${dc.shell.sectionY}`}>
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <aside>
              <p className={dc.type.eyebrow}>{pagesContent.create.hero.badge}</p>
              <h1 className={`mt-4 ${dc.type.heroTitle}`}>{pagesContent.create.hero.title}</h1>
              <p className={`mt-5 max-w-xl text-base leading-7 ${palette.mutedText}`}>{pagesContent.create.hero.description}</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {enabledTasks.map((item) => {
                  const Icon = taskIcon[item.key] || FileText
                  const active = item.key === task
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setTask(item.key)}
                      className={`rounded-lg border p-4 text-left transition ${active ? `border-[var(--slot4-accent)] ${palette.accentSoftBg}` : `${palette.border} ${palette.surfaceBg} hover:border-[var(--slot4-accent)]`}`}
                    >
                      <Icon className={`h-5 w-5 ${active ? palette.accentText : palette.mutedText}`} />
                      <span className={`mt-3 block text-sm font-bold ${active ? palette.accentText : palette.pageText}`}>{item.label}</span>
                      <span className={`mt-1 block text-xs font-medium leading-5 ${palette.mutedText}`}>{item.description}</span>
                    </button>
                  )
                })}
              </div>
            </aside>

            <form onSubmit={submit} className={`rounded-xl border ${palette.border} ${palette.surfaceBg} ${palette.shadow} p-5 sm:p-7`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${palette.mutedText}`}>Create {activeTask?.label || 'post'}</p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-[-0.01em]">{pagesContent.create.formTitle}</h2>
                </div>
                <span className={`rounded-full ${palette.panelBg} px-4 py-2 text-xs font-bold uppercase tracking-[0.14em]`}>{session.name}</span>
              </div>

              <div className="mt-6 grid gap-4">
                <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Post title" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
                  <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Website or source URL" />
                </div>
                <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Featured image URL" />
                <textarea className={`${textAreaClass} min-h-24`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Short summary" required />
                <textarea className={`${textAreaClass} min-h-48`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Main content, details, notes, or description" required />
              </div>

              {created ? (
                <div className="mt-5 rounded-lg bg-emerald-50 p-4 text-emerald-700">
                  <p className="flex items-center gap-2 text-sm font-bold"><CheckCircle2 className="h-5 w-5" /> {pagesContent.create.successTitle}</p>
                  <p className="mt-1 text-sm font-medium opacity-80">{created.title}</p>
                </div>
              ) : null}

              <button type="submit" className={`${dc.button.primary} mt-5 h-12 w-full uppercase tracking-[0.12em]`}>
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
