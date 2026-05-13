import { Check, FileClock } from "lucide-react";

export function RecentActivity() {
  return (
    <section className="space-y-6">
      <h2 className="font-headline text-xl font-extrabold text-slate-950 sm:text-2xl">
        Recent Activity
      </h2>

      <div className="space-y-6 rounded-2xl bg-[#eef4ff] p-5 shadow-sm sm:rounded-3xl sm:p-8">
        <article className="flex gap-4">
          <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-300 text-emerald-800">
            <Check className="size-4" />
          </div>
          <div className="min-w-0">
            <h3 className="font-headline text-base font-semibold text-slate-950">
              Completed session with David L.
            </h3>
            <p className="mt-1 text-sm leading-5 text-slate-600">
              Left a 5-star review: &quot;Incredibly helpful insights for my thesis.&quot;
            </p>
            <p className="mt-2 text-xs font-medium text-slate-400">
              Yesterday, 4:15 PM
            </p>
          </div>
        </article>

        <article className="flex gap-4">
          <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-slate-500">
            <FileClock className="size-4" />
          </div>
          <div className="min-w-0">
            <h3 className="font-headline text-base font-semibold text-slate-950">
              Updated availability for next week
            </h3>
            <p className="mt-1 text-sm leading-5 text-slate-600">
              Added 4 new slots on Thursday and Friday.
            </p>
            <p className="mt-2 text-xs font-medium text-slate-400">Oct 24, 9:00 AM</p>
          </div>
        </article>
      </div>
    </section>
  );
}
