'use client'

import { MentorCard } from '@/components/cards/MentorCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const mentors = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
]

export function MentorGrid() {
  return (
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
        {mentors.map((mentor) => (
          <MentorCard key={mentor.name} {...mentor} />
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
  )
}
