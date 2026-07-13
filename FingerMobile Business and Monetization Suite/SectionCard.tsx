import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function SectionCard({
  title,
  subtitle,
  action,
  children,
  className,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        'rounded-[28px] border border-white/10 bg-slate-950/60 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur',
        className,
      )}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
            {title}
          </p>
          {subtitle ? (
            <p className="mt-2 max-w-2xl text-sm text-slate-300">{subtitle}</p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
