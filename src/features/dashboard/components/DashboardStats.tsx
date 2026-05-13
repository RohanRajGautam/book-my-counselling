import { CalendarClock, Star, UsersRound } from "lucide-react";

export function DashboardStats() {
  return (
    <section
      aria-label="Dashboard statistics"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      <article className="min-h-[148px] rounded-2xl bg-[#eef4ff] p-5 shadow-sm sm:rounded-3xl sm:p-6 lg:p-7">
        <div className="flex items-center gap-3">
          <UsersRound className="size-5 text-blue-700" />
          <h2 className="text-xs font-bold uppercase leading-4 tracking-[0.16em] text-slate-600">
            Total Sessions
          </h2>
        </div>
        <p className="mt-6 text-4xl font-extrabold leading-none tracking-normal text-slate-950 lg:text-5xl">
          142
        </p>
        <p className="mt-4 text-sm font-semibold text-emerald-700">+12 this month</p>
      </article>

      <article className="min-h-[148px] rounded-2xl bg-[#0755d8] p-5 text-white shadow-sm shadow-blue-200 sm:rounded-3xl sm:p-6 lg:p-7">
        <div className="flex items-center gap-3">
          <CalendarClock className="size-5 text-white" />
          <h2 className="text-xs font-bold uppercase leading-4 tracking-[0.16em] text-blue-50">
            Upcoming This Week
          </h2>
        </div>
        <p className="mt-6 text-4xl font-extrabold leading-none tracking-normal lg:text-5xl">8</p>
        <p className="mt-4 text-sm font-semibold text-blue-100">
          Next session in 2 hours
        </p>
      </article>

      <article className="relative min-h-[148px] overflow-hidden rounded-2xl bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6 lg:p-7">
        <Star
          className="absolute -right-1 -top-2 size-20 fill-[#eef4ff] text-[#eef4ff]"
          aria-hidden="true"
        />
        <div className="relative flex items-center gap-3">
          <Star className="size-5 text-amber-600" />
          <h2 className="text-xs font-bold uppercase leading-4 tracking-[0.16em] text-slate-600">
            Average Rating
          </h2>
        </div>
        <p className="relative mt-6 text-4xl font-extrabold leading-none tracking-normal text-slate-950 lg:text-5xl">
          4.9
        </p>
        <p className="relative mt-4 text-sm font-semibold text-slate-500">
          From 86 student reviews
        </p>
      </article>
    </section>
  );
}
