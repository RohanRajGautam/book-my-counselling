import Image from 'next/image'

const team = [
  {
    name: 'Dr. Elena Rostova',
    role: 'Co-Founder & Chief Curator',
    bio: 'Former Admissions Director at Oxford and Career Strategist.',
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=720&q=85',
  },
  {
    name: 'Marcus Thorne',
    role: 'Co-Founder & Product Lead',
    bio: 'Tech entrepreneur focused on educational equity and UX design.',
    image:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=720&q=85',
  },
  {
    name: 'Sarah Jenkins',
    role: 'Head of Mentor Relations',
    bio: 'Expert in professional development with 15 years in HR at McKinsey.',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=720&q=85',
  },
  {
    name: 'Prof. David Chen',
    role: 'Academic Advisor',
    bio: 'Senior fellow and emeritus professor specializing in higher education policy.',
    image:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=720&q=85',
  },
]

export function AboutTeam() {
  return (
    <section className="bg-[#f7f8ff]">
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-24 sm:px-8 md:pt-28 md:pb-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-[family-name:var(--font-headline)] text-4xl font-extrabold tracking-tight text-[#121c2a]">
            Meet the Visionaries
          </h2>
          <p className="mt-5 text-base leading-7 text-[#434655]">
            The architects of Book Your Counselling come from diverse backgrounds in academia,
            technology, and career strategy.
          </p>
        </div>

        <div className="mt-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <article key={member.name}>
              <Image
                src={member.image}
                alt={member.name}
                width={720}
                height={900}
                className="aspect-[0.82] w-full rounded-[18px] object-cover shadow-[0_12px_28px_rgba(18,28,42,0.08)]"
              />
              <h3 className="mt-7 font-[family-name:var(--font-headline)] text-lg font-extrabold tracking-tight text-[#121c2a]">
                {member.name}
              </h3>
              <p className="mt-1 text-sm font-bold text-[#1155d9]">{member.role}</p>
              <p className="mt-4 text-sm leading-6 text-[#434655]">{member.bio}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
