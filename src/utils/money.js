/* Exact arithmetic on the API's decimal strings ("13876.31", "-0.01"). Values are held as
   BigInt in units of 10^-SCALE, so sums and comparisons never touch binary floats —
   the guide (§2.2) forbids parseFloat/Number for anything the user acts on. */
const SCALE = 6
const FACTOR = 10n ** BigInt(SCALE)

function toUnits(value) {
  const s = String(value ?? '0').trim()
  const negative = s.startsWith('-')
  const [whole, frac = ''] = s.replace(/^[-+]/, '').split('.')
  const units =
    BigInt(whole || '0') * FACTOR + BigInt((frac + '0'.repeat(SCALE)).slice(0, SCALE) || '0')
  return negative ? -units : units
}

function fromUnits(units, dp = 2) {
  const negative = units < 0n
  const abs = negative ? -units : units
  const whole = abs / FACTOR
  const frac = (abs % FACTOR).toString().padStart(SCALE, '0').slice(0, dp)
  return (negative && abs !== 0n ? '-' : '') + whole.toString() + (dp ? '.' + frac : '')
}

/* Sum of decimal strings; nulls count as zero. Returns a 2dp decimal string. */
export function sum(values) {
  return fromUnits(values.reduce((acc, v) => acc + toUnits(v), 0n))
}

export function sub(a, b) {
  return fromUnits(toUnits(a) - toUnits(b))
}

/* |value| > limit, exactly. */
export function absExceeds(value, limit) {
  const u = toUnits(value)
  return (u < 0n ? -u : u) > toUnits(limit)
}

export function sign(value) {
  const u = toUnits(value)
  return u === 0n ? 0 : u > 0n ? 1 : -1
}
