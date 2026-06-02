import Image from 'next/image'
import Link from 'next/link'
import PublicLayout from '@/components/public-layout'
import { prisma } from '@/lib/prisma'
import { ChevronRight, Package, Truck } from 'lucide-react'

async function getListings() {
  try {
    return await prisma.listing.findMany({
      where: { status: 'ACTIVE' },
      include: { breed: true },
      orderBy: [{ breed: { species: 'asc' } }, { createdAt: 'desc' }],
    })
  } catch { return [] }
}

const AGE_LABEL: Record<string, string> = {
  HATCHING_EGG: 'Hatching Eggs',
  DAY_OLD_CHICK: 'Day-Old Chicks',
  STARTED: 'Started Birds',
  ADULT: 'Adult Birds',
  BREEDING_PAIR: 'Breeding Pair',
  BREEDING_TRIO: 'Breeding Trio',
}

const BREED_PHOTOS: Record<string, string> = {
  'Silkie': '/farm/silkies.jpg',
  'Black Silkie': '/farm/black-pair-show.jpg',
  'Silver Laced Wyandotte': '/farm/hens-laced-straw.jpg',
  "Mille Fleur d'Uccle": '/farm/chicks-golden-straw.jpg',
  'Black Java': '/farm/black-rooster-show.jpg',
  'Embden Goose': '/farm/white-goose.jpg',
  'Sebastopol Goose': '/farm/white-goose.jpg',
  'Mandarin Duck': '/farm/mandarin-duck.jpg',
}
const FALLBACK_PHOTO = '/farm/chicks-golden-tray.jpg'

export default async function ShopPage() {
  const listings = await getListings()

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
            Available Now
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
            Birds &{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Hatching Eggs</em>
          </h1>
          <p style={{ fontSize: 'clamp(17px,1.5vw,20px)', color: 'rgba(246,240,228,.74)', lineHeight: 1.7, maxWidth: 560 }}>
            All birds are pasture-raised, NPIP-compliant, and antibiotic-free. Prices include care packaging for shipped eggs.
          </p>
        </div>
      </div>

      <div style={{ background: 'var(--cream)', padding: 'clamp(64px,8vw,118px) 0' }}>
        <div className="max-w-[1240px] mx-auto px-10">
          {listings.length === 0 ? (
            <div
              className="text-center py-24 rounded-[10px]"
              style={{ border: '2px dashed var(--line)' }}
            >
              <p className="text-5xl mb-4">🌱</p>
              <h2
                style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 500, color: 'var(--forest-deep)', marginBottom: 12 }}
              >
                Nothing listed yet
              </h2>
              <p style={{ color: 'var(--ink-soft)', marginBottom: 28 }}>
                New hatches coming soon. Contact us to reserve your birds early.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 font-semibold rounded-[var(--r)] transition-all hover:-translate-y-0.5"
                style={{ fontSize: 13, letterSpacing: '0.04em', padding: '14px 26px', background: 'var(--forest)', color: 'var(--cream)', border: '1.5px solid transparent' }}
              >
                Get on the Waitlist <ChevronRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))' }}>
              {listings.map(l => {
                const photo = BREED_PHOTOS[l.breed?.name ?? ''] ?? FALLBACK_PHOTO
                return (
                  <article
                    key={l.id}
                    className="rounded-[var(--r)] overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
                    style={{ background: 'var(--paper)', border: '1px solid var(--line)', cursor: 'pointer' }}
                  >
                    <div className="relative overflow-hidden" style={{ aspectRatio: '4/3.2', background: 'var(--sand-deep)' }}>
                      <Image
                        src={photo}
                        alt={l.breed?.name ?? 'Bird'}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <span
                        className="absolute top-3.5 left-3.5 text-[10.5px] font-bold tracking-[0.1em] uppercase flex items-center gap-1.5 rounded-full px-[11px] py-[5px]"
                        style={{
                          background: 'rgba(252,249,242,.92)',
                          color: '#3c5a3a',
                          backdropFilter: 'blur(4px)',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#3c5a3a' }} />
                        Available
                      </span>
                    </div>
                    <div style={{ padding: '22px 24px 24px' }}>
                      <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-faint)', fontWeight: 600 }}>
                        {l.breed?.species?.replace('_', ' ').toLowerCase() ?? 'poultry'}
                      </div>
                      <div className="flex justify-between items-baseline gap-3 mt-2 mb-1">
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 23, fontWeight: 500, color: 'var(--forest-deep)', lineHeight: 1.1 }}>
                          {l.breed?.name ?? 'Bird'}
                        </h3>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--ink)', whiteSpace: 'nowrap', textAlign: 'right' }}>
                          ${Number(l.priceEach).toFixed(0)}
                          <span className="block" style={{ fontFamily: 'var(--font-sans)', fontSize: 10.5, color: 'var(--ink-faint)', letterSpacing: '0.02em', fontWeight: 500 }}>
                            / {l.ageType === 'HATCHING_EGG' ? 'dozen' : 'each'}
                          </span>
                        </div>
                      </div>
                      <div style={{ fontSize: 12.5, color: 'var(--ink-faint)', marginBottom: 14 }}>
                        {AGE_LABEL[l.ageType] ?? l.ageType} · {l.quantityAvail} available
                      </div>
                      {l.description && (
                        <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.65, marginBottom: 14 }} className="line-clamp-2">
                          {l.description}
                        </p>
                      )}
                      <div
                        className="flex items-center justify-between pt-3.5"
                        style={{ borderTop: '1px solid var(--line)' }}
                      >
                        <span style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>{l.quantityAvail} left</span>
                        <Link
                          href={`/contact?bird=${encodeURIComponent(l.breed?.name ?? 'bird')}&type=${encodeURIComponent(AGE_LABEL[l.ageType] ?? l.ageType)}`}
                          className="inline-flex items-center gap-2 font-semibold rounded-[var(--r)] transition-all hover:-translate-y-0.5"
                          style={{ fontSize: 12, padding: '10px 18px', background: 'var(--gold)', color: '#fff', border: '1.5px solid transparent' }}
                        >
                          Request
                        </Link>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}

          {/* Shipping info */}
          <div
            className="mt-16 rounded-[10px] overflow-hidden"
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}
          >
            <div style={{ padding: 'clamp(38px,5vw,60px)', background: 'var(--forest-deep)', color: 'var(--cream)' }}>
              <div className="flex items-center gap-3 mb-3">
                <Package size={20} style={{ color: 'var(--gold-soft)' }} />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500, color: 'var(--cream)' }}>
                  Hatching Eggs
                </h3>
              </div>
              <p style={{ fontSize: 14.5, color: 'rgba(246,240,228,.82)', lineHeight: 1.65 }}>
                Shipped USPS Priority Mail in specialized packaging. Typical hatch rates 50–80%. Collected fresh, stored properly, and shipped within 7 days of lay. 80% fertility guarantee.
              </p>
            </div>
            <div style={{ padding: 'clamp(38px,5vw,60px)', background: 'var(--forest)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="flex items-center gap-3 mb-3">
                <Truck size={20} style={{ color: 'var(--gold-soft)' }} />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500, color: 'var(--cream)' }}>
                  Live Birds
                </h3>
              </div>
              <p style={{ fontSize: 14.5, color: 'rgba(246,240,228,.82)', lineHeight: 1.65 }}>
                Day-old chicks ship USPS Priority Mail Express (spring/summer). Started and adult birds prefer local pickup. Interstate movement requires health certificate — we help with this.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
