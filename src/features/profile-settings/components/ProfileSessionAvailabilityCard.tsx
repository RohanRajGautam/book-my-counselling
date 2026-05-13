'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  CalendarDays,
  CalendarPlus,
  Check,
  ExternalLink,
  MinusCircle,
  PlusCircle,
  ShieldCheck,
  Trash2,
} from 'lucide-react'

type AvailabilitySlot = {
  id: string
  start: string
  end: string
}

type AvailabilityDay = {
  id: string
  day: string
  available: boolean
  slots: AvailabilitySlot[]
}

type DateOverride = {
  id: string
  date: string
  title: string
  description: string
}

const initialAvailability: AvailabilityDay[] = [
  { id: 'mon', day: 'Mon', available: true, slots: [{ id: 'mon-1', start: '09:00 AM', end: '05:00 PM' }] },
  { id: 'tue', day: 'Tue', available: true, slots: [{ id: 'tue-1', start: '10:00 AM', end: '06:00 PM' }] },
  { id: 'wed', day: 'Wed', available: false, slots: [] },
  { id: 'thu', day: 'Thu', available: true, slots: [{ id: 'thu-1', start: '09:00 AM', end: '05:00 PM' }] },
  { id: 'fri', day: 'Fri', available: true, slots: [{ id: 'fri-1', start: '01:00 PM', end: '06:00 PM' }] },
]

const initialOverrides: DateOverride[] = [
  {
    id: 'christmas-eve',
    date: '2026-12-24',
    title: 'Christmas Eve Holiday',
    description: 'Marked as Unavailable',
  },
  {
    id: 'late-night-intake',
    date: '2027-01-05',
    title: 'Late Night Intake',
    description: 'Special Hours: 19:00 - 22:00',
  },
]

const syncDefaults = {
  google: true,
  calendly: true,
}

export function ProfileSessionAvailabilityCard() {
  const [availability, setAvailability] = useState<AvailabilityDay[]>(initialAvailability)
  const [overrides, setOverrides] = useState<DateOverride[]>(initialOverrides)
  const [syncStatus, setSyncStatus] = useState(syncDefaults)
  const [minimumNotice, setMinimumNotice] = useState('24 Hours before session')
  const [sessionBuffer, setSessionBuffer] = useState('15 Minutes between')
  const [defaultDuration, setDefaultDuration] = useState<'45' | '60'>('45')

  const nextAvailableSlot = useMemo(() => {
    const nextDay = availability.find((day) => day.available && day.slots.length > 0)
    if (!nextDay) return 'No availability published'
    const firstSlot = nextDay.slots[0]
    if (!firstSlot) return 'No availability published'

    return `${nextDay.day}, ${firstSlot.start}`
  }, [availability])

  const toggleDay = (dayId: string) => {
    setAvailability((current) =>
      current.map((day) => {
        if (day.id !== dayId) return day

        const nextAvailable = !day.available
        return {
          ...day,
          available: nextAvailable,
          slots:
            nextAvailable && day.slots.length === 0
              ? [{ id: `${day.id}-${Date.now()}`, start: '09:00 AM', end: '05:00 PM' }]
              : day.slots,
        }
      })
    )
  }

  const updateSlot = (
    dayId: string,
    slotId: string,
    field: keyof Pick<AvailabilitySlot, 'start' | 'end'>,
    value: string
  ) => {
    setAvailability((current) =>
      current.map((day) =>
        day.id === dayId
          ? {
              ...day,
              slots: day.slots.map((slot) =>
                slot.id === slotId ? { ...slot, [field]: value } : slot
              ),
            }
          : day
      )
    )
  }

  const addSlot = (dayId: string) => {
    setAvailability((current) =>
      current.map((day) =>
        day.id === dayId
          ? {
              ...day,
              available: true,
              slots: [...day.slots, { id: `${day.id}-${Date.now()}`, start: '09:00 AM', end: '05:00 PM' }],
            }
          : day
      )
    )
  }

  const removeSlot = (dayId: string, slotId: string) => {
    setAvailability((current) =>
      current.map((day) => {
        if (day.id !== dayId) return day

        const nextSlots = day.slots.filter((slot) => slot.id !== slotId)
        return {
          ...day,
          available: nextSlots.length > 0,
          slots: nextSlots,
        }
      })
    )
  }

  const addException = () => {
    setOverrides((current) => [
      ...current,
      {
        id: `override-${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        title: 'New Exception',
        description: 'Add availability details',
      },
    ])
  }

  const updateOverride = (id: string, field: keyof Omit<DateOverride, 'id'>, value: string) => {
    setOverrides((current) =>
      current.map((override) => (override.id === id ? { ...override, [field]: value } : override))
    )
  }

  const removeOverride = (id: string) => {
    setOverrides((current) => current.filter((override) => override.id !== id))
  }

  const handleSave = () => {
    const payload = {
      weeklyAvailability: availability.map((day) => ({
        day: day.day,
        available: day.available,
        slots: day.available ? day.slots : [],
      })),
      dateOverrides: overrides,
      connectedSync: syncStatus,
      bookingRules: {
        minimumNotice: minimumNotice.trim(),
        sessionBuffer: sessionBuffer.trim(),
        defaultDurationMinutes: Number(defaultDuration),
      },
    }

    console.log('Session availability payload:', payload)
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_350px] xl:gap-8">
      <div className="min-w-0 space-y-6 xl:space-y-8">
        <section className="rounded-2xl bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8">
          <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-headline text-xl font-extrabold text-slate-950">
              Weekly Availability
            </h2>
            <span className="w-fit rounded-full bg-[#eaf1ff] px-4 py-1.5 text-xs font-extrabold text-[#0053db]">
              Standard Hours
            </span>
          </div>

          <div>
            {availability.map((row, index) => (
              <div
                key={row.id}
                className={`grid gap-4 border-[#edf2fb] py-4 sm:grid-cols-[auto_42px_minmax(0,1fr)_auto] sm:items-start ${
                  index === availability.length - 1 ? '' : 'border-b'
                }`}
              >
                <div className="flex items-center justify-between gap-4 sm:contents">
                  <button
                    type="button"
                    aria-pressed={row.available}
                    aria-label={`${row.day} availability`}
                    onClick={() => toggleDay(row.id)}
                    className={`flex size-6 items-center justify-center rounded-md border transition ${
                      row.available
                        ? 'border-[#075bd8] bg-[#075bd8] text-white'
                        : 'border-[#c8d2e6] bg-white text-transparent'
                    }`}
                  >
                    <Check className="size-4" strokeWidth={3} />
                  </button>

                  <span className="mr-auto text-base font-semibold text-[#172033] sm:mr-0">
                    {row.day}
                  </span>

                  <StatusLabel available={row.available} className="sm:hidden" />
                </div>

                {row.available ? (
                  <div className="min-w-0 space-y-3">
                    {row.slots.map((slot) => (
                      <div
                        key={slot.id}
                        className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-[minmax(112px,1fr)_auto_minmax(112px,1fr)_auto] sm:items-center sm:gap-4"
                      >
                        <TimeField
                          ariaLabel={`${row.day} start time`}
                          value={slot.start}
                          onChange={(value) => updateSlot(row.id, slot.id, 'start', value)}
                        />
                        <span className="hidden text-lg font-medium text-[#c3cce0] sm:block">-</span>
                        <TimeField
                          ariaLabel={`${row.day} end time`}
                          value={slot.end}
                          onChange={(value) => updateSlot(row.id, slot.id, 'end', value)}
                        />
                        <button
                          type="button"
                          aria-label={`Remove time range for ${row.day}`}
                          onClick={() => removeSlot(row.id, slot.id)}
                          className="flex h-10 items-center justify-center rounded-xl text-[#737b90] transition hover:bg-red-50 hover:text-red-600 sm:size-8"
                        >
                          <MinusCircle className="size-5" />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addSlot(row.id)}
                      className="inline-flex min-h-9 items-center gap-2 rounded-full bg-[#eef4ff] px-4 text-sm font-extrabold text-[#075bd8] transition hover:bg-[#dfeaff]"
                    >
                      <PlusCircle className="size-4" />
                      Add Time
                    </button>
                  </div>
                ) : (
                  <p className="min-w-0 text-sm font-medium text-[#a6adbd] sm:self-center">
                    No availability scheduled for this day
                  </p>
                )}

                <StatusLabel available={row.available} className="hidden sm:block sm:self-center" />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-headline text-xl font-extrabold text-slate-950">
              Specific Date Overrides
            </h2>
            <button
              type="button"
              onClick={addException}
              className="inline-flex w-fit items-center gap-2 text-sm font-extrabold text-[#075bd8]"
            >
              <CalendarPlus className="size-4" />
              Add Exception
            </button>
          </div>

          <div className="space-y-4">
            {overrides.map((override) => (
              <div
                key={override.id}
                className="grid grid-cols-[auto_minmax(0,1fr)] gap-4 rounded-2xl bg-[#eaf1ff] p-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center"
              >
                <DateBadge date={override.date} />
                <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(120px,0.65fr)_minmax(180px,1fr)]">
                  <input
                    type="date"
                    value={override.date}
                    onChange={(event) => updateOverride(override.id, 'date', event.target.value)}
                    className="min-h-11 rounded-xl bg-white px-3 text-sm font-bold text-[#172033] outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  <input
                    type="text"
                    value={override.title}
                    onChange={(event) => updateOverride(override.id, 'title', event.target.value)}
                    className="min-h-11 rounded-xl bg-white px-3 text-sm font-extrabold text-[#172033] outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  <input
                    type="text"
                    value={override.description}
                    onChange={(event) =>
                      updateOverride(override.id, 'description', event.target.value)
                    }
                    className="min-h-11 rounded-xl bg-white px-3 text-sm font-medium text-[#5f6472] outline-none focus:ring-2 focus:ring-blue-200 sm:col-span-2"
                  />
                </div>
                <button
                  type="button"
                  aria-label={`Delete ${override.title}`}
                  onClick={() => removeOverride(override.id)}
                  className="col-span-2 flex h-10 items-center justify-center rounded-xl text-red-600 transition hover:bg-red-50 sm:col-span-1 sm:size-9"
                >
                  <Trash2 className="size-5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <aside className="space-y-6 xl:space-y-8">
        <section className="rounded-2xl border-t-4 border-[#6cf8bb] bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8">
          <h2 className="font-headline text-xl font-extrabold text-slate-950">Connected Sync</h2>

          <div className="mt-7 space-y-5">
            <SyncCard
              icon={<CalendarDays className="size-5 text-[#3b74d7]" />}
              title="Google Calendar"
              connected={syncStatus.google}
              onToggle={() => setSyncStatus((current) => ({ ...current, google: !current.google }))}
            />
            <SyncCard
              icon={<CalendarDays className="size-5 text-white" />}
              title="Calendly"
              connected={syncStatus.calendly}
              onToggle={() =>
                setSyncStatus((current) => ({ ...current, calendly: !current.calendly }))
              }
              blue
            />
          </div>

          <p className="mt-6 max-w-[240px] text-xs leading-5 font-medium text-[#6d7280]">
            Your availability is automatically adjusted based on external calendar conflicts.
          </p>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8">
          <h2 className="font-headline text-xl font-extrabold text-slate-950">Booking Rules</h2>

          <div className="mt-7 space-y-6">
            <RuleField label="Minimum Notice" value={minimumNotice} onChange={setMinimumNotice} />
            <RuleField label="Session Buffer" value={sessionBuffer} onChange={setSessionBuffer} />

            <div>
              <p className="mb-2 text-xs font-extrabold tracking-[0.12em] text-[#5f6472] uppercase">
                Default Duration
              </p>
              <div className="grid h-12 grid-cols-2 rounded-2xl bg-[#eaf1ff]">
                {(['45', '60'] as const).map((duration) => (
                  <button
                    key={duration}
                    type="button"
                    aria-pressed={defaultDuration === duration}
                    onClick={() => setDefaultDuration(duration)}
                    className={`rounded-2xl text-sm font-extrabold transition ${
                      defaultDuration === duration
                        ? 'bg-[#075bd8] text-white shadow-sm'
                        : 'text-[#5f6472] hover:bg-white/70'
                    }`}
                  >
                    {duration} Mins
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="h-16 w-full rounded-xl bg-[#075bd8] text-base font-extrabold text-white shadow-[0_12px_26px_rgba(7,91,216,0.28)] transition hover:bg-[#004ac6]"
            >
              Save Changes
            </button>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-2xl bg-[#2d63e5] p-8 text-white shadow-sm sm:rounded-3xl">
          <div className="relative z-10">
            <h2 className="font-headline text-lg font-extrabold">Public Profile View</h2>
            <p className="mt-3 max-w-[250px] text-xs leading-5 font-medium text-blue-100">
              Students can see your next available slot as: {nextAvailableSlot}
            </p>
            <Link
              href="/explore-mentors"
              className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold tracking-[0.08em] text-white uppercase"
            >
              View Booking Page <ExternalLink className="size-4" />
            </Link>
          </div>
          <ShieldCheck className="absolute right-[-18px] bottom-[-18px] size-28 text-white/10" />
        </section>
      </aside>
    </div>
  )
}

function TimeField({
  ariaLabel,
  value,
  onChange,
}: {
  ariaLabel: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <input
      type="text"
      aria-label={ariaLabel}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-12 min-w-0 rounded-xl bg-[#eef4ff] px-5 text-sm font-semibold text-[#172033] outline-none focus:ring-2 focus:ring-blue-200"
    />
  )
}

function StatusLabel({ available, className = '' }: { available: boolean; className?: string }) {
  return (
    <span
      className={`justify-self-end text-xs font-extrabold ${
        available ? 'text-[#00714d]' : 'text-[#6d7280]'
      } ${className}`}
    >
      {available ? 'AVAILABLE' : 'UNAVAILABLE'}
    </span>
  )
}

function DateBadge({ date }: { date: string }) {
  const parsedDate = date ? new Date(`${date}T00:00:00`) : null
  const month = parsedDate
    ? parsedDate.toLocaleString('en-US', { month: 'short' }).toUpperCase()
    : 'DATE'
  const day = parsedDate ? parsedDate.getDate().toString().padStart(2, '0') : '--'

  return (
    <div className="flex size-14 flex-col items-center justify-center rounded-xl bg-[#dce8ff] text-[#075bd8]">
      <span className="text-[10px] font-extrabold">{month}</span>
      <span className="text-lg leading-5 font-extrabold text-[#172033]">{day}</span>
    </div>
  )
}

function SyncCard({
  icon,
  title,
  connected,
  onToggle,
  blue = false,
}: {
  icon: React.ReactNode
  title: string
  connected: boolean
  onToggle: () => void
  blue?: boolean
}) {
  return (
    <div className="flex min-h-[74px] items-center gap-4 rounded-xl border border-[#edf2fb] bg-white p-4">
      <div
        className={`flex size-9 items-center justify-center rounded-md ${
          blue ? 'bg-[#075bd8]' : 'bg-[#eef4ff]'
        }`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-extrabold text-[#172033]">{title}</p>
        <p
          className={`mt-0.5 text-[10px] font-extrabold ${
            connected ? 'text-[#00714d]' : 'text-[#6d7280]'
          }`}
        >
          ● {connected ? (title === 'Google Calendar' ? 'SYNCED' : 'CONNECTED') : 'DISABLED'}
        </p>
      </div>
      <button type="button" onClick={onToggle} className="text-[11px] font-extrabold text-[#172033]">
        {connected ? 'Disable' : 'Enable'}
      </button>
    </div>
  )
}

function RuleField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="text-xs font-extrabold tracking-[0.12em] text-[#5f6472] uppercase">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-xl bg-[#eaf1ff] px-5 text-sm font-semibold text-[#172033] outline-none focus:ring-2 focus:ring-blue-200"
      />
    </label>
  )
}
