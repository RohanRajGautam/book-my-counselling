'use client'

import { useState } from 'react'
import {
  Banknote,
  Check, ChevronLeft, ChevronRight, Clock, Database,
  Loader2, RotateCcw, ShieldCheck, Star, Users, UserCheck, X,
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
  type AdminMentorFilter,
} from '../hooks/useAdminMentors'
import { AdminMentorProfile } from '../types/admin.types'
import { RefundsPanel } from './RefundsPanel'

// ---------------------------------------------------------------------------
// Tab definitions
// Each tab maps to a specific backend filter combination:
//   pending  → is_verified=false, is_rejected=false  (never reviewed)
//   approved → is_verified=true                       (approved)
//   rejected → is_rejected=true                       (explicitly rejected)
//   all      → no filter
// ---------------------------------------------------------------------------

type TabId = 'pending' | 'approved' | 'rejected' | 'all'

const TABS: { id: TabId; label: string; filter: AdminMentorFilter; emptyMsg: string }[] = [
  {
    id: 'pending',
    label: 'Pending',
    filter: { isVerified: false, isRejected: false },
    emptyMsg: 'No pending applications.',
  },
  {
    id: 'approved',
    label: 'Approved',
    filter: { isVerified: true },
    emptyMsg: 'No approved mentors yet.',
  },
  {
    id: 'rejected',
    label: 'Rejected',
    filter: { isRejected: true },
    emptyMsg: 'No rejected applications.',
  },
  {
    id: 'all',
    label: 'All',
    filter: {},
    emptyMsg: 'No mentors found.',
  },
]

function getInitials(name: string) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

type Section = 'mentors' | 'refunds'

export function AdminDashboard() {
  const { user, logout } = useAuth()
  const [section, setSection] = useState<Section>('mentors')
  const [tabId, setTabId] = useState<TabId>('pending')
  const [page, setPage] = useState(1)

  const activeTab = TABS.find((t) => t.id === tabId)!

  const { data: stats } = useAdminStats()
  const { data: mentorsData, isLoading } = useAdminMentors(activeTab.filter, page)
  const { mutate: verify, isPending: verifying } = useVerifyMentor()
  const { mutate: reject, isPending: rejecting } = useRejectMentor()
  const { mutate: feature } = useFeatureMentor()
  const { mutate: reindex, isPending: reindexing } = useReindexES()

  const handleTabChange = (id: TabId) => { setTabId(id); setPage(1) }

  const handleVerify = (id: string, name: string) =>
    verify(id, {
      onSuccess: () => toast.success(`${name} approved.`),
      onError: () => toast.error('Failed to approve mentor.'),
    })

  const handleReject = (id: string, name: string) =>
    reject(id, {
      onSuccess: () => toast.success(`${name} rejected.`),
      onError: () => toast.error('Failed to reject mentor.'),
    })

  const handleFeature = (id: string, featured: boolean, name: string) =>
    feature({ id, featured }, {
      onSuccess: () => toast.success(`${name} ${featured ? 'featured' : 'unfeatured'}.`),
      onError: () => toast.error('Failed to update featured status.'),
    })

  const handleReindex = () =>
    reindex(undefined, {
      onSuccess: (data) => toast.success(data.message),
      onError: () => toast.error('Reindex failed.'),
    })

  return (
    <div className="min-h-svh bg-[#f0f4ff]">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-600">
              <ShieldCheck className="size-4 text-white" />
            </div>
            <div>
              <h1 className="font-headline text-base font-extrabold text-slate-950">Admin Panel</h1>
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
              title="Sync all approved mentor profiles to Elasticsearch search index"
            >
              {reindexing
                ? <Loader2 className="size-3 animate-spin" />
                : <Database className="size-3" />}
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
          <StatCard
            icon={<Users className="size-5 text-blue-600" />}
            label="Total Users"
            value={stats?.total_users ?? '—'}
            bg="bg-blue-50"
          />
          <StatCard
            icon={<ShieldCheck className="size-5 text-emerald-600" />}
            label="Total Mentors"
            value={stats?.total_mentors ?? '—'}
            bg="bg-emerald-50"
          />
          <StatCard
            icon={<Star className="size-5 text-amber-600" />}
            label="Total Bookings"
            value={stats?.total_bookings ?? '—'}
            bg="bg-amber-50"
          />
        </div>

        {/* Section switcher */}
        <div className="mt-8 inline-flex rounded-2xl bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setSection('mentors')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-extrabold transition ${
              section === 'mentors'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserCheck className="size-4" />
            Mentors
          </button>
          <button
            type="button"
            onClick={() => setSection('refunds')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-extrabold transition ${
              section === 'refunds'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Banknote className="size-4" />
            Refunds
          </button>
        </div>

        {section === 'mentors' ? (
          <>
            {/* Mentor sub-tabs */}
            <div className="mt-4 flex gap-1 overflow-x-auto rounded-2xl bg-white p-1 shadow-sm">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleTabChange(t.id)}
                  className={`flex-1 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-extrabold transition ${
                    tabId === t.id
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
                  <p className="text-sm font-semibold text-slate-400">{activeTab.emptyMsg}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {mentorsData.items.map((mentor) => (
                    <MentorRow
                      key={mentor.id}
                      mentor={mentor}
                      tabId={tabId}
                      onVerify={() => handleVerify(mentor.id, mentor.user.full_name)}
                      onReject={() => handleReject(mentor.id, mentor.user.full_name)}
                      onFeature={(featured) =>
                        handleFeature(mentor.id, featured, mentor.user.full_name)
                      }
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
          </>
        ) : (
          <RefundsPanel />
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Mentor row
// ---------------------------------------------------------------------------

function MentorRow({
  mentor,
  tabId,
  onVerify,
  onReject,
  onFeature,
  isActing,
}: {
  mentor: AdminMentorProfile
  tabId: TabId
  onVerify: () => void
  onReject: () => void
  onFeature: (featured: boolean) => void
  isActing: boolean
}) {
  const initials = getInitials(mentor.user.full_name)

  const statusBadge = mentor.is_verified ? (
    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700">
      APPROVED
    </span>
  ) : mentor.is_rejected ? (
    <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-extrabold text-red-600">
      REJECTED
    </span>
  ) : (
    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-700">
      PENDING
    </span>
  )

  return (
    <article className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-center">
      {/* Info */}
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <Avatar className="size-12 shrink-0">
          <AvatarImage src={mentor.user.avatar_url ?? undefined} />
          <AvatarFallback className="bg-blue-100 font-bold text-blue-700">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-headline text-base font-extrabold text-slate-950">
              {mentor.user.full_name}
            </p>
            {statusBadge}
            {mentor.is_featured && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-700">
                FEATURED
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-sm text-slate-500">
            {mentor.title}
            {mentor.company ? ` · ${mentor.company}` : ''}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            NPR {mentor.hourly_rate}/hr · {mentor.years_of_experience} yrs ·{' '}
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
        {/* Approve — show when not yet approved (pending or rejected) */}
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

        {/* Reject — show for pending and approved (not already rejected) */}
        {!mentor.is_rejected && (
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

        {/* Re-review — show only in rejected tab */}
        {tabId === 'rejected' && mentor.is_rejected && (
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
            disabled={isActing}
            onClick={onVerify}
          >
            <RotateCcw className="size-3.5" />
            Re-approve
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
  icon: React.ReactNode
  label: string
  value: number | string
  bg: string
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
