'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { toast } from 'sonner'

import { useFilters } from '@/features/filters/context/FilterContext'
import { MentorSearchBar } from '@/features/mentors/components/MentorSearchBar'
import { smartSearch } from '@/features/search/lib/smart-search'

export function HeroSection() {
  const { filters, updateFilter } = useFilters()
  const router = useRouter()
  const [isSearching, setIsSearching] = useState(false)

  const handleSearchSubmit = async () => {
    const search = filters.jobTitle?.trim() ?? ''

    if (!search) {
      router.push('/academic-counsellor')
      return
    }

    setIsSearching(true)
    try {
      const destination = await smartSearch(search)
      router.push(destination.href)
    } catch (error) {
      toast.error('Search failed. Please try again.')
      setIsSearching(false)
    }
  }

  return (
    <section className="relative isolate mt-[-25px] overflow-hidden px-6 pt-16 pb-20 sm:px-8 lg:pt-22 lg:pb-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,#ffffff_0%,#f8f9ff_48%,#eef4ff_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-[linear-gradient(90deg,transparent,#b4c5ff,transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [background-image:linear-gradient(#d9e3f6_1px,transparent_1px),linear-gradient(90deg,#d9e3f6_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black,transparent_72%)] [background-size:72px_72px] opacity-30"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 -z-10 h-[420px] w-[640px] -translate-x-1/2 rounded-full bg-gradient-to-br from-[#004ac6]/10 via-[#2563eb]/5 to-transparent blur-3xl"
      />

      <div className="mx-auto w-full max-w-6xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#c9d7f4] bg-white/74 px-4 py-2 text-xs font-extrabold tracking-[0.12em] text-[#003ea8] uppercase shadow-[0_14px_40px_rgba(18,28,42,0.07)] backdrop-blur">
          <Sparkles className="size-4" aria-hidden="true" />
          1:1 Mentorship
        </div>

        <h1 className="mt-2 font-[family-name:var(--font-headline)] text-[clamp(2.5rem,6vw,4rem)] leading-[1.0] font-extrabold tracking-[-0.02em] text-[#121c2a]">
          Your career journey,{' '}
          <span className="relative isolate inline-block text-[#004ac6]">
            curated
            <span className="absolute right-0 -bottom-0.5 left-0 -z-10 h-1.5 rounded-full bg-[#6cf8bb]/55" />
          </span>
          .
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#434655] sm:text-lg">
          Connect with world-class mentors from industry giants and top universities to navigate
          your professional growth with precision.
        </p>

        <div className="mx-auto mt-10 max-w-2xl">
          <MentorSearchBar
            value={filters.jobTitle ?? ''}
            onChange={(value) => updateFilter('jobTitle', value)}
            onSubmit={handleSearchSubmit}
            isLoading={isSearching}
          />
        </div>
      </div>
    </section>
  )
}
