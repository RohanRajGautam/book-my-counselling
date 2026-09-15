import Image from 'next/image'

import type { CompanyResponse } from '../types/events.types'

interface EventCompaniesStripProps {
  companies: CompanyResponse[]
  /** When more than this many companies are listed, show a "see all" link. */
  previewCount?: number
}

export function EventCompaniesStrip({ companies, previewCount = 12 }: EventCompaniesStripProps) {
  if (companies.length === 0) return null

  const visible = companies.slice(0, previewCount)
  const remaining = companies.length - visible.length

  return (
    <section className="mx-auto w-full max-w-[1350px] px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto grid items-start gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28">
          <span
            aria-hidden="true"
            className="block h-1 w-12 rounded-full bg-gradient-to-r from-[#004ac6] to-[#6cf8bb]"
          />
          <p className="mt-5 text-xs font-extrabold tracking-[0.16em] text-[#004ac6] uppercase">
            JOINING U
          </p>
          <h2 className="font-headline mt-2 text-3xl leading-[1.05] font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Participating Companies
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-7 text-slate-600">
            Thanks to everyone for joining us to make the gatherings to life.
          </p>
        </div>

        <div className="rounded-[22px] border border-[#d9e3f6] bg-white p-6 shadow-[0_18px_50px_rgba(18,28,42,0.06)] sm:p-8">
          <div className="flex flex-wrap items-center gap-4 sm:gap-5">
            {visible.map((company) => (
              <div
                key={company.id}
                className="flex h-16 min-w-32 items-center gap-3 rounded-[22px] border border-[#eff4ff] bg-[#f8f9ff] px-4 py-2 sm:h-20 sm:min-w-40"
                title={company.name}
              >
                <div className="relative size-10 shrink-0 overflow-hidden rounded-[22px] bg-white sm:size-12">
                  <Image
                    src={company.logo_url}
                    alt={company.name}
                    fill
                    sizes="48px"
                    className="object-contain"
                  />
                </div>
                <span className="font-headline text-sm font-extrabold tracking-tight text-slate-900 sm:text-base">
                  {company.name}
                </span>
              </div>
            ))}
            {remaining > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#eef4ff] px-3 py-1.5 text-xs font-bold tracking-wide text-[#004ac6]">
                +{remaining} more
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
