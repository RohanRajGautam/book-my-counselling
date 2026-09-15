'use client'

import { useMemo, useState } from 'react'
import { Loader2, Mail, Phone, User, CalendarCheck2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useCreateEventBooking } from '../hooks/useEvents'
import {
 EMPTY_BOOKING_FORM,
 fieldHasError,
 formatFieldErrors,
 validateEventBookingForm,
 type EventBookingForm as EventBookingFormValues,
 type ValidationError,
} from '../lib/events.validation'
import { formatEventDate } from '../lib/events.utils'

import { EventBookedConfirmation } from './EventBookedConfirmation'

interface EventBookingFormProps {
 eventId: string
 eventTitle: string
 eventDate: string
}

const BOOKING_INPUT_CLASS =
 'h-12 w-full rounded-[22px] border-[#d9e3f6] bg-white pl-10 pr-4 text-sm shadow-sm focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20'

const BOOKING_LABEL_CLASS = 'text-xs font-extrabold tracking-wide text-slate-700 uppercase'

/** Inline form for booking a seat on the event. Replaces itself on success. */
export function EventBookingForm({ eventId, eventTitle, eventDate }: EventBookingFormProps) {
 const [form, setForm] = useState<EventBookingFormValues>(EMPTY_BOOKING_FORM)
 const [submitAttempted, setSubmitAttempted] = useState(false)

 const mutation = useCreateEventBooking(eventId)

 const errors = useMemo(() => validateEventBookingForm(form), [form])
 const show = (field: string): boolean => submitAttempted && fieldHasError(errors, field)

 const updateField = (field: keyof EventBookingFormValues) => (value: string) =>
 setForm((prev) => ({ ...prev, [field]: value }))

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault()
 setSubmitAttempted(true)
 if (errors.length > 0) return

 mutation.mutate(
 {
 name: form.name.trim(),
 email: form.email.trim(),
 phone: form.phone.trim() ? form.phone.trim() : null,
 },
 {
 onError: () => {
 /* surfaced via mutation.error below */
 },
 }
 )
 }

 if (mutation.isSuccess) {
 return <EventBookedConfirmation eventTitle={eventTitle} eventDate={eventDate} />
 }

 const serverError = mutation.error ? extractBookingError(mutation.error) : null

 return (
 <form
 onSubmit={handleSubmit}
 noValidate
 className="rounded-[22px] border border-[#d9e3f6] bg-white p-6 shadow-[0_18px_50px_rgba(18,28,42,0.08)] sm:p-7"
 >
 <div className="flex items-center gap-3">
 <div className="grid size-10 place-items-center rounded-[22px] bg-[#e6eeff] text-[#004ac6]">
 <CalendarCheck2 className="size-5" aria-hidden="true" />
 </div>
 <div>
 <p className="font-headline text-lg font-extrabold tracking-tight text-slate-900">
 Save your seat
 </p>
 <p className="text-xs font-semibold text-slate-500">
 Free to register. We&apos;ll send the details before {formatEventDate(eventDate)}.
 </p>
 </div>
 </div>

 <div className="mt-5 space-y-4">
 <div>
 <Label htmlFor="event-booking-name" className={BOOKING_LABEL_CLASS}>
 Full name
 </Label>
 <div className="relative mt-1.5">
 <User
 className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
 aria-hidden="true"
 />
 <Input
 id="event-booking-name"
 type="text"
 autoComplete="name"
 value={form.name}
 onChange={(e) => updateField('name')(e.target.value)}
 maxLength={255}
 placeholder="Anita Shrestha"
 className={BOOKING_INPUT_CLASS}
 aria-invalid={show('name')}
 aria-describedby={show('name') ? 'event-booking-name-error' : undefined}
 />
 </div>
 {show('name') ? (
 <p id="event-booking-name-error" className="mt-1.5 text-xs font-semibold text-red-700">
 {firstErrorMessage(errors, 'name')}
 </p>
 ) : null}
 </div>

 <div>
 <Label htmlFor="event-booking-email" className={BOOKING_LABEL_CLASS}>
 Email
 </Label>
 <div className="relative mt-1.5">
 <Mail
 className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
 aria-hidden="true"
 />
 <Input
 id="event-booking-email"
 type="email"
 autoComplete="email"
 value={form.email}
 onChange={(e) => updateField('email')(e.target.value)}
 placeholder="you@example.com"
 className={BOOKING_INPUT_CLASS}
 aria-invalid={show('email')}
 aria-describedby={show('email') ? 'event-booking-email-error' : undefined}
 />
 </div>
 {show('email') ? (
 <p id="event-booking-email-error" className="mt-1.5 text-xs font-semibold text-red-700">
 {firstErrorMessage(errors, 'email')}
 </p>
 ) : null}
 </div>

 <div>
 <Label htmlFor="event-booking-phone" className={BOOKING_LABEL_CLASS}>
 Phone <span className="text-slate-400 normal-case">(optional)</span>
 </Label>
 <div className="relative mt-1.5">
 <Phone
 className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
 aria-hidden="true"
 />
 <Input
 id="event-booking-phone"
 type="tel"
 autoComplete="tel"
 value={form.phone}
 onChange={(e) => updateField('phone')(e.target.value)}
 maxLength={50}
 placeholder="+977 98…"
 className={BOOKING_INPUT_CLASS}
 aria-invalid={show('phone')}
 aria-describedby={show('phone') ? 'event-booking-phone-error' : undefined}
 />
 </div>
 {show('phone') ? (
 <p id="event-booking-phone-error" className="mt-1.5 text-xs font-semibold text-red-700">
 {firstErrorMessage(errors, 'phone')}
 </p>
 ) : null}
 </div>

 {serverError ? (
 <div
 role="alert"
 className="rounded-[22px] border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-800"
 >
 {serverError}
 </div>
 ) : null}
 </div>

 <Button
 type="submit"
 disabled={mutation.isPending || (submitAttempted && errors.length > 0)}
 className="mt-6 h-12 w-full rounded-[22px] bg-[#004ac6] text-sm font-bold text-white shadow-[0_18px_36px_rgba(0,74,198,0.22)] disabled:opacity-60"
 >
 {mutation.isPending ? (
 <>
 <Loader2 className="size-4 animate-spin" /> Booking…
 </>
 ) : (
 'Confirm my seat'
 )}
 </Button>

 <p className="mt-3 text-center text-[11px] font-medium text-slate-500">
 By registering you agree to receive event-related emails from BYC.
 </p>
 </form>
 )
}

function firstErrorMessage(errors: ValidationError[], field: string): string {
 const match = errors.find((e) => e.field === field)
 return match?.message ?? formatFieldErrors(errors)
}

/**
 * Map AxiosError → friendly user-facing string. The backend returns plain
 * `{ detail }` strings for booking errors — we never surface them verbatim.
 */
function extractBookingError(err: unknown): string | null {
 if (!err || typeof err !== 'object') return null
 const e = err as { response?: { status?: number; data?: { detail?: unknown } } }
 const status = e.response?.status
 const detail = e.response?.data?.detail
 if (status === 400 && typeof detail === 'string') {
 if (/ended/i.test(detail)) return 'This event has ended and is no longer accepting bookings.'
 if (/passed/i.test(detail)) return 'This event’s date has already passed.'
 return detail
 }
 if (status === 422) {
 return 'Some fields didn’t look right. Please review and try again.'
 }
 if (status === 404) return 'This event could not be found.'
 return 'Something went wrong while booking. Please try again.'
}
