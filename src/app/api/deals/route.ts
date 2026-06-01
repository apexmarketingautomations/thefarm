import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { notifyDealWon } from '@/lib/integrations/slack'
import { z } from 'zod'

const createDealSchema = z.object({
  orgId: z.string().min(1),
  title: z.string().min(1),
  value: z.number().min(0).default(0),
  currency: z.string().default('USD'),
  stage: z.enum(['PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST']).default('PROSPECTING'),
  leadId: z.string().optional(),
  expectedCloseDate: z.string().datetime().optional(),
})

export async function GET(request: NextRequest) {
  const session = await getServerSession()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const orgId = searchParams.get('orgId')
  if (!orgId) return NextResponse.json({ error: 'orgId required' }, { status: 400 })

  const deals = await prisma.deal.findMany({
    where: { orgId },
    orderBy: { createdAt: 'desc' },
    include: { lead: { select: { firstName: true, lastName: true, company: true } }, owner: { select: { name: true } } },
  })
  return NextResponse.json(deals)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = createDealSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const deal = await prisma.deal.create({ data: parsed.data })

  if (parsed.data.stage === 'CLOSED_WON') {
    notifyDealWon(deal.title, deal.value).catch(console.error)
  }

  return NextResponse.json(deal, { status: 201 })
}
