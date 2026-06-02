import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'School to Startup Series',
  description:
    'Submit your pitch for the School to Startup Series and turn classroom ideas into scalable ventures.',
}

export default function SchoolToStartupPage() {
  notFound()
}
