import { Button } from '@/components/ui/button'

type ProfileSettingsHeaderProps = {
  onSave: () => void
}

export function ProfileSettingsHeader({ onSave }: ProfileSettingsHeaderProps) {
  return (
    <header className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1 className="font-headline text-3xl leading-tight font-extrabold tracking-normal text-slate-950 sm:text-4xl lg:text-5xl">
          Profile Settings
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-7 font-medium text-slate-500">
          Manage your mentor profile, professional biography, and scheduling preferences to provide
          the best experience for your students.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:gap-4">
        <Button
          variant="ghost"
          className="h-11 rounded-xl px-4 text-sm font-bold text-slate-700 hover:bg-blue-50 sm:h-12"
        >
          Cancel Changes
        </Button>
        <Button
          type="button"
          onClick={onSave}
          className="h-11 rounded-xl bg-[#0755d8] px-5 font-bold text-white shadow-sm hover:bg-blue-700 sm:h-14 sm:px-8"
        >
          Save Changes
        </Button>
      </div>
    </header>
  )
}
