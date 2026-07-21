import { AdminPageHeader } from '../layout/AdminPageHeader'
import { AdminReindexCard } from './components/AdminReindexCard'

export function AdminMaintenancePage() {
  return (
    <div className="min-h-svh overflow-x-hidden bg-[#f8f9ff] text-slate-950">
      <div className="mx-auto w-full max-w-[1280px] space-y-6 px-3 py-5 sm:space-y-8 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <AdminPageHeader
          title="Maintenance"
          subtitle="Operational tasks that keep the platform healthy."
        />

        <div className="grid gap-6 md:grid-cols-2">
          <AdminReindexCard />
          <article className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-4">
              <div className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                <span className="text-lg">⚙️</span>
              </div>
              <div>
                <h2 className="font-headline text-base font-extrabold text-slate-950 sm:text-lg">
                  Platform Health
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  All systems operational. Scheduled jobs and integrations run
                  automatically every few minutes.
                </p>
                <ul className="mt-3 space-y-1.5 text-xs font-semibold text-slate-500">
                  <li>• Search index: in sync</li>
                  <li>• Payment webhooks: connected</li>
                  <li>• Booking notifications: scheduled</li>
                </ul>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}
