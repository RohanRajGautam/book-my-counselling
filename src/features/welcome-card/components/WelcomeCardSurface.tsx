'use client'

import { Briefcase, Building2, Globe } from 'lucide-react'

export const WELCOME_CARD_WIDTH = 1080
export const WELCOME_CARD_HEIGHT = 1350

export interface WelcomeCardSurfaceProps {
  full_name: string
  title: string
  company: string | null
  avatar_url: string | null
}

export function WelcomeCardSurface({
  full_name,
  title,
  company,
  avatar_url,
}: WelcomeCardSurfaceProps) {
  return (
    <div
      style={{ width: WELCOME_CARD_WIDTH, height: WELCOME_CARD_HEIGHT }}
      className="relative shrink-0 overflow-hidden bg-slate-900 font-sans antialiased select-none"
    >
      {/* Background photo */}
      {avatar_url ? (
        // Plain <img> on purpose: next/image produces a <picture> with responsive
        // sources that html-to-image can't reliably rasterize.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatar_url}
          alt=""
          crossOrigin="anonymous"
          className="absolute inset-0 size-full object-cover object-center"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-600 via-slate-700 to-slate-900" />
      )}

      {/* Deep Rich Blue Lower Backdrop Gradient — Starts below "Welcome aboard!" */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[#0038A8] via-[#0052FF]/70 to-transparent" />

      {/* Intersecting Decorative Gradient Arcs */}
      <svg
        className="pointer-events-none absolute inset-0 size-full"
        viewBox="0 0 1080 1350"
        fill="none"
      >
        <defs>
          {/* White to Cyan Arc Gradient */}
          <linearGradient id="whiteIceGrad" x1="100%" y1="20%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#E0F7FF" />
            <stop offset="80%" stopColor="#80E5FF" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>

          {/* Electric Cyan Arc Gradient */}
          <linearGradient id="electricCyanGrad" x1="0%" y1="100%" x2="100%" y2="20%">
            <stop offset="0%" stopColor="#00F0FF" />
            <stop offset="35%" stopColor="#00D4FF" />
            <stop offset="80%" stopColor="#0066FF" />
            <stop offset="100%" stopColor="#0038C8" />
          </linearGradient>
        </defs>

        {/* Lower Cyan Arc */}
        <circle cx="1200" cy="1550" r="540" stroke="url(#electricCyanGrad)" strokeWidth="42" />

        {/* Upper White Arc */}
        <circle cx="1350" cy="1350" r="535" stroke="url(#whiteIceGrad)" strokeWidth="44" />
      </svg>

      {/* Frosted Glass Leaf Card Container — Expanded width (w-[740px]) */}
      <div className="absolute bottom-12 left-12 w-[740px] overflow-hidden rounded-tl-[32px] rounded-tr-[32px] rounded-br-[280px] rounded-bl-[32px] border border-white/30 bg-white/10 shadow-2xl backdrop-blur-xl">
        {/* Solid White Header Banner */}
        <div className="bg-white px-9 py-4.5">
          <span className="inline-block bg-gradient-to-r from-[#00A3FF] via-[#0070F3] to-[#0047FF] bg-clip-text text-[58px] leading-none font-bold tracking-tight text-transparent">
            Welcome aboard!
          </span>
        </div>

        {/* Translucent Glass Card Body */}
        <div className="px-9 pt-4 pb-8">
          <h1 className="mb-3 text-[62px] font-bold tracking-tight text-white drop-shadow-sm">
            {full_name}
          </h1>

          <div className="space-y-2.5">
            {title ? (
              <div className="flex items-center gap-3.5 text-[28px] font-semibold text-white/95">
                <Briefcase className="size-8 shrink-0 text-white" strokeWidth={2} />
                <span className="truncate">{title}</span>
              </div>
            ) : null}

            {company ? (
              <div className="flex items-center gap-3.5 text-[28px] font-semibold text-white/95">
                <Building2 className="size-8 shrink-0 text-white" strokeWidth={2} />
                <span className="truncate">{company}</span>
              </div>
            ) : null}
          </div>

          {/* White Action Pill Button */}
          <div className="mt-6 ml-[-20px] inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-2.5 text-[28px] font-bold text-[#0066FF] shadow-lg">
            <Globe className="size-8 shrink-0 text-[#0066FF]" strokeWidth={2.2} />
            Book a session
          </div>
        </div>
      </div>

      {/* BYC Brand Logo — Top Right */}
      <span
        aria-label="Book My Counselling"
        className="absolute top-12 right-12 h-[110px] w-auto text-white"
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 238 112"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M10.1953 15H49.5553C60.7453 15 69.8053 24.07 69.8053 35.25C69.8053 46.44 60.7353 55.5 49.5553 55.5H10.1953"
            stroke="currentColor"
            strokeWidth="30"
            strokeMiterlimit="10"
          />
          <path
            d="M10.1953 55.5117H49.5553C60.7453 55.5117 69.8053 64.5817 69.8053 75.7617C69.8053 86.9517 60.7353 96.0117 49.5553 96.0117H10.1953"
            stroke="currentColor"
            strokeWidth="30"
            strokeMiterlimit="10"
          />
          <path
            d="M237.478 94.6717H212.268C190.268 94.6717 172.438 76.8417 172.438 54.8417C172.438 32.8417 190.268 15.0117 212.268 15.0117H237.478"
            stroke="currentColor"
            strokeWidth="30"
            strokeMiterlimit="10"
          />
          <path
            d="M150.257 0.746094V52.3661C150.257 68.4561 137.207 81.5061 121.117 81.5061C105.027 81.5061 91.9766 68.4561 91.9766 52.3661V0.746094"
            stroke="currentColor"
            strokeWidth="30"
            strokeMiterlimit="10"
          />
          <path
            d="M121.188 110.255V83.7148"
            stroke="currentColor"
            strokeWidth="30"
            strokeMiterlimit="10"
          />
          <path
            d="M15 0.0273438L15 111.015"
            stroke="currentColor"
            strokeWidth="30"
            strokeMiterlimit="10"
          />
        </svg>
      </span>
    </div>
  )
}
