'use client'

import { useEffect, useState } from 'react'
import { PackageOpen } from 'lucide-react'

export type PackagesForm = {
  hourlyRate: string
}

type PackageTier = {
  label: string
  duration: number
  description: string
  multiplier: number // relative to hourly rate
}

const PACKAGE_TIERS: PackageTier[] = [
  {
    label: 'Basic Counselling Package',
    duration: 30,
    description: 'A focused 30-minute session — ideal for quick guidance or follow-ups.',
    multiplier: 0.5,
  },
  {
    label: 'Standard Counselling Package',
    duration: 60,
    description: 'A full 60-minute session — the most popular choice for in-depth counselling.',
    multiplier: 1,
  },
  {
    label: 'Premium Counselling Package',
    duration: 90,
    description: 'An extended 90-minute session — best for comprehensive planning and deep dives.',
    multiplier: 1.5,
  },
]

type ProfilePackagesCardProps = {
  value: PackagesForm
  onChange: (value: PackagesForm) => void
}

export function ProfilePackagesCard({ value, onChange }: ProfilePackagesCardProps) {
  const hourly = parseFloat(value.hourlyRate) || 0

  const getPrice = (multiplier: number) => Math.round(hourly * multiplier)

  return (
    <section
      id="packages"
      className="rounded-[28px] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)] sm:p-8"
    >
      <div className="flex items-center gap-4">
        <div className="flex size-11 items-center justify-center rounded-xl bg-violet-200 text-violet-900">
          <PackageOpen className="size-5" />
        </div>
        <h2 className="font-headline text-xl font-extrabold text-slate-950 sm:text-2xl">
          Counselling Packages
        </h2>
      </div>

      <p className="mt-2 text-sm font-medium text-slate-500">
        Set your hourly rate and we&apos;ll calculate the 30-minute and 90-minute package prices
        automatically. These packages will be shown to clients on your public profile.
      </p>

      {/* Hourly rate input */}
      <div className="mt-6">
        <label className="block">
          <span className="text-xs font-bold tracking-[0.16em] text-slate-600 uppercase">
            Hourly Rate (NPR)
          </span>
          <input
            type="number"
            value={value.hourlyRate}
            placeholder="e.g. 2000"
            min={0}
            onChange={(e) => onChange({ ...value, hourlyRate: e.target.value })}
            className="mt-2 flex min-h-14 w-full items-center rounded-2xl bg-[#eef4ff] px-4 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-200 sm:px-5 md:max-w-xs"
          />
        </label>
      </div>

      {/* Package preview */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {PACKAGE_TIERS.map((tier) => {
          const price = getPrice(tier.multiplier)
          const hasRate = hourly > 0

          return (
            <div
              key={tier.duration}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-extrabold text-blue-700">
                  {tier.duration} min
                </span>
                {hasRate && (
                  <span className="font-headline text-lg font-extrabold text-slate-950">
                    NPR {price.toLocaleString()}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-extrabold text-slate-800">{tier.label}</p>
                <p className="mt-1 text-xs font-medium leading-4 text-slate-500">
                  {tier.description}
                </p>
              </div>
              {!hasRate && (
                <p className="text-xs font-semibold text-slate-400 italic">
                  Enter your hourly rate above to see the price.
                </p>
              )}
            </div>
          )
        })}
      </div>

      <p className="mt-5 text-xs font-medium text-slate-400">
        Prices are calculated as: 30 min = ½ hourly rate · 60 min = full hourly rate · 90 min = 1.5×
        hourly rate. Click &quot;Save Changes&quot; above to publish your packages.
      </p>
    </section>
  )
}

// Helper to build the package payloads from an hourly rate
export function buildPackagePayloads(hourlyRate: number) {
  return PACKAGE_TIERS.map((tier) => ({
    title: tier.label,
    description: tier.description,
    duration_minutes: tier.duration,
    price: Math.round(hourlyRate * tier.multiplier),
  }))
}
