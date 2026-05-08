'use client'

import { SelectHTMLAttributes, forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  options: { value: string; label: string }[]
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div>
        <label
          htmlFor={props.id}
          className="mb-2 block font-[family-name:var(--font-label)] text-sm font-semibold text-[#434655]"
        >
          {label}
        </label>
        <div className="relative">
          <select
            ref={ref}
            className={`w-full cursor-pointer appearance-none rounded-lg border-none bg-[#d9e3f6] px-4 py-3 text-[#121c2a] transition-colors focus:bg-white focus:ring-2 focus:ring-[#004ac6] ${
              error ? 'ring-2 ring-[#ba1a1a]' : ''
            } ${className}`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-[#434655]" />
        </div>
        {error && (
          <p id={`${props.id}-error`} className="mt-2 text-sm text-[#ba1a1a]" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

FormSelect.displayName = 'FormSelect'
