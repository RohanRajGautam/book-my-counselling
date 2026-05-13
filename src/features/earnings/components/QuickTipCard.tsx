import { Sparkles } from "lucide-react";

export function QuickTipCard() {
  return (
    <section className="rounded-2xl border border-emerald-200 bg-emerald-100/80 p-5 text-emerald-950 sm:rounded-3xl sm:p-7">
      <div className="flex items-center gap-3">
        <Sparkles className="size-5 text-emerald-700" />
        <h2 className="font-headline text-lg font-extrabold">Quick Tip</h2>
      </div>
      <p className="mt-4 text-sm font-medium leading-6 text-emerald-900">
        Top mentors who offer <strong>research-focused sessions</strong> typically
        see a 25% higher earning rate. Consider updating your specialties to increase
        your monthly volume.
      </p>
    </section>
  );
}
