import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { integrationStatus } from '@/lib/env'

async function getStats(orgId?: string) {
  if (!orgId) return { leads: 0, deals: 0, campaigns: 0, revenue: 0 }
  const [leads, deals, campaigns, payments] = await Promise.all([
    prisma.lead.count({ where: { orgId } }),
    prisma.deal.count({ where: { orgId } }),
    prisma.campaign.count({ where: { orgId } }),
    prisma.payment.aggregate({
      where: { orgId, status: 'SUCCEEDED' },
      _sum: { amount: true },
    }),
  ])
  return { leads, deals, campaigns, revenue: payments._sum.amount ?? 0 }
}

export default async function DashboardPage() {
  const session = await getServerSession()
  if (!session?.user) redirect('/login')

  const member = await prisma.orgMember.findFirst({
    where: { user: { email: session.user.email! } },
    include: { org: true },
  })

  const stats = await getStats(member?.orgId)
  const missingIntegrations = Object.entries(integrationStatus)
    .filter(([, v]) => !v)
    .map(([k]) => k)

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">The Farm Dashboard</h1>
        <p className="text-gray-500">Welcome back, {session.user.name ?? session.user.email}</p>
      </div>

      {missingIntegrations.length > 0 && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm font-medium text-amber-800">
            {missingIntegrations.length} integration(s) not configured:{' '}
            {missingIntegrations.join(', ')}
          </p>
          <p className="text-xs text-amber-600 mt-1">
            Add the missing API keys to your environment variables to enable these features.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Leads', value: stats.leads },
          { label: 'Active Deals', value: stats.deals },
          { label: 'Campaigns', value: stats.campaigns },
          { label: 'Revenue', value: `$${stats.revenue.toLocaleString()}` },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Integration Status</h2>
          <div className="space-y-2">
            {Object.entries(integrationStatus).map(([name, active]) => (
              <div key={name} className="flex items-center justify-between py-1">
                <span className="text-sm text-gray-700 capitalize">{name}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {active ? 'Connected' : 'Not configured'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: 'Add Lead', href: '/leads/new' },
              { label: 'Create Campaign', href: '/campaigns/new' },
              { label: 'New Deal', href: '/deals/new' },
              { label: 'Integration Settings', href: '/settings/integrations' },
            ].map(action => (
              <a
                key={action.href}
                href={action.href}
                className="block w-full text-left px-4 py-2 rounded-lg bg-gray-50 hover:bg-green-50 hover:text-green-700 text-sm font-medium text-gray-700 transition-colors"
              >
                {action.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
