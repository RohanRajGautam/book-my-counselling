'use client'

import { Search } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="mx-auto max-w-7xl px-8 py-16 text-center">
      <h1 className="mb-6 font-[family-name:var(--font-headline)] text-5xl font-extrabold tracking-tight text-[#121c2a]">
        Your Career Journey, <span className="text-[#004ac6]">Curated.</span>
      </h1>
      <p className="mx-auto mb-12 max-w-2xl text-lg text-[#434655]">
        Connect with world-class mentors from industry giants and top universities to navigate your
        professional growth with precision.
      </p>

      {/* Search Bar */}
      <div className="relative mx-auto max-w-3xl">
        <div className="group flex items-center rounded-full bg-white p-2 shadow-[0_8px_24px_rgba(18,28,42,0.06)] transition-all focus-within:ring-2 focus-within:ring-[#004ac6]/20">
          <Search className="ml-6 h-6 w-6 text-[#737686]" />
          <input
            type="text"
            placeholder="Search for your interest or dream career... (e.g., 'Data Scientist' or 'Art School')"
            className="w-full border-none bg-transparent px-4 py-4 font-[family-name:var(--font-body)] text-[#121c2a] placeholder:text-[#c3c6d7] focus:outline-none focus:ring-0"
          />
          <button className="mr-1 rounded-full bg-gradient-to-br from-[#004ac6] to-[#2563eb] px-8 py-3.5 font-bold text-white transition-all active:scale-95">
            Find Mentor
          </button>
        </div>
      </div>
    </section>
  )
}
