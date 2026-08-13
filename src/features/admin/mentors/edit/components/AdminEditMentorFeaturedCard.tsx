'use client'

import { Loader2, Star } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { useFeatureMentor } from '../../hooks/useAdminMentors'
import { AdminMentorProfile } from '../../../types/admin.types'

type Props = {
  mentor: AdminMentorProfile
}

export function AdminEditMentorFeaturedCard({ mentor }: Props) {
  const { mutate: feature, isPending } = useFeatureMentor()
  const isFeatured = mentor.is_featured
  const fullName = mentor.user.full_name

  const handleToggle = () => {
    feature(
      { id: mentor.id, featured: !isFeatured },
      {
        onSuccess: () =>
          toast.success(`${fullName} ${isFeatured ? 'unfeatured' : 'featured'}.`),
        onError: () => toast.error('Failed to update featured status.'),
      }
    )
  }

  return (
    <section className="rounded-[28px] bg-white p-5 text-center shadow-[0_18px_45px_rgba(15,23,42,0.04)] sm:p-8">
      <div
        className={cn(
          'mx-auto flex size-14 items-center justify-center rounded-full ring-1 ring-inset',
          isFeatured
            ? 'bg-amber-50 text-amber-700 ring-amber-200'
            : 'bg-slate-100 text-slate-500 ring-slate-200'
        )}
      >
        <Star
          className={cn('size-7', isFeatured && 'fill-amber-500 stroke-amber-500')}
          strokeWidth={2.2}
        />
      </div>

      <h2 className="font-headline mt-6 text-xl font-extrabold text-slate-950 sm:text-2xl">
        Featured on Home
      </h2>
      <p className="mx-auto mt-2 max-w-56 text-sm leading-5 text-slate-500">
        {isFeatured
          ? 'This mentor is currently highlighted in the Featured Mentors row on the homepage.'
          : 'Highlight this mentor in the Featured Mentors row on the homepage.'}
      </p>

      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        onClick={handleToggle}
        className={cn(
          'mt-6 h-12 w-full rounded-xl font-bold disabled:opacity-60',
          isFeatured
            ? 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
            : 'border-blue-700 text-blue-700 hover:bg-blue-50'
        )}
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Saving…
          </>
        ) : isFeatured ? (
          'Remove from featured'
        ) : (
          'Feature this mentor'
        )}
      </Button>
    </section>
  )
}