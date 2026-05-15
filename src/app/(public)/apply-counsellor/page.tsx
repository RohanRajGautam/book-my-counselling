'use client'

import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { MentorAuthGate } from '@/features/auth/components/MentorAuthGate'

export default function ApplyCounsellorPage() {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#f0f4ff]">
      <MentorAuthGate>
        <ApplyCounsellorRedirect />
      </MentorAuthGate>
    </div>
  )
}

function ApplyCounsellorRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/mentor/dashboard')
  }, [router])

  return (
    <div className="flex min-h-svh items-center justify-center bg-[#f0f4ff] px-4">
      <div className="text-center">
        <Loader2 className="mx-auto size-8 animate-spin text-blue-600" />
        <p className="mt-4 text-sm font-semibold text-slate-500">
          Taking you to your mentor dashboard...
        </p>
      </div>
    </div>
  )
}
