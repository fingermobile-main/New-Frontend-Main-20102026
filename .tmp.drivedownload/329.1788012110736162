import type { EligibilityStatus } from '@shared/types'
import { cn } from '@/lib/utils'

const toneMap: Record<EligibilityStatus, string> = {
  eligible: 'bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-200 ring-1 ring-amber-500/30',
  blocked: 'bg-rose-500/15 text-rose-200 ring-1 ring-rose-500/30',
  pending: 'bg-sky-500/15 text-sky-200 ring-1 ring-sky-500/30',
}

export function StatusBadge({
  status,
  className,
}: {
  status: EligibilityStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em]',
        toneMap[status],
        className,
      )}
    >
      {status.replace('_', ' ')}
    </span>
  )
}
