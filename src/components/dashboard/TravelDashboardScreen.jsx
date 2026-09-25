import { useCallback, useMemo, useState } from 'react'
import { NAV_ITEMS, sectionIds } from '../../constants/navItems'
import { useReportDownload } from '../../hooks/useReportDownload'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import { isoDate } from '../../utils/format'
import MobileNav from './MobileNav'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import BookingsSection from './sections/BookingsSection'
import ExceptionsSection from './sections/ExceptionsSection'
import PaymentMethodsSection from './sections/PaymentMethodsSection'
import TravelOverviewSection from './sections/TravelOverviewSection'
import WalletSection from './sections/WalletSection'

function runMeta(result) {
  const parts = [result.category]
  if (result.vendor_name) parts.push(result.vendor_name)
  parts.push(isoDate(result.period_start) + ' – ' + isoDate(result.period_end))
  parts.push(result.summary.portal_bookings + ' bookings')
  return parts.join(' · ')
}

export default function TravelDashboardScreen({
  result,
  files,
  username,
  onRestart,
  onSignOut,
}) {
  const [navOpen, setNavOpen] = useState(false)
  /* Lifted so a finding's booking link can filter the Bookings table. */
  const [bookingQuery, setBookingQuery] = useState('')

  /* The wallet section only exists when a wallet file was uploaded. */
  const nav = useMemo(
    () => NAV_ITEMS.travel.filter((item) => item.id !== 'sec-wallet' || result.wallet),
    [result.wallet],
  )
  const { activeId, setActiveId } = useScrollSpy(useMemo(() => sectionIds(nav), [nav]))

  const report = useReportDownload(
    files,
    'travel',
    `reconciliation-travel-${result.period_start}-to-${result.period_end}.xlsx`,
  )

  const navigate = useCallback(
    (id) => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveId(id)
    },
    [setActiveId],
  )

  const showBooking = useCallback(
    (bookingId) => {
      setBookingQuery(bookingId)
      navigate('sec-bookings')
    },
    [navigate],
  )

  const closeNav = useCallback(() => setNavOpen(false), [])

  return (
    <div className="min-h-screen fade-up">
      <div className="flex">
        <Sidebar
          items={nav}
          activeId={activeId}
          username={username}
          onNavigate={navigate}
          onRestart={onRestart}
          onSignOut={onSignOut}
        />

        <div className="flex-1 min-w-0">
          <TopBar
            title="Travel reconciliation"
            meta={runMeta(result)}
            downloading={report.downloading}
            error={report.error}
            onDownload={report.download}
            onOpenNav={() => setNavOpen(true)}
          />

          <main className="p-5 md:p-8 space-y-10">
            <TravelOverviewSection result={result} />
            <BookingsSection
              bookings={result.bookings}
              invoiceLines={result.invoice_lines}
              flaggedRows={result.portal_rows_flagged}
              rates={result.rates}
              query={bookingQuery}
              onQueryChange={setBookingQuery}
            />
            <ExceptionsSection exceptions={result.exceptions} onShowOrder={showBooking} />
            <PaymentMethodsSection paymentMethods={result.payment_methods} />
            {result.wallet && <WalletSection wallet={result.wallet} />}
          </main>
        </div>
      </div>

      <MobileNav
        open={navOpen}
        items={nav}
        activeId={activeId}
        username={username}
        onNavigate={navigate}
        onRestart={onRestart}
        onSignOut={onSignOut}
        onClose={closeNav}
      />
    </div>
  )
}
