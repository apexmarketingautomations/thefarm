import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export type AuthContext = {
  userId: string
  orgId: string
  role: string
}

/**
 * Resolves the authenticated user and their org membership.
 * Returns NextResponse with 401/403 if not authenticated or not a member of the org.
 */
export async function requireAuth(): Promise<AuthContext | NextResponse> {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const member = await prisma.orgMember.findFirst({
    where: { user: { email: session.user.email } },
    select: { userId: true, orgId: true, role: true },
  })

  if (!member) {
    return NextResponse.json({ error: 'No organization found for this user' }, { status: 403 })
  }

  return member
}

/**
 * Verifies the authenticated user is a member of the given orgId.
 * Prevents IDOR — callers cannot access orgs they don't belong to.
 */
export async function requireOrgAccess(orgId: string): Promise<AuthContext | NextResponse> {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const member = await prisma.orgMember.findFirst({
    where: { user: { email: session.user.email }, orgId },
    select: { userId: true, orgId: true, role: true },
  })

  if (!member) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return member
}

export function isNextResponse(v: unknown): v is NextResponse {
  return v instanceof NextResponse
}

/** Clamp pagination params to safe bounds */
export function parsePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1') || 1)
  const perPage = Math.min(100, Math.max(1, parseInt(searchParams.get('perPage') ?? '25') || 25))
  return { page, perPage }
}
