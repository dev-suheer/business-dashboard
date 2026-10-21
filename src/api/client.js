/* Client for the Excel Reconciliation Service (API guide §8). The session lives in an
   HttpOnly cookie, so every call opts in with `credentials: "include"` and there is no
   token to store. */
const BASE = import.meta.env.VITE_API_URL ?? ''
const API = `${BASE}/api/v1`

export class SessionExpiredError extends Error {
  constructor() {
    super('Your session has expired. Please log in again.')
    this.name = 'SessionExpiredError'
  }
}

/* `field` names the upload field an error is about (portal/vendor/promo), when the
   server's message identifies one, so the UI can show it next to that picker. */
export class ApiError extends Error {
  constructor(message, status, field = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.field = field
  }
}

const FIELDS = ['portal', 'vendor', 'promo', 'wallet', 'settlements']

function fieldOf(detail) {
  if (typeof detail === 'string') {
    return /'(portal|vendor|promo|wallet|settlements)'/.exec(detail)?.[1] ?? null
  }
  if (Array.isArray(detail)) {
    for (const e of detail) {
      const field = (e.loc ?? []).find((p) => p !== 'body')
      if (FIELDS.includes(field)) return field
    }
  }
  return null
}

/* fetch() rejects with a TypeError when the server is down or CORS blocks the origin —
   turn that into a message a user can act on. Aborts pass through untouched. */
async function send(url, init) {
  try {
    return await fetch(url, init)
  } catch (err) {
    if (err.name === 'AbortError') throw err
    throw new ApiError(
      'Cannot reach the reconciliation service. Check that it is running and that this origin is allowed in CORS_ORIGINS.',
      0,
    )
  }
}

let onSessionExpired = () => {}

/* App registers this once; any 401 from an authenticated call routes through it. */
export function setSessionExpiredHandler(fn) {
  onSessionExpired = fn
}

/* `detail` is either a user-ready string or a validation array — branch on its type,
   not on the status code. */
export function errorMessage(detail, fallback = 'Request failed') {
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    return detail
      .map((e) => {
        const field = (e.loc ?? []).filter((p) => p !== 'body').join('.')
        return field ? `${field}: ${e.msg}` : e.msg
      })
      .join('; ')
  }
  return fallback
}

async function toError(res, fallback) {
  let detail = fallback
  try {
    detail = (await res.json()).detail
  } catch {
    /* a non-JSON error body */
  }
  return new ApiError(errorMessage(detail, fallback), res.status, fieldOf(detail))
}

/* Credentials always on, 401 handled once. A 401 is never retried — there is nothing
   to refresh. */
async function request(path, init = {}) {
  const res = await send(`${API}${path}`, { ...init, credentials: 'include' })
  if (res.status === 401) {
    onSessionExpired()
    throw new SessionExpiredError()
  }
  return res
}

// ---------------------------------------------------------------- session

export async function login(username, password) {
  // x-www-form-urlencoded, not JSON.
  const res = await send(`${API}/login/access-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username, password }),
    credentials: 'include',
  })
  if (!res.ok) throw await toError(res, 'Login failed')
  return res.json()
}

/* The account, or null when there is no live session. Deliberately not via request(). */
export async function currentUser() {
  const res = await send(`${API}/login/me`, { credentials: 'include' })
  if (res.status === 401) return null
  if (!res.ok) throw await toError(res, 'Could not read the session')
  return res.json()
}

export async function logout() {
  const res = await send(`${API}/logout`, { method: 'POST', credentials: 'include' })
  if (!res.ok) throw await toError(res, 'Logout failed')
  return res.json()
}

/* Unauthenticated liveness probe; the body is the bare JSON literal `true`. It says
   nothing about whether the session is valid. */
export async function healthCheck() {
  try {
    const res = await send(`${API}/utils/health-check/`)
    return res.ok && (await res.json()) === true
  } catch {
    return false
  }
}

// ---------------------------------------------------------------- reconcile

/* Each category posts different fields to a different endpoint; unused optional
   fields are omitted entirely rather than sent empty. */
const FORM_FIELDS = {
  eshop: {
    required: ['portal', 'vendor', 'promo'],
    optional: [
      'settlements',
      'wallet',
      'category',
      'period_start',
      'period_end',
      'standard_rate',
      'promo_rate',
      'promo_cutoff',
    ],
  },
  travel: {
    required: ['portal', 'vendor'],
    optional: ['wallet', 'period_start', 'period_end', 'hotel_rate', 'flight_rate', 'vat_rate'],
  },
  food: {
    required: ['portal', 'vendor'],
    optional: ['wallet'],
  },
}

const REPORT_PATH = {
  eshop: '/reconcile',
  travel: '/reconcile/travel',
  food: '/reconcile/food',
}

function buildForm(o, category = 'eshop') {
  const { required, optional } = FORM_FIELDS[category]
  const form = new FormData()
  for (const key of required) form.append(key, o[key])
  for (const key of optional) if (o[key]) form.append(key, o[key])
  return form
}

/* No timeout: a large workbook can legitimately take minutes. Content-Type is left to
   the browser so it can add the multipart boundary. */
export async function reconcile(options, signal) {
  const res = await request('/reconcile', { method: 'POST', body: buildForm(options), signal })
  if (!res.ok) throw await toError(res, 'Reconciliation failed')
  return res.json()
}

/* Bookings against the vendor's weekly claim. A different endpoint and a different
   result shape from eshop's — see API-INTEGRATION.md §5. */
export async function reconcileTravel(options, signal) {
  const res = await request('/reconcile/travel', {
    method: 'POST',
    body: buildForm(options, 'travel'),
    signal,
  })
  if (!res.ok) throw await toError(res, 'Reconciliation failed')
  return res.json()
}

/* Portal orders against the vendor statement, paired on Partner Order ID. */
export async function reconcileFood(options, signal) {
  const res = await request('/reconcile/food', {
    method: 'POST',
    body: buildForm(options, 'food'),
    signal,
  })
  if (!res.ok) throw await toError(res, 'Reconciliation failed')
  return res.json()
}

/* Cross-origin, Content-Disposition is only readable if the server lists it in
   Access-Control-Expose-Headers, so `fallbackName` covers the case where it is hidden. */
export async function downloadReport(
  options,
  { signal, fallbackName = 'reconciliation.xlsx', category = 'eshop' } = {},
) {
  const path = REPORT_PATH[category] ?? REPORT_PATH.eshop
  const res = await request(`${path}?format=xlsx`, {
    method: 'POST',
    body: buildForm(options, category),
    signal,
  })
  // On failure the body is JSON, not a workbook — check before touching the blob.
  if (!res.ok) throw await toError(res, 'Report generation failed')

  const disposition = res.headers.get('content-disposition') ?? ''
  const filename = /filename="?([^"]+)"?/.exec(disposition)?.[1] ?? fallbackName
  const url = URL.createObjectURL(await res.blob())
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
