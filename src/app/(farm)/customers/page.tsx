import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function CustomersPage() {
  const session = await getServerSession()
  if (!session?.user) redirect('/login')

  const member = await prisma.orgMember.findFirst({
    where: { user: { email: session.user.email! } },
  })
  if (!member) redirect('/login')

  const customers = await prisma.farmCustomer.findMany({
    where: { orgId: member.orgId },
    orderBy: { name: 'asc' },
    include: { _count: { select: { orders: true } } },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2d5028]">Customers</h1>
          <p className="text-sm text-[#7a5c3a]">{customers.length} customers on record</p>
        </div>
        <Link href="/customers/new"
          className="px-4 py-2 bg-[#3d6b35] text-white rounded-lg text-sm font-medium hover:bg-[#2d5028] transition-colors">
          + Add Customer
        </Link>
      </div>

      {customers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-[#e8dcc8]">
          <p className="text-4xl mb-4">👥</p>
          <p className="text-lg font-medium text-gray-700">No customers yet</p>
          <p className="text-sm text-gray-400 mb-4">Customers are created automatically when you add an order</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e8dcc8] overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-[#faf7f2] border-b border-[#e8dcc8]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5c3d1e]">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5c3d1e]">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5c3d1e]">Phone</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5c3d1e]">Location</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-[#5c3d1e]">Orders</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-[#faf7f2]">
                  <td className="px-4 py-3 text-sm font-medium text-[#2d5028]">{c.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{c.email ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{c.phone ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{c.location ?? '—'}</td>
                  <td className="px-4 py-3 text-center text-sm font-semibold text-[#3d6b35]">{c._count.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
