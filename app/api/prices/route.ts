import { NextResponse } from 'next/server'

const API_BASE_URL = 'https://api.quickcommerceapi.com'
const DEFAULT_LOCATION = { lat: '12.9716', lon: '77.5946', pincode: '560001' }
const PLATFORMS = ['BlinkIt', 'Zepto', 'Swiggy', 'BigBasket', 'JioMart']

type ProviderProduct = {
  id?: string
  name?: string
  brand?: string
  available?: boolean
  mrp?: number | string
  price?: number | string
  offer_price?: number | string
  selling_price?: number | string
  quantity?: string
  unit?: string
}

type SearchResponse = {
  data?: { platform?: string; products?: ProviderProduct[] }
  detail?: { error?: string; message?: string } | string
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')?.trim()
  if (!query) return NextResponse.json({ error: 'Search query is required.' }, { status: 400 })

  const apiKey = process.env.QUICKCOMMERCE_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'Price API is not configured.' }, { status: 500 })

  const requestedLat = searchParams.get('lat')
  const requestedLon = searchParams.get('lon')
  const lat = requestedLat ? Number(requestedLat) : Number(DEFAULT_LOCATION.lat)
  const lon = requestedLon ? Number(requestedLon) : Number(DEFAULT_LOCATION.lon)
  if (!Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lon) || lon < -180 || lon > 180) {
    return NextResponse.json({ error: 'Please provide a valid location.' }, { status: 400 })
  }
  const location = {
    lat: String(lat),
    lon: String(lon),
    pincode: searchParams.get('pincode')?.match(/^\\d{6}$/)?.[0] || DEFAULT_LOCATION.pincode,
  }

  const responses = await Promise.allSettled(PLATFORMS.map(async (platform) => {
    const params = new URLSearchParams({ q: query, platform, ...location })
    const response = await fetch(`${API_BASE_URL}/v1/search?${params}`, {
      headers: { 'X-API-Key': apiKey, Accept: 'application/json' },
      cache: 'no-store',
    })
    const payload = (await response.json().catch(() => null)) as SearchResponse | null
    if (!response.ok) {
      const detail = typeof payload?.detail === 'object' ? payload.detail.message || payload.detail.error : payload?.detail
      throw new Error(`${platform}: ${detail || `Price service returned ${response.status}.`}`)
    }
    return payload
  }))

  const results = responses.flatMap((result) => {
    if (result.status !== 'fulfilled') return []
    const platform = result.value.data?.platform || ''
    return (result.value.data?.products || []).slice(0, 3).map((product) => ({
      ...product,
      platform,
      price: product.offer_price ?? product.selling_price ?? product.price ?? product.mrp,
    }))
  })
  const errors = responses.flatMap((result) => result.status === 'rejected' ? [result.reason instanceof Error ? result.reason.message : 'A platform could not be reached.'] : [])

  if (!results.length) {
    const creditsExhausted = errors.some((error) => error.includes('insufficient_credits') || error.includes('No active credits'))
    return NextResponse.json({
      error: creditsExhausted
        ? 'The grocery price API has no active credits. Top up the API account to continue live comparisons.'
        : errors.join(' ') || 'No platforms returned live products.',
      errors,
    }, { status: creditsExhausted ? 402 : 502 })
  }

  return NextResponse.json({ query, results, errors, fetchedAt: new Date().toISOString() })
}
