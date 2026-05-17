'use client'

import { useState } from 'react'
import { Eye, EyeOff, Loader2, Lock, Mail, User } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../hooks/useAuth'
import { ResetPasswordFlow } from './ResetPasswordFlow'

type Tab = 'login' | 'register' | 'reset'

export function AuthModal() {
  const [tab, setTab] = useState<Tab>('login')

  return (
    <div className="flex min-h-svh items-center justify-center bg-[#f0f4ff] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-200">
            <Lock className="size-6 text-white" />
          </div>
          <h1 className="font-headline text-2xl font-extrabold text-slate-950">
            Mentor Portal
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          {/* Tabs (hidden while resetting password) */}
          {tab !== 'reset' && (
            <div className="grid grid-cols-2 border-b border-slate-100">
              <TabButton active={tab === 'login'} onClick={() => setTab('login')}>
                Sign In
              </TabButton>
              <TabButton active={tab === 'register'} onClick={() => setTab('register')}>
                Create Account
              </TabButton>
            </div>
          )}

          <div className="p-8">
            {tab === 'login' && (
              <LoginForm
                onSuccess={() => {}}
                onForgotPassword={() => setTab('reset')}
              />
            )}
            {tab === 'register' && (
              <RegisterForm onSwitchToLogin={() => setTab('login')} />
            )}
            {tab === 'reset' && (
              <ResetPasswordFlow onBackToLogin={() => setTab('login')} />
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs font-medium text-slate-400">
          Book Your Counselling — Mentor Portal
        </p>
      </div>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`py-4 text-sm font-extrabold transition-colors ${
        active
          ? 'border-b-2 border-blue-600 text-blue-600'
          : 'text-slate-400 hover:text-slate-700'
      }`}
    >
      {children}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Login form
// ---------------------------------------------------------------------------

function LoginForm({
  onSuccess,
  onForgotPassword,
}: {
  onSuccess: () => void
  onForgotPassword: () => void
}) {
  const { loginMutation } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) return

    loginMutation.mutate(
      { email: email.trim(), password },
      {
        onSuccess: () => {
          toast.success('Welcome back!')
          onSuccess()
        },
        onError: (err: unknown) => {
          const message = extractErrorMessage(err) ?? 'Invalid email or password'
          toast.error(message)
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <InputField
        label="Email address"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@example.com"
        icon={<Mail className="size-4 text-slate-400" />}
        autoComplete="email"
      />

      <div>
        <label className="block">
          <FieldLabel>Password</FieldLabel>
          <div className="relative mt-2">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
              <Lock className="size-4 text-slate-400" />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="h-12 w-full rounded-2xl bg-[#f0f4ff] pl-11 pr-11 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </label>
      </div>

      <button
        type="submit"
        disabled={loginMutation.isPending || !email || !password}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 text-sm font-extrabold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loginMutation.isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Signing in…
          </>
        ) : (
          'Sign In'
        )}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-xs font-extrabold text-blue-600 hover:underline"
        >
          Forgot password?
        </button>
      </div>
    </form>
  )
}

// ---------------------------------------------------------------------------
// Register form
// ---------------------------------------------------------------------------

function RegisterForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const { registerMutation } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !email.trim() || !password) return

    registerMutation.mutate(
      { full_name: fullName.trim(), email: email.trim(), password, role: 'mentor' },
      {
        onSuccess: () => {
          toast.success('Account created! Please sign in.')
          onSwitchToLogin()
        },
        onError: (err: unknown) => {
          const message = extractErrorMessage(err) ?? 'Registration failed. Please try again.'
          toast.error(message)
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <InputField
        label="Full name"
        type="text"
        value={fullName}
        onChange={setFullName}
        placeholder="Dr. Jane Smith"
        icon={<User className="size-4 text-slate-400" />}
        autoComplete="name"
      />

      <InputField
        label="Email address"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@example.com"
        icon={<Mail className="size-4 text-slate-400" />}
        autoComplete="email"
      />

      <div>
        <label className="block">
          <FieldLabel>Password</FieldLabel>
          <div className="relative mt-2">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
              <Lock className="size-4 text-slate-400" />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              minLength={8}
              required
              className="h-12 w-full rounded-2xl bg-[#f0f4ff] pl-11 pr-11 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </label>
      </div>

      <button
        type="submit"
        disabled={registerMutation.isPending || !fullName || !email || !password}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 text-sm font-extrabold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {registerMutation.isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Creating account…
          </>
        ) : (
          'Create Account'
        )}
      </button>

      <p className="text-center text-xs font-medium text-slate-400">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-extrabold text-blue-600 hover:underline"
        >
          Sign in
        </button>
      </p>
    </form>
  )
}

// ---------------------------------------------------------------------------
// Shared sub-components
// ---------------------------------------------------------------------------

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
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">{icon}</span>
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

// ---------------------------------------------------------------------------
// Error helper
// ---------------------------------------------------------------------------

function extractErrorMessage(err: unknown): string | null {
  if (!err || typeof err !== 'object') return null
  const e = err as Record<string, unknown>
  const response = e['response'] as Record<string, unknown> | undefined
  const data = response?.['data'] as Record<string, unknown> | undefined
  if (typeof data?.['detail'] === 'string') return data['detail']
  return null
}
