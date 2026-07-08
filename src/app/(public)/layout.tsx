import { Suspense } from "react"

import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"

function NavbarFallback() {
  return (
    <div
      aria-hidden="true"
      className="fixed top-0 z-50 h-[76px] w-full border-b border-[#c3c6d7]/20 bg-white/88 backdrop-blur-md"
    />
  )
}

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
    <main>
         <Suspense fallback={<NavbarFallback />}>
           <Navbar />
         </Suspense>
          {children}
          <Footer />
      </main>
    </>
  )
}
