'use client'

import { useState } from 'react'
import { MentorCard } from '@/components/cards/MentorCard'
import { MentorProfileModal } from '@/components/modals/MentorProfileModal'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const mentorsData = [
  {
    id: 1,
    name: 'Sarah J.',
    role: 'Senior UX Designer',
    company: 'Google',
    tags: ['#Tech', '#Google', '#PortfolioReview', '#UX'],
    rating: 4.9,
    reviews: 120,
    description:
      '5 years experience, specializes in helping non-traditional applicants break into tech.',
    price: 25,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBqWhBE6MKqHZrAlqATYsGENI0bbJdkVFNEZvPpCbBYbFRudBqZv9Pr_TAaQ5HZGNs4CCPbb1KcnqeCAldMOhGYSPgZzN2LYvlJxxK-tOmTvPkKzuyj_jrpCot8ybgIyDZ8SHXv_7cU-HynZWT4mU2-YGEolJO6nK2CcA1dJBT3pF9XTh9g5_-rcNE_lkb-tQhys2npJlzOZtXlZydUdzYcqvCddjbpW7K5UyeKbgE7EPsIszPcCIu-7QTR_tU3PAqibWY0cOyPny0',
    // Modal data
    title: 'Senior UX Researcher & Ivy League Admissions Strategist',
    about: [
      'With over a decade of experience bridging human-computer interaction and academic strategy, I specialize in helping driven students navigate complex career transitions and elite university admissions. My mentorship style is direct, actionable, and deeply personalized.',
      'Whether you are refining your design portfolio or crafting a compelling narrative for grad school, we will focus on structuring your ideas to maximize impact without relying on generic templates.',
    ],
    services: [
      { icon: 'coffee' as const, title: 'Intro Call', duration: '30 minutes', price: 25 },
      {
        icon: 'pencil' as const,
        title: 'Portfolio Review',
        duration: '60 minutes',
        price: 50,
        popular: true,
      },
      { icon: 'compass' as const, title: 'Career Strategy', duration: '90 minutes', price: 80 },
    ],
    availability: [
      { date: 'tomorrow', label: 'Tomorrow', slots: 3, isHighlighted: true },
      { date: '2024-10-25', label: 'Wed, Oct 25', slots: 2, isHighlighted: false },
    ],
    reviewsDetail: {
      rating: 5.0,
      count: 42,
      text: "Sarah didn't just review my portfolio; she completely reshaped how I talk about my design process. I got into my top master's program largely thanks to her guidance.",
      author: 'Michael T.',
      authorInitial: 'M',
    },
    responseTime: 'Usually responds within 24 hours',
    linkedIn: 'https://linkedin.com',
    portfolio: 'https://portfolio.com',
  },
  {
    id: 2,
    name: 'Marcus Chen',
    role: 'Product Lead',
    company: 'Stripe',
    tags: ['#Fintech', '#Leadership', '#ProductManagement'],
    rating: 5.0,
    reviews: 84,
    description:
      'Ex-Meta engineer turned product leader. I help senior ICs transition into management roles.',
    price: 45,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBbuwfHqHnoZupyLYf6PvPb3MfKQf8sVLQ4h5HVCQChUTTDebXFAbWXc1_XoPfUWdmIQjDURDfhPQj5vUkBcM8vJnZK6BCHjYm6G4xNYAIEHFqdE1hy-CEgHBgH9Rk3TQ9ulM5kUE1B4svJaiuyN2eCQrK-otbpCzHzbYREiefX3_tgKiAx_zHoEIcrBpYMyu-3RelLcoGt3EQUJ7uR6k-Gv6LUypn4kPT9NX9fiXJAPM5Idnpd2U6XyOk3foqAvFFBfycd-yd56wc',
    title: 'Product Lead & Engineering Manager',
    about: [
      'Former Meta engineer with 8 years of experience in product development and team leadership. I specialize in helping individual contributors make the leap to management.',
      'My approach focuses on practical frameworks for decision-making, stakeholder management, and building high-performing teams.',
    ],
    services: [
      { icon: 'coffee' as const, title: 'Intro Call', duration: '30 minutes', price: 45 },
      {
        icon: 'pencil' as const,
        title: 'Leadership Coaching',
        duration: '60 minutes',
        price: 90,
        popular: true,
      },
      { icon: 'compass' as const, title: 'Career Roadmap', duration: '90 minutes', price: 120 },
    ],
    availability: [
      { date: 'tomorrow', label: 'Tomorrow', slots: 2, isHighlighted: true },
      { date: '2024-10-26', label: 'Thu, Oct 26', slots: 4, isHighlighted: false },
    ],
    reviewsDetail: {
      rating: 5.0,
      count: 84,
      text: 'Marcus helped me navigate the transition from senior engineer to engineering manager. His insights were invaluable.',
      author: 'Jennifer L.',
      authorInitial: 'J',
    },
    responseTime: 'Usually responds within 12 hours',
    linkedIn: 'https://linkedin.com',
    portfolio: 'https://portfolio.com',
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    role: 'Creative Director',
    company: 'Adobe',
    tags: ['#Design', '#Branding', '#CareerPivot'],
    rating: 4.8,
    reviews: 215,
    description:
      'Helping designers master the business of design and land high-paying creative agency roles.',
    price: 30,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBQSPiHH8uOEZUy9FQ2E_8vO_ll_F7hqYzrct7O9BwFmRPqerAM2jbWBWlAH5o9bn-HOsgkBuJs6Lq2H00iVJ-75J_9H_32-zcj7tkY_ThvN4OxHr21_kVu_PqenhqGRJgsaUd3CgXAFZOxH6lIuxO0d4ghMkd57Ktpd40UB71qmOhbiUSC3upJv0WQR8AyTYv62W9kpkW61t-vjytDywmCNlIn5U-irIK1rLfYWKaZMqsWb98JThLYB9ui31iFXXJng1ga5Ok4zhk',
    title: 'Creative Director & Brand Strategist',
    about: [
      '15+ years in creative leadership at top agencies and tech companies. I help designers understand the business side of creativity.',
      'Whether you are building your personal brand or pivoting to a creative director role, I will help you position yourself strategically.',
    ],
    services: [
      { icon: 'coffee' as const, title: 'Intro Call', duration: '30 minutes', price: 30 },
      {
        icon: 'pencil' as const,
        title: 'Brand Review',
        duration: '60 minutes',
        price: 65,
        popular: true,
      },
      { icon: 'compass' as const, title: 'Career Strategy', duration: '90 minutes', price: 95 },
    ],
    availability: [
      { date: 'tomorrow', label: 'Tomorrow', slots: 5, isHighlighted: true },
      { date: '2024-10-24', label: 'Tue, Oct 24', slots: 3, isHighlighted: false },
    ],
    reviewsDetail: {
      rating: 4.8,
      count: 215,
      text: 'Elena helped me understand how to position myself as a creative leader. Her advice was transformative.',
      author: 'David K.',
      authorInitial: 'D',
    },
    responseTime: 'Usually responds within 24 hours',
    linkedIn: 'https://linkedin.com',
    portfolio: 'https://portfolio.com',
  },
  {
    id: 4,
    name: 'Dr. James Wilson',
    role: 'Senior Data Scientist',
    company: 'Tesla',
    tags: ['#DataScience', '#AI', '#PhDToIndustry'],
    rating: 4.9,
    reviews: 156,
    description:
      'Guiding academic researchers into data science roles. Specialist in Python, ML, and career strategy.',
    price: 50,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDrI1mjakbj9tJx5yDD6S0R6nTMsXEQkHV0zEzL_2__Yk4ZiF-wH_4Z_F-LUZO3yKS-3nhA-RbOqGHz3wUz-hkiNDl9pCoBK-OJmsH_0fpDsAYI69XKGPSU7p98wjCkR-Ig25oAx0B-XSezK4ZEw-XrV6HxVAu0Y85GalqW1adeg5b7AEDfDCBVihsSr4JaoWC5s7fkeBjpz78B9FIlu10c9BqOF6US9Pi8RIQ6wa1dJjEQjbM423_cjcvHzvfvUIoeRxNEUBUhW7s',
    title: 'Senior Data Scientist & ML Engineer',
    about: [
      'PhD in Computer Science with 10+ years bridging academia and industry. I specialize in helping researchers transition to data science roles.',
      'My mentorship covers technical skills (Python, ML, deep learning) and career strategy for landing roles at top tech companies.',
    ],
    services: [
      { icon: 'coffee' as const, title: 'Intro Call', duration: '30 minutes', price: 50 },
      {
        icon: 'pencil' as const,
        title: 'Technical Review',
        duration: '60 minutes',
        price: 100,
        popular: true,
      },
      { icon: 'compass' as const, title: 'Career Strategy', duration: '90 minutes', price: 140 },
    ],
    availability: [
      { date: 'tomorrow', label: 'Tomorrow', slots: 1, isHighlighted: true },
      { date: '2024-10-27', label: 'Fri, Oct 27', slots: 2, isHighlighted: false },
    ],
    reviewsDetail: {
      rating: 4.9,
      count: 156,
      text: 'Dr. Wilson helped me transition from academia to industry. His technical guidance was exceptional.',
      author: 'Sarah P.',
      authorInitial: 'S',
    },
    responseTime: 'Usually responds within 48 hours',
    linkedIn: 'https://linkedin.com',
    portfolio: 'https://portfolio.com',
  },
]

export function MentorGrid() {
  const [selectedMentor, setSelectedMentor] = useState<(typeof mentorsData)[0] | null>(null)

  return (
    <>
      <section>
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">142 Mentors available</h2>
          <div className="flex items-center gap-2 text-[#434655]">
            <span>Sort by:</span>
            <select className="cursor-pointer border-none bg-transparent py-0 font-bold text-[#121c2a] focus:ring-0">
              <option>Highest Rated</option>
              <option>Most Reviews</option>
              <option>Price: Low to High</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {mentorsData.map((mentor) => (
            <MentorCard
              key={mentor.id}
              name={mentor.name}
              role={mentor.role}
              company={mentor.company}
              tags={mentor.tags}
              rating={mentor.rating}
              reviews={mentor.reviews}
              description={mentor.description}
              price={mentor.price}
              imageUrl={mentor.imageUrl}
              onClick={() => setSelectedMentor(mentor)}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-16 flex items-center justify-center gap-4">
          <button className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c3c6d7] text-[#434655] transition-colors hover:bg-[#e6eeff]">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[#004ac6] font-bold text-white shadow-md">
            1
          </button>
          <button className="flex h-12 w-12 items-center justify-center rounded-full text-[#434655] transition-colors hover:bg-[#e6eeff]">
            2
          </button>
          <button className="flex h-12 w-12 items-center justify-center rounded-full text-[#434655] transition-colors hover:bg-[#e6eeff]">
            3
          </button>
          <button className="flex h-12 w-12 items-center justify-center rounded-full text-[#434655] transition-colors hover:bg-[#e6eeff]">
            ...
          </button>
          <button className="flex h-12 w-12 items-center justify-center rounded-full text-[#434655] transition-colors hover:bg-[#e6eeff]">
            12
          </button>
          <button className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c3c6d7] text-[#434655] transition-colors hover:bg-[#e6eeff]">
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </section>

      {/* Mentor Profile Modal */}
      {selectedMentor && (
        <MentorProfileModal
          isOpen={!!selectedMentor}
          onClose={() => setSelectedMentor(null)}
          mentor={{
            name: selectedMentor.name,
            title: selectedMentor.title,
            imageUrl: selectedMentor.imageUrl,
            verified: true,
            about: selectedMentor.about,
            services: selectedMentor.services,
            availability: selectedMentor.availability,
            reviews: selectedMentor.reviewsDetail,
            responseTime: selectedMentor.responseTime,
            linkedIn: selectedMentor.linkedIn,
            portfolio: selectedMentor.portfolio,
          }}
        />
      )}
    </>
  )
}
