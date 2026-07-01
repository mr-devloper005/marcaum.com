import { cn } from '@/lib/utils'

type LoadingStateProps = {
  label?: string
  className?: string
}

function PulseBlock({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-[1.25rem] bg-[#d8d0c8]', className)} />
}

export function PageLoadingState({ label = 'Loading page', className }: LoadingStateProps) {
  return (
    <div className={cn('mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8', className)} aria-live="polite" aria-busy="true">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#635b58]">{label}</p>
      <PulseBlock className="mt-5 h-16 w-4/5 max-w-4xl" />
      <PulseBlock className="mt-4 h-5 w-2/3 max-w-2xl" />
      <div className="mt-8 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-[2rem] border border-[rgba(15,14,14,0.08)] bg-[#fffdfa] p-5">
          <PulseBlock className="h-[420px] w-full rounded-[1.75rem]" />
        </div>
        <div className="grid gap-4">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="rounded-[1.75rem] border border-[rgba(15,14,14,0.08)] bg-[#fffdfa] p-4">
              <PulseBlock className="h-28 w-full" />
              <PulseBlock className="mt-4 h-5 w-5/6" />
              <PulseBlock className="mt-3 h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function CardGridLoadingState({ count = 6, className }: LoadingStateProps & { count?: number }) {
  return (
    <div className={cn('grid gap-5 sm:grid-cols-2 lg:grid-cols-3', className)} aria-live="polite" aria-busy="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-[1.75rem] border border-[rgba(15,14,14,0.08)] bg-[#fffdfa] p-4">
          <PulseBlock className="h-52 w-full" />
          <PulseBlock className="mt-4 h-5 w-5/6" />
          <PulseBlock className="mt-3 h-4 w-2/3" />
          <PulseBlock className="mt-6 h-10 w-32 rounded-full" />
        </div>
      ))}
    </div>
  )
}

export function DetailLoadingState({ label = 'Loading detail', className }: LoadingStateProps) {
  return (
    <div className={cn('mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[1fr_0.9fr]', className)} aria-live="polite" aria-busy="true">
      <div className="rounded-[2rem] border border-[rgba(15,14,14,0.08)] bg-[#fffdfa] p-5">
        <PulseBlock className="h-96 w-full rounded-[1.75rem]" />
      </div>
      <div className="rounded-[2rem] border border-[rgba(15,14,14,0.08)] bg-[#fffdfa] p-6">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#635b58]">{label}</p>
        <PulseBlock className="mt-5 h-14 w-4/5" />
        <PulseBlock className="mt-5 h-4 w-full" />
        <PulseBlock className="mt-3 h-4 w-5/6" />
        <PulseBlock className="mt-3 h-4 w-2/3" />
      </div>
    </div>
  )
}
