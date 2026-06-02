'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Leaf, Mail, MapPin, Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'Our Birds' },
  { href: '/contact', label: 'Contact' },
]

export default function NavHeader() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const isHome = pathname === '/'
  const overHero = isHome && !scrolled

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 60)
    handle()
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[900] transition-all duration-300"
        style={{ borderBottom: '1px solid transparent' }}
      >
        {/* Topbar */}
        <div style={{ background: 'var(--forest-deep)', color: 'rgba(246,240,228,.7)', fontSize: 12 }}>
          <div className="max-w-[1240px] mx-auto px-10 flex justify-between items-center h-[38px]">
            <div className="flex items-center gap-2 text-[12px]">
              <Mail size={13} style={{ color: 'var(--gold-soft)' }} />
              <span>crivera@fjfcns.com</span>
              <span className="hidden sm:inline opacity-50">·</span>
              <span className="hidden sm:inline">Central Florida, USA</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="flex items-center gap-1.5 font-semibold text-white hover:opacity-80 transition-opacity text-[12px]"
              >
                Staff Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div
          className="transition-all duration-300"
          style={
            scrolled
              ? { background: 'rgba(246,240,228,.92)', backdropFilter: 'blur(14px)', boxShadow: '0 1px 0 var(--line)' }
              : isHome
              ? { background: 'transparent' }
              : { background: 'var(--cream)' }
          }
        >
          <div className="max-w-[1240px] mx-auto px-10 flex items-center justify-between h-[74px]">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-3">
              <span
                className="flex items-center justify-center rounded-full flex-shrink-0"
                style={{
                  width: 42, height: 42,
                  background: 'var(--forest)',
                  border: '1.5px solid rgba(198,164,88,.5)',
                }}
              >
                <Leaf size={20} style={{ color: 'var(--gold-soft)' }} />
              </span>
              <span>
                <span
                  className="block text-[19px] font-semibold leading-none"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: overHero ? 'var(--cream)' : 'var(--forest-deep)',
                  }}
                >
                  Evergreen Hollow
                </span>
                <span
                  className="block mt-0.5"
                  style={{
                    fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase',
                    fontWeight: 600, color: 'var(--gold)',
                  }}
                >
                  Farm · Est. Florida
                </span>
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-[30px]">
              {NAV_LINKS.map(({ href, label }) => {
                const active = pathname === href || (href !== '/' && pathname.startsWith(href))
                return (
                  <Link
                    key={href}
                    href={href}
                    className="relative text-[13.5px] font-medium py-1.5 transition-colors duration-200"
                    style={{
                      color: overHero
                        ? active ? '#fff' : 'rgba(246,240,228,.82)'
                        : active ? 'var(--forest-deep)' : 'var(--ink-soft)',
                    }}
                  >
                    {label}
                    {active && (
                      <span
                        className="absolute left-0 right-0 -bottom-0.5 h-0.5"
                        style={{ background: 'var(--gold)' }}
                      />
                    )}
                  </Link>
                )
              })}
              <Link
                href="/contact"
                className="flex items-center gap-2 text-[13px] font-semibold px-[18px] py-[10px] rounded-[var(--r)] transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: 'var(--gold)', color: '#fff' }}
              >
                Inquire Now
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-1.5 transition-colors"
              style={{ color: overHero ? 'var(--cream)' : 'var(--ink)', background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={26} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[1000] flex flex-col px-7 py-6"
          style={{ background: 'var(--forest-deep)', animation: 'fadeIn .25s ease' }}
        >
          <div className="flex justify-between items-center mb-9">
            <Link href="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
              <span
                className="flex items-center justify-center rounded-full flex-shrink-0"
                style={{ width: 40, height: 40, background: 'var(--forest)', border: '1.5px solid rgba(198,164,88,.5)' }}
              >
                <Leaf size={18} style={{ color: 'var(--gold-soft)' }} />
              </span>
              <span
                className="text-[19px] font-semibold"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--cream)' }}
              >
                Evergreen Hollow
              </span>
            </Link>
            <button
              className="flex items-center justify-center rounded-full transition-colors"
              style={{ width: 34, height: 34, background: 'rgba(246,240,228,.12)', border: 'none', cursor: 'pointer', color: 'var(--cream)' }}
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="py-3 border-b text-left"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 30, fontWeight: 500,
                  color: 'var(--cream)',
                  borderColor: 'var(--line-light)',
                  textDecoration: 'none',
                }}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="mt-auto pt-6 flex flex-col gap-4">
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 font-semibold rounded-[var(--r)] transition-all"
              style={{ background: 'var(--gold)', color: '#fff', padding: '14px 26px', fontSize: 13 }}
              onClick={() => setMenuOpen(false)}
            >
              Inquire Now
            </Link>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 font-semibold text-[14px]"
              style={{ color: 'var(--gold-soft)', paddingTop: 4 }}
              onClick={() => setMenuOpen(false)}
            >
              Staff Sign In
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
