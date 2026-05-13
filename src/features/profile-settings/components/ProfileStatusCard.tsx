import { Eye, Star, Verified } from "lucide-react";

export function ProfileStatusCard() {
  return (
    <section className="rounded-2xl bg-[#eef4ff] p-5 shadow-sm sm:rounded-3xl sm:p-7">
      <h2 className="font-headline text-xl font-extrabold text-slate-950">
        Quick Status
      </h2>

      <div className="mt-6 space-y-4">
        <StatusRow icon={<Verified className="size-5 text-emerald-700" />} label="Verified Profile">
          <span className="text-xs font-extrabold uppercase text-emerald-700">Active</span>
        </StatusRow>
        <StatusRow icon={<Eye className="size-5 text-blue-700" />} label="Public Visibility">
          <span className="relative h-6 w-11 rounded-full bg-blue-700">
            <span className="absolute right-1 top-1 size-4 rounded-full bg-white" />
          </span>
        </StatusRow>
        <StatusRow icon={<Star className="size-5 text-amber-700" />} label="Review Average">
          <span className="text-sm font-extrabold text-slate-950">4.9 / 5.0</span>
        </StatusRow>
      </div>
    </section>
  );
}

function StatusRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-14 items-center justify-between gap-3 rounded-2xl bg-white px-4">
      <div className="flex items-center gap-3 text-sm font-bold text-slate-800">
        {icon}
        {label}
      </div>
      {children}
    </div>
  );
}
