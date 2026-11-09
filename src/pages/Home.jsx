import { useEffect, useMemo, useRef, useState } from 'react'
import Art, { guessArt } from '../components/Art.jsx'
import Icon from '../components/Icons.jsx'
import { ensureUrl, formatPrice, isListed, rentable, unitLabel, waLink } from '../store.js'

/* ---------- small pieces ---------- */
function Photo({ item }) {
  const src = item.images?.[0]
  if (src) return <img className="card-img" src={src} alt={item.name} loading="lazy" />
  return (
    <span className="ph">
      <Art className="ph-art" type={item.art || guessArt(`${item.name} ${item.category}`)} />
      <span className="ph-tag">Photo coming soon</span>
    </span>
  )
}

function rentText(item) {
  const p = formatPrice(item.rentPrice)
  return p ? `${p} ${unitLabel(item.rentUnit)}` : null
}

function Price({ item, settings, large }) {
  const sale = formatPrice(item.salePrice)
  const rent = rentable(item, settings) ? rentText(item) : null
  const main = item.forSale ? sale : rent
  return (
    <div className={large ? 'price price-lg' : 'price'}>
      {main ? (
        <>
          <span className="price-num">{item.forSale ? sale : formatPrice(item.rentPrice)}</span>
          <span className="price-unit">{item.forSale ? 'sale price' : `rent ${unitLabel(item.rentUnit)}`}</span>
        </>
      ) : (
        <span className="price-num price-call">Call for price</span>
      )}
      {item.forSale && rent && <span className="price-rent">Or rent from {rent}</span>}
    </div>
  )
}

function Status({ status, className = '' }) {
  if (!status) return null
  const cls = `status ${status === 'In stock' ? 'status-ok' : 'status-off'} ${className}`
  return <span className={cls}>{status}</span>
}

const hello = (s) => `Hello ${s.businessName}, I would like to enquire about your equipment.`
const dotted = (item) => [item.category, item.condition, item.capacity].filter(Boolean)

/* ---------- header ---------- */
function Header({ settings }) {
  return (
    <header className="site-header">
      <div className="wrap header-in">
        <a className="brand" href="#top" aria-label={settings.businessName}>
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 5v22M8 9h18M10 9l6-4 6 4M24 9v8" />
            </svg>
          </span>
          <span className="brand-name">{settings.businessName}</span>
        </a>
        <nav className="nav" aria-label="Main">
          <a href="#equipment">Equipment</a>
          {settings.offerRental && <a href="#rental">Rental</a>}
          <a href="#contact">Contact</a>
          <a className="btn btn-ink btn-sm" href={waLink(settings, hello(settings))} target="_blank" rel="noreferrer">
            <Icon name="whatsapp" size={17} /> WhatsApp
          </a>
        </nav>
      </div>
    </header>
  )
}

/* ---------- hero ---------- */
function Hero({ settings, equipment }) {
  // Prefer the hero photo; otherwise reuse the first equipment photo so the site looks real as soon as photos exist.
  const img = settings.heroImage || equipment.find((e) => e.images?.length)?.images[0]
  const actions = (ghost) => (
    <div className="hero-actions">
      <a className="btn btn-yellow" href="#equipment">
        Browse equipment for sale
      </a>
      <a className={ghost ? 'btn btn-ghost' : 'btn btn-line'} href={waLink(settings, hello(settings))} target="_blank" rel="noreferrer">
        <Icon name="whatsapp" size={18} /> Chat on WhatsApp
      </a>
    </div>
  )

  if (img) {
    return (
      <section className="hero-photo" id="top">
        <div className="hero-photo-main">
          <img className="hero-bg" src={img} alt="" fetchpriority="high" />
          <div className="wrap hero-photo-in">
            <h1>{settings.heroTitle}</h1>
            <p className="lead">{settings.heroText}</p>
            {actions(true)}
            {settings.serviceArea && (
              <p className="hero-count">
                <Icon name="pin" size={16} /> {settings.serviceArea}
              </p>
            )}
          </div>
        </div>
        <div className="hazard" aria-hidden="true" />
      </section>
    )
  }

  return (
    <section className="hero" id="top">
      <div className="wrap hero-in">
        <div className="hero-copy">
          <h1>{settings.heroTitle}</h1>
          <p className="lead">{settings.heroText}</p>
          {actions(false)}
          <p className="hero-count">{equipment.length} machines listed right now{settings.offerRental ? ' · Rental also available' : ''}</p>
        </div>
        <div className="hero-art" aria-hidden="true">
          <Art type="crane" className="hero-svg" />
        </div>
      </div>
      <div className="hazard" aria-hidden="true" />
    </section>
  )
}

function Stats({ stats }) {
  if (!stats?.length) return null
  return (
    <section className="stats" aria-label="Our numbers">
      <div className="wrap stats-in" style={{ '--n': Math.min(stats.length, 4) }}>
        {stats.slice(0, 4).map((s, i) => (
          <div className="stat" key={i}>
            <p className="stat-v">{s.value}</p>
            <p className="stat-l">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------- catalog ---------- */
function Card({ item, settings, onOpen }) {
  const rent = rentable(item, settings)
  return (
    <li className="card">
      <button className="card-btn" onClick={() => onOpen(item)} aria-label={`View details for ${item.name}`}>
        <span className="card-photo">
          <Photo item={item} />
          <Status status={item.status} className="card-status" />
          {rent && <span className="rent-badge">Also for rent</span>}
        </span>
        <span className="card-body">
          <span className="row-cat">
            {dotted(item).map((t, i) => (
              <span key={t} className={i ? 'dot-sep' : ''}>
                {t}
              </span>
            ))}
          </span>
          <span className="card-name">{item.name}</span>
          {item.summary ? <span className="card-sum">{item.summary}</span> : null}
          <span className="card-foot">
            <Price item={item} settings={settings} />
            <span className="card-more">View details</span>
          </span>
        </span>
      </button>
    </li>
  )
}

function Catalog({ equipment, settings, onOpen }) {
  const listed = useMemo(() => equipment.filter((e) => isListed(e, settings)), [equipment, settings])
  const categories = useMemo(() => ['All', ...Array.from(new Set(listed.map((e) => e.category).filter(Boolean)))], [listed])
  const [cat, setCat] = useState('All')
  const [mode, setMode] = useState('all') // all | buy | rent
  const hasRent = settings.offerRental && listed.some((e) => e.forRent)
  const activeMode = hasRent ? mode : 'all'

  const shown = listed.filter(
    (e) =>
      (cat === 'All' || e.category === cat) &&
      (activeMode === 'all' || (activeMode === 'buy' && e.forSale) || (activeMode === 'rent' && e.forRent))
  )

  return (
    <section className="catalog" id="equipment">
      <div className="wrap">
        <p className="print-only print-title">{settings.businessName}: equipment price list</p>
        <div className="catalog-head">
          <div>
            <h2>Equipment for sale</h2>
            <p className="muted catalog-note">
              Tap a machine for photos, full specifications and to ask about price and stock.
              {settings.offerRental ? ' Machines marked "Also for rent" can be hired instead.' : ''}
            </p>
          </div>
          <div className="catalog-tools">
            <button className="btn btn-line btn-sm" onClick={() => window.print()}>
              <Icon name="download" size={16} /> Print or save price list
            </button>
          </div>
        </div>
        {hasRent && (
          <div className="seg" role="group" aria-label="Show equipment to">
            {[
              ['all', 'All'],
              ['buy', 'Buy'],
              ['rent', 'Rent'],
            ].map(([v, l]) => (
              <button key={v} className={v === activeMode ? 'seg-on' : ''} aria-pressed={v === activeMode} onClick={() => setMode(v)}>
                {l}
              </button>
            ))}
          </div>
        )}
        {categories.length > 2 && (
          <div className="chips" role="group" aria-label="Filter by category">
            {categories.map((c) => (
              <button key={c} className={c === cat ? 'chip chip-on' : 'chip'} aria-pressed={c === cat} onClick={() => setCat(c)}>
                {c}
              </button>
            ))}
          </div>
        )}
        {shown.length ? (
          <ul className="grid">
            {shown.map((item) => (
              <Card key={item.id} item={item} settings={settings} onOpen={onOpen} />
            ))}
          </ul>
        ) : (
          <p className="empty">Nothing matches this filter yet. Message us on WhatsApp and we will help you find the right machine.</p>
        )}
      </div>
    </section>
  )
}

/* ---------- how it works ---------- */
function How({ settings }) {
  const steps = [
    ['Choose your machine', 'Check the photos, specifications and price. Not sure which one? Tell us the job and we will suggest.'],
    ['Ask for your quote', 'Message us on WhatsApp or use the form. We confirm price, stock and delivery to your location.'],
    ['Pay and take delivery', 'We arrange delivery to your site and show you how to run it. Service and spare parts stay available.'],
  ]
  return (
    <section className="how" id="how">
      <div className="wrap">
        <h2>Buying is simple</h2>
        <ol className="how-steps">
          {steps.map(([t, d], i) => (
            <li className="how-step" key={t}>
              <span className="how-num">{i + 1}</span>
              <h3>{t}</h3>
              <p className="muted">{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Rental({ settings, equipment }) {
  const rentItems = equipment.filter((e) => e.forRent)
  if (!settings.offerRental || !rentItems.length) return null
  return (
    <section className="rental" id="rental">
      <div className="wrap rental-in">
        <div>
          <h2>Not ready to buy? Rent it.</h2>
          <p className="rental-lead">{settings.rentalNote}</p>
          <a
            className="btn btn-yellow"
            href={waLink(settings, `Hello ${settings.businessName}, I would like to rent equipment. Please share availability and rates.`)}
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="whatsapp" size={18} /> Ask about renting
          </a>
        </div>
        <ul className="rental-list">
          {rentItems.slice(0, 6).map((e) => (
            <li key={e.id}>
              <span>{e.name}</span>
              <strong>{rentText(e) || 'Call for price'}</strong>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------- our work ---------- */
function Work({ gallery }) {
  const [zoom, setZoom] = useState(null)
  useEffect(() => {
    if (zoom === null) return
    const onKey = (e) => e.key === 'Escape' && setZoom(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [zoom])
  if (!gallery?.length) return null
  return (
    <section className="work" id="work">
      <div className="wrap">
        <h2>Our equipment on site</h2>
        <p className="muted work-note">Recent jobs where our machines were at work.</p>
        <div className="work-grid">
          {gallery.map((src, i) => (
            <button key={i} onClick={() => setZoom(i)} aria-label={`Open photo ${i + 1}`}>
              <img src={src} alt={`Our equipment on a job site, photo ${i + 1}`} loading="lazy" />
            </button>
          ))}
        </div>
      </div>
      {zoom !== null && (
        <div className="lightbox" onMouseDown={(e) => e.target === e.currentTarget && setZoom(null)}>
          <button className="sheet-close" onClick={() => setZoom(null)} aria-label="Close photo">
            <Icon name="close" size={20} />
          </button>
          <img src={gallery[zoom]} alt={`Photo ${zoom + 1}`} />
        </div>
      )}
    </section>
  )
}

/* ---------- reviews ---------- */
function Reviews({ reviews }) {
  if (!reviews?.length) return null
  return (
    <section className="reviews" id="reviews">
      <div className="wrap">
        <h2>What customers say</h2>
        <div className="review-grid">
          {reviews.map((r, i) => (
            <figure className="review" key={i}>
              <blockquote>{r.text}</blockquote>
              <figcaption>{r.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- detail sheet ---------- */
function Sheet({ item, settings, onClose }) {
  const [idx, setIdx] = useState(0)
  const closeRef = useRef(null)
  const images = item.images?.length ? item.images : []

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const canRent = rentable(item, settings)
  const salePrice = formatPrice(item.salePrice)
  const priceNote = item.forSale && salePrice ? ` (${salePrice})` : ''
  const buyMsg = `Hello ${settings.businessName}, I want to buy the ${item.name}${priceNote}. Is it available?`
  const rentMsg = `Hello ${settings.businessName}, I would like to rent the ${item.name}${rentText(item) ? ` (${rentText(item)})` : ''}. Is it available?`
  const shareText = `${item.name}${priceNote}\n${window.location.href.split('#')[0]}`

  return (
    <div className="backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside className="sheet" role="dialog" aria-modal="true" aria-label={item.name}>
        <button ref={closeRef} className="sheet-close" onClick={onClose} aria-label="Close details">
          <Icon name="close" size={20} />
        </button>

        <div className="sheet-media">
          {images.length ? (
            <img src={images[idx]} alt={item.name} />
          ) : (
            <span className="ph">
              <Art type={item.art || guessArt(`${item.name} ${item.category}`)} className="ph-art" />
              <span className="ph-tag">Photo coming soon</span>
            </span>
          )}
        </div>
        {images.length > 1 && (
          <div className="thumbs">
            {images.map((src, i) => (
              <button key={i} className={i === idx ? 'thumb thumb-on' : 'thumb'} onClick={() => setIdx(i)} aria-label={`Photo ${i + 1}`}>
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        )}

        <div className="sheet-body">
          <p className="row-cat">
            {dotted(item).map((t, i) => (
              <span key={t} className={i ? 'dot-sep' : ''}>
                {t}
              </span>
            ))}
          </p>
          <h3 className="sheet-title">{item.name}</h3>
          <div className="sheet-price">
            <Price item={item} settings={settings} large />
            <Status status={item.status} />
          </div>
          {item.summary && <p className="sheet-sum">{item.summary}</p>}

          {item.features?.length > 0 && (
            <>
              <h4>What you get</h4>
              <ul className="ticks">
                {item.features.map((f) => (
                  <li key={f}>
                    <Icon name="check" size={18} /> {f}
                  </li>
                ))}
              </ul>
            </>
          )}

          {item.specs?.length > 0 && (
            <>
              <h4>Specifications</h4>
              <dl className="specs">
                {item.specs.map((s, i) => (
                  <div key={i} className="spec">
                    <dt>{s.k}</dt>
                    <dd>{s.v}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}

          <div className="sheet-cta">
            {item.forSale && (
              <a className="btn btn-yellow" href={waLink(settings, buyMsg)} target="_blank" rel="noreferrer">
                <Icon name="whatsapp" size={18} /> Ask about buying on WhatsApp
              </a>
            )}
            {canRent && (
              <a className={item.forSale ? 'btn btn-line' : 'btn btn-yellow'} href={waLink(settings, rentMsg)} target="_blank" rel="noreferrer">
                <Icon name="whatsapp" size={18} /> Ask about renting
              </a>
            )}
            {settings.phone && (
              <a className="btn btn-line" href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`}>
                <Icon name="phone" size={18} /> Call {settings.phone}
              </a>
            )}
            <a className="share" href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noreferrer">
              Share this machine on WhatsApp
            </a>
          </div>
        </div>
      </aside>
    </div>
  )
}

/* ---------- enquiry + footer ---------- */
function Enquiry({ settings, equipment }) {
  const [f, setF] = useState({ name: '', phone: '', want: 'buy', item: '', note: '' })
  const [err, setErr] = useState('')
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    if (!settings.whatsapp) return setErr('WhatsApp is not set up yet. Please call us instead.')
    if (!f.name.trim() || !f.phone.trim()) return setErr('Enter your name and phone number so we can reply.')
    setErr('')
    const text = [
      `Hello ${settings.businessName}, I would like a quote to ${f.want === 'rent' ? 'rent' : 'buy'} equipment.`,
      `Name: ${f.name.trim()}`,
      `Phone: ${f.phone.trim()}`,
      f.item ? `Equipment: ${f.item}` : '',
      f.note.trim() ? `Details: ${f.note.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n')
    window.open(waLink(settings, text), '_blank', 'noopener')
  }

  return (
    <form className="enquiry" onSubmit={submit}>
      <h3>Get a quote</h3>
      <div className="grid-2">
        <div className="field">
          <label htmlFor="q-name">Your name</label>
          <input id="q-name" value={f.name} onChange={set('name')} autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="q-phone">Phone number</label>
          <input id="q-phone" value={f.phone} onChange={set('phone')} inputMode="tel" autoComplete="tel" />
        </div>
      </div>
      {settings.offerRental && (
        <div className="field">
          <span className="label">I want to</span>
          <div className="seg seg-form" role="group" aria-label="Buy or rent">
            {[
              ['buy', 'Buy'],
              ['rent', 'Rent'],
            ].map(([v, l]) => (
              <button type="button" key={v} className={v === f.want ? 'seg-on' : ''} aria-pressed={v === f.want} onClick={() => setF((s) => ({ ...s, want: v }))}>
                {l}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="field">
        <label htmlFor="q-item">Equipment you need</label>
        <select id="q-item" value={f.item} onChange={set('item')}>
          <option value="">Not sure yet</option>
          {equipment.map((e) => (
            <option key={e.id}>{e.name}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="q-note">{f.want === 'rent' ? 'Site location and dates' : 'Delivery location and when you need it'}</label>
        <textarea id="q-note" value={f.note} onChange={set('note')} placeholder={f.want === 'rent' ? 'e.g. Andheri, from 15 Dec for 2 weeks' : 'e.g. Pune, within 2 weeks'} />
      </div>
      {err && <p className="error-text">{err}</p>}
      <button className="btn btn-ink" type="submit">
        <Icon name="whatsapp" size={18} /> Send enquiry on WhatsApp
      </button>
    </form>
  )
}

function Footer({ settings, equipment }) {
  const socials = [
    { name: 'whatsapp', label: 'WhatsApp', href: settings.whatsapp ? waLink(settings, `Hello ${settings.businessName}`) : '' },
    { name: 'instagram', label: 'Instagram', href: ensureUrl(settings.instagram) },
    { name: 'facebook', label: 'Facebook', href: ensureUrl(settings.facebook) },
    { name: 'youtube', label: 'YouTube', href: ensureUrl(settings.youtube) },
  ].filter((s) => s.href)

  return (
    <footer className="footer" id="contact">
      <div className="wrap footer-in">
        <div>
          <h2>Need a machine on your site?</h2>
          <p className="footer-lead">Tell us what you need and where. We reply with availability and a final quote.</p>
          <Enquiry settings={settings} equipment={equipment} />
        </div>
        <div className="contact">
          {settings.phone && (
            <a href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`}>
              <Icon name="phone" size={18} /> {settings.phone}
            </a>
          )}
          {settings.email && (
            <a href={`mailto:${settings.email}`}>
              <Icon name="mail" size={18} /> {settings.email}
            </a>
          )}
          {settings.address && (
            <span>
              <Icon name="pin" size={18} /> {settings.address}
            </span>
          )}
          {settings.serviceArea && <p className="area">We deliver to: {settings.serviceArea}</p>}
          {settings.mapsUrl && (
            <a className="btn btn-ink btn-sm" href={ensureUrl(settings.mapsUrl)} target="_blank" rel="noreferrer">
              <Icon name="pin" size={16} /> Get directions
            </a>
          )}
          {socials.length > 0 && (
            <div className="socials">
              {socials.map((s) => (
                <a key={s.name} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} title={s.label}>
                  <Icon name={s.name} size={20} />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="wrap footer-base">
        <span>
          © {new Date().getFullYear()} {settings.businessName}
        </span>
        <a href="#/admin">Admin</a>
      </div>
    </footer>
  )
}

/* ---------- search engine tags ---------- */
function useSeo(settings, equipment) {
  useEffect(() => {
    const names = equipment.slice(0, 6).map((e) => e.name).join(', ')
    const desc = `${settings.businessName}: ${names || 'construction equipment'} for sale${settings.offerRental ? ' and rent' : ''}.${
      settings.serviceArea ? ` Serving ${settings.serviceArea}.` : ''
    }`
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.content = desc

    let ld = document.getElementById('ld-business')
    if (!ld) {
      ld = document.createElement('script')
      ld.type = 'application/ld+json'
      ld.id = 'ld-business'
      document.head.appendChild(ld)
    }
    const sameAs = [settings.instagram, settings.facebook, settings.youtube].filter(Boolean).map(ensureUrl)
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: settings.businessName,
      url: window.location.href.split('#')[0],
      ...(settings.phone && { telephone: settings.phone }),
      ...(settings.email && { email: settings.email }),
      ...(settings.address && { address: { '@type': 'PostalAddress', streetAddress: settings.address } }),
      ...(settings.serviceArea && { areaServed: settings.serviceArea }),
      ...(sameAs.length && { sameAs }),
    })
  }, [settings, equipment])
}

/* ---------- page ---------- */
export default function Home({ data, error }) {
  const { settings, equipment } = data
  const [open, setOpen] = useState(null)
  useSeo(settings, equipment)

  const tel = settings.phone ? `tel:${settings.phone.replace(/[^\d+]/g, '')}` : ''

  return (
    <>
      <Header settings={settings} />
      <main>
        {error && <p className="banner-error">{error}</p>}
        <Hero settings={settings} equipment={equipment} />
        <Stats stats={settings.stats} />
        <Catalog equipment={equipment} settings={settings} onOpen={setOpen} />
        <How settings={settings} />
        <Rental settings={settings} equipment={equipment} />
        <Work gallery={settings.gallery} />
        <Reviews reviews={settings.reviews} />
      </main>
      <Footer settings={settings} equipment={equipment.filter((e) => isListed(e, settings))} />

      {(tel || settings.whatsapp) && (
        <div className="mbar">
          {tel && (
            <a href={tel}>
              <Icon name="phone" size={18} /> Call
            </a>
          )}
          {settings.whatsapp && (
            <a className="wa" href={waLink(settings, hello(settings))} target="_blank" rel="noreferrer">
              <Icon name="whatsapp" size={18} /> WhatsApp
            </a>
          )}
        </div>
      )}
      {settings.whatsapp && (
        <a className="fab" href={waLink(settings, hello(settings))} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
          <Icon name="whatsapp" size={28} />
        </a>
      )}
      {open && <Sheet item={open} settings={settings} onClose={() => setOpen(null)} />}
    </>
  )
}
