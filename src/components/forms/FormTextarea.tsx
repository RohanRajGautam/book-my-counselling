'use client'

import { TextareaHTMLAttributes, forwardRef } from 'react'

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div>
        <label
          htmlFor={props.id}
          className="mb-2 block font-[family-name:var(--font-label)] text-sm font-semibold text-[#434655]"
        >
          {label}
        </label>
        <textarea
          ref={ref}
          className={`w-full resize-none rounded-lg border-none bg-[#d9e3f6] px-4 py-3 text-[#121c2a] transition-colors focus:bg-white focus:ring-2 focus:ring-[#004ac6] ${
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

FormTextarea.displayName = 'FormTextarea'
