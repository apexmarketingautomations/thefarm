import Image from 'next/image'
import Link from 'next/link'
import PublicLayout from '@/components/public-layout'
import { prisma } from '@/lib/prisma'
import { Award, Truck, Calendar, Shield, Check, Heart, ChevronRight, Leaf } from 'lucide-react'

async function getActiveListings() {
  try {
    return await prisma.listing.findMany({
      where: { status: 'ACTIVE' },
      include: { breed: true },
      orderBy: { createdAt: 'desc' },
      take: 4,
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

const TRUST_ITEMS = [
  { icon: Award, label: 'Health-guaranteed birds' },
  { icon: Leaf, label: 'Hand-raised from day one' },
  { icon: Truck, label: 'Hatching eggs ship nationwide' },
  { icon: Calendar, label: 'Farm visits by appointment' },
]

const CATEGORIES = [
  {
    label: 'Exotic Chickens',
    note: 'Silkies, Wyandottes, d\'Uccle & more',
    photo: '/farm/silkies.jpg',
    href: '/about',
  },
  {
    label: 'Ornamental Waterfowl',
    note: 'Mandarin Ducks & Sebastopol Geese',
    photo: '/farm/mandarin-duck.jpg',
    href: '/about',
  },
  {
    label: 'Hatching Eggs',
    note: 'Ships nationwide · 80% fertility guarantee',
    photo: '/farm/chicks-golden-tray.jpg',
    href: '/shop',
  },
]

const TESTIMONIALS = [
  {
    text: 'We got a trio of Silkies last spring and they are the most gentle, family-friendly birds. The kids adore them.',
    name: 'Rachel M.',
    loc: 'Tampa, FL',
    animal: 'Silkies',
  },
  {
    text: 'Hatching eggs arrived perfectly packed. 9 out of 12 hatched — incredible! Will order again for sure.',
    name: 'David K.',
    loc: 'Atlanta, GA',
    animal: 'Wyandotte Hatching Eggs',
  },
  {
    text: 'The Mandarin pair is stunning. They came healthy, vibrant, and settled into our pond immediately.',
    name: 'Lena T.',
    loc: 'Orlando, FL',
    animal: 'Mandarin Duck Pair',
  },
  {
    text: 'Asked a dozen questions before buying and they answered every one. Real breeders who actually care.',
    name: 'James R.',
    loc: 'Nashville, TN',
    animal: 'Black Java Cockerel',
  },
]

const GALLERY_PHOTOS = [
  '/farm/chick-hero.jpg',
  '/farm/mandarin-duck.jpg',
  '/farm/silkies.jpg',
  '/farm/hens-laced-straw.jpg',
  '/farm/chicks-golden-straw.jpg',
  '/farm/white-goose.jpg',
]

const POLICY_ITEMS = [
  'Availability always depends on your local, state, and federal regulations.',
  'Hatching eggs, chicks, and live birds may carry shipping or transport restrictions.',
  'Buyers are responsible for confirming local ownership and transport laws before purchase.',
  'We reserve the right to decline any sale we believe to be unsafe, unhealthy, or unlawful.',
]

const FAQ = [
  {
    q: 'Do you ship live birds?',
    a: 'Day-old chicks ship USPS Priority Mail Express (spring/summer). Started birds and adults prefer local pickup or we can help arrange transport. Hatching eggs ship nationwide year-round.',
  },
  {
    q: 'What is your hatch rate guarantee?',
    a: 'We guarantee 80% fertility on shipped eggs. If your hatch rate is below 50%, contact us with an incubation log and we will make it right with a partial replacement or credit.',
  },
  {
    q: 'Are you NPIP certified?',
    a: 'Yes. All our flocks are tested and certified under the National Poultry Improvement Plan (NPIP), which is required for interstate shipment of live birds and eggs.',
  },
  {
    q: 'Can I visit the farm?',
    a: 'Absolutely — we love visitors! Farm visits are Tuesday through Saturday by appointment. Use the Contact page to schedule, and we\'ll confirm a time within 24 hours.',
  },
]

export default async function HomePage() {
  const listings = await getActiveListings()

  return (
    <PublicLayout>
      {/* ─── HERO ─────────────────────────────────────────── */}
      <section
        className="relative"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.05fr 1fr',
          minHeight: 'calc(100vh - 112px)',
        }}
      >
        {/* Text side */}
        <div
          className="flex flex-col justify-center"
          style={{
            padding: 'clamp(64px,8vw,120px) 56px clamp(64px,8vw,80px) max(40px, calc((100vw - 1240px)/2 + 40px))',
            background: 'var(--cream)',
          }}
        >
          <div style={{ maxWidth: 540 }}>
            <span
              className="inline-flex items-center gap-2.5 mb-5 text-[12px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: 'var(--gold)' }}
            >
              <span className="block w-[26px] h-px opacity-60" style={{ background: 'var(--gold)' }} />
              Heritage Poultry & Exotic Waterfowl
            </span>
            <h1
              className="leading-[1.05] tracking-[-0.01em] mb-6"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                color: 'var(--ink)',
                fontSize: 'clamp(40px,5.6vw,74px)',
              }}
            >
              Rare birds,{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--gold)', fontWeight: 500 }}>raised by hand</em>{' '}
              on a family farm.
            </h1>
            <p
              className="mb-8"
              style={{
                fontSize: 'clamp(17px,1.5vw,20px)',
                color: 'var(--ink-soft)',
                lineHeight: 1.7,
              }}
            >
              From mandarin ducks to silkie bantams and fresh hatching eggs — thoughtfully bred, beautifully cared for, and ready for the right home.
            </p>
            <div className="flex flex-wrap gap-3.5">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 font-semibold rounded-[var(--r)] transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  fontSize: 13, letterSpacing: '0.04em',
                  padding: '14px 26px',
                  background: 'var(--forest)', color: 'var(--cream)',
                  border: '1.5px solid transparent',
                }}
              >
                <Leaf size={16} /> View Available Birds
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 font-semibold rounded-[var(--r)] transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  fontSize: 13, letterSpacing: '0.04em',
                  padding: '14px 26px',
                  background: 'transparent', color: 'var(--forest)',
                  border: '1.5px solid var(--line)',
                }}
              >
                <Calendar size={16} /> Contact Us
              </Link>
            </div>
            {/* Stats */}
            <div
              className="flex flex-wrap gap-[38px] mt-14 pt-8"
              style={{ borderTop: '1px solid var(--line)' }}
            >
              {[
                { n: '8+', l: 'Breeds & species' },
                { n: 'NPIP', l: '100% health documented' },
                { n: '80%', l: 'Egg fertility guarantee' },
              ].map(({ n, l }) => (
                <div key={l}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: 'var(--forest-deep)', lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-faint)', marginTop: 5, letterSpacing: '0.02em' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Image side */}
        <div className="relative overflow-hidden" style={{ background: 'var(--sand-deep)', minHeight: 500 }}>
          <Image
            src="/farm/chick-hero.jpg"
            alt="A hand-raised chick at Evergreen Hollow Farm"
            fill
            className="object-cover"
            style={{ objectPosition: 'center 38%' }}
            priority
            sizes="50vw"
          />
          <div
            className="absolute left-6 bottom-6 flex items-center gap-2 rounded-full px-4 py-2"
            style={{
              background: 'rgba(252,249,242,.9)',
              backdropFilter: 'blur(6px)',
              fontSize: 12,
              color: 'var(--forest-deep)',
              fontWeight: 500,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Heart size={14} fill="true" style={{ color: 'var(--gold)' }} />
            Raised gentle, handled daily
          </div>
        </div>

        {/* Mobile layout override */}
        <style>{`
          @media (max-width: 880px) {
            .hero-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ─── TRUST STRIP ──────────────────────────────────── */}
      <section style={{ background: 'var(--forest)', color: 'var(--cream)' }}>
        <div
          className="max-w-[1240px] mx-auto px-10 py-[22px] flex flex-wrap justify-between gap-6"
        >
          {TRUST_ITEMS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-[11px]" style={{ fontSize: 13.5, color: 'rgba(246,240,228,.9)' }}>
              <Icon size={19} style={{ color: 'var(--gold-soft)', flexShrink: 0 }} />
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* ─── WHAT WE RAISE ────────────────────────────────── */}
      <section className="max-w-[1240px] mx-auto px-10" style={{ padding: 'clamp(64px,8vw,118px) 40px' }}>
        <div className="text-center" style={{ maxWidth: 660, margin: '0 auto 52px' }}>
          <span
            className="inline-flex items-center gap-2.5 mb-4 text-[12px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: 'var(--gold)' }}
          >
            <span className="block w-[26px] h-px opacity-60" style={{ background: 'var(--gold)' }} />
            What we raise
          </span>
          <h2
            style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(30px,3.8vw,52px)', color: 'var(--ink)', lineHeight: 1.05, marginTop: 16 }}
          >
            A small farm,{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>thoughtfully</em>{' '}
            stocked
          </h2>
          <p style={{ fontSize: 'clamp(17px,1.5vw,20px)', color: 'var(--ink-soft)', lineHeight: 1.7, marginTop: 18 }}>
            We focus on a handful of species we truly love — and raise each one with the time and attention it deserves.
          </p>
        </div>

        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {CATEGORIES.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className="relative rounded-[var(--r)] overflow-hidden flex items-end cursor-pointer"
              style={{ aspectRatio: '3/3.4', display: 'flex', alignItems: 'flex-end' }}
            >
              <Image
                src={c.photo}
                alt={c.label}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(16,28,21,.86) 4%, rgba(16,28,21,.18) 46%, transparent 70%)' }}
              />
              <div className="relative z-10 p-[22px] text-center w-full flex flex-col items-center gap-1.5" style={{ color: 'var(--cream)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 21, fontWeight: 500, lineHeight: 1.1 }}>{c.label}</div>
                <div style={{ fontSize: 12.5, color: 'rgba(246,240,228,.72)', marginTop: 4 }}>{c.note}</div>
                <span className="mt-2.5 text-[12px] font-semibold tracking-[0.06em] flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--gold-soft)' }}>
                  Browse <ChevronRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── AVAILABLE NOW ────────────────────────────────── */}
      {listings.length > 0 && (
        <section style={{ background: 'var(--cream)', padding: 'clamp(64px,8vw,118px) 0' }}>
          <div className="max-w-[1240px] mx-auto px-10">
            <div className="flex items-end justify-between gap-5 flex-wrap mb-11">
              <div>
                <span
                  className="inline-flex items-center gap-2.5 mb-4 text-[12px] font-semibold uppercase tracking-[0.22em]"
                  style={{ color: 'var(--gold)' }}
                >
                  <span className="block w-[26px] h-px opacity-60" style={{ background: 'var(--gold)' }} />
                  Available now
                </span>
                <h2
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(30px,3.8vw,52px)', color: 'var(--ink)', lineHeight: 1.05, marginTop: 16 }}
                >
                  Ready for their{' '}
                  <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>forever homes</em>
                </h2>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 font-semibold text-[13px] tracking-[0.04em] transition-all hover:-translate-y-0.5 rounded-[var(--r)]"
                style={{ padding: '14px 26px', background: 'transparent', color: 'var(--forest)', border: '1.5px solid var(--line)' }}
              >
                See all available <ChevronRight size={16} />
              </Link>
            </div>

            <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
              {listings.map(l => {
                const photo = BREED_PHOTOS[l.breed?.name ?? ''] ?? FALLBACK_PHOTO
                return (
                  <article
                    key={l.id}
                    className="rounded-[var(--r)] overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
                    style={{ background: 'var(--paper)', border: '1px solid var(--line)', boxShadow: 'var(--shadow-sm)' }}
                  >
                    <div className="relative overflow-hidden" style={{ aspectRatio: '4/3.2', background: 'var(--sand-deep)' }}>
                      <Image
                        src={photo}
                        alt={l.breed?.name ?? 'Bird'}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                      <span
                        className="absolute top-3.5 left-3.5 text-[10.5px] font-bold tracking-[0.1em] uppercase flex items-center gap-1.5 rounded-full px-[11px] py-[5px]"
                        style={{
                          background: 'rgba(94,114,87,.16)',
                          color: '#3c5a3a',
                          backdropFilter: 'blur(4px)',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
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
                      <div
                        className="flex items-center justify-between pt-3.5"
                        style={{ borderTop: '1px solid var(--line)' }}
                      >
                        <Link
                          href="/shop"
                          className="inline-flex items-center gap-1.5 font-semibold text-[13px] tracking-[0.04em]"
                          style={{ color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          View details <ChevronRight size={15} />
                        </Link>
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
          </div>
        </section>
      )}

      {/* ─── FARM STORY SPLIT ─────────────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(155deg,#1B2F23,#16271D 60%,#112017)',
          padding: 'clamp(64px,8vw,118px) 0',
          color: 'var(--cream)',
        }}
      >
        <div className="max-w-[1240px] mx-auto px-10">
          <div
            className="grid items-center"
            style={{ gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px,6vw,84px)' }}
          >
            <div>
              <span
                className="inline-flex items-center gap-2.5 mb-5 text-[12px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: 'var(--gold-soft)' }}
              >
                <span className="block w-[26px] h-px opacity-60" style={{ background: 'var(--gold-soft)' }} />
                Our philosophy
              </span>
              <h2
                style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(30px,3.8vw,52px)', color: 'var(--cream)', lineHeight: 1.05, marginTop: 16, marginBottom: 18 }}
              >
                Raised the{' '}
                <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>right way</em>{' '}
                — start to finish
              </h2>
              <p style={{ fontSize: 'clamp(17px,1.5vw,20px)', color: 'rgba(246,240,228,.74)', lineHeight: 1.7 }}>
                Evergreen Hollow is a family operation built on one belief: animals deserve exceptional care from the moment they hatch to the day they go home. We&apos;re breeders first, deeply invested in every bird in our pens.
              </p>
              <div className="flex flex-wrap gap-[30px] my-8">
                {[
                  { icon: Award, title: 'Documented health', desc: 'Vaccinated & dewormed where appropriate' },
                  { icon: Heart, title: 'Daily handling', desc: 'Calm, people-friendly birds' },
                  { icon: Shield, title: '7-day guarantee', desc: 'On pre-existing conditions' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-3 items-start" style={{ maxWidth: 200 }}>
                    <Icon size={22} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--cream)' }}>{title}</div>
                      <div style={{ fontSize: 12.5, color: 'rgba(246,240,228,.6)', marginTop: 2 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 font-semibold rounded-[var(--r)] transition-all hover:-translate-y-0.5"
                style={{ fontSize: 13, letterSpacing: '0.04em', padding: '14px 26px', background: 'var(--gold)', color: '#fff', border: '1.5px solid transparent' }}
              >
                Read our story <ChevronRight size={16} />
              </Link>
            </div>

            {/* Story collage */}
            <div
              className="grid gap-3.5"
              style={{ gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', aspectRatio: '1/1.04' }}
            >
              <div className="row-span-2 relative rounded-[var(--r)] overflow-hidden">
                <Image src="/farm/game-rooster-grey.jpg" alt="Grey game cock" fill className="object-cover" sizes="25vw" />
              </div>
              <div className="relative rounded-[var(--r)] overflow-hidden">
                <Image src="/farm/silkies.jpg" alt="Silkie bantams" fill className="object-cover" sizes="25vw" />
              </div>
              <div className="relative rounded-[var(--r)] overflow-hidden">
                <Image src="/farm/chicks-golden-straw.jpg" alt="Golden chicks" fill className="object-cover" sizes="25vw" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── GALLERY STRIP ────────────────────────────────── */}
      <section style={{ background: 'var(--paper)', padding: 'clamp(64px,8vw,118px) 0' }}>
        <div className="max-w-[1240px] mx-auto px-10">
          <div className="flex justify-between items-end flex-wrap gap-5 mb-9">
            <div>
              <span
                className="inline-flex items-center gap-2.5 mb-4 text-[12px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: 'var(--gold)' }}
              >
                <span className="block w-[26px] h-px opacity-60" style={{ background: 'var(--gold)' }} />
                From the farm
              </span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(30px,3.8vw,52px)', color: 'var(--ink)', lineHeight: 1.05, marginTop: 16 }}>
                Lately at the{' '}
                <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>hollow</em>
              </h2>
            </div>
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 font-semibold rounded-[var(--r)] transition-all hover:-translate-y-0.5"
              style={{ fontSize: 13, letterSpacing: '0.04em', padding: '14px 26px', background: 'transparent', color: 'var(--forest)', border: '1.5px solid var(--line)' }}
            >
              Meet our birds <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
            {GALLERY_PHOTOS.map((src, i) => (
              <div key={i} className="relative rounded-[var(--r)] overflow-hidden" style={{ aspectRatio: '1', background: 'var(--sand-deep)' }}>
                <Image
                  src={src}
                  alt="Farm photo"
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 33vw, 16vw"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────── */}
      <section style={{ background: 'var(--cream)', padding: 'clamp(64px,8vw,118px) 0' }}>
        <div className="max-w-[1240px] mx-auto px-10">
          <div className="text-center mb-12" style={{ maxWidth: 660, margin: '0 auto 48px' }}>
            <span
              className="inline-flex items-center gap-2.5 mb-4 text-[12px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: 'var(--gold)' }}
            >
              <span className="block w-[26px] h-px opacity-60" style={{ background: 'var(--gold)' }} />
              Kind words
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(30px,3.8vw,52px)', color: 'var(--ink)', lineHeight: 1.05, marginTop: 16 }}>
              Trusted by families{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>across the South</em>
            </h2>
          </div>
          <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-[var(--r)] p-[30px] relative"
                style={{ background: 'var(--paper)', border: '1px solid var(--line)' }}
              >
                <div style={{ color: 'var(--gold)', fontSize: 15, letterSpacing: 2 }}>★★★★★</div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 17, lineHeight: 1.55, color: 'var(--ink)', margin: '16px 0 20px', fontStyle: 'italic' }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid var(--line)' }}>
                  <div
                    className="flex items-center justify-center rounded-full flex-shrink-0"
                    style={{
                      width: 40, height: 40,
                      background: 'var(--forest)',
                      color: 'var(--gold-soft)',
                      fontFamily: 'var(--font-display)',
                      fontSize: 16,
                    }}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--forest-deep)' }}>{t.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--ink-faint)' }}>{t.loc} · {t.animal}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── POLICY ───────────────────────────────────────── */}
      <section style={{ background: 'var(--cream)', padding: 'clamp(64px,8vw,118px) 0' }}>
        <div className="max-w-[1240px] mx-auto px-10">
          <div
            className="overflow-hidden rounded-[10px]"
            style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr' }}
          >
            <div style={{ padding: 'clamp(38px,5vw,60px)', background: 'var(--forest-deep)', color: 'var(--cream)' }}>
              <span
                className="inline-flex items-center gap-2 mb-4 text-[12px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: 'var(--gold-soft)' }}
              >
                <Shield size={15} /> Trust & Responsibility
              </span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(26px,3vw,40px)', color: 'var(--cream)', lineHeight: 1.05, margin: '16px 0 14px' }}>
                Responsible Animal Sales & Hatching Policy
              </h2>
              <p style={{ fontSize: 'clamp(17px,1.5vw,20px)', color: 'rgba(246,240,228,.74)', lineHeight: 1.7 }}>
                We care deeply about where our animals go and that every sale is done the right way — legally, ethically, and with the bird&apos;s welfare first.
              </p>
              <p style={{ fontSize: 12.5, color: 'rgba(246,240,228,.5)', marginTop: 26, fontStyle: 'italic', lineHeight: 1.6 }}>
                This section is provided for general information only and is not legal advice. Please consult your local authorities about the rules that apply to you.
              </p>
            </div>
            <div style={{ padding: 'clamp(38px,5vw,60px)', background: 'var(--forest)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <ul className="flex flex-col gap-[18px] mt-2">
                {POLICY_ITEMS.map((item) => (
                  <li key={item} className="flex gap-3.5 items-start" style={{ color: 'rgba(246,240,228,.86)', fontSize: 14.5, lineHeight: 1.55 }}>
                    <Check size={20} style={{ color: 'var(--gold-soft)', flexShrink: 0, marginTop: 2 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────── */}
      <section style={{ background: 'var(--paper)', padding: 'clamp(64px,8vw,118px) 0' }}>
        <div className="max-w-[1240px] mx-auto px-10">
          <div className="grid gap-12 items-start" style={{ gridTemplateColumns: '1fr 1.4fr' }}>
            <div style={{ position: 'sticky', top: 130 }}>
              <span
                className="inline-flex items-center gap-2.5 mb-4 text-[12px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: 'var(--gold)' }}
              >
                <span className="block w-[26px] h-px opacity-60" style={{ background: 'var(--gold)' }} />
                Common questions
              </span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(30px,3.8vw,52px)', color: 'var(--ink)', lineHeight: 1.05, marginTop: 16, marginBottom: 18 }}>
                Things people often{' '}
                <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>wonder about</em>
              </h2>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, fontSize: 15 }}>
                Don&apos;t see your question? Chat with Clover (the 🌿 button) or send us a message.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 font-semibold rounded-[var(--r)] transition-all hover:-translate-y-0.5"
                style={{ fontSize: 13, letterSpacing: '0.04em', padding: '14px 26px', background: 'var(--forest)', color: 'var(--cream)', border: '1.5px solid transparent' }}
              >
                Ask us directly <ChevronRight size={16} />
              </Link>
            </div>
            <div style={{ borderTop: '1px solid var(--line)' }}>
              {FAQ.map((item) => (
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
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ───────────────────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(155deg,#1B2F23,#16271D 60%,#112017)',
          padding: 'clamp(64px,8vw,118px) 0',
          color: 'var(--cream)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="max-w-[720px] mx-auto px-10 text-center" style={{ position: 'relative', zIndex: 2 }}>
          <span
            className="inline-flex items-center gap-2.5 mb-5 text-[12px] font-semibold uppercase tracking-[0.22em] justify-center"
            style={{ color: 'var(--gold-soft)' }}
          >
            <span className="block w-[26px] h-px opacity-60" style={{ background: 'var(--gold-soft)' }} />
            Limited availability
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(30px,3.8vw,52px)', color: 'var(--cream)', lineHeight: 1.05, margin: '18px 0 16px' }}>
            Ready to find your{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>perfect bird?</em>
          </h2>
          <p style={{ fontSize: 'clamp(17px,1.5vw,20px)', color: 'rgba(246,240,228,.74)', lineHeight: 1.7, marginBottom: 32 }}>
            Browse what&apos;s available now, or contact us and meet the flock. Every animal leaves with full health records and our personal guarantee.
          </p>
          <div className="flex justify-center gap-3.5 flex-wrap">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 font-semibold rounded-[var(--r)] transition-all hover:-translate-y-0.5"
              style={{ fontSize: 13, letterSpacing: '0.04em', padding: '14px 26px', background: 'var(--gold)', color: '#fff', border: '1.5px solid transparent' }}
            >
              <Calendar size={16} /> View Available Birds
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 font-semibold rounded-[var(--r)] transition-all hover:-translate-y-0.5"
              style={{ fontSize: 13, letterSpacing: '0.04em', padding: '14px 26px', background: 'rgba(246,240,228,.1)', color: 'var(--cream)', border: '1.5px solid rgba(246,240,228,.35)' }}
            >
              Contact Us <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
