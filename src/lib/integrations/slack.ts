import { env, integrationStatus } from '@/lib/env'

export async function postToSlack(text: string, channel?: string): Promise<boolean> {
  if (!integrationStatus.slack) {
    console.warn('Slack not configured — notification skipped')
    return false
  }
  const res = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.SLACK_BOT_TOKEN}`,
    },
    body: JSON.stringify({ channel: channel ?? env.SLACK_CHANNEL_ID ?? '#general', text }),
  })
  const data = await res.json()
  return data.ok
}

export async function notifyNewLead(leadName: string, company: string, source: string): Promise<void> {
  await postToSlack(`🌱 New lead added to The Farm: *${leadName}* from ${company} (via ${source})`)
}

export async function notifyDealWon(dealTitle: string, value: number): Promise<void> {
  await postToSlack(`🏆 Deal won! *${dealTitle}* — $${value.toLocaleString()}`)
}
