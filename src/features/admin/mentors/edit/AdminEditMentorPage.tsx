'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, ArrowLeft, Loader2, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  useAdminSetMentorLogo,
  useAdminSetUserAvatar,
  useMentorFromAdminListCache,
  useUpdateAdminUserProfile,
} from '@/features/admin/mentors/hooks/useAdminMentors'
import { useTags } from '@/features/tags/hooks/useTags'
import {
  useAllAcademicSubcategoryIds,
  useProfessionalSubcategoryBuckets,
} from '@/features/categories/hooks/useCounselingCategories'
import { COACH_FOR_FRESHERS_SERVICE_SLUGS } from '@/features/coach-for-freshers/types/coach-for-freshers.types'
import { AdminCreateMentorHeader } from '../create/components/AdminCreateMentorHeader'
import {
  AdminCreateMentorTabs,
  type AdminCreateMentorTab,
} from '../create/components/AdminCreateMentorTabs'
import { AdminCreateMentorIdentityCard } from '../create/components/AdminCreateMentorIdentityCard'
import {
  AdminCreateMentorGeneralInfoCard,
  type AdminCreateMentorGeneralInfoForm,
} from '../create/components/AdminCreateMentorGeneralInfoCard'
import {
  AdminCreateMentorCounsellingCard,
  type AdminCounsellingForm,
} from '../create/components/AdminCreateMentorCounsellingCard'
import { AdminCreateMentorPhotoCard } from '../create/components/AdminCreateMentorPhotoCard'
import { AdminCreateMentorLogoCard } from '../create/components/AdminCreateMentorLogoCard'
import {
  AdminCreateMentorBioCard,
  type AdminCreateMentorBioForm,
} from '../create/components/AdminCreateMentorBioCard'
import {
  fieldHasError,
  formatFieldErrors,
  validateUpdateMentorForm,
  type UpdateMentorForm,
} from '../create/lib/validation'
import type { AdminMentorProfileUpdate, AdminUserProfileUpdate } from '../../types/admin.types'

const EMPTY_GENERAL: AdminCreateMentorGeneralInfoForm = {
  title: '',
  company: '',
  yearsOfExperience: '',
  hourlyRate: '',
}

const EMPTY_COUNSELLING: AdminCounsellingForm = {
  isProfessionalCounselor: false,
  isAcademicCounselor: false,
  coachingServices: [],
  subcategoryIds: [],
  professionalCategories: [],
  academicTags: [],
  industryIds: [],
}

const EMPTY_BIO: AdminCreateMentorBioForm = {
  bio: '',
  linkedinUrl: '',
  websiteUrl: '',
  calendlyLink: '',
}

type InitialSnapshot = {
  fullName: string
  general: AdminCreateMentorGeneralInfoForm
  counselling: AdminCounsellingForm
  bio: AdminCreateMentorBioForm
}

type AdminEditMentorPageProps = {
  userId: string
}

export function AdminEditMentorPage({ userId }: AdminEditMentorPageProps) {
  const router = useRouter()
  const { mutate: updateProfile, isPending } = useUpdateAdminUserProfile(userId)
  const { mutateAsync: uploadAvatar } = useAdminSetUserAvatar(userId)
  const { data: catalogTags = [] } = useTags()
  const { ids: academicIds, isLoading: academicIdsLoading } = useAllAcademicSubcategoryIds()
  const cachedMentor = useMentorFromAdminListCache(userId)
  // The logo endpoint takes the mentor profile id, not the user id. The hook
  // is always called (rules of hooks) but `cachedMentor.id` is what we want
  // once the cache is populated; the trailing `userId` fallback only covers
  // the brief pre-load window and is never exercised by the upload handler
  // (the card only renders once `cachedMentor` is loaded).
  const uploadMentorLogoMutate = useAdminSetMentorLogo(cachedMentor?.id ?? userId)

  const [activeTab, setActiveTab] = useState<AdminCreateMentorTab>('general-info')

  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [general, setGeneral] = useState<AdminCreateMentorGeneralInfoForm>(EMPTY_GENERAL)
  const [counselling, setCounselling] = useState<AdminCounsellingForm>(EMPTY_COUNSELLING)
  const [bio, setBio] = useState<AdminCreateMentorBioForm>(EMPTY_BIO)

  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [snapshot, setSnapshot] = useState<InitialSnapshot | null>(null)

  // Local override for the avatar preview. Updated immediately from the upload
  // response so the user sees their new photo without waiting for the mentor
  // list to refetch. The cache invalidation in useAdminSetUserAvatar keeps
  // every other page in sync.
  const [avatarUrlOverride, setAvatarUrlOverride] = useState<string | null>(null)
  // Set true when an avatar was uploaded during this session, so the "Save
  // changes" handler can distinguish "user uploaded a photo and then clicked
  // save" from "user opened the page and clicked save with no edits".
  const [avatarUploadedInSession, setAvatarUploadedInSession] = useState(false)

  // Same pattern for the company logo — immediate preview refresh from the
  // upload response, and a session flag so the "Save changes" handler can
  // distinguish "logo uploaded, save tapped" from "no edits at all".
  const [companyLogoUrlOverride, setCompanyLogoUrlOverride] = useState<string | null>(null)
  const [companyLogoUploadedInSession, setCompanyLogoUploadedInSession] = useState(false)

  // Split the flat subcategory list into academic IDs (used as
  // `subcategoryIds`) and professional buckets (one entry per parent category).
  const flatSubIds = useMemo(
    () => cachedMentor?.subcategories?.map((s) => s.id) ?? [],
    [cachedMentor?.subcategories]
  )

  const initialSubIds = useMemo(() => {
    const subList = cachedMentor?.subcategories ?? []
    return subList.filter((s) => academicIds.has(s.id)).map((s) => s.id)
  }, [cachedMentor?.subcategories, academicIds])

  const { buckets: professionalBuckets, isLoading: bucketsLoading } =
    useProfessionalSubcategoryBuckets(flatSubIds)

  const readyToSeed = Boolean(cachedMentor) && !academicIdsLoading && !bucketsLoading

  // Seed the controlled form once per mentor. After that, user edits own the state.
  const seededFor = useRef<string | null>(null)
  useEffect(() => {
    if (!readyToSeed || !cachedMentor) return
    if (seededFor.current === cachedMentor.user_id) return

    const idToSlug = new Map(catalogTags.map((t) => [t.id, t.slug] as const))

    const tagSlugs = cachedMentor.tags.map((t) => idToSlug.get(t.id) ?? t.slug).filter(Boolean)

    const managedServiceSlugs = tagSlugs.filter((s) => COACH_FOR_FRESHERS_SERVICE_SLUGS.includes(s))
    const academicTagSlugs = tagSlugs.filter((s) => !COACH_FOR_FRESHERS_SERVICE_SLUGS.includes(s))

    setEmail(cachedMentor.user.email)
    setFullName(cachedMentor.user.full_name)
    setGeneral({
      title: cachedMentor.title,
      company: cachedMentor.company ?? '',
      yearsOfExperience: String(cachedMentor.years_of_experience ?? 0),
      hourlyRate: cachedMentor.hourly_rate,
    })
    setCounselling({
      isProfessionalCounselor: cachedMentor.is_professional_counselor,
      isAcademicCounselor: cachedMentor.is_academic_counselor,
      coachingServices: managedServiceSlugs,
      subcategoryIds: initialSubIds,
      professionalCategories: professionalBuckets,
      academicTags: academicTagSlugs,
      industryIds: cachedMentor.industries.map((i) => i.id),
    })
    setBio({
      bio: cachedMentor.bio ?? '',
      linkedinUrl: cachedMentor.linkedin_url ?? '',
      websiteUrl: cachedMentor.website_url ?? '',
      calendlyLink: cachedMentor.calendly_link ?? '',
    })
    setSnapshot({
      fullName: cachedMentor.user.full_name,
      general: {
        title: cachedMentor.title,
        company: cachedMentor.company ?? '',
        yearsOfExperience: String(cachedMentor.years_of_experience ?? 0),
        hourlyRate: cachedMentor.hourly_rate,
      },
      counselling: {
        isProfessionalCounselor: cachedMentor.is_professional_counselor,
        isAcademicCounselor: cachedMentor.is_academic_counselor,
        coachingServices: managedServiceSlugs,
        subcategoryIds: initialSubIds,
        professionalCategories: professionalBuckets,
        academicTags: academicTagSlugs,
        industryIds: cachedMentor.industries.map((i) => i.id),
      },
      bio: {
        bio: cachedMentor.bio ?? '',
        linkedinUrl: cachedMentor.linkedin_url ?? '',
        websiteUrl: cachedMentor.website_url ?? '',
        calendlyLink: cachedMentor.calendly_link ?? '',
      },
    })
    seededFor.current = cachedMentor.user_id
    // We deliberately omit deps that change while the user edits so seeding
    // only runs once per mentor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyToSeed, cachedMentor?.user_id])

  // ── Validation ────────────────────────────────────────────────────────
  const errors = useMemo<{ field: string; message: string }[]>(() => {
    if (!snapshot) return []
    return validateUpdateMentorForm({
      fullName,
      title: general.title,
      company: general.company,
      yearsOfExperience: general.yearsOfExperience,
      hourlyRate: general.hourlyRate,
      bio: bio.bio,
      linkedinUrl: bio.linkedinUrl,
      websiteUrl: bio.websiteUrl,
      calendlyLink: bio.calendlyLink,
      isProfessionalCounselor: counselling.isProfessionalCounselor,
      isAcademicCounselor: counselling.isAcademicCounselor,
      subcategoryIds: counselling.subcategoryIds,
      professionalCategories: counselling.professionalCategories,
      coachingServices: counselling.coachingServices,
      academicTags: counselling.academicTags,
      industryIds: counselling.industryIds,
    })
  }, [fullName, general, bio, counselling, snapshot])

  const showError = (field: string) => submitAttempted && fieldHasError(errors, field)
  const firstErrorMessage = errors[0]?.message

  // ── Submit ────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    setSubmitAttempted(true)
    if (!snapshot) return
    if (errors.length > 0) {
      toast.error(formatFieldErrors(errors))
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      return
    }

    const payload = buildUpdatePayload({
      fullName,
      general,
      counselling,
      bio,
      snapshot,
      catalogTags,
    })

    if (Object.keys(payload).length === 0) {
      // Avatar / logo (if any) already saved via their own mutations. Skip
      // the "nothing happened" toast in those cases so the user isn't told
      // their upload was ignored.
      if (avatarUploadedInSession && companyLogoUploadedInSession) {
        toast.success('Profile photo and company logo already updated.')
      } else if (avatarUploadedInSession) {
        toast.success('Profile photo already updated.')
      } else if (companyLogoUploadedInSession) {
        toast.success('Company logo already updated.')
      } else {
        toast.info('No changes to save.')
      }
      return
    }

    updateProfile(payload, {
      onSuccess: () => {
        toast.success('Mentor updated.')
        // The list cache is invalidated by the hook; reseed from the freshly
        // refetched mentor so the snapshot tracks the new server state.
        setSnapshot((cur) =>
          cur
            ? {
                ...cur,
                fullName: fullName.trim(),
                general,
                counselling,
                bio,
              }
            : cur
        )
      },
      onError: (err) => {
        toast.error(extractApiError(err) ?? 'Failed to update mentor.')
      },
    })
  }

  const handleAvatarUpload = async (file: File) => {
    try {
      const updated = await uploadAvatar(file)
      setAvatarUrlOverride(updated.avatar_url ?? null)
      setAvatarUploadedInSession(true)
      toast.success(updated.avatar_url ? 'Profile photo updated.' : 'Profile photo removed.')
    } catch (err) {
      toast.error(extractApiError(err) ?? 'Failed to upload photo. Please try again.')
      throw err
    }
  }

  const handleMentorLogoUpload = async (file: File) => {
    try {
      const updated = await uploadMentorLogoMutate.mutateAsync(file)
      setCompanyLogoUrlOverride(updated.company_logo_url ?? null)
      setCompanyLogoUploadedInSession(true)
      toast.success(updated.company_logo_url ? 'Company logo updated.' : 'Company logo removed.')
    } catch (err) {
      toast.error(extractApiError(err) ?? 'Failed to upload logo. Please try again.')
      throw err
    }
  }

  // ── Not-in-cache state (direct URL access without a prior mentors list visit) ──
  // Render this only after we've had a chance to look at the cache. On the
  // first render the hook synchronously reads the cache so `cachedMentor` is
  // `undefined` only if the cache really doesn't have this user.
  if (!cachedMentor) {
    return (
      <StateShell>
        <AlertTriangle className="mx-auto size-10 text-amber-600" strokeWidth={2.2} />
        <h1 className="font-headline mt-3 text-2xl font-extrabold text-slate-950">
          Open this mentor from the list
        </h1>
        <p className="mt-1 max-w-sm text-sm text-slate-600">
          We couldn&apos;t load this mentor&apos;s profile from your current view. Open them from
          the mentors list to edit.
        </p>
        <Button
          variant="outline"
          className="mt-5 rounded-xl"
          nativeButton={false}
          render={<Link href="/admin/mentors" />}
        >
          <ArrowLeft className="size-3.5" /> Back to mentors
        </Button>
      </StateShell>
    )
  }

  if (!readyToSeed || !snapshot) {
    return (
      <div className="min-h-svh bg-[#f8f9ff] text-slate-950">
        <div className="mx-auto w-full max-w-[1180px] space-y-6 px-3 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <SkeletonHeader />
          <SkeletonTabs />
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-8">
            <div className="space-y-6 sm:space-y-7">
              <SkeletonCard lines={4} />
              <SkeletonCard lines={4} />
              <SkeletonCard lines={6} />
            </div>
            <SkeletonCard lines={3} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-[#f8f9ff] pb-28 text-slate-950 md:pb-0">
      <div className="mx-auto w-full max-w-[1180px] space-y-3 px-3 py-5 sm:space-y-6 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <AdminCreateMentorHeader mode="edit" onSubmit={handleSubmit} isSubmitting={isPending} />

        <div className="sticky top-16 z-10 -mx-3 bg-[#f8f9ff]/95 px-3 py-2 backdrop-blur md:static md:mx-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
          <AdminCreateMentorTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            ariaLabel="Edit mentor sections"
          />
        </div>

        {firstErrorMessage && submitAttempted ? (
          <div
            role="alert"
            className="mt-2 flex items-start gap-3 rounded-2xl border-2 border-red-100 bg-red-50 px-4 py-3 sm:px-5"
          >
            <p className="text-sm font-bold text-red-700">{firstErrorMessage}</p>
          </div>
        ) : null}

        {activeTab === 'general-info' && (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-8">
            <div className="min-w-0 space-y-6 sm:space-y-7">
              <AdminCreateMentorIdentityCard
                email={email}
                fullName={fullName}
                onEmailChange={() => {
                  /* email is read-only on edit; no-op */
                }}
                onFullNameChange={setFullName}
                emailReadOnly
                title="Profile Identity"
                description="Update the mentor's display name. Email is locked here — manage it through the user's account settings."
                emailError={showError('email') ? 'Please enter a valid email.' : undefined}
                fullNameError={showError('fullName') ? 'Full name is required.' : undefined}
              />
              <AdminCreateMentorGeneralInfoCard
                value={general}
                onChange={setGeneral}
                errors={{
                  title: showError('title') ? 'Professional title is required.' : undefined,
                  yearsOfExperience: showError('yearsOfExperience')
                    ? 'Years must be a whole number between 0 and 60.'
                    : undefined,
                  hourlyRate: showError('hourlyRate')
                    ? 'Hourly rate must be between 0 and 10000 NPR.'
                    : undefined,
                }}
              />
              <AdminCreateMentorCounsellingCard
                value={counselling}
                onChange={setCounselling}
                errors={{
                  counsellingType: showError('counsellingType')
                    ? 'Choose at least one counselling type.'
                    : undefined,
                  subcategoryIds: showError('subcategoryIds')
                    ? 'Pick at least one academic field.'
                    : undefined,
                  coachingServices: showError('coachingServices')
                    ? 'Pick at least one professional service.'
                    : undefined,
                }}
              />
            </div>

            <aside className="space-y-6 lg:space-y-7">
              <AdminCreateMentorPhotoCard
                avatarFile={null}
                fullName={fullName}
                onAvatarChange={() => {
                  /* edit uses onUpload (immediate upload); onAvatarChange is unused here */
                }}
                existingAvatarUrl={avatarUrlOverride ?? cachedMentor.user.avatar_url ?? null}
                onUpload={handleAvatarUpload}
              />
              <AdminCreateMentorLogoCard
                existingLogoUrl={companyLogoUrlOverride ?? cachedMentor.company_logo_url ?? null}
                onUpload={handleMentorLogoUpload}
                companyName={general.company}
              />
            </aside>
          </div>
        )}

        {activeTab === 'professional-bio' && (
          <AdminCreateMentorBioCard
            value={bio}
            onChange={setBio}
            errors={{
              linkedinUrl: showError('linkedinUrl') ? 'Enter a valid URL.' : undefined,
              websiteUrl: showError('websiteUrl') ? 'Enter a valid URL.' : undefined,
              calendlyLink: showError('calendlyLink') ? 'Enter a valid URL.' : undefined,
            }}
          />
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-slate-200/80 bg-white/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-16px_40px_rgba(15,23,42,0.12)] backdrop-blur md:hidden">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/mentors')}
          className="h-12 flex-1 rounded-2xl border-slate-300 font-bold text-slate-700"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="h-12 flex-1 rounded-2xl bg-[#0755d8] font-bold text-white shadow-[0_12px_24px_rgba(7,85,216,0.22)] hover:bg-blue-700 disabled:opacity-60"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Saving…
            </>
          ) : (
            'Save changes'
          )}
        </Button>
      </div>
    </div>
  )
}

// ── Helpers ────────────────────────────────────────────────────────────────

function buildUpdatePayload(args: {
  fullName: string
  general: AdminCreateMentorGeneralInfoForm
  counselling: AdminCounsellingForm
  bio: AdminCreateMentorBioForm
  snapshot: InitialSnapshot
  catalogTags: { id: string; slug: string }[]
}): AdminUserProfileUpdate {
  const { fullName, general, counselling, bio, snapshot, catalogTags } = args
  const out: AdminUserProfileUpdate = {}

  if (fullName.trim() !== snapshot.fullName.trim()) {
    out.user = { ...(out.user ?? {}), full_name: fullName.trim() }
  }

  const profile: AdminMentorProfileUpdate = {}

  const titleTrim = general.title.trim()
  if (titleTrim !== snapshot.general.title.trim()) {
    profile.title = titleTrim
  }

  const companyTrim = general.company.trim()
  const snapCompany = snapshot.general.company.trim()
  if (companyTrim !== snapCompany) {
    profile.company = companyTrim === '' ? null : companyTrim
  }

  const bioTrim = bio.bio.trim()
  const snapBio = snapshot.bio.bio.trim()
  if (bioTrim !== snapBio) {
    profile.bio = bioTrim === '' ? null : bioTrim
  }

  const linkedinTrim = bio.linkedinUrl.trim()
  const snapLinkedin = snapshot.bio.linkedinUrl.trim()
  if (linkedinTrim !== snapLinkedin) {
    profile.linkedin_url = linkedinTrim === '' ? null : linkedinTrim
  }

  const websiteTrim = bio.websiteUrl.trim()
  const snapWebsite = snapshot.bio.websiteUrl.trim()
  if (websiteTrim !== snapWebsite) {
    profile.website_url = websiteTrim === '' ? null : websiteTrim
  }

  const calendlyTrim = bio.calendlyLink.trim()
  const snapCalendly = snapshot.bio.calendlyLink.trim()
  if (calendlyTrim !== snapCalendly) {
    profile.calendly_link = calendlyTrim === '' ? null : calendlyTrim
  }

  const yearsTrim = general.yearsOfExperience.trim()
  const snapYears = snapshot.general.yearsOfExperience.trim()
  if (yearsTrim !== snapYears) {
    const yearsNum = yearsTrim === '' ? 0 : Number(yearsTrim)
    profile.years_of_experience = Number.isFinite(yearsNum) ? yearsNum : 0
  }

  const rateTrim = general.hourlyRate.trim()
  const snapRate = snapshot.general.hourlyRate.trim()
  if (rateTrim !== snapRate) {
    profile.hourly_rate = rateTrim
  }

  if (counselling.isProfessionalCounselor !== snapshot.counselling.isProfessionalCounselor) {
    profile.is_professional_counselor = counselling.isProfessionalCounselor
  }
  if (counselling.isAcademicCounselor !== snapshot.counselling.isAcademicCounselor) {
    profile.is_academic_counselor = counselling.isAcademicCounselor
  }

  if (!arraysEqual(counselling.industryIds, snapshot.counselling.industryIds)) {
    profile.industry_ids = [...counselling.industryIds]
  }

  if (
    !arraysEqual(
      [...counselling.coachingServices].sort(),
      [...snapshot.counselling.coachingServices].sort()
    )
  ) {
    profile.coaching_services = [...counselling.coachingServices]
  }

  if (
    !arraysEqual(
      [...counselling.academicTags].sort(),
      [...snapshot.counselling.academicTags].sort()
    )
  ) {
    const slugToId = new Map(catalogTags.map((t) => [t.slug, t.id] as const))
    profile.tag_ids = counselling.academicTags
      .map((s) => slugToId.get(s))
      .filter((id): id is string => Boolean(id))
  }

  if (
    counselling.isAcademicCounselor !== snapshot.counselling.isAcademicCounselor ||
    !arraysEqual(
      [...counselling.subcategoryIds].sort(),
      [...snapshot.counselling.subcategoryIds].sort()
    )
  ) {
    profile.subcategory_ids = counselling.isAcademicCounselor ? [...counselling.subcategoryIds] : []
  }

  if (
    counselling.isProfessionalCounselor !== snapshot.counselling.isProfessionalCounselor ||
    !professionalCategoriesEqual(
      counselling.professionalCategories,
      snapshot.counselling.professionalCategories
    )
  ) {
    if (!counselling.isProfessionalCounselor) {
      profile.professional_categories = []
    } else {
      const nonEmpty = counselling.professionalCategories.filter(
        (c) => c.subcategory_ids.length > 0
      )
      profile.professional_categories = nonEmpty
    }
  }

  if (Object.keys(profile).length > 0) out.mentor_profile = profile
  return out
}

function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

function professionalCategoriesEqual(
  a: { category_id: string; subcategory_ids: string[] }[],
  b: { category_id: string; subcategory_ids: string[] }[]
): boolean {
  const norm = (x: { category_id: string; subcategory_ids: string[] }[]) =>
    [...x]
      .map((c) => ({
        category_id: c.category_id,
        subcategory_ids: [...c.subcategory_ids].sort(),
      }))
      .sort((p, q) => p.category_id.localeCompare(q.category_id))
  const na = norm(a)
  const nb = norm(b)
  if (na.length !== nb.length) return false
  for (let i = 0; i < na.length; i++) {
    const left = na[i]
    const right = nb[i]
    if (!left || !right) return false
    if (left.category_id !== right.category_id) return false
    if (!arraysEqual(left.subcategory_ids, right.subcategory_ids)) return false
  }
  return true
}

function extractApiError(err: unknown): string | null {
  if (!err || typeof err !== 'object') return null
  const e = err as Record<string, unknown>
  const response = e['response'] as Record<string, unknown> | undefined
  const data = response?.['data'] as Record<string, unknown> | undefined
  if (!data) return null

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

  if (typeof data['detail'] === 'string') return data['detail']

  return null
}

// ── Loading / error primitives ────────────────────────────────────────────

function StateShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-[#f8f9ff]">
      <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
        {children}
      </div>
    </div>
  )
}

function SkeletonHeader() {
  return (
    <div className="space-y-3">
      <div className="h-3 w-32 animate-pulse rounded-full bg-slate-200" />
      <div className="h-10 w-64 animate-pulse rounded-xl bg-slate-200" />
      <div className="h-4 w-96 max-w-full animate-pulse rounded-full bg-slate-200" />
    </div>
  )
}

function SkeletonTabs() {
  return <div className="h-12 w-[560px] max-w-full animate-pulse rounded-full bg-slate-200" />
}

function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
      <div className="h-5 w-32 animate-pulse rounded-full bg-slate-200" />
      <div className="mt-6 space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-12 animate-pulse rounded-2xl bg-slate-100"
            style={{ width: `${85 - i * 5}%` }}
          />
        ))}
      </div>
    </div>
  )
}

// Re-export so the type used in the parent page isn't orphaned.
export type { UpdateMentorForm }
