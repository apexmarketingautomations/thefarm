import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

const AGE_LABELS: Record<string, string> = {
  HATCHING_EGG: '🥚 Hatching Egg',
  DAY_OLD_CHICK: '🐣 Day-Old Chick',
  STARTED_PULLET: '🐤 Started Pullet',
  JUVENILE: '🐓 Juvenile',
  ADULT: '🦴 Adult',
  BREEDING_PAIR: '💑 Breeding Pair',
  BREEDING_TRIO: '👨‍👩‍👧 Breeding Trio',
}

export default async function ListingsPage() {
  const session = await getServerSession()
  if (!session?.user) redirect('/login')

  const member = await prisma.orgMember.findFirst({
    where: { user: { email: session.user.email! } },
  })
  if (!member) redirect('/login')

  const listings = await prisma.listing.findMany({
    where: { orgId: member.orgId },
    orderBy: { createdAt: 'desc' },
    include: { breed: { select: { name: true } }, _count: { select: { saleItems: true } } },
  })

  const active = listings.filter(l => l.status === 'ACTIVE')
  const other = listings.filter(l => l.status !== 'ACTIVE')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2d5028]">For Sale Listings</h1>
          <p className="text-sm text-[#7a5c3a]">{active.length} active listings</p>
        </div>
        <Link href="/listings/new"
          className="px-4 py-2 bg-[#3d6b35] text-white rounded-lg text-sm font-medium hover:bg-[#2d5028] transition-colors">
          + New Listing
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {active.map(listing => (
          <div key={listing.id} className="bg-white border border-[#e8dcc8] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-[#f5e6c8] px-4 py-2 flex items-center justify-between">
              <span className="text-xs font-medium text-[#5c3d1e]">{AGE_LABELS[listing.ageType] ?? listing.ageType}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">Active</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-[#2d5028]">{listing.title}</h3>
              {listing.breed && <p className="text-sm text-gray-500">{listing.breed.name}</p>}
              {listing.description && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{listing.description}</p>}
              <div className="flex items-center justify-between mt-3">
                <div>
                  <span className="text-xl font-bold text-[#c17c2a]">${listing.priceEach}</span>
                  <span className="text-xs text-gray-400 ml-1">each</span>
                </div>
                <span className="text-sm text-gray-500">{listing.quantityAvail} avail</span>
              </div>
              <div className="flex gap-2 mt-3 text-xs text-gray-500">
                {listing.localPickup && <span>📍 Local pickup</span>}
                {listing.shipsTo.length > 0 && <span>📦 Ships</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {other.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-[#5c3d1e] mb-3">Inactive Listings</h2>
          <div className="bg-white rounded-xl border border-[#e8dcc8] divide-y divide-gray-50">
            {other.map(l => (
              <div key={l.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">{l.title}</p>
                  <p className="text-xs text-gray-400">{l.breed?.name} · {AGE_LABELS[l.ageType]}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-700">${l.priceEach}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    l.status === 'SOLD_OUT' ? 'bg-red-100 text-red-700' :
                    l.status === 'PAUSED' ? 'bg-gray-100 text-gray-600' :
                    'bg-gray-100 text-gray-500'
                  }`}>{l.status.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {listings.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-[#e8dcc8]">
          <p className="text-4xl mb-4">🏷️</p>
          <p className="text-lg font-medium text-gray-700">No listings yet</p>
          <p className="text-sm text-gray-400 mb-4">Create your first listing to start selling</p>
          <Link href="/listings/new" className="px-4 py-2 bg-[#3d6b35] text-white rounded-lg text-sm font-medium">
            Create Listing
          </Link>
        </div>
      )}
    </div>
  )
}
