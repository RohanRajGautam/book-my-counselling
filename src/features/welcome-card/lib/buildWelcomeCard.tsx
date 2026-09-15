/**
 * Renders `WelcomeCardSurface` off-screen and rasterizes it to a PNG blob.
 *
 * The surface is a Tailwind-styled card sitting on top of the mentor's avatar.
 * We mount it into a hidden `<div>` so we don't need to refactor the visible
 * welcome card on the dashboard — the export surface is its own DOM tree.
 */
import { createRoot, type Root } from 'react-dom/client'
import { flushSync } from 'react-dom'
import { toPng } from 'html-to-image'

import {
  WELCOME_CARD_HEIGHT,
  WELCOME_CARD_WIDTH,
  WelcomeCardSurface,
} from '../components/WelcomeCardSurface'

export interface WelcomeCardMentor {
  full_name: string
  title: string
  company: string | null
  avatar_url: string | null
}

function safeFilenameSegment(name: string): string {
  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  return slug || 'mentor'
}

function waitForImages(root: HTMLElement): Promise<void> {
  const images = Array.from(root.querySelectorAll('img'))
  if (images.length === 0) return Promise.resolve()
  return Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) return resolve()
          img.addEventListener('load', () => resolve(), { once: true })
          img.addEventListener('error', () => resolve(), { once: true })
        })
    )
  ).then(() => undefined)
}

interface MountHandle {
  host: HTMLElement
  root: Root
  surface: HTMLElement
}

function mountSurface(mentor: WelcomeCardMentor): MountHandle {
  const host = document.createElement('div')
  // Park it well off-screen. `position: fixed` + a huge negative left so it
  // doesn't briefly show during paint, even if a reflow happens.
  host.style.position = 'fixed'
  host.style.left = '-100000px'
  host.style.top = '0'
  host.style.pointerEvents = 'none'
  document.body.appendChild(host)

  const root = createRoot(host)
  // createRoot.render() schedules the commit via the React scheduler — the
  // DOM child isn't there yet synchronously. flushSync forces the commit
  // before we read firstElementChild.
  flushSync(() => {
    root.render(<WelcomeCardSurface {...mentor} />)
  })

  const surface = host.firstElementChild as HTMLElement | null
  if (!surface) throw new Error('Welcome card surface failed to mount.')

  return { host, root, surface }
}

export interface WelcomeCardResult {
  blob: Blob
  filename: string
}

export async function buildWelcomeCard(mentor: WelcomeCardMentor): Promise<WelcomeCardResult> {
  if (!mentor.full_name.trim()) {
    throw new Error('Mentor has no name to render on the welcome card.')
  }

  const { host, root, surface } = mountSurface(mentor)

  try {
    // Two RAFs to let React paint, then wait for the avatar to actually decode.
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
    await waitForImages(surface)

    const dataUrl = await toPng(surface, {
      width: WELCOME_CARD_WIDTH,
      height: WELCOME_CARD_HEIGHT,
      cacheBust: true,
      pixelRatio: 1,
    })

    const res = await fetch(dataUrl)
    if (!res.ok) throw new Error('Failed to encode PNG.')
    const blob = await res.blob()

    return {
      blob,
      filename: `${safeFilenameSegment(mentor.full_name)}-welcome-card.png`,
    }
  } finally {
    root.unmount()
    host.remove()
  }
}

/**
 * Convenience wrapper: builds the image and triggers a browser download.
 * Use `buildWelcomeCard` directly when you need the blob for something
 * else (e.g. copying to clipboard).
 */
export async function downloadWelcomeCard(mentor: WelcomeCardMentor): Promise<void> {
  const { blob, filename } = await buildWelcomeCard(mentor)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
