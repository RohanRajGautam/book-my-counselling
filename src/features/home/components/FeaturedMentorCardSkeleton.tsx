export function FeaturedMentorCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_18px_50px_rgba(18,28,42,0.08)] ring-1 ring-slate-200/70">
      <div className="aspect-[4/3] w-full animate-pulse rounded-t-3xl bg-gradient-to-br from-[var(--brand-blue-surface)] to-[var(--brand-blue-soft)]" />
      <div className="flex flex-1 flex-col gap-3 px-5 pt-5 pb-5">
        <div className="h-5 w-2/3 animate-pulse rounded-full bg-slate-100" />
        <div className="h-4 w-1/2 animate-pulse rounded-full bg-slate-100" />
        <div className="flex gap-1.5">
          <div className="h-4 w-14 animate-pulse rounded-full bg-slate-100" />
          <div className="h-4 w-12 animate-pulse rounded-full bg-slate-100" />
        </div>
        <div className="h-4 w-1/3 animate-pulse rounded-full bg-slate-100" />
        <div className="mt-auto h-10 w-full animate-pulse rounded-full bg-slate-100" />
      </div>
    </div>
  )
}