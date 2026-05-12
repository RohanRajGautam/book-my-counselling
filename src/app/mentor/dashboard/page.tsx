import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";

// Feature Components (Imported from your files)
import Header from "@/features/dashboard/Header";
import { StatSection } from "@/features/dashboard/StatSection";
import { UpcomingBookings } from "@/features/dashboard/UpComingBooking";
import RecentActivity from "@/features/dashboard/RecentActivity";
import { ProfileSidebar } from "@/features/dashboard/ProfileSidebar";

export default function Dashboard() {
  return (
    <div className="min-h-screen w-full bg-[#f8fafc] selection:bg-blue-100">
      {/* The Main Wrapper: 
        Uses max-w-7xl (approx 1280px) or 1400px for a high-end feel.
      */}
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-10">
        
        {/* Header Section */}
        <header className="mb-10">
          <Header />
        </header>

        {/* Top Stats - Cleanly separated from the main content grid */}
        <section className="mb-12">
          <StatSection />
        </section>

        {/* The Layout Grid:
          8 Columns for main content, 4 Columns for the Profile Sidebar.
          On mobile, it stacks automatically.
        */}
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-12">
          
          {/* LEFT COLUMN: Main Dashboard Content */}
          <main className="space-y-12 xl:col-span-8">
            
            {/* Upcoming Bookings Section */}
            <section className="space-y-6">
              {/* This component should render the list of booking cards */}
              <UpcomingBookings />
            </section>

            {/* Recent Activity Section */}
            <section className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  Recent Activity
                </h2>
              </div>
              
              <RecentActivity />
            </section>
          </main>

          {/* RIGHT COLUMN: Profile & Support */}
          <aside className="xl:col-span-4">
            <div className="sticky top-8 w-full">
              <SidebarProvider defaultOpen={true}>
                <ProfileSidebar />
              </SidebarProvider>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}