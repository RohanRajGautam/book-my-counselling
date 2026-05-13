'use client'

import { BadgePlus, BriefcaseBusiness, X } from 'lucide-react'
import { useState } from 'react'

type ProfileCounsellingCardProps = {
  tags: string[]
  onChange: (tags: string[]) => void
}

export function ProfileCounsellingCard({ tags, onChange }: ProfileCounsellingCardProps) {
  const [inputValue, setInputValue] = useState('')

  const addTag = () => {
    const trimmed = inputValue.trim()
    if (!trimmed || tags.includes(trimmed)) return
    onChange([...tags, trimmed])
    setInputValue('')
  }

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <section
      id="counselling-provided"
      className="rounded-2xl bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8"
    >
      <div className="flex items-center gap-4">
        <div className="flex size-11 items-center justify-center rounded-xl bg-amber-200 text-amber-900">
          <BriefcaseBusiness className="size-5" />
        </div>
        <h2 className="font-headline text-xl font-extrabold text-slate-950 sm:text-2xl">
          Counselling Provided
        </h2>
      </div>

      <div className="mt-7">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
          Specialized Fields
        </p>
        <div className="mt-2 min-h-14 rounded-2xl bg-[#eef4ff] p-3">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-300 px-3 py-1.5 text-sm font-bold text-emerald-900"
              >
                {tag}
                <button
                  type="button"
                  aria-label={`Remove ${tag}`}
                  onClick={() => removeTag(tag)}
                  className="rounded-full p-0.5 transition hover:bg-emerald-400"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}

            {/* Inline add input */}
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add field…"
                className="h-9 w-32 rounded-full border border-dashed border-slate-400 bg-white px-3 text-sm font-bold text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
              />
              <button
                type="button"
                onClick={addTag}
                disabled={!inputValue.trim()}
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-dashed border-slate-400 bg-white px-3 text-sm font-bold text-slate-700 transition hover:border-blue-400 hover:text-blue-700 disabled:opacity-40"
              >
                <BadgePlus className="size-4" />
                Add
              </button>
            </div>
          </div>
        </div>
        <p className="mt-2 text-xs font-medium text-slate-400">
          Press Enter or click Add. These appear on your public profile.
        </p>
      </div>
    </section>
  )
}
