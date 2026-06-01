import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { notifyNewLead } from '@/lib/integrations/slack'
import { z } from 'zod'

const createLeadSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  company: z.string().optional(),
  title: z.string().optional(),
  source: z.enum(['MANUAL', 'APOLLO', 'IMPORT', 'FORM', 'REFERRAL', 'LINKEDIN', 'WEBSITE', 'ZAPIER', 'API']).default('MANUAL'),
  orgId: z.string().min(1),
})

export async function GET(request: NextRequest) {
  const session = await getServerSession()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const orgId = searchParams.get('orgId')
  const status = searchParams.get('status')
  const page = parseInt(searchParams.get('page') ?? '1')
  const perPage = parseInt(searchParams.get('perPage') ?? '25')

  if (!orgId) return NextResponse.json({ error: 'orgId required' }, { status: 400 })

  const where = { orgId, ...(status ? { status: status as any } : {}) }
  const [leads, total] = await Promise.all([
    prisma.lead.findMany({ where, skip: (page - 1) * perPage, take: perPage, orderBy: { createdAt: 'desc' }, include: { assignedTo: { select: { name: true, email: true } } } }),
    prisma.lead.count({ where }),
  ])

  return NextResponse.json({ leads, total, page, perPage, totalPages: Math.ceil(total / perPage) })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = createLeadSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const lead = await prisma.lead.create({
    data: { ...parsed.data, email: parsed.data.email || undefined },
  })

  // Fire-and-forget Slack notification
  notifyNewLead(`${lead.firstName} ${lead.lastName}`, lead.company ?? 'Unknown', lead.source).catch(console.error)

  return NextResponse.json(lead, { status: 201 })
}
