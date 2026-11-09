// Data layer.
// The public site reads /equipment.json. The admin panel saves edits to this
// browser (localStorage) so you can preview them instantly, then you download
// the updated equipment.json and upload it to your hosting to publish.

const DATA_KEY = 'ce_data_v1'
const PW_KEY = 'ce_admin_pw_v1'
const DEFAULT_PW = 'admin123'

export const DEFAULT_SETTINGS = {
  businessName: 'Your Company',
  heroTitle: 'Buy quality construction equipment.',
  heroText: 'Browse our equipment with specifications and clear prices.',
  offerRental: true, // turn the rental facility on or off for the whole site
  rentalNote: 'Rent by the day or month instead of buying. Message us for availability, delivery and deposit details.',
  phone: '',
  whatsapp: '',
  email: '',
  address: '',
  instagram: '',
  facebook: '',
  youtube: '',
  serviceArea: '',
  mapsUrl: '',
  heroImage: '',
  stats: [], // [{ value: '10+', label: 'Years in business' }]
  reviews: [], // [{ name: 'Customer name', text: 'Review text' }]
  gallery: [], // photos of finished jobs
}

export const STATUSES = ['In stock', 'Made to order', 'Sold out']
export const CONDITIONS = ['New', 'Used', 'Refurbished']

// Each machine can be for sale, for rent, or both.
// Older data had one price + unit ('sale' meant a sale price); convert it here.
export function migrateItem(e) {
  const base = { condition: 'New', forSale: true, forRent: false, salePrice: 0, rentPrice: 0, rentUnit: 'day' }
  if (e.forSale !== undefined || e.salePrice !== undefined || e.rentPrice !== undefined) {
    return { ...base, ...e, status: STATUSES.includes(e.status) ? e.status : 'In stock' }
  }
  const { price, unit, ...rest } = e
  const sale = unit === 'sale'
  return {
    ...base,
    ...rest,
    forSale: sale,
    forRent: !sale,
    salePrice: sale ? Number(price) || 0 : 0,
    rentPrice: sale ? 0 : Number(price) || 0,
    rentUnit: sale ? 'day' : unit || 'day',
    status: e.status === 'Sold out' ? 'Sold out' : 'In stock',
  }
}

export function withDefaults(data) {
  return {
    settings: { ...DEFAULT_SETTINGS, ...(data?.settings || {}) },
    equipment: Array.isArray(data?.equipment) ? data.equipment.map(migrateItem) : [],
  }
}

async function fetchPublished() {
  const res = await fetch(`${import.meta.env.BASE_URL}equipment.json?t=${Date.now()}`)
  if (!res.ok) throw new Error('equipment.json not found')
  return withDefaults(await res.json())
}

export function readLocal() {
  try {
    const raw = localStorage.getItem(DATA_KEY)
    return raw ? withDefaults(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

export function writeLocal(data) {
  try {
    localStorage.setItem(DATA_KEY, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

export function clearLocal() {
  try {
    localStorage.removeItem(DATA_KEY)
  } catch {
    /* ignore */
  }
}

export async function loadData() {
  const local = readLocal()
  if (local) return { data: local, fromLocal: true }
  return { data: await fetchPublished(), fromLocal: false }
}

// Admin password (a light gate, not real security: see README).
export function getPassword() {
  try {
    return localStorage.getItem(PW_KEY) || DEFAULT_PW
  } catch {
    return DEFAULT_PW
  }
}
export function setPassword(pw) {
  try {
    localStorage.setItem(PW_KEY, pw)
    return true
  } catch {
    return false
  }
}

// ---------- helpers ----------
export const RENT_UNITS = [
  { value: 'hour', label: 'per hour' },
  { value: 'day', label: 'per day' },
  { value: 'month', label: 'per month' },
]

export function unitLabel(unit) {
  return RENT_UNITS.find((u) => u.value === unit)?.label || ''
}

export function formatPrice(price) {
  const n = Number(price)
  if (!n || n <= 0) return null
  return '₹' + new Intl.NumberFormat('en-IN').format(n)
}

export function waLink(settings, text) {
  const digits = String(settings.whatsapp || '').replace(/\D/g, '')
  if (!digits) return '#'
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
}

export function ensureUrl(u) {
  if (!u) return ''
  return /^https?:\/\//i.test(u) ? u : `https://${u}`
}

export function newId() {
  return (globalThis.crypto?.randomUUID?.() || String(Date.now()) + Math.random().toString(16).slice(2)).slice(0, 36)
}

// Rental shows only when the site-wide switch is on and the machine is marked for rent.
export const rentable = (item, settings) => !!(settings.offerRental && item.forRent)
// Hide machines that are neither for sale nor available to rent right now.
export const isListed = (item, settings) => !!(item.forSale || rentable(item, settings))
