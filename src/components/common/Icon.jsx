/* Every inline SVG from the reference, transcribed path-for-path. `sw` is that icon's
   original stroke-width — do not normalize them, the widths differ on purpose. */
const ICONS = {
  upload: {
    sw: 1.8,
    body: (
      <>
        <path d="M12 16V4m0 0L8 8m4-4l4 4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" strokeLinecap="round" />
      </>
    ),
  },
  file: {
    sw: 1.8,
    body: (
      <>
        <path d="M6 2h9l5 5v15H6z" strokeLinejoin="round" />
        <path d="M14 2v6h6" strokeLinejoin="round" />
      </>
    ),
  },
  arrowRight: {
    sw: 2.2,
    body: <path d="M5 12h14m0 0l-5-5m5 5l-5 5" strokeLinecap="round" strokeLinejoin="round" />,
  },
  overview: {
    sw: 1.8,
    body: (
      <>
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </>
    ),
  },
  trends: {
    sw: 1.8,
    body: (
      <>
        <path d="M3 3v18h18" strokeLinecap="round" />
        <path d="M7 14l4-4 3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  payments: {
    sw: 1.8,
    body: (
      <path
        d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  items: {
    sw: 1.8,
    body: <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />,
  },
  restart: {
    sw: 1.8,
    body: (
      <>
        <path d="M3 12a9 9 0 019-9 9 9 0 016.7 3M21 12a9 9 0 01-9 9 9 9 0 01-6.7-3" strokeLinecap="round" />
        <path d="M18 3v4h-4M6 21v-4h4" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  download: {
    sw: 1.8,
    body: (
      <>
        <path d="M12 3v12m0 0l4-4m-4 4l-4-4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 21h14" strokeLinecap="round" />
      </>
    ),
  },
  search: {
    sw: 1.8,
    body: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4-4" strokeLinecap="round" />
      </>
    ),
  },
  check: {
    sw: 2.6,
    body: <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />,
  },
  alert: {
    sw: 1.8,
    body: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7.6v5" strokeLinecap="round" />
        <path d="M12 16.3v.01" strokeLinecap="round" />
      </>
    ),
  },
  trendUp: {
    sw: 2,
    body: <path d="M12 5v14m0-14l5 5m-5-5l-5 5" strokeLinecap="round" strokeLinejoin="round" />,
  },
  trendDown: {
    sw: 2,
    body: <path d="M12 19V5m0 14l5-5m-5 5l-5-5" strokeLinecap="round" strokeLinejoin="round" />,
  },
  /* Drawer controls — added for the sub-lg navigation the reference lacks. */
  menu: {
    sw: 1.8,
    body: <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />,
  },
  close: {
    sw: 1.8,
    body: <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />,
  },
}

export default function Icon({ name, className = '', strokeWidth }) {
  const icon = ICONS[name]
  if (!icon) return null
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth ?? icon.sw}
      aria-hidden="true"
    >
      {icon.body}
    </svg>
  )
}
