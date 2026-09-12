import { useCallback, useState } from 'react'
import { SECTION_IDS } from '../../constants/navItems'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import MobileNav from './MobileNav'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import LineItemsSection from './sections/LineItemsSection'
import OverviewSection from './sections/OverviewSection'
import PaymentsSection from './sections/PaymentsSection'
import TrendsSection from './sections/TrendsSection'

export default function DashboardScreen({ runMeta, onRestart }) {
  const [navOpen, setNavOpen] = useState(false)
  const { activeId, setActiveId } = useScrollSpy(SECTION_IDS)

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
        <Sidebar activeId={activeId} onNavigate={navigate} onRestart={onRestart} />

        <div className="flex-1 min-w-0">
          <TopBar runMeta={runMeta} onOpenNav={() => setNavOpen(true)} />

          <main className="p-5 md:p-8 space-y-10">
            <OverviewSection />
            <TrendsSection />
            <PaymentsSection />
            <LineItemsSection />
          </main>
        </div>
      </div>

      <MobileNav
        open={navOpen}
        activeId={activeId}
        onNavigate={navigate}
        onRestart={onRestart}
        onClose={closeNav}
      />
    </div>
  )
}
