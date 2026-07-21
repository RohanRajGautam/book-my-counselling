export type AdminStatTone = 'blue' | 'amber' | 'emerald' | 'slate'

const TONE_BG: Record<AdminStatTone, string> = {
  blue: 'bg-blue-50',
  amber: 'bg-amber-50',
  emerald: 'bg-emerald-50',
  slate: 'bg-slate-100',
}

const TONE_ICON: Record<AdminStatTone, string> = {
  blue: 'text-blue-600',
  amber: 'text-amber-600',
  emerald: 'text-emerald-600',
  slate: 'text-slate-600',
}

export interface AdminStatCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  tone?: AdminStatTone
  helper?: string
}

/**
 * A 1-up metric tile used in the analytics dashboard's stat row.
 * Layout matches the platform's mentor-side `EarningsStatCard` so the
 * dashboard feels native to the rest of the app.
 */
export function AdminStatCard({
  icon,
  label,
  value,
  tone = 'blue',
  helper,
}: AdminStatCardProps) {
  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
      <div className={`inline-flex size-10 items-center justify-center rounded-xl ${TONE_BG[tone]}`}>
        <span className={TONE_ICON[tone]}>{icon}</span>
      </div>
      <h2 className="mt-4 text-[11px] font-bold tracking-[0.14em] text-slate-500 uppercase sm:tracking-[0.18em]">
        {label}
      </h2>
      <p className="mt-2 text-2xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-3xl">
        {value}
      </p>
      {helper ? (
        <p className="mt-2 text-xs font-bold text-slate-500">{helper}</p>
      ) : null}
    </article>
  )
}
