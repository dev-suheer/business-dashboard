/* One section list per category — the dashboards share no sections. */
export const NAV_ITEMS = {
  eshop: [
    { id: 'sec-overview', label: 'Overview', icon: 'overview' },
    { id: 'sec-bridge', label: 'Settlement bridge', icon: 'payments' },
    { id: 'sec-exceptions', label: 'Exceptions', icon: 'alert' },
    { id: 'sec-items', label: 'Orders', icon: 'items' },
    { id: 'sec-variances', label: 'Commission variance', icon: 'trends' },
  ],
  travel: [
    { id: 'sec-overview', label: 'Overview', icon: 'overview' },
    { id: 'sec-bookings', label: 'Bookings', icon: 'items' },
    { id: 'sec-exceptions', label: 'Findings', icon: 'alert' },
    { id: 'sec-payment-methods', label: 'Payment methods', icon: 'payments' },
    { id: 'sec-wallet', label: 'Wallet', icon: 'trends' },
  ],
  food: [
    { id: 'sec-overview', label: 'Overview', icon: 'overview' },
    { id: 'sec-exceptions', label: 'Exceptions', icon: 'alert' },
  ],
}

export const sectionIds = (items) => items.map((item) => item.id)
