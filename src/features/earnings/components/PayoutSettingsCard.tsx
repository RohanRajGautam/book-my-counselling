import { Landmark, WalletCards } from "lucide-react";

import { Button } from "@/components/ui/button";

export function PayoutSettingsCard() {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm sm:rounded-3xl sm:p-7">
      <h2 className="font-headline text-xl font-extrabold text-slate-950">
        Payout Settings
      </h2>

      <div className="mt-6 rounded-2xl bg-[#eef4ff] p-5">
        <div className="flex items-start justify-between">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Primary Bank Account
          </p>
          <a href="#" className="text-xs font-extrabold text-blue-700">
            Edit
          </a>
        </div>
        <div className="mt-5 flex items-center gap-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-white text-blue-700">
            <Landmark className="size-5" />
          </div>
          <div>
            <p className="font-headline text-base font-extrabold text-slate-950">
              Chase Manhattan
            </p>
            <p className="text-sm font-medium tracking-[0.18em] text-slate-500">
              • • • • 8821
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4 text-sm">
        <SummaryRow label="Available for withdrawal" value="$11,590.00" />
        <SummaryRow
          label="Processing fee (1.5%)"
          value="-$173.85"
          valueClassName="text-red-600"
        />
      </div>

      <div className="my-5 h-px bg-slate-200" />

      <div className="flex flex-col gap-2 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
        <span className="text-base font-extrabold text-slate-950">Total Payout</span>
        <span className="text-2xl font-extrabold text-blue-700">$11,416.15</span>
      </div>

      <Button className="mt-7 h-14 w-full rounded-xl bg-[#0755d8] text-base font-extrabold text-white shadow-lg shadow-blue-200 hover:bg-blue-700">
        <WalletCards className="size-5" />
        Request Payout
      </Button>
    </section>
  );
}

function SummaryRow({
  label,
  value,
  valueClassName = "text-slate-950",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="max-w-28 leading-5 text-slate-500">{label}</span>
      <span className={`font-extrabold ${valueClassName}`}>{value}</span>
    </div>
  );
}
