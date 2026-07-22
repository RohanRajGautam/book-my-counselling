'use client'

import { Check, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AvailabilityRequestDuration } from '../types/availability-requests.types'

interface DurationOption {
  value: AvailabilityRequestDuration
  title: string
  description: string
}

const OPTIONS: DurationOption[] = [
  {
    value: 30,
    title: 'Basic Counselling Package',
    description: 'A focused session for quick guidance or follow-ups.',
  },
  {
    value: 60,
    title: 'Standard Counselling Package',
    description: 'A full session for in-depth counselling and planning.',
  },
  {
    value: 90,
    title: 'Premium Counselling Package',
    description: 'An extended session for comprehensive support.',
  },
]

export function DurationPicker({
  value,
  onChange,
}: {
  value: AvailabilityRequestDuration
  onChange: (next: AvailabilityRequestDuration) => void
}) {
  return (
    <div role="radiogroup" aria-label="Session length" className="grid gap-3 sm:grid-cols-3">
      {OPTIONS.map((option, index) => {
        const active = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'group relative flex min-h-[158px] flex-col rounded-[24px] p-5 text-left shadow-[0_8px_24px_rgba(18,28,42,0.04)] ring-1 transition-all ring-inset',
              active
                ? 'bg-[#004ac6] text-white ring-[#004ac6]'
                : 'bg-[#f8f9ff] text-[#121c2a] ring-[#eff4ff] hover:bg-[#eff4ff]/70'
            )}
          >
            {index === 1 ? (
              <span
                className={cn(
                  'absolute top-0 right-0 rounded-tr-[24px] rounded-bl-[12px] px-3 py-1 text-[10px] font-bold',
                  active ? 'bg-white/20 text-white' : 'bg-[#6cf8bb] text-[#00714d]'
                )}
              >
                Popular
              </span>
            ) : null}

            <span className="flex items-center gap-1.5">
              <Clock
                className={cn('size-4 shrink-0', active ? 'text-white/80' : 'text-[#004ac6]')}
                strokeWidth={2.4}
              />
              <span className="text-xs font-extrabold text-current">{option.value} minutes</span>
            </span>
            <span className="mt-4 font-[family-name:var(--font-headline)] text-base leading-tight font-extrabold tracking-tight sm:text-lg">
              {option.title}
            </span>
            <span
              className={cn(
                'mt-2 text-xs leading-5 font-medium',
                active ? 'text-white/80' : 'text-[#737686]'
              )}
            >
              {option.description}
            </span>
            {active ? (
              <Check className="absolute right-4 bottom-4 size-4 text-white" strokeWidth={2.8} />
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
