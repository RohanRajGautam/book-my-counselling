import { Lock, Pencil, UserPlus } from 'lucide-react'

type Props = {
  email: string
  fullName: string
  onEmailChange: (next: string) => void
  onFullNameChange: (next: string) => void
  emailError?: string
  fullNameError?: string
  /**
   * When true, the email input becomes read-only and visually muted so the
   * edit page can communicate that email is locked. Default `false`.
   */
  emailReadOnly?: boolean
  /**
   * When `emailReadOnly` is true and an `emailEditAction` is passed, the
   * lock icon is replaced by an inline "Change" button that opens the email
   * edit flow. The read-only input still shows the (now-stale) value until
   * the parent reseeds it from the saved response.
   */
  emailEditAction?: { label: string; onClick: () => void }
  /**
   * Override the helper copy below the heading. Defaults to the create-flow
   * explanation; the edit page passes its own copy.
   */
  description?: string
  /** Override the section heading (e.g. "Account Identity" → "Profile Identity"). */
  title?: string
  /** Override the icon shown next to the heading. */
  icon?: React.ComponentType<{ className?: string }>
}

export function AdminCreateMentorIdentityCard({
  email,
  fullName,
  onEmailChange,
  onFullNameChange,
  emailError,
  fullNameError,
  emailReadOnly = false,
  emailEditAction,
  description = "Create the login account. We'll generate a temporary password and show it once after submission.",
  title = 'Account Identity',
  icon: Icon = UserPlus,
}: Props) {
  return (
    <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)] sm:p-8">
      <div className="flex items-center gap-4">
        <div className="flex size-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
          <Icon className="size-5" />
        </div>
        <h2 className="font-headline text-xl font-extrabold text-slate-950 sm:text-2xl">{title}</h2>
      </div>

      <p className="mt-2 text-sm font-medium text-slate-500">{description}</p>

      <div className="mt-7 grid gap-x-6 gap-y-7 md:grid-cols-2">
        <Field
          label="Full Name *"
          value={fullName}
          placeholder="e.g. Sita Sharma"
          onChange={onFullNameChange}
          error={fullNameError}
        />
        <Field
          label="Email Address *"
          type="email"
          value={email}
          placeholder="mentor@example.com"
          onChange={onEmailChange}
          error={emailError}
          readOnly={emailReadOnly}
          readOnlyHint={
            emailReadOnly
              ? emailEditAction
                ? `Locked here. Use “${emailEditAction.label}” to update it — it opens a confirmation step.`
                : "Email can't be changed from this screen."
              : undefined
          }
          action={
            emailReadOnly && emailEditAction
              ? {
                  label: emailEditAction.label,
                  onClick: emailEditAction.onClick,
                }
              : undefined
          }
        />
      </div>
    </section>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  readOnly = false,
  readOnlyHint,
  action,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  type?: React.HTMLInputTypeAttribute
  error?: string
  readOnly?: boolean
  readOnlyHint?: string
  action?: { label: string; onClick: () => void }
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <div className="relative mt-2">
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          className={
            'flex min-h-14 w-full items-center rounded-2xl px-4 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 sm:px-5' +
            (readOnly
              ? ' cursor-default border border-slate-200 bg-slate-100/80 text-slate-600 select-all'
              : ' bg-[#eef4ff] focus:ring-2 focus:ring-blue-200') +
            (!readOnly && error ? ' ring-2 ring-red-200' : '')
          }
        />
        {action ? (
          <button
            type="button"
            onClick={action.onClick}
            className="absolute top-1/2 right-3 inline-flex -translate-y-1/2 items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-extrabold text-blue-700 shadow-sm ring-1 ring-blue-200 transition hover:bg-blue-50 hover:ring-blue-300"
            aria-label={action.label}
          >
            <Pencil className="size-3" strokeWidth={2.6} />
            {action.label}
          </button>
        ) : readOnly ? (
          <Lock
            className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-slate-400"
            strokeWidth={2.4}
            aria-hidden
          />
        ) : null}
      </div>
      {error ? (
        <p className="mt-1.5 text-xs font-bold text-red-600">{error}</p>
      ) : readOnlyHint ? (
        <p className="mt-1.5 text-xs font-bold text-slate-500">{readOnlyHint}</p>
      ) : null}
    </label>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-bold tracking-[0.16em] text-slate-600 uppercase">{children}</span>
  )
}
