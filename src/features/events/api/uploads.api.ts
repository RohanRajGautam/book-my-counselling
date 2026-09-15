// Image upload endpoints used by the events feature. The backend never
// embeds uploaded URLs directly into payloads — it always returns
// `{ urls: [...] }` and the caller wires those URLs into the next request.

import apiClient from '@/lib/api/api-client'

interface UploadResponse {
  urls: string[]
}

function postForm(endpoint: string, form: FormData): Promise<UploadResponse> {
  return apiClient
    .post<UploadResponse>(endpoint, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data)
}

export async function uploadEventCover(file: File): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  const res = await postForm('/upload/event-cover', form)
  const url = res.urls[0]
  if (!url) throw new Error('Upload returned no URL.')
  return url
}

export async function uploadEventGallery(files: File[]): Promise<string[]> {
  if (files.length === 0) return []
  const form = new FormData()
  for (const file of files) form.append('files', file)
  const res = await postForm('/upload/event-gallery', form)
  return res.urls
}

export async function uploadEventImage(file: File, folder: string): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  const res = await apiClient.post<UploadResponse>('/upload/event-image', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    params: { folder },
  })
  const url = res.data.urls[0]
  if (!url) throw new Error('Upload returned no URL.')
  return url
}
