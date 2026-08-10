import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-slate-100", className)}
      {...props}
    />
  )
}

const CARD_RADIUS = "rounded-2xl"
const CARD_RADIUS_LARGE = "rounded-3xl"
const CARD_SHADOW = "shadow-[0_16px_40px_rgba(18,28,42,0.04)]"
const CARD_SHADOW_HEAVY = "shadow-[0_18px_45px_rgba(15,23,42,0.04)]"

function MentorCardSkeleton() {
  return (
    <div
      className={cn(
        "flex h-full flex-col p-5",
        CARD_RADIUS,
        "bg-white",
        CARD_SHADOW,
      )}
    >
      <div className="mb-4 flex h-[80px] items-center gap-4">
        <Skeleton className="size-[78px] shrink-0 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>

      <div className="mb-4 flex h-[28px] items-center gap-2">
        <Skeleton className="size-7 rounded-md" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="mb-4 space-y-2">
        <Skeleton className="h-3 w-24" />
        <div className="flex min-h-[30px] flex-wrap gap-2">
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-16 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>
      </div>

      <div className="flex-1" />

      <Skeleton className="mb-4 h-4 w-32" />

      <div className="border-t border-slate-100 pt-4">
        <Skeleton className="mb-2 h-3 w-28" />
        <div className="mb-3 flex gap-2">
          <Skeleton className="h-14 flex-1 rounded-xl" />
          <Skeleton className="h-14 flex-1 rounded-xl" />
          <Skeleton className="h-14 flex-1 rounded-xl" />
        </div>
        <Skeleton className="h-9 w-full rounded-xl" />
      </div>
    </div>
  )
}

function CardSkeleton({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "animate-pulse",
        CARD_RADIUS_LARGE,
        "bg-white p-5 sm:p-6",
        CARD_SHADOW,
        className,
      )}
    >
      {children}
    </div>
  )
}

function HeavyCardSkeleton({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[28px] bg-white p-5 sm:p-8",
        CARD_SHADOW_HEAVY,
        className,
      )}
    >
      {children}
    </div>
  )
}

function StatCardSkeleton() {
  return (
    <div
      className={cn(
        "min-h-[132px] rounded-2xl bg-[#eef4ff] p-5 shadow-sm sm:min-h-[148px] sm:rounded-3xl sm:p-6 lg:p-7",
        "animate-pulse space-y-3",
      )}
    >
      <Skeleton className="h-3 w-24 rounded-md bg-white/50" />
      <Skeleton className="h-8 w-32 rounded-md bg-white/60" />
      <Skeleton className="h-3 w-20 rounded-md bg-white/40" />
    </div>
  )
}

function TableRowSkeleton({ cells = 4 }: { cells?: number }) {
  return (
    <div className="grid animate-pulse items-center gap-3 border-b border-slate-100 px-4 py-5 md:min-h-20">
      {Array.from({ length: cells }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn(
            "h-4 rounded-md",
            index === 0 ? "w-40" : "w-24",
            index === cells - 1 && "ml-auto",
          )}
        />
      ))}
    </div>
  )
}

function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/60">
      <div className="grid animate-pulse items-center gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3">
        <Skeleton className="h-3 w-24 rounded-md bg-slate-200" />
        <Skeleton className="h-3 w-20 rounded-md bg-slate-200" />
        <Skeleton className="h-3 w-16 rounded-md bg-slate-200" />
      </div>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRowSkeleton key={index} />
      ))}
    </div>
  )
}

function ProfileModalSkeleton() {
  return (
    <>
      <div className="flex flex-col gap-4 sm:gap-5 lg:col-span-4">
        <CardSkeleton className="relative flex flex-col items-center overflow-hidden p-5 text-center sm:p-6 lg:p-7">
          <Skeleton className="size-28 rounded-full" />
          <Skeleton className="mt-5 h-6 w-40" />
          <Skeleton className="mt-2 h-4 w-56" />
          <div className="mt-5 grid w-full grid-cols-2 gap-3">
            <Skeleton className="h-12 rounded-2xl" />
            <Skeleton className="h-12 rounded-2xl" />
          </div>
        </CardSkeleton>
        <CardSkeleton className="h-[140px]" />
        <CardSkeleton className="h-[260px]" />
      </div>

      <div className="flex flex-col gap-4 pb-6 sm:gap-5 sm:pb-8 lg:col-span-8 lg:gap-6 lg:pb-0">
        <CardSkeleton className="h-[160px]">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-5/6" />
          <Skeleton className="mt-2 h-4 w-4/6" />
        </CardSkeleton>
        <CardSkeleton className="h-[200px]">
          <div className="mb-4 flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-3 w-40" />
            </div>
            <Skeleton className="h-7 w-20 rounded-full" />
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
            <Skeleton className="h-[120px] rounded-3xl" />
            <Skeleton className="h-[120px] rounded-3xl" />
            <Skeleton className="h-[120px] rounded-3xl" />
          </div>
        </CardSkeleton>
        <CardSkeleton className="h-[240px]">
          <div className="mb-4 flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-7 w-24 rounded-full" />
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 14 }).map((_, index) => (
              <Skeleton key={index} className="h-10 rounded-md" />
            ))}
          </div>
        </CardSkeleton>
      </div>
    </>
  )
}

function NavRowSkeleton() {
  return (
    <div className="flex h-12 items-center gap-3 rounded-2xl bg-slate-50/60 px-3">
      <Skeleton className="size-9 shrink-0 rounded-xl bg-white" />
      <Skeleton className="h-3.5 w-28 rounded-md bg-white" />
    </div>
  )
}

/**
 * Sidebar skeleton mirroring the `MentorSidebar` / `AdminSidebar` shell.
 * Hidden on mobile (the dashboard uses a `MobileHeader` instead), visible on lg+.
 * `statusColor` controls the brand status-pill dot: "emerald" for mentor, "blue" for admin.
 */
function DashboardSidebarSkeleton({
  navCount = 5,
  statusColor = "emerald",
}: {
  navCount?: number
  statusColor?: "emerald" | "blue"
}) {
  const dotClass =
    statusColor === "blue"
      ? "bg-blue-500"
      : "bg-emerald-500"

  return (
    <aside
      aria-hidden
      className="sticky top-0 hidden h-dvh w-[var(--sidebar-width,272px)] shrink-0 flex-col border-r border-slate-200/70 bg-white lg:flex"
    >
      {/* Brand */}
      <div className="px-5 pt-7 pb-6">
        <div className="flex items-center gap-3">
          <Skeleton className="size-11 shrink-0 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-500" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-40 rounded-md bg-slate-200" />
            <div className="flex items-center gap-1.5">
              <span className={cn("size-2 rounded-full", dotClass)} />
              <Skeleton className="h-3 w-20 rounded-md bg-slate-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 px-4 pt-1 pb-5">
        <Skeleton className="mb-3 ml-3 h-3 w-20 rounded-md bg-slate-200" />
        <div className="space-y-1.5">
          {Array.from({ length: navCount }).map((_, index) => (
            <NavRowSkeleton key={index} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200/70 px-4 pt-3 pb-5">
        <div className="rounded-2xl bg-[#f8f9ff] p-3">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 shrink-0 rounded-full border-2 border-white bg-gradient-to-br from-blue-600 to-blue-700" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-3.5 w-24 rounded-md bg-slate-200" />
              <Skeleton className="h-2.5 w-16 rounded-md bg-slate-200" />
            </div>
            <Skeleton className="size-9 shrink-0 rounded-xl border border-slate-200 bg-white" />
          </div>
        </div>
      </div>
    </aside>
  )
}

/**
 * Mobile-only header skeleton mirroring the `MentorMobileHeader` / `AdminMobileHeader`.
 * Hidden on lg+, visible below.
 */
function DashboardMobileHeaderSkeleton({
  statusColor = "emerald",
}: {
  statusColor?: "emerald" | "blue"
}) {
  const labelClass =
    statusColor === "blue"
      ? "bg-blue-100"
      : "bg-emerald-100"

  return (
    <div className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-slate-200/70 bg-white/95 px-3 backdrop-blur md:hidden sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <Skeleton className="h-7 w-7 shrink-0 rounded-md bg-slate-200" />
        <div className="min-w-0 space-y-1.5">
          <Skeleton className={cn("h-2.5 w-20 rounded-md", labelClass)} />
          <Skeleton className="h-3.5 w-28 rounded-md bg-slate-200" />
        </div>
      </div>
      <Skeleton className="size-11 shrink-0 rounded-xl border border-slate-200 bg-white" />
    </div>
  )
}

/**
 * Generic page-content skeleton sized like a dashboard panel.
 * `title` controls the headline row; `showAction` toggles a right-side action chip.
 */
function DashboardContentHeader({
  title,
  showAction = false,
  actionTone = "blue",
}: {
  title: string
  showAction?: boolean
  actionTone?: "blue" | "emerald"
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1 space-y-3">
        <Skeleton className="h-8 w-72 max-w-full rounded-md bg-slate-200 sm:h-9 lg:h-10" />
        <Skeleton className="h-4 w-80 max-w-full rounded-md bg-slate-100" />
      </div>
      {showAction ? (
        <Skeleton
          className={cn(
            "h-7 w-28 shrink-0 rounded-full",
            actionTone === "emerald" ? "bg-emerald-100" : "bg-blue-100",
          )}
        />
      ) : null}
    </header>
  )
}

/**
 * Page-level loading shell for `/mentor/dashboard`. Renders just the sidebar +
 * mobile header + a minimal page-header placeholder. Detailed content skeletons
 * are intentionally omitted — the page itself handles its own loading states.
 */
function MentorDashboardSkeleton() {
  return (
    <div className="min-h-svh overflow-x-hidden bg-[#f8f9ff] text-slate-950">
      <DashboardMobileHeaderSkeleton statusColor="emerald" />
      <div className="flex">
        <DashboardSidebarSkeleton navCount={5} statusColor="emerald" />
        <div className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1180px] px-3 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-3">
                <Skeleton className="h-9 w-72 rounded-md bg-slate-200 sm:h-10 lg:h-12" />
                <Skeleton className="h-4 w-80 rounded-md bg-slate-100" />
              </div>
              <div className="hidden items-center gap-4 sm:flex">
                <Skeleton className="size-11 rounded-full bg-white shadow-sm" />
                <Skeleton className="size-12 rounded-full bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Page-level loading shell for `/admin/dashboard`. Renders just the sidebar +
 * mobile header + a minimal page-header placeholder. Detailed content skeletons
 * are intentionally omitted — the page itself handles its own loading states.
 */
function AdminDashboardSkeleton() {
  return (
    <div className="min-h-svh overflow-x-hidden bg-[#f8f9ff] text-slate-950">
      <DashboardMobileHeaderSkeleton statusColor="blue" />
      <div className="flex">
        <DashboardSidebarSkeleton navCount={6} statusColor="blue" />
        <div className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1280px] px-3 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1 space-y-3">
                <Skeleton className="h-7 w-56 rounded-md bg-slate-200 sm:h-8 lg:h-10" />
                <Skeleton className="h-4 w-80 rounded-md bg-slate-100" />
              </div>
              <Skeleton className="h-7 w-28 shrink-0 rounded-full bg-emerald-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Generic auth-gate loading shell for the mentor/admin dashboard. Renders just
 * the sidebar + mobile header + a minimal page-header placeholder. Detailed
 * content skeletons are intentionally omitted — the page itself handles its own
 * loading states.
 */
function AuthShellSkeleton() {
  return (
    <div className="min-h-svh bg-[#f8f9ff]">
      <DashboardMobileHeaderSkeleton statusColor="emerald" />
      <div className="flex">
        <DashboardSidebarSkeleton navCount={5} statusColor="emerald" />
        <div className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1180px] px-3 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <DashboardContentHeader title="Dashboard" />
          </div>
        </div>
      </div>
    </div>
  )
}

export {
  Skeleton,
  MentorCardSkeleton,
  CardSkeleton,
  HeavyCardSkeleton,
  StatCardSkeleton,
  TableRowSkeleton,
  TableSkeleton,
  ProfileModalSkeleton,
  DashboardSidebarSkeleton,
  DashboardMobileHeaderSkeleton,
  DashboardContentHeader,
  MentorDashboardSkeleton,
  AdminDashboardSkeleton,
  AuthShellSkeleton,
}
