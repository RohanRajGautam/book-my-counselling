import { HOME_STATS } from '../lib/home.constants'

function StatCard({
  label,
  value,
  detail,
}: {
  label: string
  value: string
  detail: string
}) {
  return (
    <div className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white p-8 shadow-[0_24px_60px_-20px_rgba(2,18,52,0.55)] ring-1 ring-black/[0.04] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_32px_70px_-18px_rgba(2,18,52,0.65)] sm:p-10">
      <p className="text-[11px] font-bold tracking-[0.18em] text-slate-500 uppercase">
        {label}
      </p>
      <p className="mt-6 font-[family-name:var(--font-headline)] text-6xl leading-none font-extrabold tracking-[-0.04em] text-[#004ac6] sm:text-7xl">
        {value}
      </p>
      <p className="mt-5 text-[15px] leading-6 font-medium text-slate-600">
        {detail}
      </p>
    </div>
  )
}

export function Statistics() {
  return (
    <section className="relative isolate overflow-hidden bg-[#004ac6] px-6 py-24 sm:px-8 sm:py-28 lg:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.18),transparent_55%),radial-gradient(circle_at_50%_100%,rgba(0,10,40,0.45),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]"
      />

      <div className="mx-auto max-w-7xl">
        <h2 className="mx-auto max-w-3xl text-center text-3xl leading-[1.05] font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          A platform that delivers results.
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4 lg:gap-8">
          {HOME_STATS.map((stat) => (
            <StatCard key={stat.detail} {...stat} />
          ))}
        </div>
      </div>
    </section>
  )
}