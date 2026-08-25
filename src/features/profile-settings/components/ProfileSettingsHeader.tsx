import { Button } from '@/components/ui/button'

type ProfileSettingsHeaderProps = {
  onSave: () => void
  isSaving?: boolean
  hasChanges?: boolean
}

export function ProfileSettingsHeader({
  onSave,
  isSaving = false,
  hasChanges = false,
}: ProfileSettingsHeaderProps) {
  return (
    <header className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1 className="font-headline text-3xl leading-tight font-extrabold tracking-normal text-slate-950 sm:text-4xl lg:text-5xl">
          Profile Settings
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 font-medium text-slate-500 sm:text-base sm:leading-7">
          Manage your mentor profile, professional biography, and scheduling preferences to provide
          the best experience for your students.
        </p>
      </div>

      <div className="hidden w-full md:flex md:w-auto md:items-center md:gap-4">
        <Button
          type="button"
          onClick={onSave}
          disabled={isSaving || !hasChanges}
          className="h-14 rounded-xl bg-[#0755d8] px-8 font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
        >
          {isSaving ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>
    </header>
  )
}
