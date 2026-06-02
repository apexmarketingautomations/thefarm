import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function proxy(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        // Public paths — no auth required
        if (
          pathname === '/' ||
          pathname.startsWith('/shop') ||
          pathname.startsWith('/about') ||
          pathname.startsWith('/contact') ||
          pathname.startsWith('/faq') ||
          pathname.startsWith('/policies') ||
          pathname.startsWith('/login') ||
          pathname.startsWith('/api/auth') ||
          pathname.startsWith('/api/health') ||
          pathname.startsWith('/api/webhooks') ||
          pathname.startsWith('/api/chat')
        ) {
          return true
        }
        return !!token
      },
    },
  },
)

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|.*\\.(png|jpg|jpeg|gif|webp|svg|ico)$).*)'],
}
