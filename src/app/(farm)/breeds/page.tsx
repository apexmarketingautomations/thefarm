import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function BreedsPage() {
  const session = await getServerSession()
  if (!session?.user) redirect('/login')

  const member = await prisma.orgMember.findFirst({
    where: { user: { email: session.user.email! } },
  })
  if (!member) redirect('/login')

  const breeds = await prisma.breed.findMany({
    where: { orgId: member.orgId },
    orderBy: [{ species: 'asc' }, { name: 'asc' }],
    include: { _count: { select: { birds: true, listings: true } } },
  })

  const bySpecies = breeds.reduce((acc, b) => {
    const s = b.species
    if (!acc[s]) acc[s] = []
    acc[s].push(b)
    return acc
  }, {} as Record<string, typeof breeds>)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2d5028]">Breeds</h1>
          <p className="text-sm text-[#7a5c3a] mt-0.5">{breeds.length} breeds in the catalog</p>
        </div>
        <Link href="/breeds/new"
          className="px-4 py-2 bg-[#3d6b35] text-white rounded-lg text-sm font-medium hover:bg-[#2d5028] transition-colors">
          + Add Breed
        </Link>
      </div>

      {Object.entries(bySpecies).map(([species, items]) => (
        <div key={species} className="mb-8">
          <h2 className="text-lg font-semibold text-[#5c3d1e] mb-3 capitalize">
            {species === 'CHICKEN' ? '🐓' : species === 'DUCK' ? '🦆' : species === 'GOOSE' ? '🪿' : '🐦'} {species.replace('_', ' ')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(breed => (
              <div key={breed.id} className="bg-white border border-[#e8dcc8] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-[#2d5028]">{breed.name}</h3>
                    {breed.isRare && <span className="text-xs text-amber-600 font-medium">✨ Rare breed</span>}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    breed.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>{breed.isAvailable ? 'Available' : 'Unavailable'}</span>
                </div>
                {breed.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{breed.description}</p>
                )}
                <div className="flex gap-4 mt-3 text-xs text-gray-500">
                  <span>{breed._count.birds} birds</span>
                  <span>{breed._count.listings} listings</span>
                  {breed.eggColor && <span>Eggs: {breed.eggColor}</span>}
                </div>
                <Link href={`/breeds/${breed.id}`}
                  className="mt-3 block text-center text-sm text-[#3d6b35] font-medium hover:underline">
                  View details →
                </Link>
              </div>
            ))}
          </div>
        </div>
      ))}

      {breeds.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-[#e8dcc8]">
          <p className="text-4xl mb-4">🐣</p>
          <p className="text-lg font-medium text-gray-700">No breeds yet</p>
          <p className="text-sm text-gray-400 mb-4">Start by adding the breeds you raise</p>
          <Link href="/breeds/new" className="px-4 py-2 bg-[#3d6b35] text-white rounded-lg text-sm font-medium">
            Add First Breed
          </Link>
        </div>
      )}
    </div>
  )
}
