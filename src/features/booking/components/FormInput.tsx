'use client'

import { InputHTMLAttributes, forwardRef } from 'react'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  optional?: boolean
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, optional, className = '', ...props }, ref) => {
    return (
      <div>
        <label
          htmlFor={props.id}
          className="mb-2 block font-[family-name:var(--font-label)] text-sm font-semibold text-[#434655]"
        >
          {label}
          {optional && <span className="font-normal text-[#737686]"> (Optional)</span>}
        </label>
        <input
          ref={ref}
          className={`w-full rounded-lg border-none bg-[#d9e3f6] px-4 py-3 text-[#121c2a] transition-colors focus:bg-white focus:ring-2 focus:ring-[#004ac6] ${
            error ? 'ring-2 ring-[#ba1a1a]' : ''
          } ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${props.id}-error`} className="mt-2 text-sm text-[#ba1a1a]" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'
