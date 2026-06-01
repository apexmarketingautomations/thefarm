import { NextResponse } from 'next/server'
import { integrationStatus } from '@/lib/env'

export async function GET() {
  return NextResponse.json({
    integrations: Object.entries(integrationStatus).map(([name, configured]) => ({
      name,
      configured,
      status: configured ? 'active' : 'not_configured',
    })),
  })
}
