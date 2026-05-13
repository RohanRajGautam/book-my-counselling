import { Banknote, Landmark, WalletCards } from "lucide-react";

export function EarningsStats() {
  return (
    <section aria-label="Earnings statistics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <EarningsStatCard
        icon={<WalletCards className="size-5 text-blue-700" />}
        label="Total Balance"
        value="$12,840.00"
        helper="↗ +12.5% from last month"
        helperClassName="text-emerald-700"
        iconClassName="bg-blue-100"
      />
      <EarningsStatCard
        icon={<Landmark className="size-5 text-amber-800" />}
        label="Pending Payouts"
        value="$1,250.00"
        helper="Estimated arrival: Oct 24, 2023"
        helperClassName="text-slate-500"
        iconClassName="bg-amber-100"
      />
      <EarningsStatCard
        icon={<Banknote className="size-5 text-emerald-800" />}
        label="Total Withdrawn"
        value="$45,200.00"
        helper="Lifetime earnings"
        helperClassName="text-slate-500"
        iconClassName="bg-emerald-100"
      />
    </section>
  );
}

function EarningsStatCard({
  icon,
  label,
  value,
  helper,
  helperClassName,
  iconClassName,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  helper: string;
  helperClassName: string;
  iconClassName: string;
}) {
  return (
    <article className="min-h-[176px] rounded-2xl bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6 lg:min-h-[200px] lg:p-8">
      <div className={`flex size-11 items-center justify-center rounded-xl ${iconClassName}`}>
        {icon}
      </div>
      <h2 className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </h2>
      <p className="mt-2 text-3xl font-extrabold leading-tight tracking-normal text-slate-950 lg:text-4xl">
        {value}
      </p>
      <p className={`mt-5 text-sm font-extrabold ${helperClassName}`}>{helper}</p>
    </article>
  );
}
