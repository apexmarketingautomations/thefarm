import Link from 'next/link'
import PublicLayout from '@/components/public-layout'
import { prisma } from '@/lib/prisma'

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

const SPECIES_ICON: Record<string, string> = {
  CHICKEN: '🐔', DUCK: '🦆', GOOSE: '🪿', TURKEY: '🦃', GUINEA_FOWL: '🐦', OTHER: '🐦',
}

const AGE_BADGE: Record<string, string> = {
  HATCHING_EGG: 'bg-yellow-100 text-yellow-800',
  DAY_OLD_CHICK: 'bg-orange-100 text-orange-800',
  STARTED: 'bg-blue-100 text-blue-800',
  ADULT: 'bg-purple-100 text-purple-800',
  BREEDING_PAIR: 'bg-pink-100 text-pink-800',
  BREEDING_TRIO: 'bg-rose-100 text-rose-800',
}

export default async function ShopPage() {
  const listings = await getListings()

  return (
    <PublicLayout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--farm-green-dark)' }}>Available Birds & Eggs</h1>
          <p className="text-gray-500">All birds are pasture-raised, NPIP-compliant, and antibiotic-free. Prices include care packaging for shipped eggs.</p>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-24 rounded-3xl border-2 border-dashed" style={{ borderColor: '#d4c9a8' }}>
            <p className="text-5xl mb-4">🌱</p>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--farm-green-dark)' }}>Nothing listed yet</h2>
            <p className="text-gray-500 mb-6">New hatches coming soon. Contact us to reserve your birds early.</p>
            <Link href="/contact" style={{ backgroundColor: 'var(--farm-green)' }} className="inline-block text-white font-semibold px-6 py-3 rounded-xl hover:brightness-110 transition">
              Get on the Waitlist
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(l => (
              <div
                key={l.id}
                className="rounded-2xl border overflow-hidden hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                style={{ backgroundColor: 'var(--farm-cream)', borderColor: '#e8dfc8' }}
              >
                <div
                  className="h-40 flex items-center justify-center text-6xl relative"
                  style={{ backgroundColor: 'var(--farm-straw)' }}
                >
                  {SPECIES_ICON[l.breed?.species ?? ''] ?? '🐦'}
                  <span className={`absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 rounded-full ${AGE_BADGE[l.ageType] ?? 'bg-gray-100 text-gray-700'}`}>
                    {AGE_LABEL[l.ageType] ?? l.ageType}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-base" style={{ color: 'var(--farm-green-dark)' }}>{l.breed?.name ?? 'Bird'}</p>
                      <p className="text-xs text-gray-400 capitalize">{(l.breed?.species ?? '').replace('_', ' ').toLowerCase()}</p>
                    </div>
                    <span className="text-xl font-bold" style={{ color: 'var(--farm-amber)' }}>
                      ${Number(l.priceEach).toFixed(0)}
                      <span className="text-xs font-normal text-gray-400">/{l.ageType === 'HATCHING_EGG' ? 'dz' : 'ea'}</span>
                    </span>
                  </div>
                  {l.description && (
                    <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">{l.description}</p>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: '#e8dfc8' }}>
                    <span className="text-sm text-gray-500">{l.quantityAvail} available</span>
                    <Link
                      href={`/contact?bird=${encodeURIComponent(l.breed?.name ?? 'bird')}&type=${encodeURIComponent(AGE_LABEL[l.ageType] ?? l.ageType)}`}
                      style={{ backgroundColor: 'var(--farm-green)' }}
                      className="text-white text-sm font-semibold px-4 py-2 rounded-lg hover:brightness-110 transition"
                    >
                      Inquire →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Shipping info */}
        <div
          className="mt-12 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
          style={{ backgroundColor: 'var(--farm-straw)', border: '1px solid #e8dfc8' }}
        >
          <div>
            <h3 className="font-bold text-base mb-2" style={{ color: 'var(--farm-green-dark)' }}>🥚 Hatching Eggs</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Shipped USPS Priority Mail in specialized packaging. Typical hatch rates 50–80%. Collected fresh, stored properly, and shipped within 7 days of lay.</p>
          </div>
          <div>
            <h3 className="font-bold text-base mb-2" style={{ color: 'var(--farm-green-dark)' }}>🐣 Live Birds</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Day-old chicks ship USPS Priority Mail Express (spring/summer). Started and adult birds prefer local pickup. Interstate movement requires health certificate — we help with this.</p>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
