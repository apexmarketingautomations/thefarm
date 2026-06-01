import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { integrationStatus } from '@/lib/env'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getServerSession()
  if (!session?.user) redirect('/login')

  const member = await prisma.orgMember.findFirst({
    where: { user: { email: session.user.email! } },
    include: { org: true },
  })

  const orgId = member?.orgId

  const [
    totalBirds,
    activeListing,
    pendingOrders,
    incubating,
    recentHatches,
    breeds,
  ] = orgId ? await Promise.all([
    prisma.bird.count({ where: { orgId, status: 'ACTIVE' } }),
    prisma.listing.count({ where: { orgId, status: 'ACTIVE' } }),
    prisma.farmOrder.count({ where: { orgId, status: { in: ['PENDING', 'DEPOSIT_PAID'] } } }),
    prisma.hatchRecord.count({ where: { orgId, status: { in: ['INCUBATING', 'LOCKDOWN', 'HATCHING'] } } }),
    prisma.hatchRecord.findMany({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.breed.findMany({
      where: { orgId, isAvailable: true },
      orderBy: { name: 'asc' },
      take: 8,
    }),
  ]) : [0, 0, 0, 0, [], []]

  const missingIntegrations = Object.entries(integrationStatus)
    .filter(([, v]) => !v)
    .map(([k]) => k)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2d5028]">Farm Dashboard</h1>
        <p className="text-[#7a5c3a] mt-1">Welcome back, {session.user.name ?? session.user.email}</p>
      </div>

      {missingIntegrations.length > 0 && (
        <div className="mb-6 bg-amber-50 border border-amber-300 rounded-xl p-4 flex gap-3">
          <span className="text-amber-500 text-xl">⚠️</span>
          <div>
            <p className="text-sm font-semibold text-amber-800">
              {missingIntegrations.length} integration(s) need API keys: {missingIntegrations.join(', ')}
            </p>
            <p className="text-xs text-amber-600 mt-0.5">Add keys to your .env to enable payments, SMS, and notifications.</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Birds', value: totalBirds, icon: '🐓', color: 'bg-green-50 border-green-200', text: 'text-green-800' },
          { label: 'Active Listings', value: activeListing, icon: '🏷️', color: 'bg-amber-50 border-amber-200', text: 'text-amber-800' },
          { label: 'Pending Orders', value: pendingOrders, icon: '📦', color: 'bg-blue-50 border-blue-200', text: 'text-blue-800' },
          { label: 'In Incubator', value: incubating, icon: '🥚', color: 'bg-orange-50 border-orange-200', text: 'text-orange-800' },
        ].map(stat => (
          <div key={stat.label} className={`rounded-xl border p-5 ${stat.color}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className={`text-3xl font-bold ${stat.text}`}>{stat.value}</p>
            <p className={`text-sm mt-1 ${stat.text} opacity-75`}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Hatches */}
        <div className="bg-white rounded-xl border border-[#e8dcc8] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#2d5028]">🥚 Recent Hatch Records</h2>
            <Link href="/hatchery" className="text-sm text-[#3d6b35] hover:underline">View all</Link>
          </div>
          {(recentHatches as any[]).length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No hatch records yet</p>
          ) : (
            <div className="space-y-3">
              {(recentHatches as any[]).map((h: any) => (
                <div key={h.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{h.batchName}</p>
                    <p className="text-xs text-gray-400">Set {new Date(h.settingDate).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    h.status === 'COMPLETE' ? 'bg-green-100 text-green-700' :
                    h.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>{h.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-xl border border-[#e8dcc8] p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#2d5028] mb-4">⚡ Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Add Bird', href: '/flocks/new', icon: '🐓' },
              { label: 'Start Hatch', href: '/hatchery/new', icon: '🥚' },
              { label: 'New Listing', href: '/listings/new', icon: '🏷️' },
              { label: 'New Order', href: '/orders/new', icon: '📦' },
              { label: 'Add Breed', href: '/breeds/new', icon: '📋' },
              { label: 'Health Record', href: '/health/new', icon: '🩺' },
            ].map(a => (
              <Link key={a.href} href={a.href}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[#f5e6c8] hover:bg-[#ebd5a8] text-[#5c3d1e] text-sm font-medium transition-colors">
                <span>{a.icon}</span> {a.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Available Breeds */}
      {(breeds as any[]).length > 0 && (
        <div className="mt-6 bg-white rounded-xl border border-[#e8dcc8] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#2d5028]">📋 Available Breeds</h2>
            <Link href="/breeds" className="text-sm text-[#3d6b35] hover:underline">Manage breeds</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(breeds as any[]).map((b: any) => (
              <div key={b.id} className="bg-[#faf7f2] border border-[#e8dcc8] rounded-lg p-3">
                <p className="text-sm font-semibold text-[#2d5028]">{b.name}</p>
                <p className="text-xs text-gray-500 capitalize">{b.species.toLowerCase()}</p>
                {b.isRare && <span className="text-xs text-amber-600 font-medium">✨ Rare</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
