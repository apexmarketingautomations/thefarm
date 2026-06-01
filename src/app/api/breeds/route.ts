import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, isNextResponse } from '@/lib/auth-helpers'
import { z } from 'zod'

const breedSchema = z.object({
  name: z.string().min(1).max(100),
  species: z.enum(['CHICKEN', 'DUCK', 'GOOSE', 'TURKEY', 'GUINEA_FOWL', 'QUAIL', 'OTHER']),
  description: z.string().max(2000).optional(),
  eggColor: z.string().max(50).optional(),
  temperament: z.string().max(200).optional(),
  isRare: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
})

export async function GET(_request: NextRequest) {
  const auth = await requireAuth()
  if (isNextResponse(auth)) return auth

  const breeds = await prisma.breed.findMany({
    where: { orgId: auth.orgId },
    orderBy: [{ species: 'asc' }, { name: 'asc' }],
    include: { _count: { select: { birds: true, listings: true } } },
  })
  return NextResponse.json(breeds)
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth()
  if (isNextResponse(auth)) return auth

  let body: unknown
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const parsed = breedSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const breed = await prisma.breed.create({ data: { ...parsed.data, orgId: auth.orgId } })
  return NextResponse.json(breed, { status: 201 })
}
