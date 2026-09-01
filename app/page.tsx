'use client'

import { FormEvent, useState } from 'react'
import { ArrowRight, LoaderCircle, Moon, Search, Sun } from 'lucide-react'

const examples = ['Atta 5kg', 'Basmati rice', 'Milk 1L', 'Maggi noodles']

const deals = [
  { store: 'Blinkit', price: '₹249', note: 'Delivery in 10 min', tone: 'lime' },
  { store: 'Zepto', price: '₹255', note: 'Best nearby deal', tone: 'yellow' },
  { store: 'BigBasket', price: '₹268', note: 'Scheduled delivery', tone: 'blue' },
]

export default function Home() {
  const [query, setQuery] = useState('')
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [liveDeals, setLiveDeals] = useState<typeof deals>([])
  const [dark, setDark] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!query.trim() || loading) return
    setLoading(true)
    setError('')
    setSearched(false)
    try {
      const response = await fetch(`/api/prices?q=${encodeURIComponent(query.trim())}`)
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Could not load prices')
      const rows = Array.isArray(payload) ? payload : payload.deals || payload.products || []
      setLiveDeals(rows.map((row: { store?: string; retailer?: string; platform?: string; price?: string | number; amount?: string | number; note?: string }) => ({
        store: row.store || row.retailer || row.platform || 'Quick commerce',
        price: typeof (row.price ?? row.amount) === 'number' ? `₹${row.price ?? row.amount}` : String(row.price ?? row.amount ?? '—'),
        note: row.note || 'Live price',
        tone: 'lime',
      })))
      setSearched(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to fetch live prices right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={dark ? 'site dark' : 'site'}>
      <header className="nav shell">
        <a className="wordmark" href="#top" aria-label="smartprice home"><span className="mark">₹</span>smartprice</a>
        <nav className="desktop-nav" aria-label="Main navigation"><a href="#how">How it works</a><a href="#deals">Today&apos;s deals</a><a href="#about">About us</a></nav>
        <div className="nav-actions"><button className="theme-button" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? <Sun size={17} /> : <Moon size={17} />}</button><a className="join-link" href="#deals">Join free <ArrowRight size={16} /></a></div>
      </header>

      <main id="top">
        <section className="hero shell">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> India&apos;s grocery price checker</p>
            <h1>Shop smart.<br /><em>Save more.</em></h1>
            <p className="intro">Compare grocery prices across Blinkit, Zepto, Swiggy Instamart, BigBasket and JioMart — all in one simple search.</p>
            <form className="search-form" onSubmit={submit}><Search size={20} aria-hidden="true" /><input value={query} onChange={(e) => { setQuery(e.target.value); setSearched(false); setError('') }} placeholder="What&apos;s on your shopping list?" aria-label="Search for an Indian grocery item" /><button type="submit" disabled={loading}>{loading ? <><LoaderCircle size={17} className="spin" /> Checking live prices</> : <>Find live prices <ArrowRight size={17} /></>}</button></form>
            <div className="examples"><span>Try searching</span>{examples.map((item) => <button key={item} type="button" onClick={() => { setQuery(item); setSearched(false) }}>{item}</button>)}</div>
            {error && <p className="api-error" role="alert">{error}</p>}{searched && <div className="results" aria-live="polite"><div className="result-heading"><strong>Live prices for {query}</strong><span>Fetched just now</span></div>{liveDeals.length ? liveDeals.map((deal) => <div className="deal-row" key={`${deal.store}-${deal.price}`}><span className={`store-dot ${deal.tone}`} /><b>{deal.store}</b><small>{deal.note}</small><strong>{deal.price}</strong></div>) : <p className="empty-results">No live products were returned for this search.</p>}</div>}
          </div>
          <div className="hero-art" aria-label="Indian groceries and savings" role="img"><div className="art-note">Your thali<br /><span>for less.</span></div><div className="photo photo-avocado" /><div className="photo photo-tomato" /><div className="photo photo-bread" /><div className="price-sticker"><span>Save up to</span><strong>32%</strong><small>on your monthly shop</small></div></div>
        </section>

        <section className="ticker"><div className="ticker-inner"><span>Compare smarter</span><i>•</i><span>Desi staples</span><i>•</i><span>Save every week</span><i>•</i><span>Compare smarter</span></div></section>
        <section className="how shell" id="how"><div className="section-label">The smart way to shop</div><div className="how-grid"><div><h2>Your basket,<br /><em>better priced.</em></h2><p>From dal and atta to snacks and fresh produce, smartprice finds the best deal across India&apos;s favourite grocery apps.</p><a className="text-link" href="#deals">See how it works <ArrowRight size={16} /></a></div><div className="steps"><div className="step"><span>01</span><div><h3>Search an item</h3><p>Tell us what is on your shopping list.</p></div></div><div className="step"><span>02</span><div><h3>Compare apps</h3><p>See live prices from the apps you already use.</p></div></div><div className="step"><span>03</span><div><h3>Save your money</h3><p>Pick the best price, delivery time and store.</p></div></div></div></div></section>
        <section className="deal-banner shell" id="deals"><div><p className="eyebrow"><span className="eyebrow-dot" /> This week&apos;s pick</p><h2>Everyday prices.<br /><em>Everyday wins.</em></h2></div><div className="banner-right"><p>Save an average of <strong>₹850</strong> every month by comparing before you tap buy.</p><a className="light-button" href="#top">Start comparing <ArrowRight size={16} /></a></div></section>
      </main>
      <footer className="footer shell" id="about"><span className="wordmark"><span className="mark">₹</span>smartprice</span><span>Prices change. Your savings don&apos;t have to.</span><span>© 2026 SmartPrice India</span></footer>
    </div>
  )
}
