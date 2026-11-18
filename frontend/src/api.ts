export const FEEDS = ['All', 'Featured', 'Clearance', 'Computers', 'Electronics', 'Home', 'Gourmet', 'Shirts', 'Sports', 'Tools', 'Wootoff'] as const
export type Feed = (typeof FEEDS)[number]

export interface FeedItem {
  OfferId: string
  Title: string
  Url: string
  Photo?: string
  Condition?: string
  ListPrice?: unknown
  SalePrice?: unknown
  IsSoldOut?: boolean
  IsWootOff?: boolean
  Subtitle?: string
  Site?: string
}
export interface FeedResponse { Items: FeedItem[]; MarketingName?: string; TotalPages?: number }

export interface OfferDetail {
  Id: string
  Title: string
  Url: string
  Teaser?: string
  Features?: string
  Photos?: { Url: string }[]
  Items?: { Id: string; Title: string; ListPrice?: number; SalePrice?: number; Attributes?: { Key: string; Value: string }[] }[]
}

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(res.status === 429 ? 'Rate limited by Woot — try again shortly.' : `Request failed (${res.status})`)
  return res.json()
}

export const fetchFeed = (feed: Feed, page: number) =>
  fetch(`/api/feed/${feed}?page=${page}`).then((r) => json<FeedResponse>(r))

/** Woot getoffers: full details for up to 25 offer ids. */
export const getOffers = (ids: string[]) =>
  fetch('/api/offers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(ids) })
    .then((r) => json<OfferDetail[]>(r))

/** Prices may be a number, {Minimum,Maximum}, or an array of those. */
export function formatPrice(p: unknown): string {
  const fmt = (n: number) => `$${n.toFixed(2)}`
  if (typeof p === 'number') return fmt(p)
  const r = Array.isArray(p) ? p[0] : p
  if (r && typeof r === 'object') {
    const { Minimum: min, Maximum: max } = r as { Minimum?: number; Maximum?: number }
    if (min != null && max != null && min !== max) return `${fmt(min)} – ${fmt(max)}`
    if (min != null) return fmt(min)
  }
  return '—'
}
