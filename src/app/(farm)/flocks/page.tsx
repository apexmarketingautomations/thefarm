import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function FlocksPage() {
  const session = await getServerSession()
  if (!session?.user) redirect('/login')

  const member = await prisma.orgMember.findFirst({
    where: { user: { email: session.user.email! } },
  })
  if (!member) redirect('/login')

  const flocks = await prisma.flock.findMany({
    where: { orgId: member.orgId },
    orderBy: { name: 'asc' },
    include: { _count: { select: { birds: true } } },
  })

  const birds = await prisma.bird.findMany({
    where: { orgId: member.orgId, status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' },
    include: { breed: { select: { name: true, species: true } }, flock: { select: { name: true } } },
    take: 50,
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2d5028]">Flocks &amp; Birds</h1>
          <p className="text-sm text-[#7a5c3a]">{birds.length} active birds across {flocks.length} flocks</p>
        </div>
        <div className="flex gap-2">
          <Link href="/flocks/new-flock"
            className="px-4 py-2 bg-[#f5e6c8] text-[#5c3d1e] rounded-lg text-sm font-medium hover:bg-[#ebd5a8] transition-colors">
            + New Flock
          </Link>
          <Link href="/flocks/new"
            className="px-4 py-2 bg-[#3d6b35] text-white rounded-lg text-sm font-medium hover:bg-[#2d5028] transition-colors">
            + Add Bird
          </Link>
        </div>
      </div>

      {flocks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {flocks.map(flock => (
            <div key={flock.id} className="bg-white border border-[#e8dcc8] rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-[#2d5028]">{flock.name}</h3>
              {flock.location && <p className="text-xs text-gray-400 mt-0.5">📍 {flock.location}</p>}
              <p className="text-sm text-gray-600 mt-2">{flock._count.birds} birds · {flock.purpose.toLowerCase()}</p>
            </div>
          ))}
        </div>
      )}

      {birds.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-[#e8dcc8]">
          <p className="text-4xl mb-4">🐓</p>
          <p className="text-lg font-medium text-gray-700">No birds yet</p>
          <p className="text-sm text-gray-400 mb-4">Start adding your flock members</p>
          <Link href="/flocks/new" className="px-4 py-2 bg-[#3d6b35] text-white rounded-lg text-sm font-medium">
            Add First Bird
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e8dcc8] overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-[#faf7f2] border-b border-[#e8dcc8]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5c3d1e]">Name / Band</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5c3d1e]">Breed</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5c3d1e]">Flock</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-[#5c3d1e]">Sex</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-[#5c3d1e]">Status</th>
              </tr>
            </thead>
            <tbody>
              {birds.map(bird => (
                <tr key={bird.id} className="border-b border-gray-50 hover:bg-[#faf7f2]">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">
                    {bird.name ?? bird.bandNumber ?? <span className="text-gray-400 italic">Unnamed</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{bird.breed?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{bird.flock?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-center text-xs text-gray-500">
                    {bird.sex === 'MALE' ? '♂' : bird.sex === 'FEMALE' ? '♀' : '?'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      bird.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                      bird.status === 'FOR_SALE' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>{bird.status.replace('_', ' ')}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
