export function AboutStory() {
  return (
    <section className="bg-[#eef4ff]">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-8 md:py-24 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
        <div>
          <h2 className="font-[family-name:var(--font-headline)] text-4xl font-extrabold tracking-tight text-[#121c2a]">
            Our Story
          </h2>
          <div className="mt-8 h-1.5 w-20 rounded-full bg-[#1155d9]" />
        </div>

        <div className="max-w-3xl space-y-9 text-lg leading-8 text-[#434655]">
          <p className="font-medium text-[#121c2a]">
            Book My Counselling was born from a simple observation: the transition from higher
            education to a high-impact career is often the most vulnerable period in a
            professional&apos;s life.
          </p>
          <p>
            Founded by a collective of educators and industry veterans, we realized that traditional
            career services were too generic, while elite mentorship was hidden behind closed doors.
            We set out to bridge this gap, creating a sanctuary where academic rigor meets practical
            industry foresight.
          </p>
          <p>
            Today, we serve as the conduit between the world&apos;s most promising minds and the
            leaders who have already navigated the path to excellence.
          </p>
        </div>
      </div>
    </section>
  )
}
