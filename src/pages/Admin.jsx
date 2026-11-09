import { useRef, useState } from 'react'
import JSZip from 'jszip'
import Art, { guessArt } from '../components/Art.jsx'
import Icon from '../components/Icons.jsx'
import {
  CONDITIONS,
  RENT_UNITS,
  STATUSES,
  formatPrice,
  getPassword,
  newId,
  setPassword,
  unitLabel,
  withDefaults,
} from '../store.js'

const MAX_PHOTOS = 6

// Resize and compress a photo so many fit in browser storage and the site loads fast.
function fileToDataUrl(file, max = 1400, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

const slug = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) || 'item'

// Short content hash so a changed photo always gets a new file name (avoids stale browser cache).
function shortHash(str) {
  let h = 5381
  for (let i = 0; i < str.length; i += 7) h = ((h << 5) + h + str.charCodeAt(i)) | 0
  return (h >>> 0).toString(36)
}

// Turn the data into a zip: equipment.json + images/ folder with real .jpg files.
async function buildZip(data) {
  const zip = new JSZip()
  const folder = zip.folder('images')
  const stash = (src, name) => {
    if (!src || !src.startsWith('data:')) return src
    const file = `${name}-${shortHash(src)}.jpg`
    folder.file(file, src.split(',')[1], { base64: true })
    return `images/${file}`
  }
  const out = JSON.parse(JSON.stringify(data))
  out.equipment.forEach((e) => {
    e.images = (e.images || []).map((s, i) => stash(s, `${slug(e.name)}-${i + 1}`))
  })
  out.settings.heroImage = stash(out.settings.heroImage, 'hero')
  out.settings.gallery = (out.settings.gallery || []).map((s, i) => stash(s, `work-${i + 1}`))
  zip.file('equipment.json', JSON.stringify(out, null, 2))
  return zip.generateAsync({ type: 'blob' })
}

function offerText(item) {
  const parts = []
  if (item.forSale) parts.push(formatPrice(item.salePrice) ? `Sale ${formatPrice(item.salePrice)}` : 'Sale: call for price')
  if (item.forRent) parts.push(formatPrice(item.rentPrice) ? `Rent ${formatPrice(item.rentPrice)} ${unitLabel(item.rentUnit)}` : 'Rent: call for price')
  return parts.join(' · ') || 'Not listed'
}

const blankForm = {
  id: '',
  name: '',
  category: '',
  forSale: true,
  salePrice: '',
  condition: 'New',
  status: 'In stock',
  forRent: false,
  rentPrice: '',
  rentUnit: 'day',
  capacity: '',
  summary: '',
  featuresText: '',
  specsText: '',
  images: [],
}

function toForm(item) {
  return {
    id: item.id,
    name: item.name || '',
    category: item.category || '',
    forSale: !!item.forSale,
    salePrice: item.salePrice ? String(item.salePrice) : '',
    condition: item.condition || 'New',
    status: item.status || 'In stock',
    forRent: !!item.forRent,
    rentPrice: item.rentPrice ? String(item.rentPrice) : '',
    rentUnit: item.rentUnit || 'day',
    capacity: item.capacity || '',
    summary: item.summary || '',
    featuresText: (item.features || []).join('\n'),
    specsText: (item.specs || []).map((s) => (s.v ? `${s.k}: ${s.v}` : s.k)).join('\n'),
    images: item.images || [],
    art: item.art,
  }
}

const num = (v) => Number(String(v).replace(/[^\d.]/g, '')) || 0

function fromForm(f) {
  const lines = (t) => t.split('\n').map((l) => l.trim()).filter(Boolean)
  return {
    id: f.id || newId(),
    name: f.name.trim(),
    category: f.category.trim() || 'Other',
    forSale: f.forSale,
    salePrice: num(f.salePrice),
    condition: f.condition,
    status: f.status,
    forRent: f.forRent,
    rentPrice: num(f.rentPrice),
    rentUnit: f.rentUnit,
    capacity: f.capacity.trim(),
    summary: f.summary.trim(),
    features: lines(f.featuresText),
    specs: lines(f.specsText).map((l) => {
      const i = l.indexOf(':')
      return i === -1 ? { k: l, v: '' } : { k: l.slice(0, i).trim(), v: l.slice(i + 1).trim() }
    }),
    images: f.images,
    art: f.art || guessArt(`${f.name} ${f.category}`),
  }
}

// "10+ | Years in business" per line  <->  [{ value, label }]
const parsePairs = (text, a, b) =>
  text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const i = l.indexOf('|')
      return i === -1 ? { [a]: l, [b]: '' } : { [a]: l.slice(0, i).trim(), [b]: l.slice(i + 1).trim() }
    })
const pairsToText = (arr, a, b) => (arr || []).map((x) => `${x[a]} | ${x[b]}`).join('\n')

/* ---------------- photo picker ---------------- */
function PhotoPicker({ images, onChange, max, label, hint, size, showCover }) {
  const fileRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const add = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, max - images.length)
    e.target.value = ''
    if (!files.length) return
    setBusy(true)
    setErr('')
    try {
      const urls = await Promise.all(files.map((x) => fileToDataUrl(x, size)))
      onChange([...images, ...urls].slice(0, max))
    } catch {
      setErr('One of the photos could not be read. Use a JPG or PNG file.')
    }
    setBusy(false)
  }

  return (
    <div className="field">
      <span className="label">{label}</span>
      <div className="photos">
        {images.map((src, i) => (
          <div className="photo" key={i}>
            <img src={src} alt={`Photo ${i + 1}`} />
            {showCover && i === 0 && <span className="photo-tag">Cover</span>}
            <button type="button" className="photo-x" aria-label={`Remove photo ${i + 1}`} onClick={() => onChange(images.filter((_, j) => j !== i))}>
              <Icon name="close" size={14} />
            </button>
          </div>
        ))}
        {images.length < max && (
          <button type="button" className="photo-add" onClick={() => fileRef.current?.click()} disabled={busy}>
            <span>
              <Icon name="image" size={22} />
              <br />
              {busy ? 'Adding…' : 'Add photo'}
            </span>
          </button>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple={max > 1} hidden onChange={add} />
      {hint && <span className="hint">{hint}</span>}
      {err && <span className="error-text">{err}</span>}
    </div>
  )
}

/* ---------------- login ---------------- */
function Login({ onOk }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const submit = (e) => {
    e.preventDefault()
    if (pw === getPassword()) {
      sessionStorage.setItem('ce_admin_ok', '1')
      onOk()
    } else setErr('That password is not correct. Try again.')
  }
  return (
    <div className="admin">
      <div className="wrap">
        <form className="panel login" onSubmit={submit}>
          <h2>Admin sign in</h2>
          <p className="muted">Enter your password to manage equipment.</p>
          <div className="field">
            <label htmlFor="pw">Password</label>
            <input id="pw" type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus autoComplete="current-password" />
          </div>
          {err && <p className="error-text">{err}</p>}
          <div className="form-actions">
            <button className="btn btn-yellow" type="submit">
              Sign in
            </button>
            <a className="btn btn-line" href="#top" onClick={() => (window.location.hash = '')}>
              Back to website
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ---------------- equipment form ---------------- */
function EquipmentForm({ initial, categories, onSave, onCancel, isNew }) {
  const [f, setF] = useState(initial)
  const [err, setErr] = useState('')
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }))

  // An empty price is allowed: the website then shows "Call for price".
  const submit = (e) => {
    e.preventDefault()
    if (!f.name.trim()) return setErr('Enter the equipment name.')
    if (!f.forSale && !f.forRent) return setErr('Choose whether this machine is for sale, for rent, or both.')
    setErr('')
    onSave(fromForm(f))
  }

  return (
    <form className="panel" onSubmit={submit}>
      <h2>{isNew ? 'Add new equipment' : `Edit ${initial.name || 'equipment'}`}</h2>
      <p className="muted">Fill in what you know. Anything left empty is simply hidden on the website.</p>

      <PhotoPicker
        label={`Photos (up to ${MAX_PHOTOS}, the first one is the cover)`}
        images={f.images}
        onChange={(images) => setF((s) => ({ ...s, images }))}
        max={MAX_PHOTOS}
        size={1400}
        showCover
        hint="Use real photos of your own machine, taken in daylight from a few angles. Real photos get more enquiries than illustrations."
      />

      <div className="grid-2">
        <div className="field">
          <label htmlFor="name">Equipment name</label>
          <input id="name" value={f.name} onChange={set('name')} placeholder="e.g. Monkey Crane 500 kg" />
        </div>
        <div className="field">
          <label htmlFor="category">Category</label>
          <input id="category" list="cats" value={f.category} onChange={set('category')} placeholder="e.g. Cranes, Mixers, Hoists" />
          <datalist id="cats">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
      </div>

      <fieldset className="offer">
        <legend>How do you offer it?</legend>
        <label className="check">
          <input type="checkbox" checked={f.forSale} onChange={(e) => setF((s) => ({ ...s, forSale: e.target.checked }))} />
          For sale
        </label>
        {f.forSale && (
          <div className="grid-3 offer-fields">
            <div className="field">
              <label htmlFor="salePrice">Sale price in ₹</label>
              <input id="salePrice" inputMode="numeric" value={f.salePrice} onChange={set('salePrice')} placeholder="e.g. 85000" />
              <span className="hint">Leave empty to show "Call for price".</span>
            </div>
            <div className="field">
              <label htmlFor="condition">Condition</label>
              <select id="condition" value={f.condition} onChange={set('condition')}>
                {CONDITIONS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="status">Stock</label>
              <select id="status" value={f.status} onChange={set('status')}>
                {STATUSES.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </div>
          </div>
        )}
        <label className="check">
          <input type="checkbox" checked={f.forRent} onChange={(e) => setF((s) => ({ ...s, forRent: e.target.checked }))} />
          Also available for rent
        </label>
        {f.forRent && (
          <div className="grid-2 offer-fields">
            <div className="field">
              <label htmlFor="rentPrice">Rent price in ₹</label>
              <input id="rentPrice" inputMode="numeric" value={f.rentPrice} onChange={set('rentPrice')} placeholder="e.g. 1200" />
            </div>
            <div className="field">
              <label htmlFor="rentUnit">Rent is charged</label>
              <select id="rentUnit" value={f.rentUnit} onChange={set('rentUnit')}>
                {RENT_UNITS.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </fieldset>

      <div className="field">
        <label htmlFor="capacity">Capacity or size</label>
        <input id="capacity" value={f.capacity} onChange={set('capacity')} placeholder="e.g. 500 kg, 10/7 cu ft, 14 t" />
      </div>

      <div className="field">
        <label htmlFor="summary">Short description</label>
        <textarea id="summary" value={f.summary} onChange={set('summary')} placeholder="One or two lines on what it is and where it is used." />
      </div>

      <div className="grid-2">
        <div className="field">
          <label htmlFor="features">Features</label>
          <textarea id="features" value={f.featuresText} onChange={set('featuresText')} placeholder={'One feature per line\nOperator included\nDelivered to site'} />
          <span className="hint">Type one feature per line.</span>
        </div>
        <div className="field">
          <label htmlFor="specs">Specifications</label>
          <textarea id="specs" value={f.specsText} onChange={set('specsText')} placeholder={'Name: value, one per line\nLifting height: 45 m\nMotor: 5 HP'} />
          <span className="hint">Use the format Name: value, one per line.</span>
        </div>
      </div>

      {err && <p className="error-text">{err}</p>}
      <div className="form-actions">
        <button className="btn btn-yellow" type="submit">
          {isNew ? 'Add equipment' : 'Save changes'}
        </button>
        <button className="btn btn-line" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

/* ---------------- equipment list ---------------- */
function EquipmentTab({ data, save }) {
  const [editing, setEditing] = useState(null) // null | 'new' | item id
  const [msg, setMsg] = useState('')
  const list = data.equipment
  const categories = Array.from(new Set(list.map((e) => e.category).filter(Boolean)))
  const noPhoto = list.filter((e) => !e.images?.length).length

  const commit = (equipment, ok = 'Saved. Remember to publish (see the Publish tab).') => {
    const done = save({ ...data, equipment })
    setMsg(done ? ok : 'Could not save: browser storage is full. Remove a few photos and try again.')
    return done
  }

  const onSave = (item) => {
    const exists = list.some((e) => e.id === item.id)
    const next = exists ? list.map((e) => (e.id === item.id ? item : e)) : [item, ...list]
    if (commit(next, exists ? `Saved changes to ${item.name}.` : `Added ${item.name}.`)) setEditing(null)
  }

  const remove = (item) => {
    if (window.confirm(`Delete ${item.name}? This cannot be undone.`)) commit(list.filter((e) => e.id !== item.id), `Deleted ${item.name}.`)
  }

  const duplicate = (item) => {
    commit([{ ...item, id: newId(), name: `${item.name} (copy)` }, ...list], `Duplicated ${item.name}.`)
  }

  if (editing) {
    const item = editing === 'new' ? null : list.find((e) => e.id === editing)
    return (
      <EquipmentForm
        key={editing}
        isNew={editing === 'new'}
        initial={item ? toForm(item) : blankForm}
        categories={categories}
        onSave={onSave}
        onCancel={() => setEditing(null)}
      />
    )
  }

  return (
    <section className="panel">
      <div className="catalog-head" style={{ marginBottom: 8 }}>
        <div>
          <h2>Equipment ({list.length})</h2>
          <p className="muted">This is everything shown on your website.</p>
        </div>
        <button className="btn btn-yellow" onClick={() => setEditing('new')}>
          <Icon name="plus" size={18} /> Add new equipment
        </button>
      </div>
      {noPhoto > 0 && (
        <p className="note">
          <span>
            {noPhoto} {noPhoto === 1 ? 'machine has' : 'machines have'} no photo yet. Open Edit and add real photos so the site looks professional.
          </span>
        </p>
      )}
      {msg && (
        <p className="note" role="status">
          {msg}
        </p>
      )}
      {list.length === 0 ? (
        <p className="empty">No equipment yet. Add your first machine to show it on the website.</p>
      ) : (
        <ul className="list">
          {list.map((item) => (
            <li className="list-item" key={item.id}>
              <div className="list-thumb">{item.images?.[0] ? <img src={item.images[0]} alt="" /> : <Art type={item.art || guessArt(item.name)} />}</div>
              <div>
                <div className="list-name">{item.name}</div>
                <div className="list-meta">
                  {item.category} · {offerText(item)} · {item.status}
                </div>
              </div>
              <div className="list-actions">
                <button className="icon-btn" onClick={() => setEditing(item.id)}>
                  <Icon name="pencil" size={16} /> Edit
                </button>
                <button className="icon-btn" onClick={() => duplicate(item)} aria-label={`Duplicate ${item.name}`}>
                  <Icon name="copy" size={16} />
                </button>
                <button className="icon-btn danger" onClick={() => remove(item)} aria-label={`Delete ${item.name}`}>
                  <Icon name="trash" size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

/* ---------------- business details ---------------- */
function BusinessTab({ data, save }) {
  const [s, setS] = useState(data.settings)
  const [statsText, setStatsText] = useState(pairsToText(data.settings.stats, 'value', 'label'))
  const [reviewsText, setReviewsText] = useState(pairsToText(data.settings.reviews, 'name', 'text'))
  const [msg, setMsg] = useState('')
  const [pw, setPw] = useState({ next: '', again: '' })
  const [pwMsg, setPwMsg] = useState('')
  const set = (k) => (e) => setS((x) => ({ ...x, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const settings = {
      ...s,
      stats: parsePairs(statsText, 'value', 'label').slice(0, 4),
      reviews: parsePairs(reviewsText, 'name', 'text').filter((r) => r.text),
    }
    setMsg(save({ ...data, settings }) ? 'Saved. Remember to publish (see the Publish tab).' : 'Could not save: browser storage is full. Remove a few photos and try again.')
  }

  const changePw = (e) => {
    e.preventDefault()
    if (pw.next.length < 6) return setPwMsg('Use at least 6 characters.')
    if (pw.next !== pw.again) return setPwMsg('The two passwords do not match.')
    setPassword(pw.next)
    setPw({ next: '', again: '' })
    setPwMsg('Password changed on this browser.')
  }

  const text = (k, label, props = {}) => (
    <div className="field">
      <label htmlFor={k}>{label}</label>
      <input id={k} value={s[k] || ''} onChange={set(k)} {...props} />
    </div>
  )

  return (
    <>
      <form className="panel" onSubmit={submit}>
        <h2>Business details</h2>
        <p className="muted">These appear in the header, hero and footer. Sections and buttons are hidden when you leave their details empty.</p>

        <PhotoPicker
          label="Homepage photo"
          images={s.heroImage ? [s.heroImage] : []}
          onChange={(a) => setS((x) => ({ ...x, heroImage: a[0] || '' }))}
          max={1}
          size={1920}
          hint="A wide, bright photo of your best machine at work. If you leave this empty, the first equipment photo is used."
        />

        <div className="field">
          <label className="check">
            <input type="checkbox" checked={!!s.offerRental} onChange={(e) => setS((x) => ({ ...x, offerRental: e.target.checked }))} />
            We also offer equipment on rent
          </label>
          <span className="hint">Turn this off to hide all rental prices, the Rent filter and the rental section. Your rental settings on each machine are kept.</span>
        </div>
        {s.offerRental && (
          <div className="field">
            <label htmlFor="rentalNote">Rental message on the website</label>
            <textarea id="rentalNote" value={s.rentalNote || ''} onChange={set('rentalNote')} />
            <span className="hint">For example: minimum days, deposit, delivery charges.</span>
          </div>
        )}
        {text('businessName', 'Business name')}
        {text('heroTitle', 'Homepage headline')}
        <div className="field">
          <label htmlFor="heroText">Homepage intro</label>
          <textarea id="heroText" value={s.heroText} onChange={set('heroText')} />
        </div>
        <div className="grid-2">
          {text('phone', 'Phone number', { placeholder: '+91 99999 99999' })}
          {text('whatsapp', 'WhatsApp number', { placeholder: '919999999999', inputMode: 'numeric' })}
        </div>
        <span className="hint" style={{ display: 'block', marginTop: -8, marginBottom: 16 }}>
          WhatsApp number: country code first, digits only, for example 919876543210.
        </span>
        <div className="grid-2">
          {text('email', 'Email', { type: 'email' })}
          {text('address', 'Address')}
        </div>
        <div className="grid-2">
          {text('serviceArea', 'Areas you deliver to', { placeholder: 'e.g. Mumbai, Thane, Navi Mumbai' })}
          {text('mapsUrl', 'Google Maps link', { placeholder: 'https://maps.google.com/…' })}
        </div>
        <div className="grid-3" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
          {text('instagram', 'Instagram link', { placeholder: 'https://instagram.com/…' })}
          {text('facebook', 'Facebook link', { placeholder: 'https://facebook.com/…' })}
          {text('youtube', 'YouTube link', { placeholder: 'https://youtube.com/…' })}
        </div>

        <h2 style={{ marginTop: 28 }}>Build trust</h2>
        <p className="muted">Real numbers and real reviews bring in more enquiries. Only add what is true for your business.</p>
        <div className="field">
          <label htmlFor="stats">Key numbers (up to 4)</label>
          <textarea id="stats" value={statsText} onChange={(e) => setStatsText(e.target.value)} placeholder={'One per line: number | label\n12+ | Years in business\n40+ | Machines available'} />
        </div>
        <div className="field">
          <label htmlFor="reviews">Customer reviews</label>
          <textarea id="reviews" value={reviewsText} onChange={(e) => setReviewsText(e.target.value)} placeholder={'One per line: name | review\nRavi Shah, Builder | Machine arrived on time and ran without trouble.'} />
          <span className="hint">Use reviews from customers who agreed to be quoted.</span>
        </div>
        <PhotoPicker
          label="Photos of your equipment on job sites (up to 8)"
          images={s.gallery || []}
          onChange={(gallery) => setS((x) => ({ ...x, gallery }))}
          max={8}
          size={1200}
          hint="Shows real work. The section appears on the website once you add photos."
        />

        {msg && (
          <p className="note" role="status">
            {msg}
          </p>
        )}
        <div className="form-actions">
          <button className="btn btn-yellow" type="submit">
            Save details
          </button>
        </div>
      </form>

      <form className="panel" onSubmit={changePw}>
        <h2>Change admin password</h2>
        <p className="muted">The default password is admin123. Change it before you share the link.</p>
        <div className="grid-2">
          <div className="field">
            <label htmlFor="np">New password</label>
            <input id="np" type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} autoComplete="new-password" />
          </div>
          <div className="field">
            <label htmlFor="np2">Repeat new password</label>
            <input id="np2" type="password" value={pw.again} onChange={(e) => setPw({ ...pw, again: e.target.value })} autoComplete="new-password" />
          </div>
        </div>
        {pwMsg && (
          <p className="note" role="status">
            {pwMsg}
          </p>
        )}
        <button className="btn btn-line" type="submit">
          Change password
        </button>
      </form>
    </>
  )
}

/* ---------------- publish ---------------- */
function PublishTab({ data, fromLocal, save, onDiscard }) {
  const fileRef = useRef(null)
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  const exportZip = async () => {
    setBusy(true)
    try {
      downloadBlob('website-update.zip', await buildZip(data))
      setMsg('website-update.zip downloaded. Follow the steps above to upload it.')
    } catch {
      setMsg('Could not create the zip file. Try again.')
    }
    setBusy(false)
  }

  const importJson = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const parsed = JSON.parse(await file.text())
      if (!Array.isArray(parsed.equipment)) throw new Error()
      setMsg(save(withDefaults(parsed)) ? `Imported ${parsed.equipment.length} items.` : 'Could not save: browser storage is full.')
    } catch {
      setMsg('That file is not a valid equipment.json. Use a file from a website-update.zip.')
    }
  }

  return (
    <>
      <section className="panel">
        <h2>Publish your changes</h2>
        <p className="muted">Your edits are saved in this browser so you can preview them. Visitors only see them after you upload the update.</p>
        <p className="note">
          <span>{fromLocal ? 'You have changes that visitors cannot see yet.' : 'No unpublished changes. The website matches the uploaded files.'}</span>
        </p>
        <ol className="steps">
          <li>Download the update below. It is a zip with your photos and equipment list.</li>
          <li>
            Unzip it and upload <code>equipment.json</code> and the <code>images</code> folder to your website hosting, next to <code>index.html</code>. Replace the old <code>equipment.json</code> when asked.
          </li>
          <li>
            Refresh the website. If you work from the project folder, copy both into <code>public/</code> and run <code>npm run build</code>.
          </li>
          <li>
            Back here, press <strong>Discard unpublished changes</strong> to confirm the live version shows what you expect.
          </li>
        </ol>
        <div className="form-actions">
          <button className="btn btn-yellow" onClick={exportZip} disabled={busy}>
            <Icon name="download" size={18} /> {busy ? 'Preparing…' : 'Download website update'}
          </button>
        </div>
        {msg && (
          <p className="note" role="status" style={{ marginTop: 16 }}>
            {msg}
          </p>
        )}
      </section>

      <section className="panel">
        <h2>Restore and reset</h2>
        <p className="muted">Load an equipment.json from an earlier update into this browser, or drop your unpublished changes.</p>
        <div className="form-actions">
          <button className="btn btn-line" onClick={() => fileRef.current?.click()}>
            <Icon name="upload" size={18} /> Import equipment.json
          </button>
          {fromLocal && (
            <button
              className="btn btn-danger"
              onClick={() => window.confirm('Discard all unpublished changes in this browser and reload the published list?') && onDiscard()}
            >
              Discard unpublished changes
            </button>
          )}
        </div>
        <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={importJson} />
      </section>
    </>
  )
}

/* ---------------- shell ---------------- */
export default function Admin({ data, fromLocal, onSave, onDiscard }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('ce_admin_ok') === '1')
  const [tab, setTab] = useState('equipment')

  if (!authed) return <Login onOk={() => setAuthed(true)} />

  const signOut = () => {
    sessionStorage.removeItem('ce_admin_ok')
    setAuthed(false)
  }

  return (
    <div className="admin">
      <div className="admin-bar">
        <div className="wrap admin-bar-in">
          <h1>{data.settings.businessName} admin</h1>
          <div className="admin-bar-actions">
            <a className="btn btn-line btn-sm" href="#top" onClick={() => (window.location.hash = '')}>
              View website
            </a>
            <button className="btn btn-ink btn-sm" onClick={signOut}>
              Sign out
            </button>
          </div>
        </div>
      </div>
      <div className="wrap">
        <div className="tabs" role="tablist">
          {[
            ['equipment', 'Equipment'],
            ['business', 'Business details'],
            ['publish', fromLocal ? 'Publish (changes waiting)' : 'Publish'],
          ].map(([id, label]) => (
            <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? 'tab tab-on' : 'tab'} onClick={() => setTab(id)}>
              {label}
            </button>
          ))}
        </div>
        {tab === 'equipment' && <EquipmentTab data={data} save={onSave} />}
        {tab === 'business' && <BusinessTab data={data} save={onSave} />}
        {tab === 'publish' && <PublishTab data={data} fromLocal={fromLocal} save={onSave} onDiscard={onDiscard} />}
      </div>
    </div>
  )
}
