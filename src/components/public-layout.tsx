import Link from 'next/link'
import NavHeader from './nav-header'
import ChatWidget from './chat-widget'
import { Leaf, Mail, MapPin } from 'lucide-react'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--cream)' }}>
      <NavHeader />

      {/* Spacer for fixed nav: topbar (38px) + main nav (74px) = 112px */}
      <div style={{ height: 112 }} className="shrink-0" />

      <main className="flex-1">{children}</main>

      <footer style={{ background: 'var(--forest-deep)', color: 'rgba(246,240,228,.62)', paddingTop: 72, paddingBottom: 30 }}>
        <div className="max-w-[1240px] mx-auto px-10">
          <div
            className="grid gap-11 pb-12"
            style={{
              gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))',
              borderBottom: '1px solid var(--line-light)',
            }}
          >
            {/* Brand col */}
            <div style={{ gridColumn: 'span 2' }} className="min-w-0">
              <Link href="/" className="flex items-center gap-3 mb-4 w-fit">
                <span
                  className="flex items-center justify-center rounded-full flex-shrink-0"
                  style={{ width: 42, height: 42, background: 'var(--forest)', border: '1.5px solid rgba(198,164,88,.5)' }}
                >
                  <Leaf size={20} style={{ color: 'var(--gold-soft)' }} />
                </span>
                <span>
                  <span
                    className="block text-[19px] font-semibold leading-none"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--cream)' }}
                  >
                    Evergreen Hollow Farm
                  </span>
                  <span className="block mt-0.5 text-[9px] font-semibold tracking-[0.28em] uppercase" style={{ color: 'var(--gold)' }}>
                    Heritage Breeder
                  </span>
                </span>
              </Link>
              <p style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 290, color: 'rgba(246,240,228,.62)' }}>
                Miniature livestock, exotic poultry & hatching eggs — ethically raised for discerning buyers.
              </p>
              <div className="mt-4 flex flex-col gap-2" style={{ fontSize: 13.5 }}>
                <span className="flex items-center gap-2" style={{ color: 'rgba(246,240,228,.7)' }}>
                  <Mail size={14} style={{ color: 'var(--gold-soft)' }} /> crivera@fjfcns.com
                </span>
                <span className="flex items-center gap-2" style={{ color: 'rgba(246,240,228,.7)' }}>
                  <MapPin size={14} style={{ color: 'var(--gold-soft)' }} /> Central Florida, USA
                </span>
              </div>
            </div>

            {/* Animals */}
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] mb-[18px]" style={{ color: 'var(--gold-soft)' }}>
                Animals
              </h4>
              {['Silkies', 'Wyandottes', 'Mandarin Ducks', 'Sebastopol Geese', 'Hatching Eggs'].map(label => (
                <Link key={label} href="/about" className="block py-1 text-[14px] transition-colors hover:opacity-100" style={{ color: 'rgba(246,240,228,.62)' }}>
                  {label}
                </Link>
              ))}
            </div>

            {/* Visit */}
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] mb-[18px]" style={{ color: 'var(--gold-soft)' }}>
                Visit
              </h4>
              <Link href="/about" className="block py-1 text-[14px] transition-colors" style={{ color: 'rgba(246,240,228,.62)' }}>Our Story</Link>
              <Link href="/shop" className="block py-1 text-[14px] transition-colors" style={{ color: 'rgba(246,240,228,.62)' }}>Available Now</Link>
              <Link href="/contact" className="block py-1 text-[14px] transition-colors" style={{ color: 'rgba(246,240,228,.62)' }}>Contact & FAQ</Link>
            </div>

            {/* Hours */}
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] mb-[18px]" style={{ color: 'var(--gold-soft)' }}>
                Farm Hours
              </h4>
              <div style={{ fontSize: 13.5, lineHeight: 2, color: 'rgba(246,240,228,.7)' }}>
                <div><span style={{ color: 'rgba(246,240,228,.45)' }}>Tue – Fri</span> &nbsp;9:00 AM – 5:00 PM</div>
                <div><span style={{ color: 'rgba(246,240,228,.45)' }}>Saturday</span> &nbsp;9:00 AM – 3:00 PM</div>
                <div><span style={{ color: 'rgba(246,240,228,.45)' }}>Sun – Mon</span> &nbsp;By appointment</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-between items-center gap-3 pt-6" style={{ fontSize: 12.5, color: 'rgba(246,240,228,.4)' }}>
            <span>© {new Date().getFullYear()} Evergreen Hollow Farm. All rights reserved.</span>
            <span className="flex items-center gap-4">
              <Link href="/login" className="transition-colors hover:opacity-80" style={{ color: 'rgba(246,240,228,.4)', fontSize: 12.5 }}>
                Staff login
              </Link>
              <span>Raised by hand in Central Florida</span>
            </span>
          </div>
        </div>
      </footer>

      <ChatWidget />
    </div>
  )
}
