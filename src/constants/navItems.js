export const NAV_ITEMS = [
  { id: 'sec-overview', label: 'Overview', icon: 'overview' },
  { id: 'sec-bridge', label: 'Settlement bridge', icon: 'payments' },
  { id: 'sec-exceptions', label: 'Exceptions', icon: 'alert' },
  { id: 'sec-items', label: 'Orders', icon: 'items' },
  { id: 'sec-variances', label: 'Commission variance', icon: 'trends' },
]

export const SECTION_IDS = NAV_ITEMS.map((item) => item.id)
