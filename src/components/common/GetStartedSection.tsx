import Link from 'next/link'

export function GetStartedSection() {
  return (
    <div className="flex min-h-[224px] items-center justify-between px-6 py-22">
      <div className="m-auto w-3xl rounded-lg bg-[#004ac6] px-8 py-16 text-center">
        <h1 className="font-[family-name:var(--font-headline)] text-3xl font-extrabold text-white">
          Ready to find your curator?
        </h1>

        <p className="my-2 text-slate-300 dark:text-slate-100">
          Book a session with one of our mentors and get personalized guidance to
          navigate your career path with confidence.
        </p>

        <button className="mt-3 rounded-md bg-white px-8 py-3 font-bold text-[#004ac6] shadow-md transition-all hover:shadow-lg active:scale-95">
          <Link href={'/explore-mentors'}>Book a session</Link>
        </button>
      </div>
    </div>
  )
}
