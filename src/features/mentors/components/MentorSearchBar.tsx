'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { Loader2, Search } from 'lucide-react'

interface MentorSearchBarProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  placeholder?: string
  buttonLabel?: string
  loadingLabel?: string
  isLoading?: boolean
  className?: string
}

const ROTATING_PLACEHOLDERS = [
  "Search 'Data Scientist' or 'Product Manager'",
  "Try 'UX Designer' or 'Marketing Lead'",
  'Looking for a Software Engineering mentor?',
  "Find help with 'Data Analyst' or 'Finance'",
  "Search 'Career Coach' or 'Business Strategy'",
]
const TYPE_SPEED_MS = 42
const DELETE_SPEED_MS = 22
const PAUSE_DURATION_MS = 1400

type Phase = 'typing' | 'pausing' | 'deleting'
type DisplayState = { index: number; text: string; phase: Phase }

const INITIAL_STATE: DisplayState = { index: 0, text: '', phase: 'typing' }

export function MentorSearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search for your dream career...',
  buttonLabel = 'Find Mentor',
  loadingLabel = 'Searching…',
  isLoading = false,
  className = '',
}: MentorSearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [displayState, setDisplayState] = useState<DisplayState>(INITIAL_STATE)
  const stateRef = useRef<DisplayState>(INITIAL_STATE)

  useEffect(() => {
    if (value || isFocused) {
      stateRef.current = INITIAL_STATE
      setDisplayState(INITIAL_STATE)
      return
    }

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setDisplayState({
        index: 0,
        text: ROTATING_PLACEHOLDERS[0] ?? '',
        phase: 'pausing',
      })
      return
    }

    let timeoutId: number
    let cancelled = false

    const tick = () => {
      if (cancelled) return
      const state = stateRef.current
      const fullText = ROTATING_PLACEHOLDERS[state.index] ?? ''
      let nextState: DisplayState
      let delay: number

      if (state.phase === 'typing') {
        if (state.text.length < fullText.length) {
          nextState = { ...state, text: fullText.slice(0, state.text.length + 1) }
          delay = TYPE_SPEED_MS
        } else {
          nextState = { ...state, phase: 'pausing' }
          delay = PAUSE_DURATION_MS
        }
      } else if (state.phase === 'pausing') {
        nextState = { ...state, phase: 'deleting' }
        delay = DELETE_SPEED_MS
      } else {
        if (state.text.length > 0) {
          nextState = { ...state, text: state.text.slice(0, -1) }
          delay = DELETE_SPEED_MS
        } else {
          nextState = {
            index: (state.index + 1) % ROTATING_PLACEHOLDERS.length,
            text: '',
            phase: 'typing',
          }
          delay = TYPE_SPEED_MS
        }
      }

      stateRef.current = nextState
      setDisplayState(nextState)
      timeoutId = window.setTimeout(tick, delay)
    }

    tick()

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [value, isFocused])

  const showAnimatedPlaceholder = !value && !isFocused

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit?.()
  }

  return (
    <form onSubmit={handleSubmit} className={`relative mx-auto max-w-6xl ${className}`}>
      <div className="group flex h-16 items-center rounded-full bg-white shadow-[0_8px_24px_rgba(18,28,42,0.06)] transition-all focus-within:ring-2 focus-within:ring-[#004ac6]/20">
        <Search className="ml-6 h-6 w-6 text-[#737686]" />
        <div className="relative min-w-0 flex-1">
          <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={showAnimatedPlaceholder ? '' : placeholder}
            aria-label="Search for a mentor or career"
            className="relative z-10 w-full border-none bg-transparent px-4 py-4 font-[family-name:var(--font-body)] text-[#121c2a] placeholder:text-[#c3c6d7] focus:ring-0 focus:outline-none"
          />
          {showAnimatedPlaceholder && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-4 left-4 z-0 flex items-center overflow-hidden text-left"
            >
              <span className="flex w-full items-center font-[family-name:var(--font-body)] text-[#c3c6d7]">
                <span className="flex-1 truncate text-left">{displayState.text}</span>
              </span>
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="flex h-16 items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#004ac6] to-[#2563eb] px-6 py-3 text-sm font-bold whitespace-nowrap text-white transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-80"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              <span>{loadingLabel}</span>
            </>
          ) : (
            <span>{buttonLabel}</span>
          )}
        </button>
      </div>
    </form>
  )
}
