'use client'

import { Search } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import type { BankInfo } from '../types/payment'

interface BankSelectorProps {
  banks: BankInfo[]
  loading: boolean
  error: string | null
  selectedBank: BankInfo | null
  onSelect: (bank: BankInfo) => void
  onRetry: () => void
}

export function BankSelector({
  banks,
  loading,
  error,
  selectedBank,
  onSelect,
  onRetry,
}: BankSelectorProps) {
  const [query, setQuery] = useState('')

  const filtered = banks.filter((b) =>
    b.bank_name.toLowerCase().includes(query.toLowerCase())
  )

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-10 animate-pulse rounded-lg bg-[#eff4ff]" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-[#eff4ff]" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 p-4 text-center">
        <p className="mb-3 text-sm text-red-600">{error}</p>
        <button
          onClick={onRetry}
          className="rounded-lg bg-[#004ac6] px-4 py-2 text-sm font-semibold text-white hover:bg-[#003a9e]"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#434655]" />
        <input
          type="text"
          placeholder="Search your bank..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border-none bg-[#eff4ff] py-2.5 pr-4 pl-10 text-sm text-[#121c2a] focus:bg-white focus:ring-2 focus:ring-[#004ac6] focus:outline-none"
        />
      </div>

      {/* Bank grid */}
      {filtered.length === 0 ? (
        <p className="py-4 text-center text-sm text-[#434655]">No banks found</p>
      ) : (
        <div className="grid max-h-64 grid-cols-2 gap-2 overflow-y-auto pr-1">
          {filtered.map((bank) => {
            const isSelected = selectedBank?.bank_code === bank.bank_code
            return (
              <button
                key={bank.bank_code}
                onClick={() => onSelect(bank)}
                className={`flex items-center gap-2 rounded-xl border-2 p-3 text-left transition-all ${
                  isSelected
                    ? 'border-[#004ac6] bg-[#eff4ff]'
                    : 'border-transparent bg-[#f8f9ff] hover:border-[#004ac6]/30 hover:bg-[#eff4ff]'
                }`}
              >
                {bank.logo_url ? (
                  <Image
                    src={bank.logo_url}
                    alt={bank.bank_name}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded object-contain"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-[#004ac6] text-xs font-bold text-white">
                    {bank.bank_name.charAt(0)}
                  </div>
                )}
                <span className="text-xs font-medium leading-tight text-[#121c2a]">
                  {bank.bank_name}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
