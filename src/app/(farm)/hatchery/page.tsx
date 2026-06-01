import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

function daysUntil(date: Date) {
  const diff = new Date(date).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function hatchRate(record: { eggsHatched: number | null; eggsSet: number }) {
  if (!record.eggsHatched || !record.eggsSet) return null
  return Math.round((record.eggsHatched / record.eggsSet) * 100)
}

export default async function HatcheryPage() {
  const session = await getServerSession()
  if (!session?.user) redirect('/login')

  const member = await prisma.orgMember.findFirst({
    where: { user: { email: session.user.email! } },
  })
  if (!member) redirect('/login')

  const records = await prisma.hatchRecord.findMany({
    where: { orgId: member.orgId },
    orderBy: { settingDate: 'desc' },
  })

  const active = records.filter(r => ['INCUBATING', 'LOCKDOWN', 'HATCHING'].includes(r.status))
  const completed = records.filter(r => ['COMPLETE', 'FAILED'].includes(r.status))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2d5028]">Hatchery</h1>
          <p className="text-sm text-[#7a5c3a]">{active.length} active batches in incubator</p>
        </div>
        <Link href="/hatchery/new"
          className="px-4 py-2 bg-[#3d6b35] text-white rounded-lg text-sm font-medium hover:bg-[#2d5028] transition-colors">
          + Start Hatch
        </Link>
      </div>

      {active.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[#5c3d1e] mb-3">🌡️ Active Batches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {active.map(record => {
              const days = daysUntil(record.expectedHatchDate)
              return (
                <div key={record.id} className="bg-white border-2 border-amber-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-[#2d5028]">{record.batchName}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      record.status === 'HATCHING' ? 'bg-green-100 text-green-700 animate-pulse' :
                      record.status === 'LOCKDOWN' ? 'bg-orange-100 text-orange-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>{record.status}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center mb-3">
                    <div className="bg-[#faf7f2] rounded-lg p-2">
                      <p className="text-xl font-bold text-[#3d6b35]">{record.eggsSet}</p>
                      <p className="text-xs text-gray-500">Eggs Set</p>
                    </div>
                    <div className="bg-[#faf7f2] rounded-lg p-2">
                      <p className={`text-xl font-bold ${days <= 0 ? 'text-green-600' : days <= 3 ? 'text-orange-500' : 'text-[#3d6b35]'}`}>
                        {days <= 0 ? 'NOW' : `${days}d`}
                      </p>
                      <p className="text-xs text-gray-500">Until Hatch</p>
                    </div>
                    <div className="bg-[#faf7f2] rounded-lg p-2">
                      <p className="text-xl font-bold text-[#c17c2a] capitalize">{record.species.toLowerCase()}</p>
                      <p className="text-xs text-gray-500">Species</p>
                    </div>
                  </div>
                  {record.incubatorTemp && (
                    <p className="text-xs text-gray-500">
                      🌡️ {record.incubatorTemp}°F
                      {record.incubatorHumidity && ` · 💧 ${record.incubatorHumidity}%`}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-[#5c3d1e] mb-3">📊 Completed Hatches</h2>
        {completed.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-[#e8dcc8]">
            <p className="text-gray-400 text-sm">No completed hatches yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#e8dcc8] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#faf7f2] border-b border-[#e8dcc8]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#5c3d1e]">Batch</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#5c3d1e]">Set Date</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#5c3d1e]">Set</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#5c3d1e]">Hatched</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#5c3d1e]">Rate</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#5c3d1e]">Status</th>
                </tr>
              </thead>
              <tbody>
                {completed.map(r => {
                  const rate = hatchRate(r)
                  return (
                    <tr key={r.id} className="border-b border-gray-50 hover:bg-[#faf7f2]">
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{r.batchName}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{new Date(r.settingDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-sm text-center text-gray-700">{r.eggsSet}</td>
                      <td className="px-4 py-3 text-sm text-center text-gray-700">{r.eggsHatched ?? '—'}</td>
                      <td className="px-4 py-3 text-sm text-center">
                        {rate !== null ? (
                          <span className={`font-semibold ${rate >= 70 ? 'text-green-600' : rate >= 40 ? 'text-amber-600' : 'text-red-500'}`}>
                            {rate}%
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          r.status === 'COMPLETE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>{r.status}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {records.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-[#e8dcc8]">
          <p className="text-4xl mb-4">🥚</p>
          <p className="text-lg font-medium text-gray-700">No hatch records yet</p>
          <p className="text-sm text-gray-400 mb-4">Track your incubation batches here</p>
          <Link href="/hatchery/new" className="px-4 py-2 bg-[#3d6b35] text-white rounded-lg text-sm font-medium">
            Start First Hatch
          </Link>
        </div>
      )}
    </div>
  )
}
