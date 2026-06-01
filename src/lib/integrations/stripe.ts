import Stripe from 'stripe'
import { env, integrationStatus } from '@/lib/env'

function createStripeClient(): Stripe | null {
  if (!integrationStatus.stripe) {
    console.warn('Stripe secret key not configured')
    return null
  }
  return new Stripe(env.STRIPE_SECRET_KEY!, { apiVersion: '2024-10-28.acacia' })
}

export const stripe = createStripeClient()

export async function createCheckoutSession(params: {
  customerId?: string
  priceId: string
  successUrl: string
  cancelUrl: string
}) {
  if (!stripe) throw new Error('Stripe not configured')
  return stripe.checkout.sessions.create({
    customer: params.customerId,
    payment_method_types: ['card'],
    line_items: [{ price: params.priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
  })
}

export async function createCustomer(email: string, name: string): Promise<string | null> {
  if (!stripe) return null
  const customer = await stripe.customers.create({ email, name })
  return customer.id
}
