import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { env, integrationStatus } from '@/lib/env'
import { rateLimit } from '@/lib/rate-limit'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    ...(integrationStatus.google
      ? [
          GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID!,
            clientSecret: env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        return user
      },
    }),
  ],
  session: { strategy: 'jwt' as const },
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      return session
    },
  },
  pages: { signIn: '/login' },
}

const handler = NextAuth(authOptions)

// Wrap with rate limiting on POST (sign-in attempts)
async function POST(req: NextRequest) {
  const limited = rateLimit(req, { limit: 10, windowMs: 60_000 })
  if (limited) return limited
  return handler(req as any, {} as any)
}

async function GET(req: NextRequest) {
  return handler(req as any, {} as any)
}

export { GET, POST }
