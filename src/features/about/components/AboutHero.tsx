import Image from 'next/image'

export function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-[#f7f8ff]">
      <div className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-14 px-6 py-16 sm:px-8 lg:grid-cols-[0.92fr_1fr] lg:gap-20 lg:py-20">
        <div className="max-w-2xl">
          <p className="mb-4 inline-flex rounded-full bg-[#62f2ad] px-4 py-2 font-[family-name:var(--font-headline)] text-[11px] font-bold tracking-[0.16em] text-[#0b5b4c] uppercase">
            Our Philosophy
          </p>
          <h1 className="font-[family-name:var(--font-headline)] text-[clamp(3rem,8vw,4.7rem)] leading-[1.07] font-extrabold tracking-tight text-[#121c2a]">
            Redefining the <span className="block text-[#1155d9]">Mentorship</span>
            Landscape.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-[#434655]">
            At Book Your Counselling, we believe that the distance between academic potential and
            career excellence should not be determined by geography or network, but by ambition.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[610px] pb-10 lg:pb-0">
          <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-[24px] bg-[#8ed1da] shadow-[0_30px_70px_rgba(18,28,42,0.16)] sm:translate-x-5 sm:translate-y-5" />
          <div className="relative rounded-[20px] bg-[#bcecef]/65 p-5 shadow-[inset_0_0_35px_rgba(255,255,255,0.54)] sm:p-8">
            <Image
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1080&q=85"
              alt="Mentor guiding students during a laptop discussion"
              width={1080}
              height={760}
              priority
              className="h-[300px] w-full rounded-[12px] object-cover shadow-[0_22px_45px_rgba(18,28,42,0.22)] sm:h-[380px]"
            />
          </div>

          <div className="relative -mt-16 ml-4 max-w-[305px] rounded-lg bg-white px-8 py-7 shadow-[0_22px_42px_rgba(18,28,42,0.14)] sm:ml-[-32px]">
            <p className="font-[family-name:var(--font-headline)] text-3xl font-extrabold tracking-tight text-[#1155d9]">
              500+
            </p>
            <p className="mt-2 text-sm leading-5 text-[#434655]">
              Curated mentors from Ivy League and Fortune 500 institutions.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
