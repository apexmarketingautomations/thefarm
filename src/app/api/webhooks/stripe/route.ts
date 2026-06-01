import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/integrations/stripe'
import { prisma } from '@/lib/prisma'
import { env } from '@/lib/env'

export async function POST(request: NextRequest) {
  if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, env.STRIPE_WEBHOOK_SECRET)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as any
      await prisma.payment.create({
        data: {
          stripeInvoiceId: invoice.id,
          amount: invoice.amount_paid / 100,
          currency: invoice.currency.toUpperCase(),
          status: 'SUCCEEDED',
          customerEmail: invoice.customer_email,
          paidAt: new Date(invoice.status_transitions.paid_at * 1000),
        },
      })
      break
    }
    case 'customer.subscription.updated': {
      const sub = event.data.object as any
      await prisma.organization.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: { stripePriceId: sub.items.data[0]?.price.id, stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000) },
      })
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as any
      await prisma.organization.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: { plan: 'FREE', stripeSubscriptionId: null, stripePriceId: null },
      })
      break
    }
  }

  return NextResponse.json({ received: true })
}
