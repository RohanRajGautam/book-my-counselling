import { privacyNavItems } from './privacyNavItems'

interface PrivacySideNavProps {
  activeSection: string
  onSectionSelect: (sectionId: string) => void
}

export function PrivacySideNav({ activeSection, onSectionSelect }: PrivacySideNavProps) {
  return (
    <aside className="lg:sticky lg:top-28 lg:self-start">
      <p className="mb-5 font-[family-name:var(--font-headline)] text-[11px] font-bold uppercase tracking-[0.22em] text-[#434655]">
        Navigation
      </p>
      <nav aria-label="Privacy policy sections" className="space-y-1">
        {privacyNavItems.map((item) => {
          const isActive = activeSection === item.id

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => onSectionSelect(item.id)}
              className={`block rounded-r-lg border-l-4 px-4 py-3 text-sm font-semibold transition-colors ${
                isActive
                  ? 'border-[#1155d9] bg-white text-[#1155d9] shadow-[0_8px_22px_rgba(18,28,42,0.06)]'
                  : 'border-transparent text-[#5b6070] hover:border-[#b4c5ff] hover:bg-white/70 hover:text-[#1155d9]'
              }`}
            >
              {item.label}
            </a>
          )
        })}
      </nav>

      <div className="mt-6 rounded-2xl bg-[#1155d9] p-6 text-white shadow-[0_18px_36px_rgba(17,85,217,0.2)]">
        <h2 className="font-[family-name:var(--font-headline)] text-base font-extrabold">
          Have Questions?
        </h2>
        <p className="mt-4 text-sm leading-6 text-white/82">
          Our compliance team is ready to assist you with privacy-related inquiries.
        </p>
        <a
          href="mailto:privacy@bookmycounselling.com"
          className="mt-5 inline-flex font-[family-name:var(--font-headline)] text-sm font-bold text-white"
        >
          Contact Privacy Officer
        </a>
      </div>
    </aside>
  )
}
