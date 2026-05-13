'use client'

import { useState } from 'react'

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

import { ProfileCounsellingCard } from './components/ProfileCounsellingCard'

export function ProfileSettingsPage() {
  const [activeTab, setActiveTab] = useState<ProfileSettingsTab>('general-info')
  const [generalInfo, setGeneralInfo] = useState<GeneralInfoForm>({
    fullName: 'Dr. Alexander Wright',
    professionalTitle: 'Senior Academic Advisor',
    emailAddress: 'alexander.wright@university.edu',
    phoneNumber: '+1 (555) 012-3456',
    education: 'Oxford University',
    currentCompany: 'Oxford University',
    experience: '12',
    timezone: '(GMT-05:00) Eastern Time - New York',
  })
  const [professionalBio, setProfessionalBio] = useState<ProfessionalBioForm>({
    headline: 'Empowering students through tailored academic strategies and career coaching.',
    specializedFields: [],
    fullBiography:
      'With over a decade of experience in academic advising at top-tier institutions, I specialize in helping students navigate complex degree requirements and transition smoothly into high-growth industries. My approach combines data-driven planning with empathetic mentorship to ensure every student reaches their full potential.',
    linkedinUrl: '',
    portfolioUrl: '',
  })

  const handleSave = () => {
    const inputValues = {
      ...generalInfo,
      headline: professionalBio.headline,
      fullBiography: professionalBio.fullBiography,
      linkedinUrl: professionalBio.linkedinUrl,
      portfolioUrl: professionalBio.portfolioUrl,
    }
    const payload = Object.fromEntries(
      Object.entries(inputValues)
        .map(([key, value]) => [key, value.trim()])
        .filter(([, value]) => Boolean(value))
    ) as Partial<GeneralInfoForm & ProfessionalBioForm>

    if (professionalBio.specializedFields.length > 0) {
      payload.specializedFields = professionalBio.specializedFields
    }

    console.log('Profile settings save payload:', payload)
  }

  return (
    <div className="min-h-svh bg-[#f8f9ff] text-slate-950">
      <div className="mx-auto w-full max-w-[1180px] space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <ProfileSettingsHeader onSave={handleSave} />
        <ProfileSettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'general-info' ? (
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div className="min-w-0 space-y-7">
              <ProfileGeneralInfoCard value={generalInfo} onChange={setGeneralInfo} />
              <ProfileCounsellingCard />
            </div>

            <aside className="space-y-6 lg:space-y-7">
              <ProfilePhotoCard />
              <ProfileStatusCard />
            </aside>
          </div>
        ) : null}

        {activeTab === 'professional-bio' ? (
          <ProfileProfessionalBioCard value={professionalBio} onChange={setProfessionalBio} />
        ) : null}

        {activeTab === 'session-availability' ? <ProfileSessionAvailabilityCard /> : null}
      </div>
    </div>
  )
}
