'use client'

import { Loader2, Plus } from 'lucide-react'

import { AvailabilityFormState, RecurrenceMode } from '../lib/slots'
import {
  addDaysKey,
  DAYS_OF_WEEK,
  parseDateKey,
  TIME_OPTIONS,
  timeIndex,
  todayKey,
} from '../lib/datetime'

export const DEFAULT_AVAILABILITY_FORM: AvailabilityFormState = {
  date: todayKey(),
  startHour: 9,
  startMinute: 0,
  endHour: 10,
  endMinute: 0,
  mode: 'none',
  endDate: addDaysKey(todayKey(), 28),
  customDays: [],
}

export interface AvailabilityFormFieldsProps {
  form: AvailabilityFormState
  onChange: (next: AvailabilityFormState) => void
  /** Disable all inputs (during submit). */
  disabled?: boolean
  /** Show the weekly suffix on the "Repeat" option ("Weekly on Wednesday"). */
  weeklyDayName?: string
}

/**
 * Date + time + repeat selector shared by the mentor's "Add availability"
 * card and the admin's "Manage availability" view. Visual chrome is
 * identical so the two flows feel like one product.
 */
export function AvailabilityFormFields({
  form,
  onChange,
  disabled,
  weeklyDayName,
}: AvailabilityFormFieldsProps) {
  const update = <K extends keyof AvailabilityFormState>(
    key: K,
    value: AvailabilityFormState[K]
  ) => {
    onChange({ ...form, [key]: value })
  }

  const updateStart = (hour: number, minute: number) => {
    const newStart = timeIndex(hour, minute)
    const currentEnd = timeIndex(form.endHour, form.endMinute)
    if (newStart >= currentEnd) {
      const pushedH = Math.min(22, hour + 1)
      onChange({
        ...form,
        startHour: hour,
        startMinute: minute,
        endHour: pushedH,
        endMinute: minute,
      })
      return
    }
    onChange({ ...form, startHour: hour, startMinute: minute })
  }

  const toggleCustomDay = (day: number) => {
    const has = form.customDays.includes(day)
    onChange({
      ...form,
      customDays: has ? form.customDays.filter((d) => d !== day) : [...form.customDays, day],
    })
  }

  const handleDateChange = (newDate: string) => {
    // Keep endDate >= date.
    const endDate =
      parseDateKey(form.endDate) && parseDateKey(form.endDate)! >= parseDateKey(newDate)!
        ? form.endDate
        : addDaysKey(newDate, 28)
    onChange({ ...form, date: newDate, endDate })
  }

  const startIdx = timeIndex(form.startHour, form.startMinute)
  const endTimeOptions = TIME_OPTIONS.filter((t) => timeIndex(t.hour, t.minute) > startIdx)

  return (
    <div className="space-y-5">
      {/* Date */}
      <Field label="Date">
        <input
          type="date"
          value={form.date}
          min={todayKey()}
          disabled={disabled}
          onChange={(e) => handleDateChange(e.target.value)}
          className="mt-2 flex min-h-14 w-full items-center rounded-2xl bg-[#eef4ff] px-4 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-60 sm:px-5"
        />
      </Field>

      {/* Time */}
      <Field label="Time">
        <div className="mt-2 grid gap-2 min-[420px]:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] min-[420px]:items-center">
          <TimeSelect
            value={`${form.startHour}:${form.startMinute}`}
            options={TIME_OPTIONS}
            onChange={updateStart}
            disabled={disabled}
          />
          <span className="text-center text-sm font-medium text-slate-500">to</span>
          <TimeSelect
            value={`${form.endHour}:${form.endMinute}`}
            options={endTimeOptions}
            onChange={(h, m) => onChange({ ...form, endHour: h, endMinute: m })}
            disabled={disabled}
          />
        </div>
      </Field>

      {/* Recurrence */}
      <Field label="Repeat">
        <select
          value={form.mode}
          disabled={disabled}
          onChange={(e) => update('mode', e.target.value as RecurrenceMode)}
          className="mt-2 flex min-h-14 w-full items-center rounded-2xl bg-[#eef4ff] px-4 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-60 sm:px-5"
        >
          <option value="none">Does not repeat</option>
          <option value="weekly">Weekly{weeklyDayName ? ` on ${weeklyDayName}` : ''}</option>
          <option value="custom">Custom</option>
        </select>
      </Field>

      {/* Custom day picker */}
      {form.mode === 'custom' ? (
        <Field label="Repeat on">
          <div className="mt-2 flex flex-wrap gap-1.5">
            {DAYS_OF_WEEK.map((d) => {
              const active = form.customDays.includes(d.value)
              return (
                <button
                  key={d.value}
                  type="button"
                  aria-pressed={active}
                  aria-label={d.label}
                  disabled={disabled}
                  onClick={() => toggleCustomDay(d.value)}
                  className={`inline-flex min-h-8 items-center justify-center rounded-full border px-3 text-xs font-extrabold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    active
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-200 bg-[#eef4ff] text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {d.short}
                </button>
              )
            })}
          </div>
        </Field>
      ) : null}

      {/* End date */}
      {form.mode !== 'none' ? (
        <Field label="Ends on">
          <input
            type="date"
            value={form.endDate}
            min={form.date}
            disabled={disabled}
            onChange={(e) => update('endDate', e.target.value)}
            className="mt-2 flex min-h-14 w-full items-center rounded-2xl bg-[#eef4ff] px-4 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-60 sm:px-5"
          />
        </Field>
      ) : null}
    </div>
  )
}

export interface AvailabilityFormProps {
  /** Title for the form card (e.g. "Add Availability" vs "Add mentor availability"). */
  title: string
  /** Sub-line under the title. */
  subtitle?: string
  /** Helper line under the submit button. */
  submitHint?: string
  /** Submit button label (e.g. "Add Availability", "Publish"). */
  submitLabel: string
  /** Pending-state label (e.g. "Adding…"). */
  submittingLabel?: string
  /** Hide the submit button when the caller wants the footer elsewhere. */
  hideSubmit?: boolean
  /** External form state — controlled by the caller. */
  form: AvailabilityFormState
  onChange: (next: AvailabilityFormState) => void
  isSubmitting?: boolean
  onSubmit: () => void
}

/**
 * Outer card wrapper around `AvailabilityFormFields` + submit button. Used by
 * both the mentor "Add availability" card and the admin "Manage mentor
 * availability" card so the visual chrome is identical.
 */
export function AvailabilityForm({
  title,
  subtitle,
  submitHint,
  submitLabel,
  submittingLabel = 'Adding…',
  hideSubmit,
  form,
  onChange,
  isSubmitting,
  onSubmit,
}: AvailabilityFormProps) {
  const selectedDate = parseDateKey(form.date)
  const weeklyDayName = selectedDate ? (DAYS_OF_WEEK[selectedDate.getDay()]?.label ?? '') : ''

  return (
    <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)] sm:p-8">
      <div className="mb-6">
        <h2 className="font-headline text-xl font-extrabold text-slate-950 sm:text-2xl">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm font-medium text-slate-500">{subtitle}</p> : null}
      </div>

      <AvailabilityFormFields
        form={form}
        onChange={onChange}
        disabled={isSubmitting}
        weeklyDayName={weeklyDayName}
      />

      {!hideSubmit ? (
        <div className="mt-5 border-t border-slate-100 pt-5">
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 text-sm font-extrabold text-white shadow-[0_10px_22px_rgba(0,83,219,0.22)] transition hover:bg-blue-700 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {submittingLabel}
              </>
            ) : (
              <>
                <Plus className="size-4" />
                {submitLabel}
              </>
            )}
          </button>
          {submitHint ? (
            <p className="mt-2 text-center text-xs font-medium text-slate-500">{submitHint}</p>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold tracking-[0.16em] text-slate-600 uppercase">
        {label}
      </span>
      {children}
    </label>
  )
}

function TimeSelect({
  value,
  options,
  onChange,
  disabled,
}: {
  value: string
  options: typeof TIME_OPTIONS
  onChange: (hour: number, minute: number) => void
  disabled?: boolean
}) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => {
        const [h, m] = e.target.value.split(':').map(Number)
        if (typeof h === 'number' && typeof m === 'number') onChange(h, m)
      }}
      className="h-11 flex-1 rounded-2xl bg-[#eef4ff] px-3 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-60 sm:px-4"
    >
      {options.map((t) => (
        <option key={`${t.hour}:${t.minute}`} value={`${t.hour}:${t.minute}`}>
          {t.label}
        </option>
      ))}
    </select>
  )
}
