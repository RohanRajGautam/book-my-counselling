'use client'

import { useState } from 'react'
import {
  Check, ChevronLeft, ChevronRight, Database,
  Loader2, RefreshCw, ShieldCheck, Star, Users, X,
} from 'lucide-react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/hooks/useAuth'
import {
  useAdminStats,
  useAdminMentors,
  useVerifyMentor,
  useRejectMentor,
  useFeatureMentor,
  useReindexES,
} from '../hooks/useAdminMentors'
import { AdminMentorProfile } from '../types/admin.types'

type Tab = 'pending' | 'approved' | 'all'

const TABS: { label: string; value: Tab; isVerified?: boolean }[] = [
  { label: 'Pending Approval', value: 'pending', isVerified: false },
  { label: 'Approved', value: 'approved', isVerified: true },
  { label: 'All Mentors', value: 'all', isVerified: undefined },
]

function getInitials(name: string) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

export function AdminDashboard() {
  const { user, logout } = useAuth()
  const [tab, setTab] = useState<Tab>('pending')
  const [page, setPage] = useState(1)

  const activeTab = TABS.find((t) => t.value === tab)!
  const { data: stats } = useAdminStats()
  const { data: mentorsData, isLoading } = useAdminMentors(activeTab.isVerified, page)
  const { mutate: verify, isPending: verifying } = useVerifyMentor()
  const { mutate: reject, isPending: rejecting } = useRejectMentor()
  const { mutate: feature } = useFeatureMentor()
  const { mutate: reindex, isPending: reindexing } = useReindexES()

  const handleTabChange = (t: Tab) => { setTab(t); setPage(1) }

  const handleVerify = (id: string, name: string) => {
    verify(id, {
      onSuccess: () => toast.success(`${name} approved.`),
      onError: () => toast.error('Failed to approve mentor.'),
    })
  }

  const handleReject = (id: string, name: string) => {
    reject(id, {
      onSuccess: () => toast.success(`${name} rejected.`),
      onError: () => toast.error('Failed to reject mentor.'),
    })
  }

  const handleFeature = (id: string, featured: boolean, name: string) => {
    feature({ id, featured }, {
      onSuccess: () => toast.success(`${name} ${featured ? 'featured' : 'unfeatured'}.`),
      onError: () => toast.error('Failed to update featured status.'),
    })
  }

  const handleReindex = () => {
    reindex(undefined, {
      onSuccess: (data) => toast.success(data.message),
      onError: () => toast.error('Reindex failed.'),
    })
  }

  return (
    <div className="min-h-svh bg-[#f0f4ff]">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-600">
              <ShieldCheck className="size-4 text-white" />
            </div>
            <div>
              <h1 className="font-headline text-base font-extrabold text-slate-950">
                Admin Panel
              </h1>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl text-xs"
              disabled={reindexing}
              onClick={handleReindex}
            >
              {reindexing ? <Loader2 className="size-3 animate-spin" /> : <Database className="size-3" />}
              Reindex ES
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-xl text-xs text-slate-500"
              onClick={logout}
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard icon={<Users className="size-5 text-blue-600" />} label="Total Users" value={stats?.total_users ?? '—'} bg="bg-blue-50" />
          <StatCard icon={<ShieldCheck className="size-5 text-emerald-600" />} label="Total Mentors" value={stats?.total_mentors ?? '—'} bg="bg-emerald-50" />
          <StatCard icon={<Star className="size-5 text-amber-600" />} label="Total Bookings" value={stats?.total_bookings ?? '—'} bg="bg-amber-50" />
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-1 rounded-2xl bg-white p-1 shadow-sm">
          {TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => handleTabChange(t.value)}
              className={`flex-1 rounded-xl py-2.5 text-sm font-extrabold transition ${
                tab === t.value
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Mentor list */}
        <div className="mt-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-2xl bg-white" />
              ))}
            </div>
          ) : !mentorsData?.items.length ? (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
              <p className="text-sm font-semibold text-slate-400">
                {tab === 'pending' ? 'No pending mentor applications.' : 'No mentors found.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {mentorsData.items.map((mentor) => (
                <MentorRow
                  key={mentor.id}
                  mentor={mentor}
                  tab={tab}
                  onVerify={() => handleVerify(mentor.id, mentor.user.full_name)}
                  onReject={() => handleReject(mentor.id, mentor.user.full_name)}
                  onFeature={(featured) => handleFeature(mentor.id, featured, mentor.user.full_name)}
                  isActing={verifying || rejecting}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {mentorsData && mentorsData.total_pages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                disabled={!mentorsData.has_prev}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <span className="text-sm font-semibold text-slate-600">
                {mentorsData.page} / {mentorsData.total_pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                disabled={!mentorsData.has_next}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Mentor row
// ---------------------------------------------------------------------------

function MentorRow({
  mentor,
  tab,
  onVerify,
  onReject,
  onFeature,
  isActing,
}: {
  mentor: AdminMentorProfile
  tab: Tab
  onVerify: () => void
  onReject: () => void
  onFeature: (featured: boolean) => void
  isActing: boolean
}) {
  const initials = getInitials(mentor.user.full_name)

  return (
    <article className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-center">
      {/* Avatar + info */}
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <Avatar className="size-12 shrink-0">
          <AvatarImage src={mentor.user.avatar_url ?? undefined} />
          <AvatarFallback className="bg-blue-100 font-bold text-blue-700">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-headline text-base font-extrabold text-slate-950">
              {mentor.user.full_name}
            </p>
            {mentor.is_featured && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-700">
                FEATURED
              </span>
            )}
            {mentor.is_verified ? (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700">
                APPROVED
              </span>
            ) : (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-700">
                PENDING
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-sm text-slate-500">
            {mentor.title}{mentor.company ? ` · ${mentor.company}` : ''}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            NPR {mentor.hourly_rate}/hr · {mentor.years_of_experience} yrs exp ·{' '}
            {mentor.is_professional_counselor && 'Professional'}
            {mentor.is_professional_counselor && mentor.is_academic_counselor && ' & '}
            {mentor.is_academic_counselor && 'Academic'}
          </p>
          {mentor.bio && (
            <p className="mt-1 line-clamp-1 text-xs text-slate-400">{mentor.bio}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 flex-wrap gap-2">
        {/* Approve — show for pending or all */}
        {!mentor.is_verified && (
          <Button
            size="sm"
            className="gap-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
            disabled={isActing}
            onClick={onVerify}
          >
            <Check className="size-3.5" />
            Approve
          </Button>
        )}

        {/* Reject — show for pending or approved */}
        {(tab === 'pending' || tab === 'approved' || tab === 'all') && (
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 rounded-xl border-red-200 text-red-600 hover:bg-red-50"
            disabled={isActing}
            onClick={onReject}
          >
            <X className="size-3.5" />
            {mentor.is_verified ? 'Revoke' : 'Reject'}
          </Button>
        )}

        {/* Feature toggle — only for approved */}
        {mentor.is_verified && (
          <Button
            size="sm"
            variant="outline"
            className={`gap-1.5 rounded-xl ${
              mentor.is_featured
                ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            onClick={() => onFeature(!mentor.is_featured)}
          >
            <Star className="size-3.5" />
            {mentor.is_featured ? 'Unfeature' : 'Feature'}
          </Button>
        )}
      </div>
    </article>
  )
}

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------

function StatCard({
  icon, label, value, bg,
}: {
  icon: React.ReactNode; label: string; value: number | string; bg: string
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className={`inline-flex size-10 items-center justify-center rounded-xl ${bg}`}>
        {icon}
      </div>
      <p className="mt-4 text-2xl font-extrabold text-slate-950">{value}</p>
      <p className="mt-1 text-xs font-semibold text-slate-500">{label}</p>
    </div>
  )
}
