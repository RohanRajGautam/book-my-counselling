// Suspense fallback for /admin/events/[id]. Mirrors the inner skeleton's
// shape so the layout doesn't shift when the route hydrates.

export function AdminEventDetailFallback() {
  return (
    <div className="min-h-svh bg-[#f8f9ff]">
      <div className="mx-auto w-full max-w-[1280px] space-y-6 px-3 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="h-3 w-24 animate-pulse rounded-full bg-slate-200" />
        <div className="space-y-3">
          <div className="h-10 w-72 animate-pulse rounded-[22px] bg-slate-200" />
          <div className="h-4 w-96 max-w-full animate-pulse rounded-full bg-slate-200" />
        </div>
        <div className="h-12 w-full animate-pulse rounded-[22px] bg-slate-200" />
        <div className="space-y-3">
          <div className="h-44 animate-pulse rounded-[22px] bg-slate-200" />
          <div className="h-44 animate-pulse rounded-[22px] bg-slate-200" />
        </div>
      </div>
    </div>
  )
}
