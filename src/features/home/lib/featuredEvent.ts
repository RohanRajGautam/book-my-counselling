import {
  getFeaturedThirtyMaThirtyEvent,
  type FeaturedThirtyMaThirtyEvent,
} from '@/features/events/lib/thirty-ma-thirty-events'

export type FeaturedEvent = FeaturedThirtyMaThirtyEvent

export const FEATURED_EVENT = getFeaturedThirtyMaThirtyEvent()

export function getFeaturedEvent() {
  return getFeaturedThirtyMaThirtyEvent()
}
