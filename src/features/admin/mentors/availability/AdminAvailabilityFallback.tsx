'use client'

/**
 * Skeleton shown while the admin availability page is hydrating. Matches the
 * final layout so the page swap is invisible to the admin.
 */
export function AdminAvailabilityFallback() {
  return (
    <div className="min-h-svh bg-[#f8f9ff] text-slate-950">
      <div className="mx-auto w-full max-w-[1280px] space-y-6 px-3 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="space-y-3">
          <div className="h-3 w-32 animate-pulse rounded-full bg-slate-200" />
          <div className="h-10 w-72 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-4 w-96 max-w-full animate-pulse rounded-full bg-slate-200" />
        </div>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-8">
          <div className="animate-pulse rounded-[28px] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)] sm:p-8">
            <div className="h-5 w-40 rounded-full bg-slate-100" />
            <div className="mt-6 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-12 rounded-2xl bg-slate-100"
                  style={{ width: `${85 - i * 5}%` }}
                />
              ))}
            </div>
          </div>
          <div className="animate-pulse rounded-[28px] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)] sm:p-8">
            <div className="h-5 w-40 rounded-full bg-slate-100" />
            <div className="mt-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 rounded-xl bg-slate-100"
                  style={{ width: `${90 - i * 10}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
