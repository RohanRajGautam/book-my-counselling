/**
 * Global type declarations for the Calendly embed widget.
 *
 * The Calendly script (https://assets.calendly.com/assets/external/widget.js)
 * attaches a `Calendly` object to `window`. These declarations allow TypeScript
 * to recognise it without a third-party @types package.
 */

interface CalendlyInitInlineOptions {
  url: string
  parentElement: HTMLElement
  prefill?: {
    name?: string
    email?: string
    customAnswers?: Record<string, string>
  }
  utm?: {
    utmSource?: string
    utmCampaign?: string
    utmContent?: string
    utmMedium?: string
    utmTerm?: string
  }
}

interface Window {
  Calendly?: {
    initInlineWidget: (options: CalendlyInitInlineOptions) => void
    closePopupWidget: () => void
    destroyBadgeWidget: () => void
  }
}
