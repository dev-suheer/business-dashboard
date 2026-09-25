import { useEffect } from 'react'
import Icon from '../common/Icon'
import Logo from '../common/Logo'
import { NavLinks, RestartButton, SignedInAs, SignOutButton } from './Sidebar'

/* Sub-lg navigation. The reference hid the sidebar below 1024px with no replacement, so
   there was no way to jump between sections or start a new run on a phone or tablet.
   Same links, same tokens, same active-state styling as the desktop sidebar. */
export default function MobileNav({
  open,
  items,
  activeId,
  username,
  onNavigate,
  onRestart,
  onSignOut,
  onClose,
}) {
  useEffect(() => {
    if (!open) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="lg:hidden fixed inset-0 z-30">
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
      />
      <aside className="drawer-in absolute inset-y-0 left-0 w-64 max-w-[80vw] bg-panel border-r border-line/70 flex flex-col">
        <div className="flex items-center justify-between gap-3 px-5 h-16 border-b border-line/70 shrink-0">
          <div className="flex items-center gap-3">
            <Logo />
            <p className="font-display font-600 text-[14px] tracking-tight">Reconciliation</p>
          </div>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="text-mut hover:text-txt transition-colors"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>

        <NavLinks
          items={items}
          activeId={activeId}
          onNavigate={(id) => {
            onNavigate(id)
            onClose()
          }}
        />

        <div className="mt-auto p-3 shrink-0 space-y-2">
          <RestartButton onRestart={onRestart} />
          <SignedInAs username={username} />
          <SignOutButton onSignOut={onSignOut} />
        </div>
      </aside>
    </div>
  )
}
