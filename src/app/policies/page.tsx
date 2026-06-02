'use client'

import { useState } from 'react'
import PublicLayout from '@/components/public-layout'

const POLICY_DOCS = {
  policies: {
    title: 'Farm Policies',
    updated: 'June 1, 2026',
    sections: [
      ['Responsible Sales', 'We place animals only where they will be properly housed, fed, and cared for. We may ask about your setup, experience, and intended use, and we reserve the right to decline any sale we believe to be unsafe, unhealthy, or unlawful. This is part of our commitment to animal welfare.'],
      ['Deposits & Reservations', 'A non-refundable deposit (typically 25% of the purchase price) reserves an animal and removes it from the available list. Reserved animals are held for up to 30 days. The remaining balance is due before the animal leaves the farm.'],
      ['Health Guarantee', 'Animals leave the farm in good health, age-appropriately vaccinated and dewormed. We offer a 7-day guarantee against pre-existing conditions, provided the animal has not been exposed to other livestock or poultry. Hatching eggs carry a minimum 80% fertility guarantee; hatch rate is not guaranteed.'],
      ['Pickup, Transport & Shipping', 'Live animals are sold for local and regional pickup. Longer transport may be arranged through a licensed hauler at the buyer\'s expense. Fertile hatching eggs ship within the continental US; we package carefully but cannot control carrier handling.'],
      ['Compliance', 'Compliance with local, state, and federal regulations is the buyer\'s responsibility. The information on this site is provided for general guidance only and is not legal advice. Please consult your local authorities about the rules that apply to you.'],
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    updated: 'June 1, 2026',
    sections: [
      ['Information We Collect', 'When you submit an inquiry, booking request, or message, we collect the contact details and information you provide (such as your name, email, phone number, and your animal interests). We may also collect basic, non-identifying analytics about how visitors use the site.'],
      ['How We Use It', 'We use your information solely to respond to your inquiry, arrange visits and sales, send confirmations and reminders you request, and improve our service. We do not sell your personal information.'],
      ['Cookies & Analytics', 'This site may use cookies and third-party analytics or advertising tools (for example, to measure traffic or support social-media features) to understand performance and reach. You can control cookies through your browser settings.'],
      ['Data Sharing', 'We share information only with service providers that help us operate (such as scheduling, email, or payment tools) and where required by law. We never sell your data to third parties.'],
      ['Your Choices', 'You may request access to, correction of, or deletion of your personal information at any time by emailing crivera@fjfcns.com. You may also opt out of any non-essential communications.'],
    ],
  },
  terms: {
    title: 'Terms of Service',
    updated: 'June 1, 2026',
    sections: [
      ['Use of This Site', 'This website is provided for informational purposes to showcase our animals and facilitate inquiries. Listings, prices, and availability are subject to change without notice and do not constitute a binding offer until confirmed by us in writing.'],
      ['Inquiries & Purchases', 'Submitting an inquiry or deposit does not guarantee a sale. All sales are subject to our Farm Policies, including our right to decline a sale and our deposit and health-guarantee terms.'],
      ['No Professional Advice', 'Care, husbandry, and legal information on this site is general in nature and not a substitute for professional veterinary or legal advice. Always consult qualified professionals for your specific situation.'],
      ['Limitation of Liability', 'To the fullest extent permitted by law, Evergreen Hollow Farm is not liable for indirect or consequential damages arising from use of this site or reliance on its content. Animals are living creatures and outcomes after sale are beyond our control.'],
      ['Governing Law', 'These terms are governed by the laws of the State of Florida. By using this site you agree to these terms and to our Privacy Policy.'],
    ],
  },
} as const

type DocId = keyof typeof POLICY_DOCS

const TABS: [DocId, string][] = [
  ['policies', 'Farm Policies'],
  ['privacy', 'Privacy'],
  ['terms', 'Terms'],
]

export default function PoliciesPage() {
  const [active, setActive] = useState<DocId>('policies')
  const doc = POLICY_DOCS[active]

  return (
    <PublicLayout>
      {/* Page header */}
      <div
        style={{
          background: 'linear-gradient(155deg,#1B2F23,#16271D 60%,#112017)',
          paddingTop: 'clamp(48px,6vw,84px)',
          paddingBottom: 'clamp(48px,6vw,84px)',
        }}
      >
        <div className="max-w-[1240px] mx-auto px-10">
          <span
            className="inline-flex items-center gap-2.5 mb-4 text-[12px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: 'var(--gold-soft)' }}
          >
            <span className="block w-[26px] h-px opacity-60" style={{ background: 'var(--gold-soft)' }} />
            Legal & Trust
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              fontSize: 'clamp(40px,5.6vw,74px)',
              color: 'var(--cream)',
              lineHeight: 1.05,
              marginTop: 16,
              marginBottom: 16,
            }}
          >
            {doc.title}
          </h1>
          <p style={{ fontSize: 'clamp(17px,1.5vw,20px)', color: 'rgba(246,240,228,.74)', lineHeight: 1.7, maxWidth: 560 }}>
            Last updated {doc.updated}. This information is provided for general guidance and is not legal advice.
          </p>
        </div>
      </div>

      <section style={{ background: 'var(--cream)', padding: 'clamp(64px,8vw,118px) 0' }}>
        <div className="max-w-[880px] mx-auto px-10">
          {/* Tabs */}
          <div
            className="flex flex-wrap gap-2.5 mb-10"
            style={{ borderBottom: '1px solid var(--line)', paddingBottom: 0 }}
          >
            {TABS.map(([id, label]) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className="relative font-semibold transition-colors"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 14,
                  fontWeight: 600,
                  color: active === id ? 'var(--forest-deep)' : 'var(--ink-faint)',
                  padding: '0 2px 14px',
                }}
              >
                {label}
                {active === id && (
                  <span
                    className="absolute left-0 right-0 -bottom-px h-0.5"
                    style={{ background: 'var(--gold)' }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Legal document */}
          <div className="flex flex-col gap-[34px]">
            {doc.sections.map(([heading, body], i) => (
              <div key={heading}>
                <h2
                  className="flex items-baseline gap-3"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 24,
                    fontWeight: 500,
                    color: 'var(--forest-deep)',
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      color: 'var(--gold)',
                      flexShrink: 0,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {heading}
                </h2>
                <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.7 }}>{body}</p>
              </div>
            ))}
          </div>

          <div
            className="mt-12 pt-8 text-sm"
            style={{ borderTop: '1px solid var(--line)', color: 'var(--ink-faint)' }}
          >
            Questions about this policy? Email{' '}
            <a
              href="mailto:crivera@fjfcns.com"
              style={{ color: 'var(--gold)', fontWeight: 500 }}
            >
              crivera@fjfcns.com
            </a>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
