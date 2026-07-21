export type AdminPageHeaderProps = {
  title: string
  subtitle?: string
  /** Rendered on the right (filters, refresh button, etc.). */
  action?: React.ReactNode
}

/**
 * Consistent top-of-page header used across all admin routes.
 * Mirrors the `EarningsHeader` pattern from the mentor side, but stripped down
 * to the admin context (no avatar/notification chrome — that's in the sidebar).
 */
export function AdminPageHeader({ title, subtitle, action }: AdminPageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-headline text-2xl leading-tight font-extrabold tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-sm leading-6 font-medium text-slate-500 sm:text-base sm:leading-7">
            {subtitle}
          </p>
        ) : null}
      </div>
      {action ? <div className="flex shrink-0 items-center gap-3">{action}</div> : null}
    </header>
  )
}
