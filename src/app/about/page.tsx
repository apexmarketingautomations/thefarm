import Image from 'next/image'
import Link from 'next/link'
import PublicLayout from '@/components/public-layout'
import { ChevronRight, Award, Check, Shield } from 'lucide-react'

const BREEDS = [
  {
    name: 'Silkie',
    species: 'Exotic Chicken',
    photo: '/farm/silkies.jpg',
    description: 'The most docile chicken breed in the world. Known for their fluffy, silk-like plumage, black skin and bones, five toes, and exceptional mothering instincts. Perfect for families and therapy animals.',
    tags: ['Family Friendly', 'Broody', 'Bantam', 'Show Quality'],
    price: 'From $85/ea',
  },
  {
    name: 'Black Silkie',
    species: 'Exotic Chicken',
    photo: '/farm/black-pair-show.jpg',
    description: 'Same calm, gentle temperament as the white Silkie with stunning jet-black plumage. Highly sought after and limited in availability. Exceptional as mothers, pets, and show birds.',
    tags: ['Rare', 'Show Quality', 'Bantam', 'Limited'],
    price: 'From $95/ea',
  },
  {
    name: 'Silver Laced Wyandotte',
    species: 'Heritage Chicken',
    photo: '/farm/hens-laced-straw.jpg',
    description: 'A quintessential American heritage breed with breathtaking silver and black laced feathers. Cold-hardy, excellent brown egg layer (~200/year), and a wonderful dual-purpose farm bird.',
    tags: ['Heritage', 'Egg Layer', 'Cold Hardy', 'Large Fowl'],
    price: 'From $35/ea',
  },
  {
    name: "Mille Fleur d'Uccle",
    species: 'Bantam Chicken',
    photo: '/farm/chicks-golden-straw.jpg',
    description: 'Belgian Bearded d\'Uccle with feathered feet and a gorgeous "thousand flowers" tri-color pattern. One of the friendliest bantam breeds — excellent pets and show birds.',
    tags: ['Bantam', 'Show Quality', 'Pet Friendly', 'Feathered Feet'],
    price: 'From $40/ea',
  },
  {
    name: 'Black Java',
    species: 'Heritage Chicken',
    photo: '/farm/black-rooster-show.jpg',
    description: "One of America's oldest heritage breeds, listed on the Livestock Conservancy's threatened list. Large fowl with excellent foraging ability and steady brown egg production.",
    tags: ['Heritage', 'Conservation', 'Large Fowl', 'Rare'],
    price: 'From $45/ea',
  },
  {
    name: 'Embden Goose',
    species: 'Ornamental Goose',
    photo: '/farm/white-goose.jpg',
    description: 'Large, regal white geese known for their loyal personalities and impressive size. Excellent guardians for homesteads, devoted parents, and stunning to look at.',
    tags: ['Guardian', 'Large', 'White', 'Homestead'],
    price: 'From $65/ea',
  },
  {
    name: 'Sebastopol Goose',
    species: 'Ornamental Goose',
    photo: '/farm/white-goose.jpg',
    description: 'The most ornamental goose breed in existence. Uniquely curled and frizzled feathers give them an ethereal, almost fairy-tale appearance. Gentle temperament, show-stopping looks.',
    tags: ['Ornamental', 'Show Quality', 'Rare', 'Gentle'],
    price: 'From $120/ea',
  },
  {
    name: 'Mandarin Duck',
    species: 'Exotic Waterfowl',
    photo: '/farm/mandarin-duck.jpg',
    description: 'Widely considered among the most beautiful birds in the world. Brilliantly colored males with extraordinary plumage. Regulated under the MBTA — we guide buyers through the permit process.',
    tags: ['Ornamental', 'Rare', 'Regulated', "World's Most Beautiful"],
    price: 'From $650/pair',
  },
]

const STANDARDS = [
  { icon: Award, title: 'NPIP Certified', desc: 'Required for interstate shipping. Our flock is tested, documented, and clean.' },
  { icon: Check, title: 'No Antibiotics — Ever', desc: 'Non-medicated feed, fresh pasture, and clean water — always.' },
  { icon: Shield, title: 'Show-Quality Genetics', desc: 'Selected for breed conformance, health, and temperament, not quantity.' },
  { icon: Check, title: 'Handled from Hatch', desc: 'Daily human contact from day one makes our birds exceptionally tame.' },
]

export default function AboutPage() {
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
            Our Flock
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
            Meet the{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Breeds</em>
          </h1>
          <p style={{ fontSize: 'clamp(17px,1.5vw,20px)', color: 'rgba(246,240,228,.74)', lineHeight: 1.7, maxWidth: 560 }}>
            Eight rare and heritage breeds raised with passion, patience, and decades of knowledge on our family farm in Central Florida.
          </p>
        </div>
      </div>

      {/* Farm story */}
      <section style={{ background: 'var(--paper)', padding: 'clamp(64px,8vw,118px) 0' }}>
        <div className="max-w-[1240px] mx-auto px-10">
          <div
            className="grid items-center"
            style={{ gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px,6vw,84px)' }}
          >
            <div>
              <span
                className="inline-flex items-center gap-2.5 mb-4 text-[12px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: 'var(--gold)' }}
              >
                <span className="block w-[26px] h-px opacity-60" style={{ background: 'var(--gold)' }} />
                Our story
              </span>
              <h2
                style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(30px,3.8vw,52px)', color: 'var(--ink)', lineHeight: 1.05, marginTop: 16, marginBottom: 18 }}
              >
                A small farm,{' '}
                <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>exceptional</em>{' '}
                birds
              </h2>
              <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 16 }}>
                Evergreen Hollow Farm is a small, dedicated heritage poultry and waterfowl operation. We believe rare breeds deserve exceptional care — not factory conditions. Every bird here is pasture-raised, antibiotic-free, and handled with intention.
              </p>
              <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 24 }}>
                We specialize in breeds that are hard to find, high in quality, and meaningful to preserve. Each species has been carefully selected for temperament, breed conformance, and genetic health.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 font-semibold rounded-[var(--r)] transition-all hover:-translate-y-0.5"
                style={{ fontSize: 13, letterSpacing: '0.04em', padding: '14px 26px', background: 'var(--forest)', color: 'var(--cream)', border: '1.5px solid transparent' }}
              >
                Shop Available Birds <ChevronRight size={16} />
              </Link>
            </div>

            {/* Standards grid */}
            <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
              {STANDARDS.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-[var(--r)] p-5"
                  style={{ background: 'var(--cream)', border: '1px solid var(--line)' }}
                >
                  <Icon size={22} style={{ color: 'var(--gold)', marginBottom: 10 }} />
                  <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--forest-deep)', marginBottom: 4 }}>{title}</p>
                  <p style={{ fontSize: 12.5, color: 'var(--ink-faint)', lineHeight: 1.55 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Breeds grid */}
      <section style={{ background: 'var(--cream)', padding: 'clamp(64px,8vw,118px) 0' }}>
        <div className="max-w-[1240px] mx-auto px-10">
          <div className="text-center mb-12" style={{ maxWidth: 660, margin: '0 auto 52px' }}>
            <span
              className="inline-flex items-center gap-2.5 mb-4 text-[12px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: 'var(--gold)' }}
            >
              <span className="block w-[26px] h-px opacity-60" style={{ background: 'var(--gold)' }} />
              What we raise
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(30px,3.8vw,52px)', color: 'var(--ink)', lineHeight: 1.05, marginTop: 16 }}>
              Eight{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>remarkable</em>{' '}
              breeds
            </h2>
          </div>

          <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))' }}>
            {BREEDS.map(b => (
              <article
                key={b.name}
                className="rounded-[var(--r)] overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
                style={{ background: 'var(--paper)', border: '1px solid var(--line)', cursor: 'pointer' }}
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: '4/3.2', background: 'var(--sand-deep)' }}>
                  <Image
                    src={b.photo}
                    alt={b.name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    loading="lazy"
                  />
                </div>
                <div style={{ padding: '22px 24px 24px' }}>
                  <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-faint)', fontWeight: 600 }}>
                    {b.species}
                  </div>
                  <div className="flex justify-between items-baseline gap-3 mt-2 mb-3">
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 23, fontWeight: 500, color: 'var(--forest-deep)', lineHeight: 1.1 }}>
                      {b.name}
                    </h3>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--ink-soft)', whiteSpace: 'nowrap' }}>
                      {b.price}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.65, marginBottom: 16 }} className="line-clamp-3">
                    {b.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {b.tags.map(t => (
                      <span
                        key={t}
                        className="text-[12px] font-medium rounded-full px-3 py-1.5"
                        style={{ background: 'var(--sand)', color: 'var(--brown)' }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14 }}>
                    <Link
                      href={`/contact?bird=${encodeURIComponent(b.name)}`}
                      className="inline-flex items-center gap-1.5 font-semibold text-[13px] tracking-[0.04em]"
                      style={{ color: 'var(--gold)' }}
                    >
                      Request availability <ChevronRight size={15} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Mandarin duck legal note */}
      <section style={{ background: 'var(--paper)', padding: 'clamp(48px,6vw,84px) 0' }}>
        <div className="max-w-[1240px] mx-auto px-10">
          <div
            className="rounded-[var(--r)] p-8"
            style={{ background: 'var(--cream)', borderLeft: '4px solid var(--gold)', border: '1px solid var(--line)', borderLeftWidth: 4, borderLeftColor: 'var(--gold)' }}
          >
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500, color: 'var(--forest-deep)', marginBottom: 10 }}>
              A Note on Mandarin Ducks
            </h3>
            <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.7 }}>
              Mandarin Ducks are regulated under the Migratory Bird Treaty Act (MBTA) as migratory waterfowl. They are legal to own in most U.S. states with the appropriate permit. We work with buyers to understand their state&apos;s requirements and guide them through the process. Don&apos;t let the paperwork scare you — we&apos;ve done this many times and make it straightforward.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          background: 'linear-gradient(155deg,#1B2F23,#16271D 60%,#112017)',
          padding: 'clamp(64px,8vw,118px) 0',
          color: 'var(--cream)',
        }}
      >
        <div className="max-w-[720px] mx-auto px-10 text-center">
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(30px,3.8vw,52px)', color: 'var(--cream)', lineHeight: 1.05, marginBottom: 16 }}>
            Ready to start your{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>flock?</em>
          </h2>
          <p style={{ fontSize: 'clamp(17px,1.5vw,20px)', color: 'rgba(246,240,228,.74)', lineHeight: 1.7, marginBottom: 32 }}>
            Browse what&apos;s available now, or chat with Clover — our AI farm assistant — for instant answers.
          </p>
          <div className="flex justify-center gap-3.5 flex-wrap">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 font-semibold rounded-[var(--r)] transition-all hover:-translate-y-0.5"
              style={{ fontSize: 13, letterSpacing: '0.04em', padding: '14px 26px', background: 'var(--gold)', color: '#fff', border: '1.5px solid transparent' }}
            >
              Shop Available Birds <ChevronRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 font-semibold rounded-[var(--r)] transition-all hover:-translate-y-0.5"
              style={{ fontSize: 13, letterSpacing: '0.04em', padding: '14px 26px', background: 'rgba(246,240,228,.1)', color: 'var(--cream)', border: '1.5px solid rgba(246,240,228,.35)' }}
            >
              Ask a Question <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
