import { DashboardHeader } from './components/DashboardHeader'
import { DashboardStats } from './components/DashboardStats'
import { ProfilePresence } from './components/ProfilePresence'
import { RecentActivity } from './components/RecentActivity'
import { SupportCard } from './components/SupportCard'
import { UpcomingBookings } from './components/UpcomingBookings'

export function MentorDashboard() {
  return (
    <div className="min-h-svh bg-[#f8f9ff] text-slate-950">
      <div className="mx-auto w-full max-w-[1180px] space-y-8 px-4 py-6 sm:px-6 lg:space-y-10 lg:px-8 lg:py-8">
        <DashboardHeader />
        <DashboardStats />

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0 space-y-8 lg:space-y-10">
            <UpcomingBookings />
            <RecentActivity />
          </div>

          <aside className="space-y-6 lg:space-y-7">
            <ProfilePresence />
            <SupportCard />
          </aside>
        </div>
      </div>
    </div>
  )
}
