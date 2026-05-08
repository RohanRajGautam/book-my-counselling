'use client'

import { useEffect, useState } from 'react'
import { PrivacyDataUsage } from './PrivacyDataUsage'
import { PrivacyHero } from './PrivacyHero'
import { PrivacyInformationCollected } from './PrivacyInformationCollected'
import { PrivacyIntroduction } from './PrivacyIntroduction'
import { privacyNavItems } from './privacy-nav-items'
import { PrivacyRights } from './PrivacyRights'
import { PrivacySecurity } from './PrivacySecurity'
import { PrivacySideNav } from './PrivacySideNav'

export function PrivacyContent() {
  const [activeSection, setActiveSection] = useState('introduction')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visible?.target.id) {
          setActiveSection(visible.target.id)
        }
      },
      {
        rootMargin: '-24% 0px -55% 0px',
        threshold: [0.1, 0.25, 0.5, 0.75],
      }
    )

    privacyNavItems.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="bg-[#f7f8ff]">
      <PrivacyHero />

      <div className="mx-auto grid max-w-7xl gap-10 px-6 pt-10 pb-28 sm:px-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <PrivacySideNav activeSection={activeSection} onSectionSelect={setActiveSection} />

        <div className="space-y-20">
          <PrivacyIntroduction />
          <PrivacyInformationCollected />
          <PrivacyDataUsage />
          <PrivacySecurity />
          <PrivacyRights />
        </div>
      </div>
    </div>
  )
}
