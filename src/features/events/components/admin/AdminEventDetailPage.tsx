'use client'

import Link from 'next/link'
import { useState } from 'react'
import axios from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, CheckCircle2, Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { AdminPageHeader } from '@/features/admin/layout/AdminPageHeader'

import {
  useAdminEvent,
  useDeleteAdminEvent,
  useMarkEventComplete,
} from '../../hooks/useAdminEvents'
import { useAdminEventBookings } from '../../hooks/useAdminEventBookings'
import {
  ADMIN_EVENT_DETAIL_TABS,
  findAdminEventDetailTab,
  type AdminEventDetailTabId,
} from '../../lib/events.constants'
import { formatLongDate, formatTime } from '../../lib/events.utils'

import { AdminEventBookingsTab } from './AdminEventBookingsTab'
import { AdminEventCompaniesTab } from './AdminEventCompaniesTab'
import { AdminEventDetailsTab } from './AdminEventDetailsTab'
import { AdminEventGalleryTab } from './AdminEventGalleryTab'
import { AdminEventSpeakerTab } from './AdminEventSpeakerTab'
import { AdminEventTabs } from './AdminEventTabs'
import { AdminEventTestimonialsTab } from './AdminEventTestimonialsTab'
import { AdminEventTimelineTab } from './AdminEventTimelineTab'

const VALID_DETAIL_TAB_IDS = new Set<AdminEventDetailTabId>([
  'details',
  'speaker',
  'timeline',
  'gallery',
  'companies',
  'testimonials',
  'bookings',
])

function isDetailTabId(value: string | null): value is AdminEventDetailTabId {
  return !!value && VALID_DETAIL_TAB_IDS.has(value as AdminEventDetailTabId)
}

interface AdminEventDetailPageProps {
  eventId: string
}

export function AdminEventDetailPage({ eventId }: AdminEventDetailPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams?.get('tab')
  const tabId: AdminEventDetailTabId = isDetailTabId(tabParam) ? tabParam : 'details'
  // Touch findAdminEventDetailTab so a stray `?tab=foo` falls back to the first
  // entry in the config — keeps the tab config the single source of truth.
  findAdminEventDetailTab(tabId)

  const { data: event, isLoading, error } = useAdminEvent(eventId)
  const { mutate: markComplete, isPending: marking } = useMarkEventComplete(eventId)
  const { mutate: remove, isPending: deleting } = useDeleteAdminEvent()

  // Cheap "how many seats booked?" lookup. We only need the total — no rows.
  // The page=1+pageSize=1 query is fine because TanStack Query dedupes by key.
  const { data: bookingsHead } = useAdminEventBookings(eventId, 1, 1)
  const bookingCount = bookingsHead?.total

  const [confirmDelete, setConfirmDelete] = useState(false)

  if (isLoading) return <DetailSkeleton />

  // 404 / 403 / network — surface a friendly fallback with a back link.
  if (error || !event) {
    const isNotFound = axios.isAxiosError(error) && error.response?.status === 404
    return (
      <StateShell>
        <div className="mx-auto grid size-14 place-items-center rounded-[22px] bg-amber-50 text-amber-600">
          <ArrowLeft className="size-6" />
        </div>
        <h1 className="mt-4 font-headline text-2xl font-extrabold text-slate-950">
          {isNotFound ? 'Event not found' : 'Could not load this event'}
        </h1>
        <p className="mt-1 max-w-sm text-sm text-slate-600">
          {isNotFound
            ? 'The event may have been deleted. Head back to the events list to pick another.'
            : 'Something went wrong while loading the event. Try again in a moment.'}
        </p>
        <Button
          variant="outline"
          className="mt-5 rounded-[22px]"
          nativeButton={false}
          render={<Link href="/admin/events" />}
        >
          Back to events
        </Button>
      </StateShell>
    )
  }

  const handleTabChange = (next: AdminEventDetailTabId) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '')
    params.set('tab', next)
    router.replace(`/admin/events/${eventId}?${params.toString()}`, { scroll: false })
  }

  const handleMarkComplete = () => {
    markComplete(undefined, {
      onError: () => {
        // useMarkEventComplete already toasts on error; this is just a guard.
      },
    })
  }

  const handleDelete = () => {
    remove(event.id, {
      onSuccess: () => {
        toast.success('Event deleted.')
        router.replace('/admin/events')
      },
      onError: () => {
        toast.error('Failed to delete event. Try again in a moment.')
        setConfirmDelete(false)
      },
    })
  }

  return (
    <div className="min-h-svh bg-[#f8f9ff] text-slate-950">
      <div className="mx-auto w-full max-w-[1280px] min-w-0 space-y-6 overflow-x-hidden px-3 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wide text-slate-500 uppercase hover:text-slate-800"
        >
          <ArrowLeft className="size-3.5" />
          Back to events
        </Link>

        <AdminPageHeader
          title={event.title}
          subtitle={
            event.is_completed
              ? `Marked complete on ${formatLongDate(event.completed_at ?? event.updated_at)}${
                  event.completed_by?.full_name ? ` by ${event.completed_by.full_name}` : ''
                }.`
              : `${formatLongDate(event.event_date)}${
                  event.event_time ? ` · ${event.event_time}` : ''
                }${event.location ? ` · ${event.location}` : ''}`
          }
          action={
            <div className="flex flex-wrap items-center gap-2">
              {event.is_completed ? null : (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleMarkComplete}
                  disabled={marking}
                  className="gap-1.5 rounded-[22px] border-emerald-200 bg-emerald-50 font-bold text-emerald-700 hover:bg-emerald-100"
                >
                  {marking ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="size-4" strokeWidth={2.4} />
                  )}
                  {marking ? 'Marking…' : 'Mark complete'}
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setConfirmDelete(true)}
                className="gap-1.5 rounded-[22px] border-red-200 bg-white font-bold text-red-700 hover:bg-red-50"
              >
                <Trash2 className="size-4" />
                Delete
              </Button>
            </div>
          }
        />

        {event.is_completed ? (
          <div
            role="status"
            className="flex flex-wrap items-start gap-3 rounded-[22px] border border-amber-200 bg-amber-50 px-4 py-3 sm:px-5"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-700">
              <CheckCircle2 className="size-4" strokeWidth={2.4} />
            </span>
            <div className="min-w-0">
              <p className="font-headline text-sm font-extrabold text-amber-900">
                Read-only for new bookings
              </p>
              <p className="mt-0.5 text-xs leading-5 font-medium text-amber-800">
                This event is marked complete
                {event.completed_at
                  ? ` on ${formatLongDate(event.completed_at)} at ${formatTime(event.completed_at)}`
                  : ''}
                {event.completed_by?.full_name ? ` by ${event.completed_by.full_name}` : ''}.
                Event details stay editable — only new public bookings are blocked.
              </p>
            </div>
          </div>
        ) : null}

        <div className="overflow-x-auto rounded-[22px] border border-[#d9e3f6] bg-white p-2 shadow-sm sm:p-3">
          <AdminEventTabs
            tabs={ADMIN_EVENT_DETAIL_TABS}
            value={tabId}
            onChange={handleTabChange}
          />
        </div>

        <section key={tabId} aria-label="Active event section">
          {tabId === 'details' && <AdminEventDetailsTab event={event} />}
          {tabId === 'speaker' && <AdminEventSpeakerTab event={event} />}
          {tabId === 'timeline' && <AdminEventTimelineTab eventId={event.id} items={event.timeline_items} />}
          {tabId === 'gallery' && <AdminEventGalleryTab eventId={event.id} images={event.gallery_images} />}
          {tabId === 'companies' && (
            <AdminEventCompaniesTab eventId={event.id} companies={event.companies} />
          )}
          {tabId === 'testimonials' && (
            <AdminEventTestimonialsTab eventId={event.id} testimonials={event.testimonials} />
          )}
          {tabId === 'bookings' && (
            <AdminEventBookingsTab eventId={event.id} bookingCount={bookingCount} />
          )}
        </section>
      </div>

      {confirmDelete ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Delete event"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4"
        >
          <div className="w-full max-w-sm rounded-[22px] bg-white p-6 shadow-2xl">
            <h2 className="font-headline text-lg font-extrabold text-slate-950">
              Delete this event?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Permanently removes <span className="font-bold">{event.title}</span> and all of
              its timeline rows, gallery images, sponsors, testimonials, and bookings. This
              can&rsquo;t be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
                className="rounded-[22px]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleting}
                className="gap-1.5 rounded-[22px] bg-red-600 text-white hover:bg-red-700"
              >
                {deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                Delete event
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

// ── Loading skeleton ────────────────────────────────────────────────────

function DetailSkeleton() {
  return (
    <div className="min-h-svh bg-[#f8f9ff]">
      <div className="mx-auto w-full max-w-[1280px] space-y-6 px-3 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="h-3 w-24 animate-pulse rounded-full bg-slate-200" />
        <div className="space-y-3">
          <div className="h-10 w-72 animate-pulse rounded-[22px] bg-slate-200" />
          <div className="h-4 w-96 max-w-full animate-pulse rounded-full bg-slate-200" />
        </div>
        <div className="h-12 w-full animate-pulse rounded-[22px] bg-slate-200" />
        <div className="space-y-3">
          <div className="h-44 animate-pulse rounded-[22px] bg-slate-200" />
          <div className="h-44 animate-pulse rounded-[22px] bg-slate-200" />
        </div>
      </div>
    </div>
  )
}

// ── 404 / error shell ───────────────────────────────────────────────────

function StateShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-[#f8f9ff]">
      <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
        {children}
      </div>
    </div>
  )
}
