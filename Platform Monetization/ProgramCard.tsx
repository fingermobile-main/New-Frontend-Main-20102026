import type { EligibilityResult, ProgramDefinition } from '@shared/types'
import { StatusBadge } from '@/components/StatusBadge'

export function ProgramCard({
  program,
  eligibility,
  onApply,
}: {
  program: ProgramDefinition
  eligibility: EligibilityResult | undefined
  onApply: () => void
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-slate-900/60 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{program.title}</h3>
          <p className="mt-2 text-sm text-slate-300">{program.summary}</p>
        </div>
        {eligibility ? <StatusBadge status={eligibility.status} /> : null}
      </div>
      <ul className="mt-4 space-y-2 text-sm text-slate-300">
        {program.requirements.map((item) => (
          <li key={item} className="rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3">
            {item}
          </li>
        ))}
      </ul>
      {eligibility ? (
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <div className="rounded-2xl bg-emerald-500/10 p-4">
            <div className="mb-2 text-xs uppercase tracking-[0.24em] text-emerald-200">
              Passed
            </div>
            <ul className="space-y-2 text-sm text-emerald-50">
              {eligibility.passedRules.slice(0, 4).map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-rose-500/10 p-4">
            <div className="mb-2 text-xs uppercase tracking-[0.24em] text-rose-200">
              Next actions
            </div>
            <ul className="space-y-2 text-sm text-rose-50">
              {(eligibility.nextActions.length > 0
                ? eligibility.nextActions
                : ['No action required. Product is ready or already active.']
              )
                .slice(0, 4)
                .map((item) => (
                  <li key={item}>{item}</li>
                ))}
            </ul>
          </div>
        </div>
      ) : null}
      <button
        type="button"
        onClick={onApply}
        className="mt-5 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-200"
      >
        Apply or refresh review
      </button>
    </div>
  )
}
