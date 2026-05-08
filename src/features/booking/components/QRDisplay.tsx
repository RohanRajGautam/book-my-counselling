'use client'

import { AlertTriangle, Smartphone } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import type { QRData } from '../types/payment'

interface QRDisplayProps {
  qrData: QRData
  timeRemaining: number | null
  onCancel: () => void
}

function isMobile(): boolean {
  if (typeof navigator === 'undefined') return false
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function QRDisplay({ qrData, timeRemaining, onCancel }: QRDisplayProps) {
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    setMobile(isMobile())
  }, [])

  const isExpiringSoon = timeRemaining !== null && timeRemaining < 120

  return (
    <div className="space-y-4">
      {/* Timer */}
      {timeRemaining !== null && (
        <div
          className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
            isExpiringSoon
              ? 'bg-amber-50 text-amber-700'
              : 'bg-[#eff4ff] text-[#434655]'
          }`}
        >
          {isExpiringSoon && <AlertTriangle className="h-4 w-4" />}
          <span>
            {timeRemaining === 0
              ? 'Payment expired'
              : `Expires in ${formatTime(timeRemaining)}`}
          </span>
        </div>
      )}

      {mobile ? (
        /* Mobile: deep link button */
        <div className="space-y-3 text-center">
          <p className="text-sm text-[#434655]">
            Tap the button below to open your banking app and complete the payment.
          </p>
          <a
            href={qrData.deep_link}
            className="flex w-full items-center justify-center gap-2 rounded-[24px] bg-gradient-to-br from-[#004ac6] to-[#2563eb] py-4 font-semibold text-white shadow-sm transition-all hover:shadow-md"
          >
            <Smartphone className="h-5 w-5" />
            Open in Banking App
          </a>
          <p className="text-xs text-[#434655]">
            After completing payment in your app, return here to see the confirmation.
          </p>
        </div>
      ) : (
        /* Desktop: QR code */
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-[#434655]">
            Scan this QR code with your banking app to pay.
          </p>
          <div className="rounded-xl border-2 border-[#eff4ff] p-3">
            {qrData.qr_code_url ? (
              <Image
                src={qrData.qr_code_url}
                alt="Fonepay QR Code"
                width={200}
                height={200}
                className="h-48 w-48"
                unoptimized
              />
            ) : (
              /* Fallback: render QR from qr_message using a QR service */
              <Image
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData.qr_message)}`}
                alt="Fonepay QR Code"
                width={200}
                height={200}
                className="h-48 w-48"
                unoptimized
              />
            )}
          </div>
          <p className="text-xs text-[#434655]">
            Open your mobile banking app → Scan QR → Confirm payment
          </p>
        </div>
      )}

      <button
        onClick={onCancel}
        className="w-full rounded-lg py-2 text-sm text-[#434655] underline-offset-2 hover:underline"
      >
        Cancel payment
      </button>
    </div>
  )
}
