import { HOME_STATS } from '../lib/home.constants'

function StatCell({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center text-[var(--brand-blue)]">
      <div className="text-sm font-bold sm:text-base">{label}</div>
      <div className="text-5xl font-extrabold sm:text-6xl">{value}</div>
      <div className="text-base font-bold sm:text-lg">{detail}</div>
    </div>
  )
}

export function Statistics() {
  return (
    <section className="bg-gradient-to-r from-[var(--brand-blue)] to-[#2f6aea] px-6 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-10 text-center text-2xl leading-[1.05] font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
          A platform that delivers results
        </h2>

        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {HOME_STATS.map((stat) => (
            <div
              key={stat.detail}
              className="flex min-h-44 items-center justify-center rounded-3xl bg-white p-6"
            >
              <StatCell {...stat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
