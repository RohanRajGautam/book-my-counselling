import { EarningsHeader } from './components/EarningsHeader'
import { EarningsStats } from './components/EarningsStats'
import { TransactionHistory } from './components/TransactionHistory'

export function EarningsPage() {
  return (
    <div className="min-h-svh overflow-x-hidden bg-[#f8f9ff] text-slate-950">
      <div className="mx-auto w-full max-w-[1180px] space-y-6 px-3 py-5 sm:space-y-8 sm:px-6 sm:py-6 lg:space-y-10 lg:px-8 lg:py-8">
        <EarningsHeader />
        <EarningsStats />
        <TransactionHistory />
      </div>
    </div>
  )
}
