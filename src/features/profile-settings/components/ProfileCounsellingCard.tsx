import { BadgePlus, BriefcaseBusiness } from 'lucide-react'

export function ProfileCounsellingCard() {
  return (
    <section
      id="professional-bio"
      className="rounded-2xl bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8"
    >
      <div className="flex items-center gap-4">
        <div className="flex size-11 items-center justify-center rounded-xl bg-amber-200 text-amber-900">
          <BriefcaseBusiness className="size-5" />
        </div>
        <h2 className="font-headline text-xl font-extrabold text-slate-950 sm:text-2xl">
          Counselling Provided
        </h2>
      </div>

      <div className="mt-7 space-y-6">
        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_120px]">
          <div>
            <Label>Specialized Fields</Label>
            <div className="mt-2 rounded-2xl bg-[#eef4ff] p-3">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-emerald-300 px-4 py-2 text-sm font-bold text-emerald-900">
                  Computer Science ×
                </span>
                <span className="rounded-full bg-emerald-300 px-4 py-2 text-sm font-bold text-emerald-900">
                  Career Growth ×
                </span>
                <button className="inline-flex items-center gap-2 rounded-full border border-dashed border-slate-400 px-4 py-2 text-sm font-bold text-slate-700">
                  <BadgePlus className="size-4" />
                  Add Field
                </button>
              </div>
            </div>
          </div>

          {/* <div>
            <Label>Experience</Label>
            <div className="mt-2 flex min-h-14 items-center justify-between rounded-2xl bg-[#eef4ff] px-5 text-sm font-bold text-slate-800">
              12
              <span className="text-xs text-slate-500 uppercase">Yrs</span>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold tracking-[0.16em] text-slate-600 uppercase">{children}</p>
}
