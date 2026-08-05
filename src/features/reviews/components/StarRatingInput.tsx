'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
  invalid?: boolean
}

const STAR_VALUES = [1, 2, 3, 4, 5] as const
const FILLED = 'fill-amber-400 text-amber-400'
const EMPTY = 'text-[#c3c6d7]'

export function StarRatingInput({ value, onChange, disabled, invalid }: Props) {
  const [hover, setHover] = useState<number | null>(null)
  const display = hover ?? value

  return (
    <div
      role="radiogroup"
      aria-label="Rating"
      aria-invalid={invalid || undefined}
      aria-disabled={disabled || undefined}
      className={cn('flex items-center gap-1', disabled && 'opacity-60')}
      onMouseLeave={() => setHover(null)}
    >
      {STAR_VALUES.map((n) => {
        const filled = n <= display
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`Rate ${n} ${n === 1 ? 'star' : 'stars'}`}
            tabIndex={value === 0 || value === n ? 0 : -1}
            disabled={disabled}
            onClick={() => onChange(n)}
            onMouseEnter={() => !disabled && setHover(n)}
            onFocus={() => !disabled && setHover(n)}
            onBlur={() => setHover(null)}
            onKeyDown={(e) => {
              if (disabled) return
              if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                e.preventDefault()
                const next = Math.min(5, (value || 0) + 1)
                onChange(next)
              } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                e.preventDefault()
                const next = Math.max(1, (value || 0) - 1)
                onChange(next)
              }
            }}
            className={cn(
              'flex size-10 items-center justify-center rounded-xl transition-transform',
              !disabled &&
                'hover:scale-110 focus-visible:ring-2 focus-visible:ring-[#c9dcfb] focus-visible:outline-none'
            )}
          >
            <Star
              className={cn('size-7 transition-colors', filled ? FILLED : EMPTY)}
              strokeWidth={1.5}
            />
          </button>
        )
      })}
    </div>
  )
}
