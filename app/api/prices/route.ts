import { NextResponse } from 'next/server'

const API_BASE_URL = 'https://api.quickcommerceapi.com'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')?.trim()

  if (!query) return NextResponse.json({ error: 'Search query is required.' }, { status: 400 })

  const apiKey = process.env.QUICKCOMMERCE_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'Price API is not configured.' }, { status: 500 })

  try {
    const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`, {
      headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' },
      cache: 'no-store',
    })

    const payload = await response.json().catch(() => null)
    if (!response.ok) {
      return NextResponse.json({ error: payload?.message ?? 'The price service could not be reached.' }, { status: response.status })
    }

    return NextResponse.json(payload)
  } catch {
    return NextResponse.json({ error: 'Unable to fetch live prices right now.' }, { status: 502 })
  }
}
