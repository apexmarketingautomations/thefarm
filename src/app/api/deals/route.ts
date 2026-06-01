import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { notifyDealWon } from '@/lib/integrations/slack'
import { requireAuth, isNextResponse, parsePagination } from '@/lib/auth-helpers'
import { z } from 'zod'

const createDealSchema = z.object({
  title: z.string().min(1).max(300),
  value: z.number().min(0).max(1_000_000_000).default(0),
  currency: z.string().length(3).default('USD'),
  stage: z
    .enum(['PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'])
    .default('PROSPECTING'),
  leadId: z.string().cuid().optional(),
  expectedCloseDate: z.string().datetime().optional(),
  notes: z.string().max(10000).optional(),
})

export async function GET(request: NextRequest) {
  const auth = await requireAuth()
  if (isNextResponse(auth)) return auth

  const { searchParams } = new URL(request.url)
  const requestedOrgId = searchParams.get('orgId')
  if (requestedOrgId && requestedOrgId !== auth.orgId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { page, perPage } = parsePagination(searchParams)

  const deals = await prisma.deal.findMany({
    where: { orgId: auth.orgId },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * perPage,
    take: perPage,
    include: {
      lead: { select: { firstName: true, lastName: true, company: true } },
      owner: { select: { name: true } },
    },
  })
  return NextResponse.json(deals)
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

  const parsed = createDealSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  // Verify the leadId (if given) belongs to this org — prevents IDOR across leads
  if (parsed.data.leadId) {
    const lead = await prisma.lead.findFirst({
      where: { id: parsed.data.leadId, orgId: auth.orgId },
      select: { id: true },
    })
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  }

  const deal = await prisma.deal.create({
    data: { ...parsed.data, orgId: auth.orgId, ownerId: auth.userId },
  })

  if (parsed.data.stage === 'CLOSED_WON') {
    notifyDealWon(deal.title, deal.value).catch(console.error)
  }

  return NextResponse.json(deal, { status: 201 })
}
