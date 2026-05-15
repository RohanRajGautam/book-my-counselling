'use client'

import { Eye, Star, Verified } from 'lucide-react'
import { useMentorProfile } from '@/features/mentor-dashboard/hooks/useMentorProfile'

export function ProfileStatusCard() {
  const { data: profile } = useMentorProfile()

  const isVerified = profile?.is_verified ?? false
  const isAccepting = profile?.is_accepting_bookings ?? false
  const rating = profile?.average_rating ?? 0
  const totalReviews = profile?.total_reviews ?? 0

  return (
    <section className="rounded-2xl bg-[#eef4ff] p-5 shadow-sm sm:rounded-3xl sm:p-7">
      <h2 className="font-headline text-xl font-extrabold text-slate-950">Quick Status</h2>

      <div className="mt-6 space-y-4">
        <StatusRow icon={<Verified className="size-5 text-emerald-700" />} label="Verified Profile">
          <span
            className={`text-xs font-extrabold uppercase ${
              isVerified ? 'text-emerald-700' : 'text-slate-400'
            }`}
          >
            {isVerified ? 'Active' : 'Pending'}
          </span>
        </StatusRow>
        {/* <StatusRow icon={<Eye className="size-5 text-blue-700" />} label="Accepting Bookings">
          <span
            className={`relative h-6 w-11 rounded-full transition-colors ${
              isAccepting ? 'bg-blue-700' : 'bg-slate-300'
            }`}
          >
            <span
              className={`absolute top-1 size-4 rounded-full bg-white transition-all ${
                isAccepting ? 'right-1' : 'left-1'
              }`}
            />
          </span>
        </StatusRow> */}
        <StatusRow icon={<Star className="size-5 text-amber-700" />} label="Review Average">
          <span className="text-sm font-extrabold text-slate-950">
            {rating > 0 ? `${rating.toFixed(1)} / 5.0` : '—'}
            {totalReviews > 0 && (
              <span className="ml-1 text-xs font-medium text-slate-400">({totalReviews})</span>
            )}
          </span>
        </StatusRow>
      </div>
    </section>
  )
}

function StatusRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-14 items-center justify-between gap-3 rounded-2xl bg-white px-4">
      <div className="flex items-center gap-3 text-sm font-bold text-slate-800">
        {icon}
        {label}
      </div>
      {children}
    </div>
  )
}
