import apiClient from '@/lib/api/api-client'
import { PaginatedResponse } from '@/lib/api/api.types'
import { MentorResponse } from '@/features/mentors/types/mentors.types'
import {
  MentorBooking,
  MentorProfileCreate,
  MentorProfileUpdate,
  ServicePackage,
  ServicePackageCreate,
  ServicePackageUpdate,
  AvailabilitySlot,
  AvailabilitySlotCreate,
  CalendlyLinkUpdate,
  CalendlyLinkResponse,
} from '../types/mentor-dashboard.types'
import { BookingStatus } from '../types/booking-status'

// ---------------------------------------------------------------------------
// Mentor profile
// ---------------------------------------------------------------------------

export async function getMyMentorProfile(): Promise<MentorResponse> {
  const response = await apiClient.get<MentorResponse>('/mentors/profile/me')
  return response.data
}

export async function createMentorProfile(data: MentorProfileCreate): Promise<MentorResponse> {
  const response = await apiClient.post<MentorResponse>('/mentors/profile', data)
  return response.data
}

export async function updateMyMentorProfile(data: MentorProfileUpdate): Promise<MentorResponse> {
  const response = await apiClient.put<MentorResponse>('/mentors/profile/me', data)
  return response.data
}

// ---------------------------------------------------------------------------
// Avatar upload
// ---------------------------------------------------------------------------

export async function uploadAvatar(file: File): Promise<{ avatar_url: string }> {
  const formData = new FormData()
  formData.append('file', file)
  const response = await apiClient.post<{ avatar_url: string; id: string }>(
    '/upload/avatar',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  // Backend returns a full UserResponse; we only need avatar_url
  return { avatar_url: (response.data as Record<string, string>)['avatar_url'] ?? '' }
}

// ---------------------------------------------------------------------------
// Bookings
// ---------------------------------------------------------------------------

export async function getMyBookings(
  status?: BookingStatus,
  page = 1,
  pageSize = 20
): Promise<PaginatedResponse<MentorBooking>> {
  const response = await apiClient.get<PaginatedResponse<MentorBooking>>('/bookings/me', {
    params: {
      status: status ?? undefined,
      page,
      page_size: pageSize,
    },
  })
  return response.data
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
  cancellationReason?: string
): Promise<MentorBooking> {
  const response = await apiClient.patch<MentorBooking>(`/bookings/${bookingId}/status`, {
    status,
    cancellation_reason: cancellationReason ?? null,
  })
  return response.data
}

// ---------------------------------------------------------------------------
// Service packages
// ---------------------------------------------------------------------------

export async function getMyServicePackages(): Promise<ServicePackage[]> {
  const response = await apiClient.get<ServicePackage[]>('/service-packages/me')
  return response.data
}

export async function createServicePackage(data: ServicePackageCreate): Promise<ServicePackage> {
  const response = await apiClient.post<ServicePackage>('/service-packages', data)
  return response.data
}

export async function updateServicePackage(
  packageId: string,
  data: ServicePackageUpdate
): Promise<ServicePackage> {
  const response = await apiClient.put<ServicePackage>(`/service-packages/${packageId}`, data)
  return response.data
}

export async function deleteServicePackage(packageId: string): Promise<void> {
  await apiClient.delete(`/service-packages/${packageId}`)
}

// ---------------------------------------------------------------------------
// Availability slots
// ---------------------------------------------------------------------------

export async function getMyAvailabilitySlots(
  mentorId: string,
  onlyAvailable = false,
  pageSize = 50
): Promise<PaginatedResponse<AvailabilitySlot>> {
  const response = await apiClient.get<PaginatedResponse<AvailabilitySlot>>(
    `/availability/mentor/${mentorId}`,
    {
      params: {
        only_available: onlyAvailable,
        page_size: pageSize,
      },
    }
  )
  return response.data
}

export async function createAvailabilitySlot(
  data: AvailabilitySlotCreate
): Promise<AvailabilitySlot> {
  const response = await apiClient.post<AvailabilitySlot>('/availability', data)
  return response.data
}

export async function deleteAvailabilitySlot(slotId: string): Promise<void> {
  await apiClient.delete(`/availability/${slotId}`)
}

// ---------------------------------------------------------------------------
// Calendly
// ---------------------------------------------------------------------------

export async function getMyCalendlyLink(): Promise<CalendlyLinkResponse> {
  const response = await apiClient.get<CalendlyLinkResponse>('/calendly/link/me')
  return response.data
}

export async function updateCalendlyLink(data: CalendlyLinkUpdate): Promise<CalendlyLinkResponse> {
  const response = await apiClient.put<CalendlyLinkResponse>('/calendly/link', data)
  return response.data
}
