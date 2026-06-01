import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { integrationStatus } from '@/lib/env'

export default async function SettingsPage() {
  const session = await getServerSession()
  if (!session?.user) redirect('/login')

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2d5028]">Settings</h1>
        <p className="text-sm text-[#7a5c3a]">Manage your farm admin configuration</p>
      </div>

      <div className="bg-white rounded-xl border border-[#e8dcc8] p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-[#2d5028] mb-4">Integration Status</h2>
        <div className="space-y-2">
          {Object.entries(integrationStatus).map(([name, active]) => (
            <div key={name} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-700 capitalize">{name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {active ? 'Connected' : 'Not configured'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#faf7f2] border border-[#e8dcc8] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-[#5c3d1e] mb-2">About Evergreen Hollow Farm Admin</h3>
        <p className="text-sm text-gray-600">
          Poultry &amp; waterfowl breeder management system. Track your flock, manage hatch records,
          list birds for sale, and handle orders all in one place.
        </p>
      </div>
    </div>
  )
}
