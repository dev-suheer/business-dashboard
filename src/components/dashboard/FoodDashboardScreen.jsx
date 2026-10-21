import { useCallback, useState } from 'react'
import { NAV_ITEMS, sectionIds } from '../../constants/navItems'
import { useReportDownload } from '../../hooks/useReportDownload'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import { isoDate } from '../../utils/format'
import MobileNav from './MobileNav'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import ExceptionsSection from './sections/ExceptionsSection'
import FoodOverviewSection from './sections/FoodOverviewSection'

const NAV = NAV_ITEMS.food
const SECTION_IDS = sectionIds(NAV)

function runMeta(result) {
  const { summary } = result
  const parts = [result.category]
  if (result.vendor_name) parts.push(result.vendor_name)
  parts.push(isoDate(summary.portal_date_start) + ' to ' + isoDate(summary.portal_date_end))
  parts.push(summary.settled_orders + ' settled')
  return parts.join(' · ')
}

export default function FoodDashboardScreen({ result, files, username, onRestart, onSignOut }) {
  const [navOpen, setNavOpen] = useState(false)
  const { activeId, setActiveId } = useScrollSpy(SECTION_IDS)
  const report = useReportDownload(
    files,
    'food',
    `reconciliation-food-${result.summary.portal_date_start}-to-${result.summary.portal_date_end}.xlsx`,
  )

  const navigate = useCallback(
    (id) => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveId(id)
    },
    [setActiveId],
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
            title="Food reconciliation"
            meta={runMeta(result)}
            downloading={report.downloading}
            error={report.error}
            onDownload={report.download}
            onOpenNav={() => setNavOpen(true)}
            downloadTitle="Excel report with Dashboard, Orders, Exceptions, Wallet when a wallet history was uploaded, Cashback, and the Portal and Vendor sheets from this upload"
            downloadNote="The workbook also includes the Portal and Vendor sheets."
          />

          <main className="p-5 md:p-8 space-y-10">
            <FoodOverviewSection result={result} />
            <ExceptionsSection exceptions={result.exceptions} />
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
