'use client'

import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'
import { ResetPasswordFlow } from '@/features/auth/components/ResetPasswordFlow'

export default function ResetPasswordPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-svh items-center justify-center bg-[#f0f4ff] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-200">
            <Lock className="size-6 text-white" />
          </div>
          <h1 className="font-headline text-2xl font-extrabold text-slate-950">
            Reset your password
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            For mentors who already have a public profile.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <ResetPasswordFlow onBackToLogin={() => router.push('/mentor')} />
        </div>

        <p className="mt-6 text-center text-xs font-medium text-slate-400">
          Book Your Counselling — Mentor Portal
        </p>
      </div>
    </div>
  )
}
