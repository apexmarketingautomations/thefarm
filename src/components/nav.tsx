'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '🏡' },
  { href: '/flocks', label: 'Flocks', icon: '🐓' },
  { href: '/breeds', label: 'Breeds', icon: '📋' },
  { href: '/hatchery', label: 'Hatchery', icon: '🥚' },
  { href: '/listings', label: 'For Sale', icon: '🏷️' },
  { href: '/orders', label: 'Orders', icon: '📦' },
  { href: '/customers', label: 'Customers', icon: '👥' },
  { href: '/health', label: 'Health', icon: '🩺' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-60 min-h-screen bg-[#2d5028] text-white flex flex-col">
      <div className="p-5 border-b border-[#3d6b35]">
        <h1 className="text-xl font-bold text-[#f5e6c8]">Evergreen Hollow</h1>
        <p className="text-xs text-[#a8c5a0] mt-0.5">Farm Admin</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active ? 'bg-[#4e8a44] text-white' : 'text-[#c8dfc4] hover:bg-[#3d6b35] hover:text-white'
              }`}>
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-[#3d6b35]">
        <p className="text-xs text-[#a8c5a0]">Evergreen Hollow Farm</p>
      </div>
    </aside>
  )
}
