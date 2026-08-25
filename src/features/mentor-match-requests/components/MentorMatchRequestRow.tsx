'use client'

import { useState } from 'react'
import { Calendar, Check, ChevronRight, Copy, Mail, MessageSquare } from 'lucide-react'

import type { MentorMatchResponse } from '../types/mentor-match-requests.types'
import { badgeClasses, STATUS_LABEL } from '../lib/requestBadges'
import { formatAbsoluteTime, formatRelativeTime, getRequesterInitials } from '../lib/datetime'

interface MentorMatchRequestRowProps {
  request: MentorMatchResponse
  onOpen: () => void
}

export function MentorMatchRequestRow({ request, onOpen }: MentorMatchRequestRowProps) {
  const [copied, setCopied] = useState(false)

  function handleCopyEmail(ev: React.MouseEvent) {
    ev.stopPropagation()
    void navigator.clipboard.writeText(request.requester_email)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  function handleKeyDown(ev: React.KeyboardEvent<HTMLDivElement>) {
    if (ev.key === 'Enter' || ev.key === ' ') {
      // Don't hijack presses that originate inside an interactive child (copy button, mailto, etc.).
      if (ev.target !== ev.currentTarget) return
      ev.preventDefault()
      onOpen()
    }
  }

  const decidedByName = request.decided_by?.full_name ?? request.decided_by?.email ?? null

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={handleKeyDown}
      className="group block w-full cursor-pointer rounded-2xl bg-white p-5 text-left shadow-sm ring-1 ring-slate-200/70 transition hover:ring-[var(--brand-blue)]/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]/40 sm:p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-50 text-sm font-extrabold text-blue-700 shadow-sm sm:size-14">
            {getRequesterInitials(request.requester_name, request.requester_email)}
          </div>

          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className={badgeClasses(request.status)}>{STATUS_LABEL[request.status]}</span>
              <h3 className="font-[family-name:var(--font-headline)] truncate text-base font-extrabold tracking-tight text-slate-950 sm:text-lg">
                {request.preferred_expertise}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-slate-600 sm:text-sm">
              <span className="inline-flex items-center gap-1.5">
                <span className="truncate text-slate-900">{request.requester_name}</span>
              </span>
              <button
                type="button"
                title={`Copy ${request.requester_email}`}
                aria-label={`Copy email ${request.requester_email}`}
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-blue-700 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]/30"
              >
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                <span className="font-mono text-[11px] tracking-tight sm:text-xs">
                  {request.requester_email}
                </span>
              </button>
              <a
                href={`mailto:${request.requester_email}`}
                onClick={(ev) => ev.stopPropagation()}
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <Mail className="size-3.5" aria-hidden="true" />
                <span className="text-xs font-semibold">Send email</span>
              </a>
            </div>

            {request.goals ? (
              <p className="mt-1 line-clamp-2 text-sm leading-6 font-medium text-slate-600">
                <MessageSquare
                  className="mr-1.5 inline-block size-3.5 -translate-y-0.5 text-slate-400"
                  aria-hidden="true"
                />
                {request.goals}
              </p>
            ) : null}

            {request.preferred_at ? (
              <p className="mt-1 text-sm font-bold text-slate-700">
                <Calendar
                  className="mr-1.5 inline-block size-3.5 -translate-y-0.5 text-[var(--brand-blue)]"
                  aria-hidden="true"
                />
                Wants to meet {formatAbsoluteTime(request.preferred_at)}
              </p>
            ) : null}

            {(decidedByName || request.decision_at) && (
              <p className="mt-1 text-[11px] font-medium text-slate-500">
                {decidedByName ? <>Last touched by {decidedByName}</> : 'Last touched'}
                {request.decision_at ? <> · {formatRelativeTime(request.decision_at)}</> : null}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-start">
          <p className="text-[10px] font-extrabold tracking-[0.16em] text-slate-400 uppercase">
            Filed
          </p>
          <p className="text-sm font-extrabold text-slate-700">
            {formatRelativeTime(request.created_at)}
          </p>
          <ChevronRight
            className="size-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-[var(--brand-blue)]"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  )
}
