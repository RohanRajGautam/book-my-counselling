import { Fingerprint } from 'lucide-react'
import { PrivacySectionHeading } from './PrivacySectionHeading'

const collectedData = [
  {
    title: 'Direct Identifiers',
    description: 'Data you provide during account creation:',
    items: [
      'Legal name and contact information',
      'Professional background and credentials',
      'Payment details via encrypted gateways',
    ],
    dotClassName: 'bg-[#1155d9]',
  },
  {
    title: 'Service Usage Data',
    description: 'Information generated through interaction:',
    items: [
      'Session notes and preferences',
      'Communication metadata',
      'Technical logs and IP address',
    ],
    dotClassName: 'bg-[#00875a]',
  },
]

export function PrivacyInformationCollected() {
  return (
    <section id="information" className="scroll-mt-28">
      <PrivacySectionHeading
        icon={<Fingerprint className="h-5 w-5" />}
        iconClassName="bg-[#62f2ad] text-[#0b5b4c]"
        title="Information We Collect"
      />
      <div className="mt-9 grid gap-8 md:grid-cols-2">
        {collectedData.map((group) => (
          <article key={group.title} className="rounded-2xl bg-[#eaf1ff] p-8">
            <h3 className="font-[family-name:var(--font-headline)] text-lg font-extrabold tracking-tight text-[#121c2a]">
              {group.title}
            </h3>
            <p className="mt-4 text-sm leading-6 text-[#5b6070]">{group.description}</p>
            <ul className="mt-5 space-y-3">
              {group.items.map((item) => (
                <li key={item} className="flex gap-3 text-sm font-medium text-[#121c2a]">
                  <span className={`mt-2 h-1.5 w-1.5 rounded-full ${group.dotClassName}`} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
