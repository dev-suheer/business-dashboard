import FileDropzone from './FileDropzone'
import IntakeHeader from './IntakeHeader'
import StartBar from './StartBar'

export default function IntakeScreen({
  files,
  ready,
  hint,
  onSelect,
  onClear,
  onStart,
  onSignOut,
}) {
  return (
    <div className="min-h-screen grain flex flex-col">
      <IntakeHeader onSignOut={onSignOut} />

      <main className="flex-1 grid place-items-center px-6 py-12 xl:py-16">
        {/* Scales up from xl only — below that the reference proportions are unchanged. */}
        <div className="w-full max-w-4xl xl:max-w-5xl fade-up">
          <div className="mb-10 xl:mb-12 max-w-2xl xl:max-w-3xl">
            <h1 className="font-display text-3xl md:text-[40px] xl:text-[44px] leading-[1.05] font-600 tracking-tight">
              Reconcile a vendor statement
              <br className="hidden md:block" /> against your ledger.
            </h1>
            <p className="mt-4 text-[15px] xl:text-[16px] text-mut leading-relaxed max-w-xl xl:max-w-2xl">
              Drop your internal transaction export and the vendor statement below. The engine
              matches line items, flags variances, and returns a full breakdown with downloadable
              master, reconciliation, and payment files.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 xl:gap-5">
            <FileDropzone
              title="Raw data file"
              caption="Internal ledger export"
              file={files.raw}
              onSelect={(file) => onSelect('raw', file)}
              onClear={() => onClear('raw')}
            />
            <FileDropzone
              title="Vendor statement file"
              caption="From supplier"
              file={files.vendor}
              onSelect={(file) => onSelect('vendor', file)}
              onClear={() => onClear('vendor')}
            />
          </div>

          <StartBar hint={hint} ready={ready} onStart={onStart} />
        </div>
      </main>
    </div>
  )
}
