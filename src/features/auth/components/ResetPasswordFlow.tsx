'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from 'lucide-react'
import { toast } from 'sonner'
import { usePasswordReset } from '../hooks/usePasswordReset'

type Step = 'email' | 'code' | 'password' | 'done'

interface Props {
  /**
   * If non-null, rendered as the on-screen affordance to go back to login.
   * The reset-password page sets this to a Link; AuthModal embeds may use a
   * tab switcher.
   */
  onBackToLogin?: () => void
}

export function ResetPasswordFlow({ onBackToLogin }: Props) {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const { requestCodeMutation, verifyCodeMutation, resetPasswordMutation } =
    usePasswordReset()

  // ── step 1: ask for email ────────────────────────────────────────────────
  const handleSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    requestCodeMutation.mutate(
      { email: email.trim() },
      {
        onSuccess: (data) => {
          toast.success(data.message)
          setStep('code')
        },
        onError: (err: unknown) => {
          toast.error(extractErrorMessage(err) ?? 'Could not send code')
        },
      },
    )
  }

  // ── step 2: verify code ──────────────────────────────────────────────────
  const handleSubmitCode = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    verifyCodeMutation.mutate(
      { email: email.trim(), code: code.trim() },
      {
        onSuccess: () => {
          setStep('password')
        },
        onError: (err: unknown) => {
          toast.error(extractErrorMessage(err) ?? 'Invalid or expired code')
        },
      },
    )
  }

  // ── step 3: set new password ─────────────────────────────────────────────
  const handleSubmitPassword = (newPassword: string) => {
    resetPasswordMutation.mutate(
      { email: email.trim(), code: code.trim(), new_password: newPassword },
      {
        onSuccess: () => {
          setStep('done')
        },
        onError: (err: unknown) => {
          toast.error(extractErrorMessage(err) ?? 'Could not reset password')
        },
      },
    )
  }

  const handleResend = () => {
    requestCodeMutation.mutate(
      { email: email.trim() },
      {
        onSuccess: (data) => toast.success(data.message),
        onError: (err: unknown) =>
          toast.error(extractErrorMessage(err) ?? 'Could not resend code'),
      },
    )
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="w-full">
      <StepHeader step={step} />

      {step === 'email' && (
        <EmailStep
          email={email}
          setEmail={setEmail}
          loading={requestCodeMutation.isPending}
          onSubmit={handleSubmitEmail}
          onBack={onBackToLogin}
        />
      )}

      {step === 'code' && (
        <CodeStep
          email={email}
          code={code}
          setCode={setCode}
          loading={verifyCodeMutation.isPending}
          onSubmit={handleSubmitCode}
          onResend={handleResend}
          resendLoading={requestCodeMutation.isPending}
          onBack={() => setStep('email')}
        />
      )}

      {step === 'password' && (
        <PasswordStep
          loading={resetPasswordMutation.isPending}
          onSubmit={handleSubmitPassword}
          onBack={() => setStep('code')}
        />
      )}

      {step === 'done' && (
        <DoneStep onBackToLogin={onBackToLogin} email={email} />
      )}
    </div>
  )
}

// ── Step indicator + per-step UIs ───────────────────────────────────────────

function StepHeader({ step }: { step: Step }) {
  const stepNumber = step === 'email' ? 1 : step === 'code' ? 2 : 3
  const stepLabel =
    step === 'email'
      ? 'Enter your email'
      : step === 'code'
        ? 'Enter the code we emailed you'
        : step === 'password'
          ? 'Choose a new password'
          : 'All set'

  if (step === 'done') {
    return (
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-emerald-100 shadow-sm shadow-emerald-100">
          <CheckCircle2 className="size-7 text-emerald-600" />
        </div>
        <h2 className="font-headline text-xl font-extrabold text-slate-950">
          Password updated
        </h2>
      </div>
    )
  }

  return (
    <div className="mb-6">
      <div className="mb-4 flex items-center justify-center gap-2">
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={`h-1.5 w-8 rounded-full transition-colors ${
              n <= stepNumber ? 'bg-blue-600' : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
      <h2 className="text-center font-headline text-xl font-extrabold text-slate-950">
        {stepLabel}
      </h2>
      <p className="mt-1 text-center text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
        Step {stepNumber} of 3
      </p>
    </div>
  )
}

function EmailStep({
  email,
  setEmail,
  loading,
  onSubmit,
  onBack,
}: {
  email: string
  setEmail: (v: string) => void
  loading: boolean
  onSubmit: (e: React.FormEvent) => void
  onBack?: () => void
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <p className="text-center text-sm font-medium leading-6 text-slate-500">
        We&apos;ll email you a 6-digit code to verify it&apos;s really you.
        Existing mentors should use the email address listed on their public
        profile.
      </p>

      <InputField
        label="Email address"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@example.com"
        icon={<Mail className="size-4 text-slate-400" />}
        autoComplete="email"
      />

      <button
        type="submit"
        disabled={loading || !email.trim()}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 text-sm font-extrabold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending code…
          </>
        ) : (
          'Send verification code'
        )}
      </button>

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mx-auto flex items-center gap-2 text-xs font-extrabold text-slate-400 transition hover:text-slate-600"
        >
          <ArrowLeft className="size-3" />
          Back to sign in
        </button>
      )}
    </form>
  )
}

function CodeStep({
  email,
  code,
  setCode,
  loading,
  onSubmit,
  onResend,
  resendLoading,
  onBack,
}: {
  email: string
  code: string
  setCode: (v: string) => void
  loading: boolean
  onSubmit: (e: React.FormEvent) => void
  onResend: () => void
  resendLoading: boolean
  onBack: () => void
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <p className="text-center text-sm font-medium leading-6 text-slate-500">
        Enter the 6-digit code sent to{' '}
        <span className="font-extrabold text-slate-700">{email}</span>.
      </p>

      <label className="block">
        <FieldLabel>Verification code</FieldLabel>
        <div className="relative mt-2">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
            <KeyRound className="size-4 text-slate-400" />
          </span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="••••••"
            autoComplete="one-time-code"
            required
            className="h-12 w-full rounded-2xl bg-[#f0f4ff] pl-11 pr-4 text-center text-lg font-extrabold tracking-[0.6em] text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </label>

      <button
        type="submit"
        disabled={loading || code.length < 4}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 text-sm font-extrabold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Verifying…
          </>
        ) : (
          'Verify code'
        )}
      </button>

      <div className="flex items-center justify-between text-xs font-extrabold">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 transition hover:text-slate-600"
        >
          <ArrowLeft className="size-3" />
          Wrong email?
        </button>
        <button
          type="button"
          onClick={onResend}
          disabled={resendLoading}
          className="text-blue-600 hover:underline disabled:opacity-60"
        >
          {resendLoading ? 'Resending…' : 'Resend code'}
        </button>
      </div>
    </form>
  )
}

function PasswordStep({
  loading,
  onSubmit,
  onBack,
}: {
  loading: boolean
  onSubmit: (newPassword: string) => void
  onBack: () => void
}) {
  const [pw, setPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)

  const tooShort = pw.length > 0 && pw.length < 8
  const noUpper = pw.length > 0 && !/[A-Z]/.test(pw)
  const noDigit = pw.length > 0 && !/\d/.test(pw)
  const mismatch = confirm.length > 0 && pw !== confirm
  const canSubmit = !tooShort && !noUpper && !noDigit && pw && confirm === pw

  const handle = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit(pw)
  }

  return (
    <form onSubmit={handle} className="space-y-5" noValidate>
      <p className="text-center text-sm font-medium leading-6 text-slate-500">
        Pick a password that&apos;s at least 8 characters and includes an
        uppercase letter and a digit.
      </p>

      <div>
        <FieldLabel>New password</FieldLabel>
        <div className="relative mt-2">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
            <Lock className="size-4 text-slate-400" />
          </span>
          <input
            type={showPw ? 'text' : 'password'}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            minLength={8}
            required
            className="h-12 w-full rounded-2xl bg-[#f0f4ff] pl-11 pr-11 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-200"
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            aria-label={showPw ? 'Hide password' : 'Show password'}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      <div>
        <FieldLabel>Confirm password</FieldLabel>
        <div className="relative mt-2">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
            <ShieldCheck className="size-4 text-slate-400" />
          </span>
          <input
            type={showPw ? 'text' : 'password'}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Re-type your password"
            autoComplete="new-password"
            minLength={8}
            required
            className="h-12 w-full rounded-2xl bg-[#f0f4ff] pl-11 pr-4 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      <ul className="space-y-1 text-xs font-medium">
        <Rule ok={pw.length >= 8}>At least 8 characters</Rule>
        <Rule ok={/[A-Z]/.test(pw)}>One uppercase letter</Rule>
        <Rule ok={/\d/.test(pw)}>One digit</Rule>
        <Rule ok={pw.length > 0 && pw === confirm}>Passwords match</Rule>
      </ul>

      {mismatch && (
        <p className="text-xs font-extrabold text-rose-500">
          Passwords don&apos;t match
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !canSubmit}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 text-sm font-extrabold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Saving…
          </>
        ) : (
          'Reset password'
        )}
      </button>

      <button
        type="button"
        onClick={onBack}
        className="mx-auto flex items-center gap-2 text-xs font-extrabold text-slate-400 transition hover:text-slate-600"
      >
        <ArrowLeft className="size-3" />
        Re-enter code
      </button>
    </form>
  )
}

function DoneStep({
  onBackToLogin,
  email,
}: {
  onBackToLogin?: () => void
  email: string
}) {
  return (
    <div className="space-y-5 text-center">
      <p className="text-sm font-medium leading-6 text-slate-500">
        Your password for{' '}
        <span className="font-extrabold text-slate-700">{email}</span> has been
        updated. You can now sign in to the Mentor Portal.
      </p>
      <button
        type="button"
        onClick={onBackToLogin}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 text-sm font-extrabold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700"
      >
        Go to sign in
      </button>
    </div>
  )
}

// ── shared subcomponents (mirrors AuthModal styling) ───────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">
      {children}
    </span>
  )
}

function InputField({
  label,
  type,
  value,
  onChange,
  placeholder,
  icon,
  autoComplete,
}: {
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  icon: React.ReactNode
  autoComplete?: string
}) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <div className="relative mt-2">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
          {icon}
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          className="h-12 w-full rounded-2xl bg-[#f0f4ff] pl-11 pr-4 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-200"
        />
      </div>
    </label>
  )
}

function Rule({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li
      className={`flex items-center gap-2 ${
        ok ? 'text-emerald-600' : 'text-slate-400'
      }`}
    >
      <CheckCircle2
        className={`size-3.5 ${ok ? 'text-emerald-500' : 'text-slate-300'}`}
      />
      <span>{children}</span>
    </li>
  )
}

function extractErrorMessage(err: unknown): string | null {
  if (!err || typeof err !== 'object') return null
  const e = err as Record<string, unknown>
  const response = e['response'] as Record<string, unknown> | undefined
  const data = response?.['data'] as Record<string, unknown> | undefined
  if (typeof data?.['detail'] === 'string') return data['detail']
  return null
}
