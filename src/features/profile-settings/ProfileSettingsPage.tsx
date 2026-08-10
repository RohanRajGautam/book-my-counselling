'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

import { ProfileGeneralInfoCard, type GeneralInfoForm } from './components/ProfileGeneralInfoCard'
import { ProfilePhotoCard } from './components/ProfilePhotoCard'
import { ProfileCompanyCard } from './components/ProfileCompanyCard'
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
  useUploadMyCompanyLogo,
} from '@/features/mentor-dashboard/hooks/useMentorProfile'
import { MentorProfileUpdate } from '@/features/mentor-dashboard/types/mentor-dashboard.types'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import {
  useMyPackages,
  useUpsertMentorPackages,
} from '@/features/service-packages/hooks/useMentorPackages'
import {
  COACH_FOR_FRESHERS_SERVICE_SLUGS,
  COACH_FOR_FRESHERS_GROUP_TAG,
} from '@/features/coach-for-freshers/types/coach-for-freshers.types'
import {
  useAllAcademicSubcategoryIds,
  useProfessionalSubcategoryBuckets,
} from '@/features/categories/hooks/useCounselingCategories'
import { useTags } from '@/features/tags/hooks/useTags'

const DEFAULT_GENERAL_INFO: GeneralInfoForm = {
  professionalTitle: '',
  currentCompany: '',
  experience: '',
  hourlyRate: '',
}

const DEFAULT_BIO: ProfessionalBioForm = {
  headline: '',
  fullBiography: '',
  linkedinUrl: '',
  portfolioUrl: '',
}

const DEFAULT_COUNSELLING: CounsellingType = {
  is_professional_counselor: false,
  is_academic_counselor: false,
  coaching_services: [],
  subcategory_ids: [],
  professional_categories: [],
  academic_tags: [],
  industry_ids: [],
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
  const { mutateAsync: uploadCompanyLogo } = useUploadMyCompanyLogo()
  const { data: myPackages = [] } = useMyPackages()
  const { mutate: upsertPackages, isPending: isSavingPackages } = useUpsertMentorPackages()

  // Local override for the company logo preview. Updated immediately from
  // the upload response so the card refreshes without waiting for the
  // mentor-profile refetch. The cache invalidation in useUploadMyCompanyLogo
  // keeps every other page in sync.
  const [companyLogoUrlOverride, setCompanyLogoUrlOverride] = useState<string | null>(null)
  // Set true when a logo was uploaded during this session, so the
  // "Save Changes" handler can distinguish "user uploaded a logo and then
  // clicked save" from "user opened the page and clicked save with no edits".
  const [companyLogoUploadedInSession, setCompanyLogoUploadedInSession] = useState(false)

  const { ids: academicSubIds, isLoading: academicBucketingLoading } =
    useAllAcademicSubcategoryIds()
  const professionalSubIds = (profile?.subcategories ?? []).map((s) => s.id)
  const { buckets: professionalBuckets, isLoading: professionalBucketingLoading } =
    useProfessionalSubcategoryBuckets(professionalSubIds)
  const { data: catalogTags = [] } = useTags()

  // Seed form state from the loaded profile. Waits for the academic + professional
  // subcategory lookups to finish so we can split the flat `subcategories` array
  // into the academic `subcategory_ids` and structured `professional_categories`
  // channels. The seeding flag lives in state so the side effect runs at most once
  // per loaded profile; the setState here is the "derived state from props" pattern
  // (https://react.dev/learn/you-might-not-need-an-effect#resetting-all-state-when-a-prop-changes).
  const [seededProfileId, setSeededProfileId] = useState<string | null>(null)
  if (
    profile &&
    profile.id !== seededProfileId &&
    !academicBucketingLoading &&
    !professionalBucketingLoading
  ) {
    setSeededProfileId(profile.id)

    setGeneralInfo({
      professionalTitle: profile.title ?? '',
      currentCompany: profile.company ?? '',
      experience: profile.years_of_experience ? String(profile.years_of_experience) : '',
      hourlyRate: profile.hourly_rate ? String(profile.hourly_rate) : '',
    })

    setProfessionalBio({
      headline: profile.title ?? '',
      fullBiography: profile.bio ?? '',
      linkedinUrl: profile.linkedin_url ?? '',
      portfolioUrl: profile.website_url ?? '',
    })

    const subIds = (profile.subcategories ?? []).map((s) => s.id)
    const profileTagSlugs = (profile.tags ?? []).map((tag) => tag.slug)
    setCounselling({
      is_professional_counselor: profile.is_professional_counselor ?? false,
      is_academic_counselor: profile.is_academic_counselor ?? false,
      coaching_services: profileTagSlugs.filter((slug) =>
        COACH_FOR_FRESHERS_SERVICE_SLUGS.includes(slug)
      ),
      subcategory_ids: subIds.filter((id) => academicSubIds.has(id)),
      professional_categories: professionalBuckets,
      // Any tag the mentor has that isn't a curated service tag or the auto-added
      // coach-for-freshers group tag is treated as an academic tag. The seed is
      // best-effort — if a tag isn't in the catalog it stays attached server-side
      // and simply won't appear as selected here.
      academic_tags: profileTagSlugs.filter(
        (slug) =>
          !COACH_FOR_FRESHERS_SERVICE_SLUGS.includes(slug) && slug !== COACH_FOR_FRESHERS_GROUP_TAG
      ),
      industry_ids: (profile.industries ?? []).map((i) => i.id),
    })

    setPackages({
      hourlyRate: profile.hourly_rate ? String(profile.hourly_rate) : '',
    })
  }

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

    const payload: MentorProfileUpdate = {
      title: generalInfo.professionalTitle.trim() || undefined,
      company: generalInfo.currentCompany.trim() || null,
      years_of_experience: yearsNum,
      hourly_rate: rateNum,
      bio: professionalBio.fullBiography.trim() || null,
      linkedin_url: professionalBio.linkedinUrl.trim() || null,
      website_url: professionalBio.portfolioUrl.trim() || null,
      is_academic_counselor: counselling.is_academic_counselor,
      is_professional_counselor: counselling.is_professional_counselor,
      industry_ids: counselling.industry_ids,
    }

    // Map selected tag slugs (coaching_services + academic_tags) → backend tag IDs.
    // We look up in both the profile's attached tags and the full catalog so newly
    // picked tags resolve even when they weren't previously attached.
    const tagSlugs = [
      ...(counselling.is_professional_counselor ? [COACH_FOR_FRESHERS_GROUP_TAG] : []),
      ...(counselling.is_professional_counselor
        ? counselling.coaching_services.filter((slug) =>
            COACH_FOR_FRESHERS_SERVICE_SLUGS.includes(slug)
          )
        : []),
      ...(counselling.is_academic_counselor ? counselling.academic_tags : []),
    ]
    if (tagSlugs.length > 0 && profile) {
      const slugToId = new Map<string, string>([
        ...profile.tags.map((t) => [t.slug, t.id] as const),
        ...catalogTags.map((t) => [t.slug, t.id] as const),
      ])
      const tagIds = tagSlugs
        .map((slug) => slugToId.get(slug))
        .filter((id): id is string => Boolean(id))
      if (tagIds.length > 0) {
        payload.tag_ids = tagIds
      }
    }

    // Sending subcategory_ids replaces the existing set. Omitting leaves it untouched,
    // so we only include it when the user is an academic counsellor.
    if (counselling.is_academic_counselor) {
      payload.subcategory_ids = counselling.subcategory_ids
    }

    // Sending professional_categories replaces the existing set of (parent, subcats)
    // pairs. Omitting leaves it untouched. We strip empty parent buckets so the
    // backend doesn't reject them.
    if (counselling.is_professional_counselor) {
      const nonEmpty = counselling.professional_categories.filter(
        (c) => c.subcategory_ids.length > 0
      )
      if (nonEmpty.length > 0) {
        payload.professional_categories = nonEmpty
      }
    }

    updateProfile(payload, {
      onSuccess: () => {
        // Avatar / company logo (if any) already saved via their own mutations.
        // Tailor the success copy so the user doesn't see a generic "Profile
        // updated" right after a logo upload that didn't change any field.
        if (companyLogoUploadedInSession) {
          toast.success('Profile and company logo are up to date.')
        } else {
          toast.success('Profile updated successfully.')
        }
      },
      onError: (err: unknown) => {
        const msg = extractApiError(err) ?? 'Failed to save profile. Please try again.'
        toast.error(msg)
      },
    })
  }

  const handleCompanyLogoUpload = async (file: File) => {
    try {
      const updated = await uploadCompanyLogo(file)
      setCompanyLogoUrlOverride(updated.company_logo_url ?? null)
      setCompanyLogoUploadedInSession(true)
      toast.success(updated.company_logo_url ? 'Company logo updated.' : 'Company logo removed.')
    } catch (err) {
      toast.error(extractApiError(err) ?? 'Failed to upload logo. Please try again.')
      throw err
    }
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
      }
    )
  }

  const isSavingAny = isSaving || isSavingPackages

  if (profileLoading) {
    return (
      <div className="min-h-svh bg-[#f8f9ff]">
        <div className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="h-12 w-64 animate-pulse rounded-2xl bg-white shadow-[0_18px_45px_rgba(15,23,42,0.04)]" />
          <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div className="space-y-7">
              <div className="h-80 animate-pulse rounded-[28px] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.04)]" />
              <div className="h-40 animate-pulse rounded-[28px] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.04)]" />
            </div>
            <div className="space-y-6">
              <div className="h-64 animate-pulse rounded-[28px] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.04)]" />
              <div className="h-48 animate-pulse rounded-[28px] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.04)]" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-[#f8f9ff] pb-28 text-slate-950 md:pb-0">
      <div className="mx-auto w-full max-w-[1180px] space-y-3 px-3 py-5 sm:space-y-6 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <ProfileSettingsHeader onSave={handleSave} isSaving={isSavingAny} />
        <div className="sticky top-16 z-10 -mx-3 bg-[#f8f9ff]/95 px-3 py-2 backdrop-blur md:static md:mx-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
          <ProfileSettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {activeTab === 'general-info' && (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-8">
            <div className="min-w-0 space-y-6 sm:space-y-7">
              <ProfileGeneralInfoCard
                value={generalInfo}
                onChange={setGeneralInfo}
                readOnlyName={currentUser?.full_name}
                readOnlyEmail={currentUser?.email}
              />
              <ProfileCounsellingCard
                value={counselling}
                onChange={setCounselling}
                loading={!profile || profile.id !== seededProfileId}
              />
            </div>

            <aside className="space-y-6 lg:space-y-7">
              <ProfilePhotoCard />
              <ProfileCompanyCard
                existingLogoUrl={companyLogoUrlOverride ?? profile?.company_logo_url ?? null}
                onUpload={handleCompanyLogoUpload}
                companyName={generalInfo.currentCompany}
              />
              <ProfileStatusCard />
            </aside>
          </div>
        )}

        {activeTab === 'professional-bio' && (
          <ProfileProfessionalBioCard
            value={professionalBio}
            onChange={setProfessionalBio}
            counselling={counselling}
            onCounsellingChange={setCounselling}
          />
        )}

        {activeTab === 'session-availability' && <ProfileSessionAvailabilityCard />}

        {activeTab === 'packages' && (
          <ProfilePackagesCard value={packages} onChange={setPackages} />
        )}
      </div>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/80 bg-white/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-16px_40px_rgba(15,23,42,0.12)] backdrop-blur md:hidden">
        <Button
          type="button"
          onClick={handleSave}
          disabled={isSavingAny}
          className="h-12 w-full rounded-2xl bg-[#0755d8] font-bold text-white shadow-[0_12px_24px_rgba(7,85,216,0.22)] hover:bg-blue-700 disabled:opacity-60"
        >
          {isSavingAny ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}

function extractApiError(err: unknown): string | null {
  if (!err || typeof err !== 'object') return null
  const e = err as Record<string, unknown>
  const response = e['response'] as Record<string, unknown> | undefined
  const data = response?.['data'] as Record<string, unknown> | undefined
  if (!data) return null

  // 422 from Pydantic — detail is an array of {loc, msg, type}.
  if (Array.isArray(data['detail'])) {
    const items = (data['detail'] as Array<Record<string, unknown>>)
      .map((row) => {
        const loc = Array.isArray(row['loc'])
          ? (row['loc'] as unknown[]).filter((l) => l !== 'body').join('.')
          : ''
        const msg = typeof row['msg'] === 'string' ? row['msg'] : ''
        return loc && msg ? `${loc}: ${msg}` : msg
      })
      .filter(Boolean)
    if (items.length > 0) return items.join('\n')
  }

  // 400 from service layer — detail is a flat string.
  if (typeof data['detail'] === 'string') return data['detail']

  return null
}
