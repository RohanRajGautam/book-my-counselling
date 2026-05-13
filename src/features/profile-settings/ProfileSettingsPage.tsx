'use client'

import { useState } from 'react'

import { ProfileGeneralInfoCard, type GeneralInfoForm } from './components/ProfileGeneralInfoCard'
import { ProfilePhotoCard } from './components/ProfilePhotoCard'
import {
  ProfileProfessionalBioCard,
  type ProfessionalBioForm,
} from './components/ProfileProfessionalBioCard'
import { ProfileSettingsHeader } from './components/ProfileSettingsHeader'
import { ProfileSettingsTabs, type ProfileSettingsTab } from './components/ProfileSettingsTabs'
import { ProfileStatusCard } from './components/ProfileStatusCard'
import { ProfileSupportCard } from './components/ProfileSupportCard'

export function ProfileSettingsPage() {
  const [activeTab, setActiveTab] = useState<ProfileSettingsTab>('general-info')
  const [generalInfo, setGeneralInfo] = useState<GeneralInfoForm>({
    fullName: 'Dr. Alexander Wright',
    professionalTitle: 'Senior Academic Advisor',
    emailAddress: 'alexander.wright@university.edu',
    phoneNumber: '+1 (555) 012-3456',
    timezone: '(GMT-05:00) Eastern Time - New York',
  })
  const [professionalBio, setProfessionalBio] = useState<ProfessionalBioForm>({
    headline: 'Empowering students through tailored academic strategies and career coaching.',
    specializedFields: ['Computer Science', 'Career Growth'],
    fullBiography:
      'With over a decade of experience in academic advising at top-tier institutions, I specialize in helping students navigate complex degree requirements and transition smoothly into high-growth industries. My approach combines data-driven planning with empathetic mentorship to ensure every student reaches their full potential.',
  })

  const handleSave = () => {
    const payload =
      activeTab === 'professional-bio'
        ? {
            section: activeTab,
            professionalBio: {
              ...professionalBio,
              specializedFields: professionalBio.specializedFields
                .map((field) => field.trim())
                .filter(Boolean),
            },
          }
        : {
            section: activeTab,
            generalInfo,
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
            </div>

            <aside className="space-y-6 lg:space-y-7">
              <ProfilePhotoCard />
              <ProfileStatusCard />
              <ProfileSupportCard />
            </aside>
          </div>
        ) : null}

        {activeTab === 'professional-bio' ? (
          <ProfileProfessionalBioCard value={professionalBio} onChange={setProfessionalBio} />
        ) : null}

        {activeTab === 'session-availability' ? (
          <section
            id="session-availability"
            className="rounded-2xl bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8"
          >
            <h2 className="font-headline text-xl font-extrabold text-slate-950 sm:text-2xl">
              Session Availability
            </h2>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Availability settings will appear here.
            </p>
          </section>
        ) : null}
      </div>
    </div>
  )
}
