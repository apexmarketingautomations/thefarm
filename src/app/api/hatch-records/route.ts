import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, isNextResponse } from '@/lib/auth-helpers'
import { z } from 'zod'

const hatchSchema = z.object({
  batchName: z.string().min(1).max(100),
  species: z.enum(['CHICKEN', 'DUCK', 'GOOSE', 'TURKEY', 'GUINEA_FOWL', 'QUAIL', 'OTHER']).default('CHICKEN'),
  eggsSet: z.number().int().min(1).max(10000),
  settingDate: z.string().datetime(),
  expectedHatchDate: z.string().datetime(),
  incubatorTemp: z.number().optional(),
  incubatorHumidity: z.number().optional(),
  notes: z.string().max(2000).optional(),
})

export async function GET(_request: NextRequest) {
  const auth = await requireAuth()
  if (isNextResponse(auth)) return auth

  const records = await prisma.hatchRecord.findMany({
    where: { orgId: auth.orgId },
    orderBy: { settingDate: 'desc' },
  })
  return NextResponse.json(records)
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth()
  if (isNextResponse(auth)) return auth

  let body: unknown
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const parsed = hatchSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const record = await prisma.hatchRecord.create({ data: { ...parsed.data, orgId: auth.orgId } })
  return NextResponse.json(record, { status: 201 })
}
