// Hooks for the four nested collections (timeline / gallery / companies /
// testimonials). Each mutation rewrites the cached detail so the UI shows
// the new state without a refetch round-trip.

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  appendCompany,
  appendGalleryImage,
  appendTestimonial,
  appendTimelineItem,
  deleteCompany,
  deleteGalleryImage,
  deleteTestimonial,
  deleteTimelineItem,
  updateCompany,
  updateGalleryImage,
  updateTestimonial,
  updateTimelineItem,
} from '../api/admin-events.api'
import {
  CompanyInput,
  CompanyResponse,
  EventResponse,
  GalleryImageInput,
  GalleryImageResponse,
  TestimonialInput,
  TestimonialResponse,
  TimelineItemInput,
  TimelineItemResponse,
} from '../types/events.types'
import { ADMIN_EVENT_DETAIL_KEY } from './useAdminEvents'

// ── Internal helpers ─────────────────────────────────────────────────────

function patchDetail(
  qc: ReturnType<typeof useQueryClient>,
  eventId: string,
  patch: (event: EventResponse) => EventResponse
) {
  const key = [...ADMIN_EVENT_DETAIL_KEY, eventId]
  const current = qc.getQueryData<EventResponse>(key)
  if (!current) return
  qc.setQueryData(key, patch(current))
}

// ── Timeline items ───────────────────────────────────────────────────────

export function useAppendTimelineItem(eventId: string) {
  const qc = useQueryClient()
  return useMutation<TimelineItemResponse, Error, TimelineItemInput>({
    mutationFn: (payload) => appendTimelineItem(eventId, payload),
    onSuccess: (row) => {
      patchDetail(qc, eventId, (event) => ({
        ...event,
        timeline_items: [...event.timeline_items, row].sort(
          (a, b) => a.order_index - b.order_index
        ),
      }))
    },
  })
}

export function useUpdateTimelineItem(eventId: string) {
  const qc = useQueryClient()
  return useMutation<
    TimelineItemResponse,
    Error,
    { itemId: string; payload: Partial<TimelineItemInput> }
  >({
    mutationFn: ({ itemId, payload }) => updateTimelineItem(eventId, itemId, payload),
    onSuccess: (row, { itemId }) => {
      patchDetail(qc, eventId, (event) => ({
        ...event,
        timeline_items: event.timeline_items
          .map((item) => (item.id === itemId ? row : item))
          .sort((a, b) => a.order_index - b.order_index),
      }))
    },
  })
}

export function useDeleteTimelineItem(eventId: string) {
  const qc = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: (itemId) => deleteTimelineItem(eventId, itemId),
    onSuccess: (_void, itemId) => {
      patchDetail(qc, eventId, (event) => ({
        ...event,
        timeline_items: event.timeline_items
          .filter((item) => item.id !== itemId)
          .map((item, idx) => ({ ...item, order_index: idx })),
      }))
      toast.success('Timeline item removed.')
    },
    onError: () => toast.error('Failed to remove timeline item.'),
  })
}

// ── Gallery images ───────────────────────────────────────────────────────

export function useAppendGalleryImage(eventId: string) {
  const qc = useQueryClient()
  return useMutation<
    GalleryImageResponse,
    Error,
    GalleryImageInput,
    { tempId: string; previous: EventResponse | undefined }
  >({
    mutationFn: (payload) => appendGalleryImage(eventId, payload),
    // Optimistic insert so the new URL stays visible in the uploader while the
    // POST is in flight. The uploader is controlled by `gallery_images`, so
    // without this the URL would briefly vanish on the next render.
    onMutate: async (payload) => {
      const key = [...ADMIN_EVENT_DETAIL_KEY, eventId]
      await qc.cancelQueries({ queryKey: key })
      const previous = qc.getQueryData<EventResponse>(key)
      const tempId = `temp-${crypto.randomUUID()}`
      if (previous) {
        qc.setQueryData<EventResponse>(key, {
          ...previous,
          gallery_images: [
            ...previous.gallery_images,
            {
              id: tempId,
              image_url: payload.image_url,
              order_index: payload.order_index,
              created_at: new Date().toISOString(),
            },
          ].sort((a, b) => a.order_index - b.order_index),
        })
      }
      return { tempId, previous }
    },
    onError: (_err, _payload, context) => {
      if (context?.previous) {
        qc.setQueryData([...ADMIN_EVENT_DETAIL_KEY, eventId], context.previous)
      }
      toast.error('Failed to add image.')
    },
    onSuccess: (row, _payload, context) => {
      if (!context) return
      patchDetail(qc, eventId, (event) => ({
        ...event,
        gallery_images: event.gallery_images.map((img) =>
          img.id === context.tempId ? row : img
        ),
      }))
    },
  })
}

export function useUpdateGalleryImage(eventId: string) {
  const qc = useQueryClient()
  return useMutation<
    GalleryImageResponse,
    Error,
    { imageId: string; payload: Partial<GalleryImageInput> }
  >({
    mutationFn: ({ imageId, payload }) => updateGalleryImage(eventId, imageId, payload),
    onSuccess: (row, { imageId }) => {
      patchDetail(qc, eventId, (event) => ({
        ...event,
        gallery_images: event.gallery_images
          .map((img) => (img.id === imageId ? row : img))
          .sort((a, b) => a.order_index - b.order_index),
      }))
    },
  })
}

export function useDeleteGalleryImage(eventId: string) {
  const qc = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: (imageId) => deleteGalleryImage(eventId, imageId),
    onSuccess: (_void, imageId) => {
      patchDetail(qc, eventId, (event) => ({
        ...event,
        gallery_images: event.gallery_images
          .filter((img) => img.id !== imageId)
          .map((img, idx) => ({ ...img, order_index: idx })),
      }))
      toast.success('Image removed.')
    },
    onError: () => toast.error('Failed to remove image.'),
  })
}

// ── Companies ────────────────────────────────────────────────────────────

export function useAppendCompany(eventId: string) {
  const qc = useQueryClient()
  return useMutation<CompanyResponse, Error, CompanyInput>({
    mutationFn: (payload) => appendCompany(eventId, payload),
    onSuccess: (row) => {
      patchDetail(qc, eventId, (event) => ({
        ...event,
        companies: [...event.companies, row].sort((a, b) => a.order_index - b.order_index),
      }))
    },
  })
}

export function useUpdateCompany(eventId: string) {
  const qc = useQueryClient()
  return useMutation<CompanyResponse, Error, { companyId: string; payload: Partial<CompanyInput> }>({
    mutationFn: ({ companyId, payload }) => updateCompany(eventId, companyId, payload),
    onSuccess: (row, { companyId }) => {
      patchDetail(qc, eventId, (event) => ({
        ...event,
        companies: event.companies
          .map((c) => (c.id === companyId ? row : c))
          .sort((a, b) => a.order_index - b.order_index),
      }))
    },
  })
}

export function useDeleteCompany(eventId: string) {
  const qc = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: (companyId) => deleteCompany(eventId, companyId),
    onSuccess: (_void, companyId) => {
      patchDetail(qc, eventId, (event) => ({
        ...event,
        companies: event.companies
          .filter((c) => c.id !== companyId)
          .map((c, idx) => ({ ...c, order_index: idx })),
      }))
      toast.success('Company removed.')
    },
    onError: () => toast.error('Failed to remove company.'),
  })
}

// ── Testimonials ─────────────────────────────────────────────────────────

export function useAppendTestimonial(eventId: string) {
  const qc = useQueryClient()
  return useMutation<TestimonialResponse, Error, TestimonialInput>({
    mutationFn: (payload) => appendTestimonial(eventId, payload),
    onSuccess: (row) => {
      patchDetail(qc, eventId, (event) => ({
        ...event,
        testimonials: [...event.testimonials, row],
      }))
    },
  })
}

export function useUpdateTestimonial(eventId: string) {
  const qc = useQueryClient()
  return useMutation<
    TestimonialResponse,
    Error,
    { testimonialId: string; payload: Partial<TestimonialInput> }
  >({
    mutationFn: ({ testimonialId, payload }) =>
      updateTestimonial(eventId, testimonialId, payload),
    onSuccess: (row, { testimonialId }) => {
      patchDetail(qc, eventId, (event) => ({
        ...event,
        testimonials: event.testimonials.map((t) =>
          t.id === testimonialId ? row : t
        ),
      }))
    },
  })
}

export function useDeleteTestimonial(eventId: string) {
  const qc = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: (testimonialId) => deleteTestimonial(eventId, testimonialId),
    onSuccess: (_void, testimonialId) => {
      patchDetail(qc, eventId, (event) => ({
        ...event,
        testimonials: event.testimonials.filter((t) => t.id !== testimonialId),
      }))
      toast.success('Testimonial removed.')
    },
    onError: () => toast.error('Failed to remove testimonial.'),
  })
}
