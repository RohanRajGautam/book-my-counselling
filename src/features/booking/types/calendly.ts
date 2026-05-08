export interface CalendlyLinkResponse {
  mentor_id: string
  calendly_link: string | null
}

export interface CalendlyPrefillResponse {
  calendly_url: string
  prefill: {
    name: string
    email: string
    customAnswers: {
      a1: string // booking_id
    }
  }
  utm: {
    utmSource: string
    utmCampaign: string
    utmContent: string
  }
}

/**
 * Calendly widget event fired when a booking is successfully scheduled.
 * Emitted as a `message` event on the window with `data.event === 'calendly.event_scheduled'`.
 */
export interface CalendlyEventScheduled {
  event: 'calendly.event_scheduled'
  payload: {
    event: {
      uri: string
    }
    invitee: {
      uri: string
    }
  }
}

export type CalendlyWidgetStep = 'IDLE' | 'LOADING' | 'OPEN' | 'SCHEDULED' | 'ERROR'
