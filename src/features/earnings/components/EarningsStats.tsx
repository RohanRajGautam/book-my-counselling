'use client'

import { Banknote, Landmark, WalletCards } from 'lucide-react'
import { useMentorBookings } from '@/features/mentor-dashboard/hooks/useMentorBookings'

function sumEarnings(items: { agreed_price: string; payment_status: string }[]): number {
  return items
    .filter((b) => b.payment_status === 'paid')
    .reduce((sum, b) => sum + parseFloat(b.agreed_price), 0)
}

function formatCurrency(amount: number): string {
  return `NPR ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function EarningsStats() {
  // Fetch all completed bookings (up to 100 for stats)
  const { data: completedData, isLoading } = useMentorBookings('completed', 1, 100)
  const { data: confirmedData } = useMentorBookings('confirmed', 1, 100)

  const completedBookings = completedData?.items ?? []
  const confirmedBookings = confirmedData?.items ?? []

  const totalEarned = sumEarnings(completedBookings)
  const pendingEarnings = confirmedBookings.reduce(
    (sum, b) => sum + parseFloat(b.agreed_price),
    0
  )

  return (
    <section aria-label="Earnings statistics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <EarningsStatCard
        icon={<WalletCards className="size-5 text-blue-700" />}
        label="Total Earned"
        value={isLoading ? '—' : formatCurrency(totalEarned)}
        helper={`From ${completedData?.total ?? 0} completed session${completedData?.total !== 1 ? 's' : ''}`}
        helperClassName="text-emerald-700"
        iconClassName="bg-blue-100"
      />
      <EarningsStatCard
        icon={<Landmark className="size-5 text-amber-800" />}
        label="Pending (Confirmed)"
        value={isLoading ? '—' : formatCurrency(pendingEarnings)}
        helper={`${confirmedData?.total ?? 0} upcoming session${confirmedData?.total !== 1 ? 's' : ''}`}
        helperClassName="text-slate-500"
        iconClassName="bg-amber-100"
      />
      <EarningsStatCard
        icon={<Banknote className="size-5 text-emerald-800" />}
        label="Total Sessions"
        value={isLoading ? '—' : String(completedData?.total ?? 0)}
        helper="Lifetime completed"
        helperClassName="text-slate-500"
        iconClassName="bg-emerald-100"
      />
    </section>
  )
}

function EarningsStatCard({
  icon,
  label,
  value,
  helper,
  helperClassName,
  iconClassName,
}: {
  icon: React.ReactNode
  label: string
  value: string
  helper: string
  helperClassName: string
  iconClassName: string
}) {
  return (
    <article className="min-h-[176px] rounded-2xl bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6 lg:min-h-[200px] lg:p-8">
      <div className={`flex size-11 items-center justify-center rounded-xl ${iconClassName}`}>
        {icon}
      </div>
      <h2 className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </h2>
      <p className="mt-2 text-3xl font-extrabold leading-tight tracking-normal text-slate-950 lg:text-4xl">
        {value}
      </p>
      <p className={`mt-5 text-sm font-extrabold ${helperClassName}`}>{helper}</p>
    </article>
  )
}
