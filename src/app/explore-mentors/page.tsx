import { Navbar } from '@/components/layout/Navbar'
import { FiltersSidebar } from '@/components/sections/FiltersSidebar'
import { MentorGrid } from '@/components/sections/MentorGrid'
import { FilterProvider } from '@/contexts/FilterContext'

export default function ExploreMentorsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <FilterProvider>
          {/* Discovery Layout */}
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-8 pb-24 lg:grid-cols-12">
            {/* Sidebar Filters */}
            <div className="lg:col-span-3">
              <FiltersSidebar />
            </div>

            {/* Mentor Grid */}
            <div className="lg:col-span-9">
              <MentorGrid />
            </div>
          </div>
        </FilterProvider>
      </main>
    </>
  )
}
