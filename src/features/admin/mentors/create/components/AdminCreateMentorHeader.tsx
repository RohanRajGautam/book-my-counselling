import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

type AdminCreateMentorHeaderProps = {
  onSubmit: () => void
  isSubmitting: boolean
  mode?: 'create' | 'edit'
}

export function AdminCreateMentorHeader({
  onSubmit,
  isSubmitting,
  mode = 'create',
}: AdminCreateMentorHeaderProps) {
  const isEdit = mode === 'edit'

  return (
    <header className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        <Link
          href="/admin/mentors"
          className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.14em] text-slate-500 uppercase hover:text-blue-700"
        >
          <ArrowLeft className="size-3.5" strokeWidth={2.6} />
          Back to mentors
        </Link>
        <h1 className="font-headline mt-3 text-3xl leading-tight font-extrabold tracking-normal text-slate-950 sm:text-4xl lg:text-5xl">
          {isEdit ? 'Edit mentor' : 'Create mentor'}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 font-medium text-slate-500 sm:text-base sm:leading-7">
          {isEdit
            ? "Update the mentor's profile. Only the fields you change are saved; status, role, and avatar still use their dedicated admin actions."
            : "Create a mentor account on someone's behalf. They'll receive a temporary password and must change it when they first log in. Share the password securely."}
        </p>
      </div>

      <div className="hidden w-full md:flex md:w-auto md:items-center md:gap-4">
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="h-14 rounded-xl bg-[#0755d8] px-8 font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {isEdit ? 'Saving…' : 'Creating…'}
            </>
          ) : isEdit ? (
            'Save changes'
          ) : (
            'Create mentor'
          )}
        </Button>
      </div>
    </header>
  )
}
