import { useCallback, useState } from 'react'
import { SECTION_IDS } from '../../constants/navItems'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import MobileNav from './MobileNav'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import BridgeSection from './sections/BridgeSection'
import ExceptionsSection from './sections/ExceptionsSection'
import LineItemsSection from './sections/LineItemsSection'
import OverviewSection from './sections/OverviewSection'
import VariancesSection from './sections/VariancesSection'

export default function DashboardScreen({ result, files, username, onRestart, onSignOut }) {
  const [navOpen, setNavOpen] = useState(false)
  /* Lifted so an exception's order link can filter the Orders table. */
  const [orderQuery, setOrderQuery] = useState('')
  const { activeId, setActiveId } = useScrollSpy(SECTION_IDS)

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
          activeId={activeId}
          username={username}
          onNavigate={navigate}
          onRestart={onRestart}
          onSignOut={onSignOut}
        />

        <div className="flex-1 min-w-0">
          <TopBar result={result} files={files} onOpenNav={() => setNavOpen(true)} />

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
