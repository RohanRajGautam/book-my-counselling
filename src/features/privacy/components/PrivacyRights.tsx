import { Download, Edit3, KeyRound, RotateCcw } from 'lucide-react'
import { PrivacySectionHeading } from './PrivacySectionHeading'

const rights = [
  {
    title: 'Access & Portability',
    description: 'Request a machine-readable copy of all personal data we hold about you.',
    action: 'Request data',
    actionClassName: 'text-[#1155d9]',
    icon: Download,
  },
  {
    title: 'Rectification',
    description: 'Correct inaccurate or incomplete information in your profile settings.',

    actionClassName: 'text-[#1155d9]',
    icon: Edit3,
  },
  {
    title: 'Erasure (Right to be Forgotten)',
    description: 'Request permanent deletion of your account and associated records.',

    actionClassName: 'text-[#c62828]',
    icon: RotateCcw,
  },
  {
    title: 'Objection to Processing',
    description: 'Opt out of specific data processing activities like behavioral analytics.',

    actionClassName: 'text-[#1155d9]',
    icon: KeyRound,
  },
]

export function PrivacyRights() {
  return (
    <section id="rights" className="scroll-mt-28">
      <div className="flex items-center justify-between">
        <PrivacySectionHeading
          icon={<KeyRound className="h-5 w-5" />}
          iconClassName="bg-[#ffd978] text-[#3d2a00]"
          title="Your Rights"
        />
        <a
          href="mailto:info@bookmycounselling.com?subject=know%20your%20rights&body=hi%20i%20would%20like%20to%20request%20how%20data%20is%20currently%20being%20used"
          className="font-bold text-blue-700 hover:underline"
        >
          Request data
        </a>
      </div>
      <div className="mt-9 overflow-hidden rounded-2xl bg-[#eaf1ff]">
        <div className="hidden grid-cols-[1fr_1.65fr_0.72fr] px-8 py-5 text-sm font-bold text-[#434655] md:grid">
          <span>Right</span>
          <span>Description</span>
        </div>
        {rights.map((right) => {
          const Icon = right.icon

          return (
            <article
              key={right.title}
              className="grid gap-4 border-t border-white/70 px-8 py-7 text-sm md:grid-cols-[1fr_1.65fr_0.72fr] md:items-center"
            >
              <h3 className="flex items-center gap-3 font-[family-name:var(--font-headline)] font-extrabold text-[#121c2a]">
                <Icon className="h-4 w-4 text-[#1155d9] md:hidden" />
                {right.title}
              </h3>
              <p className="leading-6 text-[#5b6070]">{right.description}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
