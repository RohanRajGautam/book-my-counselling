// Image upload hooks. The backend never embeds uploaded URLs into payloads
// — it returns `{ urls: [...] }` and the caller wires the URL into the
// next request. These hooks wrap the three upload endpoints the events
// feature needs.

import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  uploadEventCover,
  uploadEventGallery,
  uploadEventImage,
} from '../api/uploads.api'

export function useUploadEventCover() {
  return useMutation<string, Error, File>({
    mutationFn: (file) => uploadEventCover(file),
  })
}

export function useUploadEventGallery() {
  return useMutation<string[], Error, File[]>({
    mutationFn: (files) => uploadEventGallery(files),
  })
}

export function useUploadEventImage() {
  return useMutation<string, Error, { file: File; folder: string }>({
    mutationFn: ({ file, folder }) => uploadEventImage(file, folder),
    onError: () => toast.error('Upload failed. Please try again.'),
  })
}
