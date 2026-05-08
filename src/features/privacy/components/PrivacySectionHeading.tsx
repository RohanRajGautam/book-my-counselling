import type { ReactNode } from 'react'

interface PrivacySectionHeadingProps {
  icon: ReactNode
  iconClassName: string
  title: string
  titleClassName?: string
}

export function PrivacySectionHeading({
  icon,
  iconClassName,
  title,
  titleClassName = 'text-[#121c2a]',
}: PrivacySectionHeadingProps) {
  return (
    <div className="flex items-center gap-4">
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconClassName}`}>
        {icon}
      </div>
      <h2
        className={`font-[family-name:var(--font-headline)] text-3xl font-extrabold tracking-tight ${titleClassName}`}
      >
        {title}
      </h2>
    </div>
  )
}
