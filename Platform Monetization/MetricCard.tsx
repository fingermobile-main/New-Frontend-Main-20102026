import type { ReactNode } from 'react'

export function MetricCard({
  label,
  value,
  helper,
  icon,
}: {
  label: string
  value: string
  helper: string
  icon: ReactNode
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-4 flex items-center justify-between text-slate-400">
        <span className="text-xs uppercase tracking-[0.24em]">{label}</span>
        <span>{icon}</span>
      </div>
      <div className="text-3xl font-semibold tracking-tight text-white">
        {value}
      </div>
      <div className="mt-2 text-sm text-slate-400">{helper}</div>
    </div>
  )
}
