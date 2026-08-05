import type { Metadata } from 'next'
import { ReviewInvitationPage } from '@/features/reviews/components/ReviewInvitationPage'

export const metadata: Metadata = {
  title: 'Share your session feedback',
  description: 'Leave a review for your recent mentorship session.',
  robots: { index: false, follow: false },
}

// Public, no-auth magic-link page. Reachable only via the emailed token.
// Lives outside (public)/mentor/admin route groups so it never inherits
// auth gates or marketing chrome.
export default async function ReviewInvitationRoute({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  return <ReviewInvitationPage token={token} />
}