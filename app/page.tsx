'use client'

import { FormEvent, useState } from 'react'
import { ArrowRight, Check, ChevronDown, Moon, Search, Sun } from 'lucide-react'

const examples = ['Chicken breast', 'Avocado', 'Pasta', 'Greek yogurt']

const deals = [
  { store: 'Walmart', price: '$4.97', note: 'Best value', tone: 'lime' },
  { store: 'Target', price: '$5.49', note: 'Nearby', tone: 'yellow' },
  { store: 'Kroger', price: '$5.99', note: 'Pickup available', tone: 'blue' },
]

export default function Home() {
  const [query, setQuery] = useState('')
  const [searched, setSearched] = useState(false)
  const [dark, setDark] = useState(false)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (query.trim()) setSearched(true)
  }

  return (
    <div className={dark ? 'site dark' : 'site'}>
      <header className="nav shell">
        <a className="wordmark" href="#top" aria-label="smartprice home"><span className="mark">$</span>smartprice</a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#how">How it works</a><a href="#deals">Latest deals</a><a href="#about">About us</a>
        </nav>
        <div className="nav-actions"><button className="theme-button" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? <Sun size={17} /> : <Moon size={17} />}</button><a className="join-link" href="#deals">Join free <ArrowRight size={16} /></a></div>
      </header>

      <main id="top">
        <section className="hero shell">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> Grocery prices, made simple</p>
            <h1>Eat well.<br /><em>Spend less.</em></h1>
            <p className="intro">SmartPrice finds the best prices on the food you love, so you can shop with confidence and keep more money in your pocket.</p>
            <form className="search-form" onSubmit={submit}>
              <Search size={20} aria-hidden="true" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="What are you shopping for?" aria-label="Search for a grocery item" /><button type="submit">Find prices <ArrowRight size={17} /></button>
            </form>
            <div className="examples"><span>Try searching</span>{examples.map((item) => <button key={item} onClick={() => { setQuery(item); setSearched(false) }}>{item}</button>)}</div>
            {searched && <div className="results" aria-live="polite"><div className="result-heading"><strong>Best prices for {query}</strong><span>Updated just now</span></div>{deals.map((deal) => <div className="deal-row" key={deal.store}><span className={`store-dot ${deal.tone}`} /><b>{deal.store}</b><small>{deal.note}</small><strong>{deal.price}</strong></div>)}</div>}
          </div>
          <div className="hero-art" aria-label="Fresh groceries and savings" role="img">
            <div className="art-note">Good food<br /><span>is for everyone.</span></div>
            <div className="photo photo-avocado" /><div className="photo photo-tomato" /><div className="photo photo-bread" /><div className="price-sticker"><span>Save up to</span><strong>32%</strong><small>on your weekly shop</small></div>
          </div>
        </section>

        <section className="ticker"><div className="ticker-inner"><span>Compare smarter</span><i>•</i><span>Shop happier</span><i>•</i><span>Save every week</span><i>•</i><span>Compare smarter</span></div></section>

        <section className="how shell" id="how"><div className="section-label">The smart way to shop</div><div className="how-grid"><div><h2>Your basket,<br /><em>better priced.</em></h2><p>We take the guesswork out of grocery shopping. No spreadsheets, no coupon hunting — just clear prices and useful comparisons.</p><a className="text-link" href="#deals">See how it works <ArrowRight size={16} /></a></div><div className="steps"><div className="step"><span>01</span><div><h3>Search an item</h3><p>Tell us what is on your shopping list.</p></div></div><div className="step"><span>02</span><div><h3>Compare prices</h3><p>We surface the best local deals in seconds.</p></div></div><div className="step"><span>03</span><div><h3>Save your money</h3><p>Choose the price and store that works for you.</p></div></div></div></div></section>

        <section className="deal-banner shell" id="deals"><div><p className="eyebrow"><span className="eyebrow-dot" /> This week&apos;s pick</p><h2>Small swaps.<br /><em>Big savings.</em></h2></div><div className="banner-right"><p>Save an average of <strong>$18.40</strong> every time you shop with SmartPrice.</p><a className="light-button" href="#top">Start comparing <ArrowRight size={16} /></a></div></section>
      </main>
      <footer className="footer shell" id="about"><span className="wordmark"><span className="mark">$</span>smartprice</span><span>Prices change. Your savings don&apos;t have to.</span><span>© 2026 SmartPrice</span></footer>
    </div>
  )
}
