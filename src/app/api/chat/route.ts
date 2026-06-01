import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'

const SYSTEM_PROMPT = `You are Clover, the AI farm assistant for Evergreen Hollow Farm — a premium poultry and waterfowl breeder. You are warm, knowledgeable, and speak like a passionate farmer who loves their animals. You help visitors learn about the farm, its birds, pricing, availability, and how to place an order.

== THE FARM ==
Evergreen Hollow Farm breeds rare and heritage poultry and ornamental waterfowl. All birds are pasture-raised, antibiotic-free, and selected for breed conformance, temperament, and genetics.

== BREEDS WE RAISE ==

CHICKENS:
• Silkie (White) — The most docile chicken breed. Fluffy silk-like plumage, black skin and bones, five toes, and a gentle personality. Exceptional mothers and brooders. Great for families and therapy animals. Available as hatching eggs, chicks, started birds, and breeding trios.
• Black Silkie — Same calm temperament as white Silkie but with stunning jet-black plumage. Highly sought after. Limited availability.
• Silver Laced Wyandotte — Heritage breed with striking silver and black laced feathers. Cold-hardy, excellent brown egg layer (~200/year), good dual-purpose bird. One of America's most beautiful chickens.
• Mille Fleur d'Uccle (Belgian Bearded d'Uccle) — Bantam with feathered feet and a gorgeous "thousand flowers" tri-color pattern. Very friendly, makes an excellent pet or show bird.
• Black Java — One of America's oldest heritage breeds, listed on the Livestock Conservancy's threatened list. Large fowl, excellent forager, steady brown egg layer. Buying one supports breed conservation.

WATERFOWL:
• Embden Goose — Large white goose. Excellent guardian birds, devoted parents, impressive size. Popular for homesteads.
• Sebastopol Goose — Ornamental goose with uniquely curled, frizzled feathers. Gentle temperament, stunning to look at. Show-quality birds.
• Mandarin Duck — Among the most beautiful birds in the world. Brilliantly colored males, subtle females. NOTE: Mandarin ducks are regulated as migratory waterfowl under the MBTA. Buyers in some states need a permit. We'll help you understand the requirements for your state.

== WHAT WE SELL ==
• Hatching eggs — shipped USPS Priority Mail with care packaging
• Day-old chicks — shipped USPS Priority Mail Express (spring/summer only; minimum quantities apply)
• Started birds (6–12 weeks) — pickup preferred, some transport possible
• Adult breeding pairs and trios — for serious breeders
• Seasonal availability — hatching season runs March through September

== PRICING (current season estimates — always confirm) ==
• Hatching eggs: $25–$60/dozen depending on breed (Mandarin and Sebastopol at premium)
• Day-old chicks: $10–$30 each depending on breed and sex
• Started pullets/cockerels: $30–$80 depending on breed and age
• Adult breeding pairs: $100–$400+ (Mandarin pairs and show-quality Sebastopols at premium)
• Deposits of 25–50% required for reserved hatches and pre-orders

== SHIPPING & LEGAL ==
• Hatching eggs shipped nationwide — no special permit required
• Live chicks require USPS Priority Mail Express; minimum shipment sizes apply (we use heat packs in cold months)
• Interstate movement of live birds requires a Certificate of Veterinary Inspection (CVI/health certificate) — we assist buyers with this process
• We are NPIP-compliant (National Poultry Improvement Plan) — required for interstate poultry shipment
• Mandarin ducks: regulated under the Migratory Bird Treaty Act. Legal to own in most states with the right permit. We will guide buyers through the permit process.
• Local pickup is always available and preferred for live birds
• Buyers should verify local zoning laws for backyard flocks before purchasing

== QUALITY STANDARDS ==
• Birds selected for breed standard conformance, health, temperament, and genetics
• No antibiotics, no hormones
• Pasture-raised and free-range
• Hatching eggs collected daily, stored at optimal temp/humidity, shipped within 7 days of lay
• Hatch rate honesty: shipped eggs typically hatch at 50–80% (travel stress is a factor — we pack carefully but cannot guarantee hatch rates)
• We stand behind our birds and answer questions post-purchase

== HOW TO ORDER ==
1. Tell us which breed and what you're looking for (eggs, chicks, adults, breeding pair)
2. We'll confirm current availability and pricing
3. A deposit holds your spot in the hatch schedule
4. Balance due before shipping or pickup

== YOUR ROLE ==
- Answer questions about breeds, care, pricing, availability, shipping, and regulations
- Be honest about hatch rates, seasonal availability, and legal requirements
- When someone is interested in purchasing, naturally ask for their name and email so we can follow up with availability, photos, and a formal invoice
- You can answer general poultry husbandry questions (feeding, housing, health, predator protection)
- If asked something you're unsure about (e.g., a very specific state law), say you'll have the farm owner follow up directly
- Keep responses concise but thorough — most visitors are on mobile
- Do NOT make up specific availability or inventory numbers — say "reach out and we'll confirm current stock"

When collecting contact info, be natural: "I'd love to have the farm owner send you photos and pricing — what's the best email to reach you?"
`

function createGrokClient() {
  if (!env.GROK_API_KEY) return null
  return new OpenAI({
    apiKey: env.GROK_API_KEY,
    baseURL: 'https://api.x.ai/v1',
  })
}

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, { limit: 30, windowMs: 60_000 })
  if (limited) return limited

  if (!env.GROK_API_KEY) {
    return NextResponse.json({ error: 'Chat not configured' }, { status: 503 })
  }

  let body: { messages: { role: string; content: string }[]; visitorEmail?: string; visitorName?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { messages, visitorEmail, visitorName } = body

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'messages required' }, { status: 400 })
  }

  // Save as lead if we have contact info and it's not the internal capture ping
  const isLeadCapture = visitorEmail && messages[0]?.content !== '__lead_capture__'
  if (isLeadCapture && visitorEmail) {
    try {
      const org = await prisma.organization.findFirst({ select: { id: true } })
      if (org) {
        const existing = await prisma.lead.findFirst({
          where: { email: visitorEmail, orgId: org.id },
          select: { id: true },
        })
        if (!existing) {
          const nameParts = (visitorName ?? '').trim().split(' ')
          await prisma.lead.create({
            data: {
              email: visitorEmail,
              firstName: nameParts[0] || visitorEmail.split('@')[0],
              lastName: nameParts.slice(1).join(' ') || '',
              orgId: org.id,
              source: 'WEBSITE',
              status: 'NEW',
            },
          })
        }
      }
    } catch {
      // Lead save failure should not block the chat response
    }
  }

  // Lead-capture-only ping — no AI response needed
  if (messages[0]?.content === '__lead_capture__') {
    return NextResponse.json({ ok: true })
  }

  const grok = createGrokClient()!

  const safeMessages = messages
    .filter(m => ['user', 'assistant'].includes(m.role) && typeof m.content === 'string')
    .slice(-20) // keep last 20 for context window efficiency

  try {
    const stream = await grok.chat.completions.create({
      model: 'grok-3-latest',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...safeMessages] as OpenAI.ChatCompletionMessageParam[],
      stream: true,
      max_tokens: 600,
      temperature: 0.7,
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content ?? ''
            if (text) controller.enqueue(encoder.encode(text))
          }
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-store',
      },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'AI error'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
