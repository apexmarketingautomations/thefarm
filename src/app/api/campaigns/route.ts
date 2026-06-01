import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createCampaignSchema = z.object({
  orgId: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(['EMAIL', 'SMS', 'LINKEDIN', 'MULTI_CHANNEL']),
  subject: z.string().optional(),
  body: z.string().optional(),
  fromName: z.string().optional(),
  fromEmail: z.string().email().optional(),
  scheduledAt: z.string().datetime().optional(),
})

export async function GET(request: NextRequest) {
  const session = await getServerSession()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const orgId = searchParams.get('orgId')
  if (!orgId) return NextResponse.json({ error: 'orgId required' }, { status: 400 })

  const campaigns = await prisma.campaign.findMany({
    where: { orgId },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { enrollments: true } } },
  })
  return NextResponse.json(campaigns)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = createCampaignSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const campaign = await prisma.campaign.create({ data: parsed.data })
  return NextResponse.json(campaign, { status: 201 })
}
