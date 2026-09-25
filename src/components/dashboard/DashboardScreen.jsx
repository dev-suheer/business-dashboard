import { useCallback, useState } from 'react'
import { NAV_ITEMS, sectionIds } from '../../constants/navItems'
import { useReportDownload } from '../../hooks/useReportDownload'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import { isoDate } from '../../utils/format'
import MobileNav from './MobileNav'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import BridgeSection from './sections/BridgeSection'
import ExceptionsSection from './sections/ExceptionsSection'
import LineItemsSection from './sections/LineItemsSection'
import OverviewSection from './sections/OverviewSection'
import VariancesSection from './sections/VariancesSection'

const NAV = NAV_ITEMS.eshop
const SECTION_IDS = sectionIds(NAV)

function runMeta(result) {
  const parts = [result.category]
  if (result.merchant_id) parts.push('merchant ' + result.merchant_id)
  parts.push(isoDate(result.period_start) + ' – ' + isoDate(result.period_end))
  parts.push(result.summary.orders + ' orders')
  return parts.join(' · ')
}

export default function DashboardScreen({ result, files, username, onRestart, onSignOut }) {
  const [navOpen, setNavOpen] = useState(false)
  /* Lifted so an exception's order link can filter the Orders table. */
  const [orderQuery, setOrderQuery] = useState('')
  const { activeId, setActiveId } = useScrollSpy(SECTION_IDS)
  /* Same pattern the server uses: reconciliation-<category>-<start>-to-<end>.xlsx */
  const report = useReportDownload(
    files,
    'eshop',
    `reconciliation-${result.category}-${result.period_start}-to-${result.period_end}.xlsx`,
  )

  const navigate = useCallback(
    (id) => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveId(id)
    },
    [setActiveId],
  )

  const showOrder = useCallback(
    (orderNo) => {
      setOrderQuery(orderNo)
      navigate('sec-items')
    },
    [navigate],
  )

  const closeNav = useCallback(() => setNavOpen(false), [])

  return (
    <div className="min-h-screen fade-up">
      <div className="flex">
        <Sidebar
          items={NAV}
          activeId={activeId}
          username={username}
          onNavigate={navigate}
          onRestart={onRestart}
          onSignOut={onSignOut}
        />

        <div className="flex-1 min-w-0">
          <TopBar
            title="Reconciliation summary"
            meta={runMeta(result)}
            downloading={report.downloading}
            error={report.error}
            onDownload={report.download}
            onOpenNav={() => setNavOpen(true)}
          />

          <main className="p-5 md:p-8 space-y-10">
            <OverviewSection result={result} />
            <BridgeSection result={result} onShowOrder={showOrder} />
            <ExceptionsSection exceptions={result.exceptions} onShowOrder={showOrder} />
            <LineItemsSection
              orders={result.orders}
              exceptions={result.exceptions}
              rates={result.rates}
              query={orderQuery}
              onQueryChange={setOrderQuery}
            />
            <VariancesSection variances={result.line_variances} rates={result.rates} />
          </main>
        </div>
      </div>

      <MobileNav
        open={navOpen}
        items={NAV}
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
