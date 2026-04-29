import { cn } from '@/lib/utils'

interface SectionContainerProps {
  children: React.ReactNode
  className?: string
  id?: string
}

export function SectionContainer({ children, className, id }: SectionContainerProps) {
  return (
    <section
      id={id}
      className={cn('mx-auto w-full max-w-7xl px-4 py-12 md:px-8 md:py-20 lg:px-16 lg:py-28', className)}
    >
      {children}
    </section>
  )
}
