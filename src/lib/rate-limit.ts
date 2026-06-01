import { NextRequest, NextResponse } from 'next/server'

type RateLimitStore = Map<string, { count: number; resetAt: number }>

const store: RateLimitStore = new Map()

/**
 * Simple in-process rate limiter. For multi-instance deploys on Railway,
 * replace with Redis (Upstash) — this is sufficient for a single-instance setup.
 */
export function rateLimit(
  request: NextRequest,
  options: { limit: number; windowMs: number } = { limit: 60, windowMs: 60_000 },
): NextResponse | null {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'

  const key = `${request.nextUrl.pathname}:${ip}`
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + options.windowMs })
    return null
  }

  entry.count++
  if (entry.count > options.limit) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((entry.resetAt - now) / 1000)),
          'X-RateLimit-Limit': String(options.limit),
          'X-RateLimit-Remaining': '0',
        },
      },
    )
  }

  return null
}
