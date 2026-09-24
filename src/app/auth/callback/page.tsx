'use client'

import { Suspense } from 'react'
import { Loader2, ShieldCheck } from 'lucide-react'
import { AuthCallbackClient } from './AuthCallbackClient'

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<CallbackFallback />}>
      <AuthCallbackClient />
    </Suspense>
  )
}

function CallbackFallback() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-[#f0f4ff] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-200">
            <ShieldCheck className="size-6 text-white" />
          </div>
          <h1 className="font-headline text-2xl font-extrabold text-slate-950">
            Book Your Counselling
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Sign in to access your dashboard
          </p>
        </div>
        <div className="rounded-3xl bg-white p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-50">
            <Loader2 className="size-7 animate-spin text-blue-600" />
          </div>
          <h2 className="font-headline text-xl font-extrabold text-slate-950">
            Loading sign-in…
          </h2>
        </div>
        <p className="mt-6 text-center text-xs font-medium text-slate-400">
          Book Your Counselling — Mentor Portal
        </p>
      </div>
    </div>
  )
}
