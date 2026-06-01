import { env, integrationStatus } from '@/lib/env'

interface ApolloContact {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  title: string
  organization_name: string
  linkedin_url: string
}

interface ApolloSearchParams {
  q_keywords?: string
  person_titles?: string[]
  organization_industry_tag_values?: string[]
  person_locations?: string[]
  page?: number
  per_page?: number
}

export class ApolloClient {
  private baseUrl = 'https://api.apollo.io/v1'

  private get enabled() {
    return integrationStatus.apollo
  }

  async searchContacts(params: ApolloSearchParams): Promise<ApolloContact[]> {
    if (!this.enabled) {
      console.warn('Apollo API key not configured — returning empty results')
      return []
    }
    const res = await fetch(`${this.baseUrl}/mixed_people/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache', 'X-Api-Key': env.APOLLO_API_KEY! },
      body: JSON.stringify({ ...params, api_key: env.APOLLO_API_KEY }),
    })
    if (!res.ok) throw new Error(`Apollo API error: ${res.status}`)
    const data = await res.json()
    return data.people ?? []
  }

  async enrichContact(email: string): Promise<ApolloContact | null> {
    if (!this.enabled) return null
    const res = await fetch(`${this.baseUrl}/people/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Api-Key': env.APOLLO_API_KEY! },
      body: JSON.stringify({ email }),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.person ?? null
  }
}

export const apollo = new ApolloClient()
