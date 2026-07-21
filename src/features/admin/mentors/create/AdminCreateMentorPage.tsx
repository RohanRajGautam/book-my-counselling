'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { useCreateAdminMentor } from '../hooks/useAdminMentors'
import { useTags } from '@/features/tags/hooks/useTags'
import {
  COACH_FOR_FRESHERS_SERVICE_SLUGS,
  COACH_FOR_FRESHERS_GROUP_TAG,
} from '@/features/coach-for-freshers/types/coach-for-freshers.types'

import { AdminCreateMentorHeader } from './components/AdminCreateMentorHeader'
import {
  AdminCreateMentorTabs,
  type AdminCreateMentorTab,
} from './components/AdminCreateMentorTabs'
import { AdminCreateMentorIdentityCard } from './components/AdminCreateMentorIdentityCard'
import {
  AdminCreateMentorGeneralInfoCard,
  type AdminCreateMentorGeneralInfoForm,
} from './components/AdminCreateMentorGeneralInfoCard'
import {
  AdminCreateMentorCounsellingCard,
  type AdminCounsellingForm,
} from './components/AdminCreateMentorCounsellingCard'
import { AdminCreateMentorPhotoCard } from './components/AdminCreateMentorPhotoCard'
import {
  AdminCreateMentorBioCard,
  type AdminCreateMentorBioForm,
} from './components/AdminCreateMentorBioCard'
import { AdminTempPasswordDialog } from './components/AdminTempPasswordDialog'
import { validateCreateMentorForm, fieldHasError, formatFieldErrors } from './lib/validation'

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

type CreatedAccount = {
  mentorName: string
  mentorEmail: string
  tempPassword: string
}

export function AdminCreateMentorPage() {
  const router = useRouter()
  const { mutate: createMentor, isPending } = useCreateAdminMentor()
  const { data: catalogTags = [] } = useTags()

  const [activeTab, setActiveTab] = useState<AdminCreateMentorTab>('general-info')

  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [general, setGeneral] = useState<AdminCreateMentorGeneralInfoForm>(EMPTY_GENERAL)
  const [counselling, setCounselling] = useState<AdminCounsellingForm>(EMPTY_COUNSELLING)
  const [bio, setBio] = useState<AdminCreateMentorBioForm>(EMPTY_BIO)

  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [createdAccount, setCreatedAccount] = useState<CreatedAccount | null>(null)

  const errors = useMemo(
    () =>
      validateCreateMentorForm({
        email,
        fullName,
        avatarFile,
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
      }),
    [email, fullName, avatarFile, general, bio, counselling]
  )

  const showError = (field: string) => submitAttempted && fieldHasError(errors, field)
  const firstErrorMessage = errors[0]?.message

  const handleSubmit = () => {
    setSubmitAttempted(true)
    if (errors.length > 0) {
      toast.error(formatFieldErrors(errors))
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      return
    }

    const slugToId = new Map(catalogTags.map((t) => [t.slug, t.id] as const))
    const tagSlugs = [
      ...(counselling.isProfessionalCounselor
        ? counselling.coachingServices.filter((s) => COACH_FOR_FRESHERS_SERVICE_SLUGS.includes(s))
        : []),
      ...(counselling.isAcademicCounselor ? counselling.academicTags : []),
      ...(counselling.isProfessionalCounselor &&
      counselling.coachingServices.length > 0 &&
      slugToId.has(COACH_FOR_FRESHERS_GROUP_TAG)
        ? [COACH_FOR_FRESHERS_GROUP_TAG]
        : []),
    ]
    const tagIds = tagSlugs.map((s) => slugToId.get(s)).filter((id): id is string => Boolean(id))

    const yearsNum = general.yearsOfExperience.trim()
      ? Number(general.yearsOfExperience.trim())
      : undefined
    const rateNum = Number(general.hourlyRate.trim())

    const formData = new FormData()
    const metadata: Record<string, unknown> = {
      user: {
        email: email.trim(),
        full_name: fullName.trim(),
      },
      title: general.title.trim(),
      company: general.company.trim() || null,
      bio: bio.bio.trim() || null,
      years_of_experience: yearsNum,
      hourly_rate: rateNum,
      linkedin_url: bio.linkedinUrl.trim() || null,
      website_url: bio.websiteUrl.trim() || null,
      calendly_link: bio.calendlyLink.trim() || null,
      is_professional_counselor: counselling.isProfessionalCounselor,
      is_academic_counselor: counselling.isAcademicCounselor,
      industry_ids: counselling.industryIds,
    }
    if (tagIds.length > 0) metadata['tag_ids'] = tagIds
    if (counselling.isAcademicCounselor) {
      metadata['subcategory_ids'] = counselling.subcategoryIds
    }
    if (counselling.isProfessionalCounselor) {
      const nonEmpty = counselling.professionalCategories.filter(
        (c) => c.subcategory_ids.length > 0
      )
      if (nonEmpty.length > 0) metadata['professional_categories'] = nonEmpty
    }

    formData.append('metadata', JSON.stringify(metadata))
    if (avatarFile) formData.append('avatar', avatarFile)

    createMentor(formData, {
      onSuccess: (data) => {
        setCreatedAccount({
          mentorName: data.user?.full_name || fullName.trim(),
          mentorEmail: email.trim(),
          tempPassword: data.temp_password,
        })
        setDialogOpen(true)
      },
      onError: (err) => {
        toast.error(extractApiError(err) ?? 'Failed to create mentor. Please try again.')
      },
    })
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    router.push('/admin/mentors')
  }

  return (
    <div className="min-h-svh bg-[#f8f9ff] pb-28 text-slate-950 md:pb-0">
      <div className="mx-auto w-full max-w-[1180px] space-y-3 px-3 py-5 sm:space-y-6 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <AdminCreateMentorHeader onSubmit={handleSubmit} isSubmitting={isPending} />

        <div className="sticky top-16 z-10 -mx-3 bg-[#f8f9ff]/95 px-3 py-2 backdrop-blur md:static md:mx-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
          <AdminCreateMentorTabs activeTab={activeTab} onTabChange={setActiveTab} />
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
                onEmailChange={setEmail}
                onFullNameChange={setFullName}
                emailError={showError('email') ? 'Please enter a valid email.' : undefined}
                fullNameError={showError('fullName') ? 'Full name is required.' : undefined}
              />
              <AdminCreateMentorGeneralInfoCard
                value={general}
                onChange={setGeneral}
                errors={{
                  title: showError('title') ? 'Professional title is required.' : undefined,
                  yearsOfExperience: showError('yearsOfExperience')
                    ? 'Years must be a non-negative whole number.'
                    : undefined,
                  hourlyRate: showError('hourlyRate')
                    ? 'Hourly rate must be a positive number.'
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
                avatarFile={avatarFile}
                fullName={fullName}
                onAvatarChange={setAvatarFile}
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

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/80 bg-white/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-16px_40px_rgba(15,23,42,0.12)] backdrop-blur md:hidden">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="h-12 w-full rounded-2xl bg-[#0755d8] font-bold text-white shadow-[0_12px_24px_rgba(7,85,216,0.22)] hover:bg-blue-700 disabled:opacity-60"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Creating…
            </>
          ) : (
            'Create mentor'
          )}
        </Button>
      </div>

      {createdAccount ? (
        <AdminTempPasswordDialog
          open={dialogOpen}
          mentorName={createdAccount.mentorName}
          mentorEmail={createdAccount.mentorEmail}
          tempPassword={createdAccount.tempPassword}
          onClose={handleDialogClose}
          onViewed={() => {
            // Nothing else to do; close handler will navigate.
          }}
        />
      ) : null}
    </div>
  )
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
