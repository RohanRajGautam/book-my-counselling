'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { ProfileGeneralInfoCard, type GeneralInfoForm } from './components/ProfileGeneralInfoCard'
import { ProfilePhotoCard } from './components/ProfilePhotoCard'
import {
  ProfileProfessionalBioCard,
  type ProfessionalBioForm,
} from './components/ProfileProfessionalBioCard'
import { ProfileSettingsHeader } from './components/ProfileSettingsHeader'
import { ProfileSessionAvailabilityCard } from './components/ProfileSessionAvailabilityCard'
import { ProfileSettingsTabs, type ProfileSettingsTab } from './components/ProfileSettingsTabs'
import { ProfileStatusCard } from './components/ProfileStatusCard'
import { ProfileCounsellingCard, type CounsellingType } from './components/ProfileCounsellingCard'

import {
  useMentorProfile,
  useUpdateMentorProfile,
} from '@/features/mentor-dashboard/hooks/useMentorProfile'

const DEFAULT_GENERAL_INFO: GeneralInfoForm = {
  fullName: '',
  professionalTitle: '',
  emailAddress: '',
  phoneNumber: '',
  education: '',
  currentCompany: '',
  experience: '',
  timezone: '',
}

const DEFAULT_BIO: ProfessionalBioForm = {
  headline: '',
  specializedFields: [],
  fullBiography: '',
  linkedinUrl: '',
  portfolioUrl: '',
}

const DEFAULT_COUNSELLING: CounsellingType = {
  is_professional_counselor: false,
  is_academic_counselor: false,
}

export function ProfileSettingsPage() {
  const [activeTab, setActiveTab] = useState<ProfileSettingsTab>('general-info')
  const [generalInfo, setGeneralInfo] = useState<GeneralInfoForm>(DEFAULT_GENERAL_INFO)
  const [professionalBio, setProfessionalBio] = useState<ProfessionalBioForm>(DEFAULT_BIO)
  const [counselling, setCounselling] = useState<CounsellingType>(DEFAULT_COUNSELLING)

  const { data: profile, isLoading } = useMentorProfile()
  const { mutate: updateProfile, isPending: isSaving } = useUpdateMentorProfile()

  // Populate all form state from API data once loaded
  useEffect(() => {
    if (!profile) return

    setGeneralInfo({
      fullName: profile.user?.full_name ?? '',
      professionalTitle: profile.title ?? '',
      emailAddress: '',
      phoneNumber: '',
      education: '',
      currentCompany: profile.company ?? '',
      experience: String(profile.years_of_experience ?? ''),
      timezone: '',
    })

    setProfessionalBio({
      headline: profile.title ?? '',
      specializedFields: [
        ...(profile.is_academic_counselor ? ['Academic Counselling'] : []),
        ...(profile.is_professional_counselor ? ['Professional Coaching'] : []),
      ],
      fullBiography: profile.bio ?? '',
      linkedinUrl: profile.linkedin_url ?? '',
      portfolioUrl: profile.website_url ?? '',
    })

    setCounselling({
      is_professional_counselor: profile.is_professional_counselor ?? false,
      is_academic_counselor: profile.is_academic_counselor ?? false,
    })
  }, [profile])

  const handleSave = () => {
    // Build the payload from whichever tab is active, but always include
    // the core fields that the backend accepts on PUT /mentors/profile/me
    const yearsRaw = generalInfo.experience.trim()
    const yearsNum = yearsRaw ? parseInt(yearsRaw, 10) : undefined

    const payload = {
      // General info tab fields
      title: generalInfo.professionalTitle.trim() || undefined,
      company: generalInfo.currentCompany.trim() || null,
      years_of_experience: yearsNum !== undefined && !isNaN(yearsNum) ? yearsNum : undefined,

      // Professional bio tab fields
      bio: professionalBio.fullBiography.trim() || null,
      linkedin_url: professionalBio.linkedinUrl.trim() || null,
      website_url: professionalBio.portfolioUrl.trim() || null,

      // Counselling type — from the dedicated counselling card
      is_academic_counselor: counselling.is_academic_counselor,
      is_professional_counselor: counselling.is_professional_counselor,
    }

    updateProfile(payload, {
      onSuccess: () => toast.success('Profile updated successfully.'),
      onError: (err: unknown) => {
        const msg = extractApiError(err) ?? 'Failed to save profile. Please try again.'
        toast.error(msg)
      },
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-svh bg-[#f8f9ff]">
        <div className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="h-12 w-64 animate-pulse rounded-2xl bg-slate-200" />
          <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div className="space-y-7">
              <div className="h-80 animate-pulse rounded-[28px] bg-slate-200" />
              <div className="h-40 animate-pulse rounded-[28px] bg-slate-200" />
            </div>
            <div className="space-y-6">
              <div className="h-64 animate-pulse rounded-[28px] bg-slate-200" />
              <div className="h-48 animate-pulse rounded-[28px] bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-[#f8f9ff] text-slate-950">
      <div className="mx-auto w-full max-w-[1180px] space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <ProfileSettingsHeader onSave={handleSave} isSaving={isSaving} />
        <ProfileSettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'general-info' && (
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div className="min-w-0 space-y-7">
              <ProfileGeneralInfoCard value={generalInfo} onChange={setGeneralInfo} />
              <ProfileCounsellingCard value={counselling} onChange={setCounselling} />
            </div>

            <aside className="space-y-6 lg:space-y-7">
              <ProfilePhotoCard />
              <ProfileStatusCard />
            </aside>
          </div>
        )}

        {activeTab === 'professional-bio' && (
          <ProfileProfessionalBioCard value={professionalBio} onChange={setProfessionalBio} />
        )}

        {activeTab === 'session-availability' && <ProfileSessionAvailabilityCard />}
      </div>
    </div>
  )
}

function extractApiError(err: unknown): string | null {
  if (!err || typeof err !== 'object') return null
  const e = err as Record<string, unknown>
  const response = e['response'] as Record<string, unknown> | undefined
  const data = response?.['data'] as Record<string, unknown> | undefined
  if (typeof data?.['detail'] === 'string') return data['detail']
  return null
}
