'use client'

import { useState } from 'react'
import { Check, Copy, Eye, EyeOff, KeyRound, Mail, ShieldAlert, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'

export interface AdminTempPasswordDialogProps {
  open: boolean
  mentorName: string
  mentorEmail: string
  tempPassword: string
  onClose: () => void
  onViewed: () => void
}

type CopyTarget = 'email' | 'password' | 'both' | null

/**
 * Modal shown after a successful mentor creation. Displays the mentor's email
 * and one-time `temp_password` returned by the API, each with copy buttons.
 * Closing (via Esc/backdrop or the confirm button) counts as a view.
 */
export function AdminTempPasswordDialog({
  open,
  mentorName,
  mentorEmail,
  tempPassword,
  onClose,
  onViewed,
}: AdminTempPasswordDialogProps) {
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState<CopyTarget>(null)
  const [viewed, setViewed] = useState(false)

  const handleCopy = async (target: 'email' | 'password') => {
    const value = target === 'email' ? mentorEmail : tempPassword
    const label = target === 'email' ? 'Email' : 'Password'
    try {
      await navigator.clipboard.writeText(value)
      setCopied(target)
      toast.success(`${label} copied to clipboard.`)
      window.setTimeout(() => setCopied((cur) => (cur === target ? null : cur)), 1500)
    } catch {
      toast.error('Could not copy. Select the value manually.')
    }
  }

  const handleCopyBoth = async () => {
    const value = `Email: ${mentorEmail}\nTemporary password: ${tempPassword}`
    try {
      await navigator.clipboard.writeText(value)
      setCopied('both')
      toast.success('Email and password copied.')
      window.setTimeout(() => setCopied(null), 1500)
    } catch {
      toast.error('Could not copy. Select the values manually.')
    }
  }

  const markViewedAndClose = () => {
    if (!viewed) {
      setViewed(true)
      onViewed()
    }
    onClose()
  }

  const handleOpenChange = (next: boolean) => {
    if (next) return
    markViewedAndClose()
  }

  const handleConfirm = () => {
    markViewedAndClose()
  }

  const maskedPassword = '•'.repeat(Math.min(tempPassword.length, 16))

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-md gap-0 overflow-hidden rounded-3xl border-0 bg-white p-0 shadow-[0_24px_60px_rgba(15,23,42,0.18)] sm:max-w-lg"
      >
        {/* ── Header band ────────────────────────────────────── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600 px-6 pt-8 pb-7 text-center sm:px-8">
          {/* Decorative blur orbs */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-12 -right-10 size-40 rounded-full bg-white/15 blur-2xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 -left-12 size-44 rounded-full bg-white/10 blur-3xl"
          />

          <div className="relative flex flex-col items-center gap-3">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur">
              <Sparkles className="size-7" strokeWidth={2.2} />
            </div>

            <div className="space-y-1">
              <DialogTitle className="font-headline text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Mentor account created
              </DialogTitle>
              <DialogDescription className="text-sm leading-6 font-medium text-blue-50/90">
                Share these credentials with{' '}
                <span className="font-extrabold text-white">{mentorName}</span> through a secure
                channel. They must change the temporary password on their first login.
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* ── Body ───────────────────────────────────────────── */}
        <div className="space-y-4 px-6 py-6 sm:px-8 sm:py-7">
          {/* One-time warning */}
          <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-3.5 py-3">
            <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-700" strokeWidth={2.4} />
            <p className="text-xs leading-5 font-medium text-amber-900">
              These credentials are shown only once. Copy them before closing this dialog; they
              cannot be retrieved later.
            </p>
          </div>

          <div className="flex items-start gap-2.5 rounded-2xl border border-blue-200 bg-blue-50 px-3.5 py-3">
            <ShieldAlert className="mt-0.5 size-4 shrink-0 text-blue-700" strokeWidth={2.4} />
            <p className="text-xs leading-5 font-medium text-blue-900">
              <span className="font-extrabold">Admin approval is still required.</span> For
              security, an administrator must approve this mentor before their profile becomes
              active.
            </p>
          </div>

          {/* Email */}
          <CredentialField
            icon={Mail}
            label="Email address"
            value={mentorEmail}
            copied={copied === 'email'}
            onCopy={() => handleCopy('email')}
          />

          {/* Password */}
          <div className="rounded-2xl bg-slate-50/80 p-3 sm:p-3.5">
            <div className="flex items-center justify-between gap-2">
              <p className="inline-flex items-center gap-1.5 text-[10px] font-extrabold tracking-[0.14em] text-slate-500 uppercase sm:text-[11px]">
                <KeyRound className="size-3" strokeWidth={2.6} />
                Temporary password
              </p>
              <button
                type="button"
                onClick={() => setRevealed((v) => !v)}
                aria-label={revealed ? 'Hide password' : 'Reveal password'}
                className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold text-slate-500 transition hover:bg-white hover:text-slate-800"
              >
                {revealed ? (
                  <>
                    <EyeOff className="size-3" strokeWidth={2.4} /> Hide
                  </>
                ) : (
                  <>
                    <Eye className="size-3" strokeWidth={2.4} /> Reveal
                  </>
                )}
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 ring-1 ring-slate-200/80">
              <code className="min-w-0 flex-1 font-mono text-sm font-bold tracking-wide break-all text-slate-900 select-all">
                {revealed ? tempPassword : maskedPassword}
              </code>
              <CopyButton copied={copied === 'password'} onClick={() => handleCopy('password')} />
            </div>
          </div>

          {/* Copy both shortcut */}
          <button
            type="button"
            onClick={handleCopyBoth}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-blue-200 bg-blue-50/60 px-4 py-2.5 text-xs font-bold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100"
          >
            {copied === 'both' ? (
              <>
                <Check className="size-3.5" strokeWidth={3} />
                Copied email and password
              </>
            ) : (
              <>
                <Copy className="size-3.5" strokeWidth={2.6} />
                Copy email and password together
              </>
            )}
          </button>
        </div>

        {/* ── Footer ─────────────────────────────────────────── */}
        <div className="border-t border-slate-200 bg-slate-50/80 px-6 py-4 sm:px-8">
          <Button
            type="button"
            onClick={handleConfirm}
            className="h-11 w-full rounded-xl bg-[#0755d8] font-bold text-white shadow-[0_8px_20px_rgba(7,85,216,0.22)] hover:bg-blue-700"
          >
            I&apos;ve shared the credentials
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Small primitives ──────────────────────────────────────────────────────

function CredentialField({
  icon: Icon,
  label,
  value,
  copied,
  onCopy,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  label: string
  value: string
  copied: boolean
  onCopy: () => void
}) {
  return (
    <div className="rounded-2xl bg-slate-50/80 p-3 sm:p-3.5">
      <p className="inline-flex items-center gap-1.5 text-[10px] font-extrabold tracking-[0.14em] text-slate-500 uppercase sm:text-[11px]">
        <Icon className="size-3" strokeWidth={2.6} />
        {label}
      </p>
      <div className="mt-2 flex items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 ring-1 ring-slate-200/80">
        <span className="min-w-0 flex-1 truncate text-sm font-bold text-slate-900">{value}</span>
        <CopyButton copied={copied} onClick={onCopy} />
      </div>
    </div>
  )
}

function CopyButton({ copied, onClick }: { copied: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Copy"
      className={
        'flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-3 text-xs font-bold transition ' +
        (copied ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700')
      }
    >
      {copied ? (
        <>
          <Check className="size-3.5" strokeWidth={3} /> Copied
        </>
      ) : (
        <>
          <Copy className="size-3.5" strokeWidth={2.6} /> Copy
        </>
      )}
    </button>
  )
}
