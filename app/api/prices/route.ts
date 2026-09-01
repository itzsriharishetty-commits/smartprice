import { NextResponse } from 'next/server'

const API_BASE_URL = 'https://api.quickcommerceapi.com'
const DEFAULT_LOCATION = { lat: '12.9716', lon: '77.5946', pincode: '560001' }
const PLATFORMS = 'BlinkIt,Zepto,Swiggy,BigBasket,DMart,JioMart,Minutes'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')?.trim()

  if (!query) return NextResponse.json({ error: 'Search query is required.' }, { status: 400 })

  const apiKey = process.env.QUICKCOMMERCE_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'Price API is not configured.' }, { status: 500 })

  const params = new URLSearchParams({
    q: query,
    lat: searchParams.get('lat') || DEFAULT_LOCATION.lat,
    lon: searchParams.get('lon') || DEFAULT_LOCATION.lon,
    platforms: PLATFORMS,
    pincode: searchParams.get('pincode') || DEFAULT_LOCATION.pincode,
  })

  try {
    const response = await fetch(`${API_BASE_URL}/v1/groupsearch?${params}`, {
      headers: { 'X-API-Key': apiKey, Accept: 'application/json' },
      cache: 'no-store',
    })

    const payload = await response.json().catch(() => null)
    if (!response.ok) {
      const detail = Array.isArray(payload?.detail) ? payload.detail[0]?.msg : payload?.detail
      return NextResponse.json({ error: detail || payload?.message || `Price service returned ${response.status}.` }, { status: response.status })
    }

    return NextResponse.json(payload)
  } catch {
    return NextResponse.json({ error: 'Unable to fetch live prices right now.' }, { status: 502 })
  }
}
