'use client'

import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { OAuthCaptureClient } from './OAuthCaptureClient'

export default function OAuthCapturePage() {
  return (
    <Suspense fallback={<CaptureFallback />}>
      <OAuthCaptureClient />
    </Suspense>
  )
}

function CaptureFallback() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-[#f0f4ff] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-blue-50">
          <Loader2 className="size-7 animate-spin text-blue-600" />
        </span>
        <h1 className="font-headline text-xl font-extrabold text-slate-950">
          Verifying your sign-in…
        </h1>
      </div>
    </div>
  )
}
