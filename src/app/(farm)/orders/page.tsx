import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

const STATUS_STYLE: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  DEPOSIT_PAID: 'bg-blue-100 text-blue-700',
  PAID: 'bg-green-100 text-green-700',
  READY: 'bg-purple-100 text-purple-700',
  SHIPPED: 'bg-indigo-100 text-indigo-700',
  PICKED_UP: 'bg-gray-100 text-gray-700',
  CANCELLED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-orange-100 text-orange-700',
}

export default async function OrdersPage() {
  const session = await getServerSession()
  if (!session?.user) redirect('/login')

  const member = await prisma.orgMember.findFirst({
    where: { user: { email: session.user.email! } },
  })
  if (!member) redirect('/login')

  const orders = await prisma.farmOrder.findMany({
    where: { orgId: member.orgId },
    orderBy: { createdAt: 'desc' },
    include: {
      customer: { select: { name: true } },
      items: true,
    },
  })

  const totalRevenue = orders
    .filter(o => ['PAID', 'SHIPPED', 'PICKED_UP'].includes(o.status))
    .reduce((sum, o) => sum + o.totalAmount, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2d5028]">Orders</h1>
          <p className="text-sm text-[#7a5c3a]">{orders.length} total · ${totalRevenue.toLocaleString()} revenue</p>
        </div>
        <Link href="/orders/new"
          className="px-4 py-2 bg-[#3d6b35] text-white rounded-lg text-sm font-medium hover:bg-[#2d5028] transition-colors">
          + New Order
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-[#e8dcc8]">
          <p className="text-4xl mb-4">📦</p>
          <p className="text-lg font-medium text-gray-700">No orders yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e8dcc8] overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-[#faf7f2] border-b border-[#e8dcc8]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5c3d1e]">Order #</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5c3d1e]">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5c3d1e]">Date</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#5c3d1e]">Total</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-[#5c3d1e]">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-[#faf7f2] cursor-pointer">
                  <td className="px-4 py-3 text-sm font-mono text-[#3d6b35]">{order.orderNumber}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {order.customer?.name ?? order.shippingName ?? 'Walk-in'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-800 text-right">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLE[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {order.status.replace('_', ' ')}
                    </span>
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
