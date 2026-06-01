import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { notifyNewLead } from '@/lib/integrations/slack'
import { requireAuth, requireOrgAccess, isNextResponse, parsePagination } from '@/lib/auth-helpers'
import { LeadStatus } from '@prisma/client'
import { z } from 'zod'

const createLeadSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().max(255).optional().or(z.literal('')),
  phone: z.string().max(30).optional(),
  company: z.string().max(200).optional(),
  title: z.string().max(200).optional(),
  linkedinUrl: z.string().url().max(500).optional().or(z.literal('')),
  source: z
    .enum(['MANUAL', 'APOLLO', 'IMPORT', 'FORM', 'REFERRAL', 'LINKEDIN', 'WEBSITE', 'ZAPIER', 'API'])
    .default('MANUAL'),
})

export async function GET(request: NextRequest) {
  const auth = await requireAuth()
  if (isNextResponse(auth)) return auth

  const { searchParams } = new URL(request.url)

  // orgId from query must match the authenticated user's org — prevents IDOR
  const requestedOrgId = searchParams.get('orgId')
  if (requestedOrgId && requestedOrgId !== auth.orgId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const statusParam = searchParams.get('status')
  const validStatuses = Object.values(LeadStatus)
  const status = statusParam && validStatuses.includes(statusParam as LeadStatus)
    ? (statusParam as LeadStatus)
    : undefined

  const { page, perPage } = parsePagination(searchParams)

  const where = { orgId: auth.orgId, ...(status ? { status } : {}) }
  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: 'desc' },
      include: { assignedTo: { select: { name: true, email: true } } },
    }),
    prisma.lead.count({ where }),
  ])

  return NextResponse.json({ leads, total, page, perPage, totalPages: Math.ceil(total / perPage) })
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

  const parsed = createLeadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const lead = await prisma.lead.create({
    data: {
      ...parsed.data,
      email: parsed.data.email || undefined,
      linkedinUrl: parsed.data.linkedinUrl || undefined,
      orgId: auth.orgId,
      createdById: auth.userId,
    },
  })

  notifyNewLead(
    `${lead.firstName} ${lead.lastName}`,
    lead.company ?? 'Unknown',
    lead.source,
  ).catch(console.error)

  return NextResponse.json(lead, { status: 201 })
}
