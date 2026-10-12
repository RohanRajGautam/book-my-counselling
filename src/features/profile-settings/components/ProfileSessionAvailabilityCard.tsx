'use client'

import { useMemo, useState } from 'react'
import { CalendarDays, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useMyAvailabilitySlots,
  useCreateSlotsBulk,
  useDeleteSlot,
} from '@/features/availability/hooks/useMentorAvailability'
import {
  AvailabilityForm,
  DEFAULT_AVAILABILITY_FORM,
} from '@/features/availability/components/AvailabilityForm'
import { AvailabilitySlotRow } from '@/features/availability/components/AvailabilitySlotRow'
import { formatShortDate } from '@/features/availability/lib/datetime'
import {
  AvailabilityFormState,
  expandAvailabilityForm,
  groupSlotsByDate,
  overlapsExisting,
} from '@/features/availability/lib/slots'

export function ProfileSessionAvailabilityCard() {
  const { data: existingSlots = [], isLoading } = useMyAvailabilitySlots()
  const { mutate: createBulk, isPending: isCreating } = useCreateSlotsBulk()
  const { mutate: deleteOne, isPending: isDeleting } = useDeleteSlot()

  const [form, setForm] = useState<AvailabilityFormState>(DEFAULT_AVAILABILITY_FORM)

  const groupedExisting = useMemo(() => groupSlotsByDate(existingSlots), [existingSlots])
  const sortedDateKeys = useMemo(() => [...groupedExisting.keys()].sort(), [groupedExisting])

  const handlePublish = () => {
    const ranges = expandAvailabilityForm(form)

    if (ranges.length === 0) {
      if (form.mode === 'custom' && form.customDays.length === 0) {
        toast.error('Pick at least one day of the week.')
      } else {
        toast.error('Could not build any slots from that input. Check your dates.')
      }
      return
    }

    // Filter out past times and self-overlap with existing slots.
    const now = Date.now()
    const future = ranges.filter((r) => r.start.getTime() > now)
    const nonConflicting = future.filter((r) => !overlapsExisting(r, existingSlots))
    const overlapCount = future.length - nonConflicting.length
    const pastCount = ranges.length - future.length

    if (nonConflicting.length === 0) {
      if (overlapCount > 0) {
        toast.error('All of those times overlap with availability you already have.')
      } else {
        toast.error('Those times are in the past.')
      }
      return
    }

    const payload = nonConflicting.map((r) => ({
      start_time: r.start.toISOString(),
      end_time: r.end.toISOString(),
    }))

    createBulk(
      { slots: payload },
      {
        onSuccess: (response) => {
          const created = response.items.length
          const serverConflicts = response.conflicts.length
          const messages: string[] = []
          messages.push(`Added ${created} slot${created !== 1 ? 's' : ''}.`)
          if (serverConflicts > 0) {
            messages.push(`${serverConflicts} were rejected by the server.`)
          } else if (overlapCount > 0) {
            messages.push(`${overlapCount} overlapped existing availability.`)
          }
          if (pastCount > 0) {
            messages.push(`${pastCount} were in the past.`)
          }
          toast.success(messages.join(' '))
          setForm((prev) => ({ ...DEFAULT_AVAILABILITY_FORM, date: prev.date }))
        },
        onError: () => toast.error('Failed to publish availability. Please try again.'),
      }
    )
  }

  const handleDelete = (slotId: string) => {
    deleteOne(slotId, {
      onSuccess: () => toast.success('Slot removed.'),
      onError: () => toast.error('Could not remove slot — it may already be booked.'),
    })
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-8">
      {/* LEFT: Add availability form */}
      <AvailabilityForm
        title="Add Availability"
        subtitle="Pick a date and time, then choose how often it repeats."
        submitHint="Times that overlap existing availability are skipped automatically."
        submitLabel="Add Availability"
        submittingLabel="Adding…"
        form={form}
        onChange={setForm}
        isSubmitting={isCreating}
        onSubmit={handlePublish}
      />

      {/* RIGHT: Published slots */}
      <aside>
        <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)] sm:p-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-headline text-xl font-extrabold text-slate-950 sm:text-2xl">
              Published Slots
            </h2>
            <span className="rounded-full bg-[#eef4ff] px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-blue-700 uppercase">
              {existingSlots.length}
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-[28px] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)] sm:p-8"
                >
                  <Skeleton className="h-5 w-40 rounded bg-slate-100" />
                  <Skeleton className="mt-3 h-4 w-64 rounded bg-slate-100" />
                  <Skeleton className="mt-3 h-4 w-48 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          ) : sortedDateKeys.length === 0 ? (
            <div className="mt-2 flex items-center gap-4 rounded-md bg-[#004ac6] p-6 text-white">
              <CalendarDays className="size-6 shrink-0" aria-hidden="true" />
              <div className="flex-1">
                <p className="text-sm font-extrabold">No availability yet</p>
                <p className="mt-1 text-xs font-medium text-white/80">
                  Use the form to add your first time window.
                </p>
              </div>
              <ChevronRight className="size-5 shrink-0" aria-hidden="true" />
            </div>
          ) : (
            <div className="max-h-[560px] space-y-4 overflow-y-auto pr-1">
              {sortedDateKeys.map((dateKey) => {
                const daySlots = groupedExisting.get(dateKey) ?? []
                return (
                  <div key={dateKey}>
                    <p className="mb-2 text-xs font-bold tracking-[0.16em] text-slate-600 uppercase">
                      {formatShortDate(dateKey)}
                    </p>
                    <div className="space-y-1.5">
                      {daySlots
                        .sort(
                          (a, b) =>
                            new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
                        )
                        .map((slot) => (
                          <AvailabilitySlotRow
                            key={slot.id}
                            slot={slot}
                            onDelete={() => handleDelete(slot.id)}
                            isDeleting={isDeleting}
                          />
                        ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </aside>
    </div>
  )
}
