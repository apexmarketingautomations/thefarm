import Link from 'next/link'
import PublicLayout from '@/components/public-layout'
import { ChevronRight, Mail, Calendar, MessageSquare } from 'lucide-react'

const FAQS = [
  {
    q: 'Do you ship animals and hatching eggs?',
    a: 'We ship fertile hatching eggs nationwide via express mail. Live birds and livestock are sold for local and regional pickup; longer transport can sometimes be arranged with a licensed hauler at the buyer\'s expense. Availability always depends on your local, state, and federal rules — see our sales policy.',
  },
  {
    q: 'What\'s required to reserve an animal?',
    a: 'A deposit (typically 25%, shown on each listing) holds any animal and removes it from the available list. The balance is due at pickup or before transport. Reserved animals are held up to 30 days.',
  },
  {
    q: 'Can I visit the farm first?',
    a: 'Absolutely — and we encourage it. Visits are by appointment so we can give you our full attention. Use the Contact page to send a request and we\'ll confirm a time by email.',
  },
  {
    q: 'Are your animals healthy and vaccinated?',
    a: 'Yes. Animals leave in excellent condition, dewormed, and vaccinated where appropriate (Marek\'s for poultry; EWT/WNV/rabies for equines; CDT for sheep), with a 7-day health guarantee on pre-existing conditions.',
  },
  {
    q: 'Will my hatching eggs hatch?',
    a: 'We guarantee a minimum 80% fertility, candled before packing. Actual hatch rate depends on your incubator and handling, so we can\'t guarantee chicks — but we\'ll share exactly how we run ours.',
  },
  {
    q: 'How do deposits and payments work?',
    a: 'Deposits are non-refundable and lock in your animal. We accept cash, certified funds, and major digital payments. Final balance is due before the animal leaves the farm.',
  },
  {
    q: 'Do you sell mini donkeys and horses as single companions?',
    a: 'Equines are herd animals and do best with a companion. We\'re happy to advise on suitable pairings and will ask about your setup to make sure every animal goes to a home where it will thrive.',
  },
  {
    q: 'What areas do you serve?',
    a: 'Hatching eggs ship across the continental US. Live-animal sales are local and regional from Central Florida, with transport arranged case by case through licensed haulers.',
  },
]

export default function FAQPage() {
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
            Questions & Answers
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
            Frequently asked{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>questions</em>
          </h1>
          <p style={{ fontSize: 'clamp(17px,1.5vw,20px)', color: 'rgba(246,240,228,.74)', lineHeight: 1.7, maxWidth: 560 }}>
            Everything buyers ask us most — from deposits and health to shipping and farm visits.
          </p>
        </div>
      </div>

      {/* FAQ accordion */}
      <section style={{ background: 'var(--cream)', padding: 'clamp(64px,8vw,118px) 0' }}>
        <div className="max-w-[880px] mx-auto px-10">
          <div style={{ borderTop: '1px solid var(--line)' }}>
            {FAQS.map((item) => (
              <details
                key={item.q}
                className="group"
                style={{ borderBottom: '1px solid var(--line)' }}
              >
                <summary
                  className="flex justify-between items-center gap-6 py-6 cursor-pointer list-none"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(18px,2vw,21px)',
                    color: 'var(--forest-deep)',
                    fontWeight: 500,
                  }}
                >
                  {item.q}
                  <ChevronRight size={22} style={{ color: 'var(--gold)', flexShrink: 0 }} className="group-open:rotate-90 transition-transform duration-300" />
                </summary>
                <p style={{ padding: '0 60px 26px 0', color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.7 }}>
                  {item.a}
                </p>
              </details>
            ))}
          </div>

          {/* Still have a question card */}
          <div
            className="mt-10 rounded-[var(--r)] flex flex-wrap gap-5 items-center justify-between p-8"
            style={{ background: 'var(--paper)', border: '1px solid var(--line)' }}
          >
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500, color: 'var(--forest-deep)', marginBottom: 6 }}>
                Still have a question?
              </h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: 14.5 }}>
                Ask our assistant in the corner, or reach out directly — we answer every message personally.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 font-semibold rounded-[var(--r)] transition-all hover:-translate-y-0.5"
                style={{ fontSize: 13, letterSpacing: '0.04em', padding: '14px 26px', background: 'var(--forest)', color: 'var(--cream)', border: '1.5px solid transparent' }}
              >
                <Mail size={16} /> Contact us
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 font-semibold rounded-[var(--r)] transition-all hover:-translate-y-0.5"
                style={{ fontSize: 13, letterSpacing: '0.04em', padding: '14px 26px', background: 'transparent', color: 'var(--forest)', border: '1.5px solid var(--line)' }}
              >
                <Calendar size={16} /> Book a visit
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
