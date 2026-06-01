import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

const TYPE_STYLE: Record<string, string> = {
  VACCINATION: 'bg-blue-100 text-blue-700',
  TREATMENT: 'bg-orange-100 text-orange-700',
  OBSERVATION: 'bg-gray-100 text-gray-600',
  INJURY: 'bg-yellow-100 text-yellow-700',
  ILLNESS: 'bg-red-100 text-red-700',
  DEATH: 'bg-gray-200 text-gray-700',
  CHECKUP: 'bg-green-100 text-green-700',
}

export default async function HealthPage() {
  const session = await getServerSession()
  if (!session?.user) redirect('/login')

  const member = await prisma.orgMember.findFirst({
    where: { user: { email: session.user.email! } },
  })
  if (!member) redirect('/login')

  const records = await prisma.healthRecord.findMany({
    where: { orgId: member.orgId },
    orderBy: { date: 'desc' },
    include: { bird: { select: { name: true, bandNumber: true, breed: { select: { name: true } } } } },
    take: 50,
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2d5028]">Health Records</h1>
          <p className="text-sm text-[#7a5c3a]">{records.length} records</p>
        </div>
        <Link href="/health/new"
          className="px-4 py-2 bg-[#3d6b35] text-white rounded-lg text-sm font-medium hover:bg-[#2d5028] transition-colors">
          + Add Record
        </Link>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-[#e8dcc8]">
          <p className="text-4xl mb-4">🩺</p>
          <p className="text-lg font-medium text-gray-700">No health records yet</p>
          <p className="text-sm text-gray-400 mb-4">Track vaccinations, treatments, and observations here</p>
          <Link href="/health/new" className="px-4 py-2 bg-[#3d6b35] text-white rounded-lg text-sm font-medium">
            Add First Record
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e8dcc8] overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-[#faf7f2] border-b border-[#e8dcc8]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5c3d1e]">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5c3d1e]">Bird</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5c3d1e]">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5c3d1e]">Description</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#5c3d1e]">Cost</th>
              </tr>
            </thead>
            <tbody>
              {records.map(r => (
                <tr key={r.id} className="border-b border-gray-50 hover:bg-[#faf7f2]">
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">
                    {r.bird.name ?? r.bird.bandNumber ?? 'Unknown'}
                    {r.bird.breed && <span className="text-gray-400 text-xs ml-1">({r.bird.breed.name})</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_STYLE[r.type] ?? 'bg-gray-100 text-gray-500'}`}>
                      {r.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{r.description}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{r.cost ? `$${r.cost.toFixed(2)}` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
