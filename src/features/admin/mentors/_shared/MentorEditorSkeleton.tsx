export function MentorEditorSkeletonHeader() {
  return (
    <div className="space-y-3">
      <div className="h-3 w-32 animate-pulse rounded-full bg-slate-200" />
      <div className="h-10 w-64 animate-pulse rounded-xl bg-slate-200" />
      <div className="h-4 w-96 max-w-full animate-pulse rounded-full bg-slate-200" />
    </div>
  )
}

export function MentorEditorSkeletonTabs() {
  return <div className="h-12 w-[560px] max-w-full animate-pulse rounded-full bg-slate-200" />
}

export function MentorEditorSkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
      <div className="h-5 w-32 animate-pulse rounded-full bg-slate-200" />
      <div className="mt-6 space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-12 animate-pulse rounded-2xl bg-slate-100"
            style={{ width: `${85 - i * 5}%` }}
          />
        ))}
      </div>
    </div>
  )
}

export function MentorEditorFallbackShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-svh bg-[#f8f9ff] text-slate-950">
      <div className="mx-auto w-full max-w-[1180px] space-y-6 px-3 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        {children}
      </div>
    </div>
  )
}
