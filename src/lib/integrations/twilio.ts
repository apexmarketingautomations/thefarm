import { env, integrationStatus } from '@/lib/env'

export async function sendSMS(to: string, body: string): Promise<{ sid: string } | null> {
  if (!integrationStatus.twilio) {
    console.warn('Twilio not configured — SMS not sent')
    return null
  }
  // Dynamic import to avoid breaking build when twilio package is present but unconfigured
  const { default: Twilio } = await import('twilio')
  const client = Twilio(env.TWILIO_ACCOUNT_SID!, env.TWILIO_AUTH_TOKEN!)
  const msg = await client.messages.create({ from: env.TWILIO_PHONE_NUMBER!, to, body })
  return { sid: msg.sid }
}
