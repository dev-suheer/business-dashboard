import Icon from '../common/Icon'
import FileDropzone from './FileDropzone'
import IntakeHeader from './IntakeHeader'
import StartBar from './StartBar'

/* One picker per API field. The same workbook may go into more than one — the server
   finds each field's sheet by its headers. */
const ZONES = [
  { key: 'portal', title: 'Portal export', caption: 'One row per order line' },
  { key: 'vendor', title: 'Vendor statement', caption: 'Account statement from vendor' },
  { key: 'promo', title: 'Discount base sheet', caption: 'Promotional SKUs' },
]

export default function IntakeScreen({
  files,
  ready,
  hint,
  error,
  busy,
  username,
  onSelect,
  onClear,
  onStart,
  onSignOut,
}) {
  const usePortalForPromo =
    files.portal && files.promo !== files.portal ? (
      <button
        type="button"
        onClick={() => onSelect('promo', files.portal)}
        className="text-[11px] text-emerald-soft hover:text-emerald transition-colors"
      >
        Use portal file
      </button>
    ) : null

  return (
    <div className="min-h-screen grain flex flex-col">
      <IntakeHeader username={username} onSignOut={onSignOut} />

      <main className="flex-1 grid place-items-center px-6 py-12 xl:py-16">
        {/* Scales up from xl only — below that the reference proportions are unchanged. */}
        <div className="w-full max-w-4xl xl:max-w-5xl fade-up">
          <div className="mb-10 xl:mb-12 max-w-2xl xl:max-w-3xl">
            <h1 className="font-display text-3xl md:text-[40px] xl:text-[44px] leading-[1.05] font-600 tracking-tight">
              Reconcile a vendor statement
              <br className="hidden md:block" /> against your portal sales.
            </h1>
            <p className="mt-4 text-[15px] xl:text-[16px] text-mut leading-relaxed max-w-xl xl:max-w-2xl">
              Add the portal export, the vendor's account statement and the discount base
              sheet. If the portal export and discount sheet are tabs of the same workbook,
              select that file for both.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 xl:gap-5">
            {ZONES.map(({ key, title, caption }) => (
              <FileDropzone
                key={key}
                title={title}
                caption={caption}
                file={files[key]}
                action={key === 'promo' ? usePortalForPromo : undefined}
                serverError={error?.field === key ? error.message : null}
                onSelect={(file) => onSelect(key, file)}
                onClear={() => onClear(key)}
              />
            ))}
          </div>

          {/* Errors naming a field are shown under that picker; the rest land here. */}
          {error && !error.field && (
            <p
              role="alert"
              className="mt-6 flex items-start gap-2 rounded-lg border border-bad/35 bg-bad/[0.06] px-4 py-3 text-[12.5px] text-bad"
            >
              <Icon name="alert" className="h-4 w-4 shrink-0 mt-px" />
              {error.message}
            </p>
          )}

          <StartBar hint={hint} ready={ready && !busy} onStart={onStart} />
        </div>
      </main>
    </div>
  )
}
