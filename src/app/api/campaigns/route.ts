import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, isNextResponse } from '@/lib/auth-helpers'
import { z } from 'zod'

const createCampaignSchema = z.object({
  name: z.string().min(1).max(200),
  type: z.enum(['EMAIL', 'SMS', 'LINKEDIN', 'MULTI_CHANNEL']),
  subject: z.string().max(500).optional(),
  body: z.string().max(50000).optional(),
  fromName: z.string().max(100).optional(),
  fromEmail: z.string().email().max(255).optional(),
  scheduledAt: z.string().datetime().optional(),
})

export async function GET(request: NextRequest) {
  const auth = await requireAuth()
  if (isNextResponse(auth)) return auth

  const { searchParams } = new URL(request.url)
  const requestedOrgId = searchParams.get('orgId')
  if (requestedOrgId && requestedOrgId !== auth.orgId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const campaigns = await prisma.campaign.findMany({
    where: { orgId: auth.orgId },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { enrollments: true } } },
  })
  return NextResponse.json(campaigns)
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth()
  if (isNextResponse(auth)) return auth

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = createCampaignSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const campaign = await prisma.campaign.create({
    data: { ...parsed.data, orgId: auth.orgId, createdById: auth.userId },
  })
  return NextResponse.json(campaign, { status: 201 })
}
