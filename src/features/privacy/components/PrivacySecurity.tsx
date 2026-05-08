import { Shield } from 'lucide-react'
import { PrivacySectionHeading } from './PrivacySectionHeading'

const securityProtocols = [
  {
    title: 'Zero-Knowledge Encryption',
    description:
      'Sensitive communications are encrypted in transit using TLS 1.3 and at rest with AES-256 standards. Your private notes remain accessible only to you and your mentor.',
  },
  {
    title: 'Strict Access Controls',
    description:
      'Internal access to user databases is restricted on a need-to-know basis, protected by multi-factor authentication and continuous audit logging.',
  },
  {
    title: 'Proactive Monitoring',
    description:
      'Our systems are subject to periodic security testing and real-time threat detection to prevent unauthorized data access.',
  },
]

export function PrivacySecurity() {
  return (
    <section
      id="security"
      className="scroll-mt-28 rounded-[28px] bg-[#253344] px-8 py-12 text-white sm:px-12"
    >
      <PrivacySectionHeading
        icon={<Shield className="h-5 w-5" />}
        iconClassName="bg-[#b4c5ff] text-[#00174b]"
        title="Data Security Protocols"
        titleClassName="text-white"
      />
      <div className="mt-9 grid gap-8 md:grid-cols-3">
        {securityProtocols.map((protocol) => (
          <article key={protocol.title}>
            <h3 className="font-[family-name:var(--font-headline)] text-sm font-extrabold text-[#b4c5ff]">
              {protocol.title}
            </h3>
            <p className="mt-4 text-sm leading-6 text-white/72">{protocol.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
