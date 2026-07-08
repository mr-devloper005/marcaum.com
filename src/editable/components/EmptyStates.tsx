import Link from 'next/link'
import { ArrowRight, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  title = 'Nothing published here yet',
  description = 'Fresh posts will appear here automatically once this section has published content.',
  actionLabel = 'Back to home',
  actionHref = '/',
  className,
}: EmptyStateProps) {
  return (
    <section className={cn('rounded-[2rem] border border-[rgba(15,14,14,0.08)] bg-[#fffdfa] p-8 text-center shadow-[0_24px_60px_rgba(15,14,14,0.05)]', className)}>
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#2563eb] text-[#eeeeee]">
        <SearchX className="h-7 w-7" />
      </div>
      <h2 className="editable-display mt-6 text-4xl font-semibold tracking-[-0.05em] text-[#0f0e0e]">{title}</h2>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#635b58]">{description}</p>
      <Link href={actionHref} className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#468a9a] px-6 py-3 text-sm font-extrabold text-[#eeeeee] transition hover:brightness-95">
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  )
}

export function TaskEmptyState({ taskLabel = 'posts', className }: { taskLabel?: string; className?: string }) {
  return (
    <EmptyState
      className={className}
      title={`No ${taskLabel} available yet`}
      description={`Published ${taskLabel} will appear here automatically when new entries are available.`}
      actionLabel="Explore the homepage"
      actionHref="/"
    />
  )
}

export function ContactSuccessState({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      title="Message received"
      description="Thanks for reaching out. Your message has been saved and is ready for follow-up."
      actionLabel="Return home"
      actionHref="/"
    />
  )
}
