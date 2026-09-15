// Skeleton used while a list page is fetching.

export function EventCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[22px] border border-[#d9e3f6]/70 bg-white p-2 shadow-[0_18px_50px_rgba(18,28,42,0.08)] ring-1 ring-[#004ac6]/5">
      <div className="h-52 animate-pulse rounded-[22px] bg-[#eef4ff] sm:h-56" />
      <div className="space-y-3 px-4 pt-4 pb-4 sm:px-5 sm:pt-5">
        <div className="h-3 w-32 animate-pulse rounded-full bg-[#eef4ff]" />
        <div className="h-5 w-3/4 animate-pulse rounded-[22px] bg-[#eef4ff]" />
        <div className="h-3 w-1/2 animate-pulse rounded-[22px] bg-[#eef4ff]" />
        <div className="space-y-1.5">
          <div className="h-3 w-full animate-pulse rounded-[22px] bg-[#eff4ff]" />
          <div className="h-3 w-5/6 animate-pulse rounded-[22px] bg-[#eff4ff]" />
        </div>
      </div>
    </div>
  )
}

export function EventCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  )
}
