'use client'

import { FormEvent } from 'react'
import { Search } from 'lucide-react'

interface MentorSearchBarProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  placeholder?: string
  buttonLabel?: string
  className?: string
}

export function MentorSearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Search for your interest or dream career... (e.g., 'Data Scientist' or 'Art School')",
  buttonLabel = 'Find Mentor',
  className = '',
}: MentorSearchBarProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit?.()
  }

  return (
    <form onSubmit={handleSubmit} className={`relative mx-auto max-w-6xl ${className}`}>
      <div className="group flex h-16 items-center rounded-full bg-white shadow-[0_8px_24px_rgba(18,28,42,0.06)] transition-all focus-within:ring-2 focus-within:ring-[#004ac6]/20">
        <Search className="ml-6 h-6 w-6 text-[#737686]" />
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full border-none bg-transparent px-4 py-4 font-[family-name:var(--font-body)] text-[#121c2a] placeholder:text-[#c3c6d7] focus:ring-0 focus:outline-none"
        />
        <button
          type="submit"
          className="h-16 rounded-full bg-gradient-to-br from-[#004ac6] to-[#2563eb] px-8 py-3 text-sm font-bold text-white transition-all active:scale-95"
        >
          {buttonLabel}
        </button>
      </div>
    </form>
  )
}
