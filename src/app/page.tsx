import Link from 'next/link'
import PublicLayout from '@/components/public-layout'
import { prisma } from '@/lib/prisma'

async function getBreeds() {
  try {
    return await prisma.breed.findMany({ orderBy: { name: 'asc' }, take: 6 })
  } catch { return [] }
}

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

const SPECIES_ICON: Record<string, string> = {
  CHICKEN: '🐔',
  DUCK: '🦆',
  GOOSE: '🪿',
  TURKEY: '🦃',
  GUINEA_FOWL: '🐦',
  OTHER: '🐦',
}

export default async function HomePage() {
  const [breeds, listings] = await Promise.all([getBreeds(), getActiveListings()])

  return (
    <PublicLayout>
      {/* Hero */}
      <section
        className="relative py-24 px-4 text-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--farm-green-dark) 0%, var(--farm-green) 60%, #4e8a44 100%)' }}
      >
        <div className="relative max-w-3xl mx-auto">
          <span className="inline-block bg-white/10 text-green-200 text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
            NPIP Certified · Pasture Raised · Antibiotic Free
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
            Heritage Poultry &<br />Ornamental Waterfowl
          </h1>
          <p className="text-green-100 text-lg md:text-xl mb-8 leading-relaxed">
            Rare and heritage breeds raised with care on our family farm. Silkies, Wyandottes, Mandarins, Sebastopols, and more — hatching eggs, chicks, and breeding pairs.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/shop"
              style={{ backgroundColor: 'var(--farm-amber)' }}
              className="text-white font-bold px-8 py-3.5 rounded-xl hover:brightness-110 transition text-base shadow-lg"
            >
              Shop Available Birds
            </Link>
            <Link
              href="/about"
              className="bg-white/15 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/25 transition text-base border border-white/20"
            >
              Meet Our Breeds
            </Link>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section style={{ backgroundColor: 'var(--farm-straw)' }} className="border-y border-amber-200">
        <div className="max-w-5xl mx-auto px-4 py-5 flex flex-wrap justify-center gap-6 md:gap-12 text-sm font-medium" style={{ color: 'var(--farm-brown)' }}>
          <span className="flex items-center gap-2">✅ NPIP Certified</span>
          <span className="flex items-center gap-2">🌿 No Antibiotics</span>
          <span className="flex items-center gap-2">🚚 Ships Nationwide</span>
          <span className="flex items-center gap-2">🥚 Hatching Eggs Available</span>
          <span className="flex items-center gap-2">🏆 Show-Quality Genetics</span>
        </div>
      </section>

      {/* Featured Breeds */}
      {breeds.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--farm-green-dark)' }}>Our Breeds</h2>
            <p className="text-gray-500">Heritage genetics, exceptional quality</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {breeds.map(b => (
              <div
                key={b.id}
                className="rounded-2xl p-5 border hover:shadow-md transition-shadow"
                style={{ backgroundColor: 'var(--farm-cream)', borderColor: '#e8dfc8' }}
              >
                <div className="text-3xl mb-2">{SPECIES_ICON[b.species] ?? '🐦'}</div>
                <p className="font-bold text-base" style={{ color: 'var(--farm-green-dark)' }}>{b.name}</p>
                <p className="text-xs text-gray-500 capitalize mt-0.5">{b.species.replace('_', ' ').toLowerCase()}</p>
                {b.description && (
                  <p className="text-sm text-gray-600 mt-2 leading-snug line-clamp-2">{b.description}</p>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/about" className="text-sm font-semibold hover:underline" style={{ color: 'var(--farm-green)' }}>
              Learn about all our breeds →
            </Link>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section style={{ backgroundColor: 'var(--farm-straw)' }} className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10" style={{ color: 'var(--farm-green-dark)' }}>How to Order</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🔍', step: '1. Browse', desc: 'Explore available birds, hatching eggs, and breeding pairs in our shop.' },
              { icon: '💬', step: '2. Inquire', desc: 'Contact us or chat with Clover — our AI farm assistant — to confirm availability and reserve your birds.' },
              { icon: '🚚', step: '3. Ship or Pick Up', desc: 'Hatching eggs ship USPS Priority Mail nationwide. Live birds by local pickup or arrangement.' },
            ].map(item => (
              <div key={item.step} className="text-center p-6 rounded-2xl bg-white shadow-sm border border-amber-100">
                <div className="text-4xl mb-3">{item.icon}</div>
                <p className="font-bold text-base mb-2" style={{ color: 'var(--farm-green-dark)' }}>{item.step}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Available Now */}
      {listings.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold" style={{ color: 'var(--farm-green-dark)' }}>Available Now</h2>
              <p className="text-gray-500 text-sm mt-1">Fresh from the hatchery</p>
            </div>
            <Link href="/shop" className="text-sm font-semibold hover:underline" style={{ color: 'var(--farm-green)' }}>
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {listings.map(l => (
              <div
                key={l.id}
                className="rounded-2xl border overflow-hidden hover:shadow-lg transition-shadow"
                style={{ backgroundColor: 'var(--farm-cream)', borderColor: '#e8dfc8' }}
              >
                <div
                  className="h-32 flex items-center justify-center text-5xl"
                  style={{ backgroundColor: 'var(--farm-straw)' }}
                >
                  {SPECIES_ICON[l.breed?.species ?? ''] ?? '🐦'}
                </div>
                <div className="p-4">
                  <p className="font-bold text-sm" style={{ color: 'var(--farm-green-dark)' }}>{l.breed?.name ?? 'Bird'}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{AGE_LABEL[l.ageType] ?? l.ageType}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-base" style={{ color: 'var(--farm-amber)' }}>
                      ${Number(l.priceEach).toFixed(0)}{l.ageType === 'HATCHING_EGG' ? '/dz' : '/ea'}
                    </span>
                    <span className="text-xs text-gray-400">Qty: {l.quantityAvail}</span>
                  </div>
                  <Link
                    href="/contact"
                    style={{ backgroundColor: 'var(--farm-green)' }}
                    className="block text-center text-white text-xs font-semibold py-2 rounded-lg mt-3 hover:brightness-110 transition"
                  >
                    Inquire
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty state placeholder */}
      {listings.length === 0 && breeds.length === 0 && (
        <section className="max-w-4xl mx-auto px-4 py-20 text-center">
          <p className="text-5xl mb-4">🌱</p>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--farm-green-dark)' }}>Season Opening Soon</h2>
          <p className="text-gray-500 mb-6">We are getting the flock ready. Contact us to get on our waitlist.</p>
          <Link href="/contact" style={{ backgroundColor: 'var(--farm-green)' }} className="inline-block text-white font-semibold px-6 py-3 rounded-xl hover:brightness-110 transition">
            Join the Waitlist
          </Link>
        </section>
      )}

      {/* CTA Banner */}
      <section
        className="mx-4 mb-16 rounded-3xl py-12 px-6 text-center"
        style={{ background: 'linear-gradient(135deg, var(--farm-green-dark), var(--farm-green))' }}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to start your flock?</h2>
        <p className="text-green-200 mb-6 text-base">Talk to Clover — our AI farm assistant — or send us a message and we will get back to you within 24 hours.</p>
        <Link
          href="/contact"
          style={{ backgroundColor: 'var(--farm-amber)' }}
          className="inline-block text-white font-bold px-8 py-3.5 rounded-xl hover:brightness-110 transition shadow-lg"
        >
          Get in Touch
        </Link>
      </section>
    </PublicLayout>
  )
}
