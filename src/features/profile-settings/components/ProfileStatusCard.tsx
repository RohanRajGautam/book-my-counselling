'use client'

import { Star, Verified, Activity } from 'lucide-react'
import { useMentorProfile } from '@/features/mentor-dashboard/hooks/useMentorProfile'

export function ProfileStatusCard() {
  const { data: profile } = useMentorProfile()

  const isVerified = profile?.is_verified ?? false
  const rating = profile?.average_rating ?? 0
  const totalReviews = profile?.total_reviews ?? 0

  return (
    <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)] sm:p-8">
      <div className="flex items-center gap-4">
        <div className="flex size-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
          <Activity className="size-5" />
        </div>
        <h2 className="font-headline text-xl font-extrabold text-slate-950 sm:text-2xl">
          Quick Status
        </h2>
      </div>

      <div className="mt-6 space-y-3">
        <StatusRow icon={<Verified className="size-5 text-emerald-700" />} label="Verified Profile">
          <span
            className={`text-xs font-extrabold uppercase ${
              isVerified ? 'text-emerald-700' : 'text-slate-500'
            }`}
          >
            {isVerified ? 'Active' : 'Pending'}
          </span>
        </StatusRow>
        <StatusRow icon={<Star className="size-5 text-amber-700" />} label="Review Average">
          <span className="text-sm font-extrabold text-slate-950">
            {rating > 0 ? `${rating.toFixed(1)} / 5.0` : '—'}
            {totalReviews > 0 && (
              <span className="ml-1 text-xs font-medium text-slate-500">({totalReviews})</span>
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
    <div className="flex min-h-14 items-center justify-between gap-3 rounded-2xl bg-[#eef4ff] px-4">
      <div className="flex items-center gap-3 text-sm font-bold text-slate-800">
        {icon}
        {label}
      </div>
      {children}
    </div>
  )
}
