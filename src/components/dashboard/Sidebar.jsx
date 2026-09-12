import { NAV_ITEMS } from '../../constants/navItems'
import Icon from '../common/Icon'
import Logo from '../common/Logo'

export function NavLinks({ activeId, onNavigate }) {
  return (
    <nav className="p-3 space-y-1 text-[13px]">
      {NAV_ITEMS.map((item) => {
        const on = item.id === activeId
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault()
              onNavigate(item.id)
            }}
            className={`flex items-center gap-3 rounded-lg px-3 h-9 transition-colors ${
              on ? 'bg-emerald/12 text-emerald-soft font-500' : 'text-mut'
            }`}
          >
            <Icon name={item.icon} className="h-4 w-4" />
            {item.label}
          </a>
        )
      })}
    </nav>
  )
}

export function RestartButton({ onRestart }) {
  return (
    <button
      type="button"
      onClick={onRestart}
      className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-line2 h-9 text-[13px] text-mut hover:text-txt hover:border-line2 transition-colors"
    >
      <Icon name="restart" className="h-4 w-4" />
      New reconciliation
    </button>
  )
}

export function SidebarBrand() {
  return (
    <div className="flex items-center gap-3 px-5 h-16 border-b border-line/70 shrink-0">
      <Logo />
      <p className="font-display font-600 text-[14px] tracking-tight">Reconciliation</p>
    </div>
  )
}

export default function Sidebar({ activeId, onNavigate, onRestart }) {
  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-line/70 min-h-screen sticky top-0 h-screen">
      <SidebarBrand />
      <NavLinks activeId={activeId} onNavigate={onNavigate} />
      <div className="mt-auto p-3 shrink-0">
        <RestartButton onRestart={onRestart} />
      </div>
    </aside>
  )
}
