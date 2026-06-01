import { z } from 'zod'

const envSchema = z.object({
  // Required
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  NEXTAUTH_SECRET: z.string().min(1, 'NEXTAUTH_SECRET is required'),
  NEXTAUTH_URL: z.string().url().default('http://localhost:3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Optional integrations — app works without them, features degrade gracefully
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  APOLLO_API_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),
  SLACK_BOT_TOKEN: z.string().optional(),
  SLACK_SIGNING_SECRET: z.string().optional(),
  SLACK_CHANNEL_ID: z.string().optional(),
  DOCUSIGN_INTEGRATION_KEY: z.string().optional(),
  DOCUSIGN_SECRET_KEY: z.string().optional(),
  DOCUSIGN_ACCOUNT_ID: z.string().optional(),
  DOCUSIGN_BASE_URL: z.string().default('https://demo.docusign.net/restapi'),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().default('https://app.posthog.com'),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().default('http://localhost:3000'),
  NEXT_PUBLIC_APP_NAME: z.string().default('The Farm'),
})

export type Env = z.infer<typeof envSchema>

function validateEnv(): Env {
  // Skip strict validation during `next build` — env vars are injected at runtime on Railway
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'

  const parsed = envSchema.safeParse(process.env)
  if (!parsed.success) {
    const missing = parsed.error.issues
      .filter(i => i.message.includes('required') || i.code === 'invalid_type')
      .map(i => i.path.join('.'))
    if (missing.length > 0) {
      console.warn(`⚠ Missing environment variables: ${missing.join(', ')}`)
      if (process.env.NODE_ENV === 'production' && !isBuildPhase) {
        throw new Error(`Missing required env vars: ${missing.join(', ')}`)
      }
    }
    // Coerce to valid shape with empty strings for build-time evaluation
    return envSchema.parse({
      DATABASE_URL: 'postgresql://build:build@localhost/build',
      NEXTAUTH_SECRET: 'build-time-placeholder',
      ...process.env,
    })
  }
  return parsed.data
}

export const env = validateEnv()

export const integrationStatus = {
  apollo: !!env.APOLLO_API_KEY,
  stripe: !!env.STRIPE_SECRET_KEY,
  twilio: !!(env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN),
  slack: !!env.SLACK_BOT_TOKEN,
  docusign: !!env.DOCUSIGN_INTEGRATION_KEY,
  posthog: !!env.NEXT_PUBLIC_POSTHOG_KEY,
  sentry: !!env.NEXT_PUBLIC_SENTRY_DSN,
  anthropic: !!env.ANTHROPIC_API_KEY,
  google: !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
}
