'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect } from 'react'
import { ArrowLeft, CalendarPlus, ShieldCheck, UserX } from 'lucide-react'

import { useMentor } from '@/features/mentors/hooks/useMentor'
import { Button } from '@/components/ui/button'

import { AvailabilityRequestForm } from './AvailabilityRequestForm'

interface RequestAvailabilityPageProps {
  mentorId: string | null
}

/**
 * Dedicated landing page for `/request-availability?mentorId=...`.
 *
 * Renders the form inline (no nested modal) so duration pickers, datetime
 * inputs, and textareas never fight with focus-trap dismissal. Resolves the
 * mentor and shows either the request form, a loading skeleton, a friendly
 * "Pick a mentor first" empty state, or a "mentor not found" state.
 */
export function RequestAvailabilityPage({ mentorId }: RequestAvailabilityPageProps) {
  const { data: mentor, isPending, error } = useMentor(mentorId)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [mentorId])

  if (!mentorId) return <PickMentorFirstState />
  if (isPending) return <RequestAvailabilitySkeleton />
  if (error || !mentor) return <MentorNotFoundState />

  const mentorName = mentor.user?.full_name ?? 'this mentor'
  const firstName =
    (mentorName.split(' ')[0] ?? mentorName).replace(/[^\p{L}\p{M}]/gu, '') || 'this mentor'
  const mentorTitle = mentor.title ?? null
  const mentorAvatarUrl = mentor.user?.avatar_url ?? null

  return (
    <div className="min-h-svh bg-[#f8f9ff] text-slate-950 antialiased">
      <div className="mx-auto w-full max-w-[1180px] px-4 pt-[88px] pb-16 sm:px-6 sm:pt-[92px] sm:pb-20 lg:px-8 lg:pt-[96px] lg:pb-24">
        {/* Back link */}
        <Link
          href={`/academic-counsellor/${mentorId}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 py-4 text-xs font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-blue-700"
        >
          <ArrowLeft className="size-3.5" strokeWidth={2.4} />
          Back to {firstName}&apos;s profile
        </Link>

        {/* Page header */}
        <header className="mt-6 max-w-2xl">
          <h1 className="font-headline text-3xl leading-[1.1] font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            Request a session with {firstName}
          </h1>
          <p className="mt-3 text-sm leading-6 font-medium text-slate-600 sm:text-base">
            Tell {firstName} {''} when you&apos;d like to meet and for how long. They&apos;ll review
            your request and email you a booking link if they can open that time.
          </p>
        </header>

        {/* Main grid: form + side rail */}
        <div className="mt-8 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-8">
          {/* Form card */}
          <section className="rounded-3xl bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)] sm:p-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <CalendarPlus className="size-5" strokeWidth={2.4} />
              </div>
              <div>
                <h2 className="font-headline text-lg font-extrabold tracking-tight text-slate-950 sm:text-xl">
                  Your request
                </h2>
                <p className="mt-0.5 text-xs font-medium text-slate-500">Takes about a minute.</p>
              </div>
            </div>

            <div className="mt-6">
              <AvailabilityRequestForm mentorId={mentorId} mentorName={mentorName} />
            </div>
          </section>

          {/* Side rail */}
          <aside className="space-y-5">
            {/* Mentor card */}
            <section className="rounded-3xl bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
              <p className="text-[10px] font-extrabold tracking-[0.16em] text-slate-500 uppercase">
                Requesting from
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-blue-50 shadow-sm ring-2 ring-white">
                  {mentorAvatarUrl ? (
                    <Image
                      src={mentorAvatarUrl}
                      alt={mentorName}
                      width={48}
                      height={48}
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="font-headline flex size-full items-center justify-center text-sm font-extrabold text-blue-700">
                      {mentorName
                        .split(' ')
                        .map((p) => p[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-headline truncate text-sm font-extrabold text-slate-950">
                    {mentorName}
                  </h3>
                  {mentorTitle ? (
                    <p className="mt-0.5 truncate text-xs font-medium text-slate-600">
                      {mentorTitle}
                    </p>
                  ) : null}
                </div>
              </div>
            </section>

            {/* How it works */}
            <section className="rounded-3xl bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
              <p className="text-[10px] font-extrabold tracking-[0.16em] text-slate-500 uppercase">
                How it works
              </p>
              <ol className="mt-4 space-y-3">
                <Step
                  n={1}
                  title="You send a request"
                  body="Pick a duration and a time that suits you."
                />
                <Step
                  n={2}
                  title={`${firstName} replies`}
                  body="Most mentors respond within a day."
                />
                <Step n={3} title="Slot opens" body="If accepted, we email you a booking link." />
              </ol>
            </section>

            {/* Privacy reassurance */}
            <section className="rounded-3xl bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
              <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <ShieldCheck className="size-4" strokeWidth={2.4} />
                </div>
                <div>
                  <p className="font-headline text-xs font-extrabold text-slate-950">
                    Your info stays private
                  </p>
                  <p className="mt-1 text-xs leading-5 font-medium text-slate-600">
                    Only {firstName} sees your name and email — and only for this request.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[11px] font-extrabold text-blue-700">
        {n}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-headline text-xs font-extrabold text-slate-950">{title}</p>
        <p className="mt-0.5 text-xs leading-5 font-medium text-slate-500">{body}</p>
      </div>
    </li>
  )
}

function RequestAvailabilitySkeleton() {
  return (
    <div className="min-h-svh bg-[#f8f9ff]">
      <div className="mx-auto w-full max-w-[1180px] px-4 pt-[88px] pb-16 sm:px-6 sm:pt-[92px] sm:pb-20 lg:px-8 lg:pt-[96px] lg:pb-24">
        <div className="h-9 w-40 animate-pulse rounded-full bg-white shadow-sm" />
        <div className="mt-6 space-y-3">
          <div className="h-10 w-3/4 animate-pulse rounded-lg bg-white" />
          <div className="h-5 w-2/3 animate-pulse rounded bg-white" />
        </div>
        <div className="mt-8 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-8">
          <div className="h-[640px] animate-pulse rounded-3xl bg-white" />
          <div className="space-y-5">
            <div className="h-32 animate-pulse rounded-3xl bg-white" />
            <div className="h-56 animate-pulse rounded-3xl bg-white" />
            <div className="h-28 animate-pulse rounded-3xl bg-white" />
          </div>
        </div>
      </div>
    </div>
  )
}

function PickMentorFirstState() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-[#f8f9ff] px-4 pt-[88px] pb-16 sm:px-6 sm:pt-[92px] sm:pb-20 lg:px-8 lg:pt-[96px]">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-10">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
          <CalendarPlus className="size-7" strokeWidth={2.2} />
        </div>
        <h1 className="font-headline mt-5 text-2xl font-extrabold tracking-tight text-slate-950">
          Pick a mentor first
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-600">
          Browse our mentors and use the &ldquo;Request availability&rdquo; option on their profile
          to ask them to open a specific time slot.
        </p>
        <Button
          nativeButton={false}
          render={<Link href="/academic-counsellor" />}
          className="mt-6 h-11 w-full rounded-xl bg-[#0755d8] font-bold text-white shadow-[0_8px_20px_rgba(7,85,216,0.22)] hover:bg-blue-700"
        >
          Find a mentor
        </Button>
      </div>
    </div>
  )
}

function MentorNotFoundState() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-[#f8f9ff] px-4 pt-[88px] pb-16 sm:px-6 sm:pt-[92px] sm:pb-20 lg:px-8 lg:pt-[96px]">
      <div className="w-full max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-10">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
          <UserX className="size-7" strokeWidth={2.2} />
        </div>
        <h1 className="font-headline mt-5 text-2xl font-extrabold tracking-tight text-red-700">
          We couldn&apos;t find that mentor
        </h1>
        <p className="mt-2 text-sm font-medium text-red-600">
          The link may be expired or the mentor&apos;s profile is no longer available.
        </p>
        <Button
          nativeButton={false}
          render={<Link href="/academic-counsellor" />}
          className="mt-6 h-11 w-full rounded-xl bg-red-600 font-bold text-white hover:bg-red-700"
        >
          Back to mentors
        </Button>
      </div>
    </div>
  )
}
