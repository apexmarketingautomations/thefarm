import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/integrations/stripe'
import { prisma } from '@/lib/prisma'
import { env } from '@/lib/env'

export async function POST(request: NextRequest) {
  if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  const body = await request.text()
  const sig = request.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, env.STRIPE_WEBHOOK_SECRET)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        await prisma.payment.create({
          data: {
            stripeInvoiceId: invoice.id,
            amount: (invoice.amount_paid ?? 0) / 100,
            currency: (invoice.currency ?? 'usd').toUpperCase(),
            status: 'SUCCEEDED',
            customerEmail: invoice.customer_email ?? undefined,
            paidAt: invoice.status_transitions?.paid_at
              ? new Date(invoice.status_transitions.paid_at * 1000)
              : new Date(),
          },
        })
        break
      }
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const firstItem = sub.items.data[0]
        await prisma.organization.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: {
            stripePriceId: firstItem?.price.id ?? null,
            // current_period_end is now on each subscription item in Stripe API v2
            stripeCurrentPeriodEnd: firstItem?.current_period_end
              ? new Date(firstItem.current_period_end * 1000)
              : null,
          },
        })
        break
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        await prisma.organization.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: { plan: 'FREE', stripeSubscriptionId: null, stripePriceId: null },
        })
        break
      }
    }
  } catch (err) {
    console.error('Stripe webhook handler error:', err)
    return NextResponse.json({ error: 'Handler error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
