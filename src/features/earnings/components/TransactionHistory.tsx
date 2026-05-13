import Link from "next/link";

const transactions = [
  {
    date: "Oct 18, 2023",
    initials: "AS",
    name: "Alex Stanford",
    type: "PhD Thesis",
    amount: "$250.00",
    color: "bg-blue-100 text-blue-700",
  },
  {
    date: "Oct 16, 2023",
    initials: "ML",
    name: "Maria Lopez",
    type: "Career Mentoring",
    amount: "$180.00",
    color: "bg-emerald-300 text-emerald-900",
  },
  {
    date: "Oct 15, 2023",
    initials: "JD",
    name: "James Dorian",
    type: "Research Strategy",
    amount: "$320.00",
    color: "bg-amber-200 text-amber-900",
  },
  {
    date: "Oct 12, 2023",
    initials: "EK",
    name: "Elena Kovic",
    type: "Admissions prep",
    amount: "$150.00",
    color: "bg-rose-100 text-rose-700",
  },
];

export function TransactionHistory() {
  return (
    <section className="overflow-hidden rounded-2xl bg-white shadow-sm sm:rounded-3xl">
      <div className="flex items-center justify-between bg-[#f4f7ff] px-5 py-5 sm:px-7 sm:py-7">
        <h2 className="font-headline text-lg font-extrabold text-slate-950 sm:text-xl">
          Transaction History
        </h2>
        <Link href="#" className="text-sm font-extrabold text-blue-700 hover:text-blue-900">
          View All ›
        </Link>
      </div>

      <div className="hidden grid-cols-[92px_minmax(0,1fr)_126px_92px] border-b border-slate-200 px-7 py-5 text-xs font-extrabold uppercase tracking-[0.14em] text-slate-600 md:grid">
        <span>Date</span>
        <span>Student Name</span>
        <span>Session Type</span>
        <span className="text-right">Amount</span>
      </div>

      <div>
        {transactions.map((transaction) => (
          <article
            key={`${transaction.date}-${transaction.name}`}
            className="grid gap-4 border-b border-slate-100 px-5 py-5 last:border-b-0 md:min-h-20 md:grid-cols-[92px_minmax(0,1fr)_126px_92px] md:items-center md:px-7"
          >
            <p className="text-sm font-semibold leading-5 text-slate-800 md:max-w-16">
              {transaction.date}
            </p>
            <div className="flex min-w-0 items-center gap-4">
              <span
                className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold ${transaction.color}`}
              >
                {transaction.initials}
              </span>
              <p className="font-headline text-base font-extrabold leading-5 text-slate-950">
                {transaction.name}
              </p>
            </div>
            <span className="w-fit rounded-full bg-blue-100 px-4 py-2 text-center text-xs font-bold leading-4 text-slate-700">
              {transaction.type}
            </span>
            <p className="text-left text-base font-extrabold text-slate-950 md:text-right">
              {transaction.amount}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
