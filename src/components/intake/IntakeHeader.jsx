import Logo from '../common/Logo'

export default function IntakeHeader() {
  return (
    <header className="flex items-center justify-between px-6 md:px-10 h-16 border-b border-line/70">
      <div className="flex items-center gap-3">
        <Logo />
        <div className="leading-tight">
          <p className="font-display font-600 text-[15px] tracking-tight">Reconciliation Console</p>
          <p className="text-[11px] text-mut">Accounts payable · internal</p>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-2 text-[12px] text-mut">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-soft" />
        Engine ready
      </div>
    </header>
  )
}
