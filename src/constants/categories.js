/* Each category has its own endpoint, uploads and result shape (API-INTEGRATION.md §1,
   §12.9), so everything that differs is described here and the intake screen stays
   data-driven. */
export const CATEGORIES = {
  eshop: {
    key: 'eshop',
    label: 'eShop',
    blurb: 'Order lines against the vendor account ledger.',
    heading: ['Reconcile a vendor statement', 'against your portal sales.'],
    intro:
      "Add the portal export, the vendor's account statement and the discount base sheet. If the portal export and discount sheet are tabs of the same workbook, select that file for both.",
    zones: [
      { key: 'portal', title: 'Portal export', caption: 'One row per order line', required: true },
      {
        key: 'vendor',
        title: 'Vendor statement',
        caption: 'Account statement from vendor',
        required: true,
      },
      { key: 'promo', title: 'Discount base sheet', caption: 'Promotional SKUs', required: true },
    ],
  },
  travel: {
    key: 'travel',
    label: 'Travel',
    blurb: "Hotel and flight bookings against the vendor's weekly claim.",
    heading: ['Reconcile a weekly claim', 'against your bookings.'],
    intro:
      "Add the portal export and the vendor's weekly claim workbook. Hotel and flight tabs are both read from one file. The wallet history is optional — supplied, it proves the wallet share of each booking actually left a wallet.",
    zones: [
      {
        key: 'portal',
        title: 'Portal export',
        caption: 'Hotel and flight tabs',
        required: true,
      },
      { key: 'vendor', title: 'Vendor claim', caption: 'The weekly claim workbook', required: true },
      {
        key: 'wallet',
        title: 'Wallet history',
        caption: 'Optional · proves the wallet share',
        required: false,
      },
    ],
  },
  food: {
    key: 'food',
    label: 'Food',
    blurb: 'Portal orders against the vendor statement.',
    heading: ['Reconcile a vendor statement', 'against your food orders.'],
    intro:
      'Add the portal export and the vendor statement. Orders are paired on Partner Order ID. Only Delivered rows can settle, and dates are not compared.',
    zones: [
      { key: 'portal', title: 'Portal export', caption: 'Orders from the portal', required: true },
      {
        key: 'vendor',
        title: 'Vendor statement',
        caption: 'Account statement from vendor',
        required: true,
      },
    ],
  },
}

export const CATEGORY_KEYS = Object.keys(CATEGORIES)
