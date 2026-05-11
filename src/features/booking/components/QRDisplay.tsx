'use client'

import { AlertTriangle, Loader2, RefreshCw, Wifi } from 'lucide-react'
import Image from 'next/image'
import type { QRData } from '../types/payment'

interface QRDisplayProps {
  qrData: QRData | null  // null while the API call is in flight
  timeRemaining: number | null
  onCancel: () => void
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

/**
 * Resolve the QR image source from the backend response.
 *
 * Fonepay Intent QR returns qrMessage / qrString as the raw EMV QR payload.
 * There is no pre-rendered image — we render it client-side via qrserver.com.
 *
 * If qr_code_url is ever populated (future API versions), we use it directly.
 */
function resolveQrSrc(qrData: QRData): string {
  const { qr_code_url, qr_message } = qrData

  if (qr_code_url) {
    if (qr_code_url.startsWith('data:')) return qr_code_url
    if (qr_code_url.startsWith('http')) return qr_code_url
    // Raw base64 PNG
    return `data:image/png;base64,${qr_code_url}`
  }

  if (qr_message) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(qr_message)}`
  }

  return ''
}

export function QRDisplay({ qrData, timeRemaining, onCancel }: QRDisplayProps) {
  // Still fetching QR from backend
  if (!qrData) {
    return (
      <div className="space-y-5">
        <div className="flex flex-col items-center gap-4 py-6">
          <Loader2 className="h-10 w-10 animate-spin text-[#004ac6]" />
          <p className="text-sm text-[#434655]">Generating QR code…</p>
        </div>
        <button
          onClick={onCancel}
          className="w-full rounded-xl py-2.5 text-sm text-[#434655] transition hover:bg-[#f8f9ff]"
        >
          Cancel
        </button>
      </div>
    )
  }

  const isExpiringSoon = timeRemaining !== null && timeRemaining > 0 && timeRemaining < 120
  const qrSrc = resolveQrSrc(qrData)

  return (
    <div className="space-y-5">
      {/* Timer bar */}
      {timeRemaining !== null && (
        <div
          className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium ${
            isExpiringSoon ? 'bg-amber-50 text-amber-700' : 'bg-[#eff4ff] text-[#434655]'
          }`}
        >
          {isExpiringSoon && <AlertTriangle className="h-4 w-4 shrink-0" />}
          <span>
            {timeRemaining === 0
              ? 'Payment session expired'
              : `Expires in ${formatTime(timeRemaining)}`}
          </span>
        </div>
      )}

      {/* QR code */}
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-[#434655]">
          Scan with any Fonepay-connected banking app to pay.
        </p>

        <div className="relative flex h-56 w-56 items-center justify-center rounded-2xl border-2 border-[#e6eeff] bg-white p-3 shadow-[0_4px_16px_rgba(0,74,198,0.08)]">
          {qrSrc ? (
            <Image
              src={qrSrc}
              alt="Fonepay QR Code"
              width={220}
              height={220}
              className="h-full w-full rounded-lg object-contain"
              unoptimized
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-center">
              <RefreshCw className="h-8 w-8 text-[#434655]" />
              <p className="text-xs text-[#434655]">QR unavailable</p>
            </div>
          )}
        </div>

        {/* Step-by-step instructions */}
        <ol className="w-full space-y-2 rounded-xl bg-[#eff4ff] px-4 py-3 text-sm text-[#434655]">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#004ac6] text-[10px] font-bold text-white">
              1
            </span>
            Open your mobile banking app
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#004ac6] text-[10px] font-bold text-white">
              2
            </span>
            Tap <strong className="text-[#121c2a]">Scan QR</strong> and point at the code above
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#004ac6] text-[10px] font-bold text-white">
              3
            </span>
            Confirm the amount and complete payment
          </li>
        </ol>

        {/* Live update indicator */}
        <div className="flex items-center gap-1.5 text-xs text-[#434655]">
          <Wifi className="h-3.5 w-3.5 text-[#006c49]" />
          <span>This page updates automatically once payment is confirmed.</span>
        </div>
      </div>

      <button
        onClick={onCancel}
        className="w-full rounded-xl py-2.5 text-sm text-[#434655] transition hover:bg-[#f8f9ff]"
      >
        Cancel payment
      </button>
    </div>
  )
}
