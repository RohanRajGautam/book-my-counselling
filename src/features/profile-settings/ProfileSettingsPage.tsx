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
  ProfilePackagesCard,
  type PackagesForm,
  buildPackagePayloads,
} from './components/ProfilePackagesCard'

import {
  useMentorProfile,
  useUpdateMentorProfile,
} from '@/features/mentor-dashboard/hooks/useMentorProfile'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import {
  useMyPackages,
  useUpsertMentorPackages,
} from '@/features/service-packages/hooks/useMentorPackages'

const DEFAULT_GENERAL_INFO: GeneralInfoForm = {
  professionalTitle: '',
  currentCompany: '',
  experience: '',
  hourlyRate: '',
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

const DEFAULT_PACKAGES: PackagesForm = {
  hourlyRate: '',
}

export function ProfileSettingsPage() {
  const [activeTab, setActiveTab] = useState<ProfileSettingsTab>('general-info')
  const [generalInfo, setGeneralInfo] = useState<GeneralInfoForm>(DEFAULT_GENERAL_INFO)
  const [professionalBio, setProfessionalBio] = useState<ProfessionalBioForm>(DEFAULT_BIO)
  const [counselling, setCounselling] = useState<CounsellingType>(DEFAULT_COUNSELLING)
  const [packages, setPackages] = useState<PackagesForm>(DEFAULT_PACKAGES)

  const { data: profile, isLoading: profileLoading } = useMentorProfile()
  const { data: currentUser } = useCurrentUser()
  const { mutate: updateProfile, isPending: isSaving } = useUpdateMentorProfile()
  const { data: myPackages = [] } = useMyPackages()
  const { mutate: upsertPackages, isPending: isSavingPackages } = useUpsertMentorPackages()

  // Populate form state from API data once loaded
  useEffect(() => {
    if (!profile) return

    setGeneralInfo({
      professionalTitle: profile.title ?? '',
      currentCompany: profile.company ?? '',
      experience: profile.years_of_experience ? String(profile.years_of_experience) : '',
      hourlyRate: profile.hourly_rate ? String(profile.hourly_rate) : '',
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

    setPackages({
      hourlyRate: profile.hourly_rate ? String(profile.hourly_rate) : '',
    })
  }, [profile])

  const handleSave = () => {
    if (activeTab === 'packages') {
      handleSavePackages()
      return
    }

    const yearsNum = generalInfo.experience.trim()
      ? parseInt(generalInfo.experience.trim(), 10)
      : undefined
    const rateNum = generalInfo.hourlyRate.trim()
      ? parseFloat(generalInfo.hourlyRate.trim())
      : undefined

    if (yearsNum !== undefined && isNaN(yearsNum)) {
      toast.error('Years of experience must be a number.')
      return
    }
    if (rateNum !== undefined && isNaN(rateNum)) {
      toast.error('Hourly rate must be a number.')
      return
    }

    const payload = {
      title: generalInfo.professionalTitle.trim() || undefined,
      company: generalInfo.currentCompany.trim() || null,
      years_of_experience: yearsNum,
      hourly_rate: rateNum,
      bio: professionalBio.fullBiography.trim() || null,
      linkedin_url: professionalBio.linkedinUrl.trim() || null,
      website_url: professionalBio.portfolioUrl.trim() || null,
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

  const handleSavePackages = () => {
    const hourly = parseFloat(packages.hourlyRate.trim())
    if (!packages.hourlyRate.trim() || isNaN(hourly) || hourly <= 0) {
      toast.error('Please enter a valid hourly rate to generate packages.')
      return
    }

    const nextPackages = buildPackagePayloads(hourly)

    upsertPackages(
      { existing: myPackages, next: nextPackages },
      {
        onSuccess: () => toast.success('Packages saved successfully.'),
        onError: () => toast.error('Failed to save packages. Please try again.'),
      },
    )
  }

  const isSavingAny = isSaving || isSavingPackages

  if (profileLoading) {
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
        <ProfileSettingsHeader onSave={handleSave} isSaving={isSavingAny} />
        <ProfileSettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'general-info' && (
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div className="min-w-0 space-y-7">
              <ProfileGeneralInfoCard
                value={generalInfo}
                onChange={setGeneralInfo}
                readOnlyName={currentUser?.full_name}
                readOnlyEmail={currentUser?.email}
              />
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

        {activeTab === 'packages' && (
          <ProfilePackagesCard value={packages} onChange={setPackages} />
        )}
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
