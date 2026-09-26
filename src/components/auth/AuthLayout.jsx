import Logo from '../common/Logo'
import ThemePicker from '../common/ThemePicker'

/* Same shell for all four auth screens: the intake page's grain background and brand
   header, with a single centred card. */
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen grain flex flex-col">
      <header className="flex items-center justify-between gap-4 px-6 md:px-10 h-16 border-b border-line/70">
        <div className="flex items-center gap-3">
          <Logo />
          <div className="leading-tight">
            <p className="font-display font-600 text-[15px] tracking-tight">
              Reconciliation Console
            </p>
            <p className="text-[11px] text-mut">Accounts payable · internal</p>
          </div>
        </div>
        <ThemePicker />
      </header>

      <main className="flex-1 grid place-items-center px-6 py-12">
        <div className="w-full max-w-md fade-up">
          <div className="rounded-xl border border-line/70 bg-panel/50 p-6 sm:p-8">
            <h1 className="font-display font-600 text-[22px] tracking-tight">{title}</h1>
            <p className="mt-1.5 text-[13px] text-mut leading-relaxed">{subtitle}</p>
            <div className="mt-6">{children}</div>
          </div>
          {footer && <div className="mt-4 flex justify-center">{footer}</div>}
        </div>
      </main>
    </div>
  )
}
