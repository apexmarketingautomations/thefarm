import Link from 'next/link'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--farm-bg)' }}>
      <header style={{ backgroundColor: 'var(--farm-green-dark)' }} className="sticky top-0 z-40 shadow-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-2xl">🌿</span>
            <div>
              <p className="text-white font-bold text-base leading-tight">Evergreen Hollow Farm</p>
              <p className="text-green-300 text-xs">Poultry & Waterfowl Breeders</p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/" className="text-green-200 hover:text-white transition">Home</Link>
            <Link href="/shop" className="text-green-200 hover:text-white transition">Shop</Link>
            <Link href="/about" className="text-green-200 hover:text-white transition">Our Birds</Link>
            <Link href="/contact" className="text-green-200 hover:text-white transition">Contact</Link>
          </nav>
          <Link
            href="/contact"
            style={{ backgroundColor: 'var(--farm-amber)' }}
            className="text-white text-sm font-semibold px-4 py-2 rounded-lg hover:brightness-110 transition"
          >
            Inquire
          </Link>
        </div>
        {/* Mobile nav */}
        <div className="md:hidden border-t border-green-800 px-4 py-2 flex gap-5 text-sm overflow-x-auto">
          <Link href="/" className="text-green-200 hover:text-white whitespace-nowrap">Home</Link>
          <Link href="/shop" className="text-green-200 hover:text-white whitespace-nowrap">Shop</Link>
          <Link href="/about" className="text-green-200 hover:text-white whitespace-nowrap">Our Birds</Link>
          <Link href="/contact" className="text-green-200 hover:text-white whitespace-nowrap">Contact</Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer style={{ backgroundColor: 'var(--farm-green-dark)' }} className="text-green-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="text-white font-bold text-lg mb-2">🌿 Evergreen Hollow Farm</p>
            <p className="text-sm leading-relaxed">Premium heritage poultry and ornamental waterfowl. NPIP-compliant. Pasture-raised. Antibiotic-free.</p>
          </div>
          <div>
            <p className="text-white font-semibold mb-3">Quick Links</p>
            <ul className="space-y-1.5 text-sm">
              <li><Link href="/shop" className="hover:text-white transition">Available Birds & Eggs</Link></li>
              <li><Link href="/about" className="hover:text-white transition">Our Breeds</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Order & Inquiries</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-white font-semibold mb-3">Hatching Season</p>
            <p className="text-sm leading-relaxed">March – September. Pre-orders open year-round. Hatching eggs ship nationwide. Live birds by arrangement.</p>
          </div>
        </div>
        <div className="border-t border-green-800 text-center py-4 text-xs text-green-400">
          © {new Date().getFullYear()} Evergreen Hollow Farm · All rights reserved
        </div>
      </footer>
    </div>
  )
}
