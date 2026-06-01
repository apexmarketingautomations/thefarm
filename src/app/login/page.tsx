'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await signIn('credentials', { email, callbackUrl: '/dashboard' })
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2d5028] to-[#3d6b35] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌿</div>
          <h1 className="text-3xl font-bold text-[#2d5028]">Evergreen Hollow Farm</h1>
          <p className="text-[#7a5c3a] mt-2 font-medium">Admin Portal</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#5c3d1e] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-[#e8dcc8] rounded-lg focus:ring-2 focus:ring-[#3d6b35] focus:border-transparent outline-none text-gray-800 bg-[#faf7f2]"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3d6b35] hover:bg-[#2d5028] text-white font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="mt-4 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">or</span>
          </div>
        </div>
        <button
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          className="mt-4 w-full border border-[#e8dcc8] hover:bg-[#faf7f2] text-[#5c3d1e] font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          Sign in with Google
        </button>
        <p className="mt-6 text-center text-xs text-gray-400">Poultry &amp; Waterfowl Breeder Admin</p>
      </div>
    </div>
  )
}
