import FileDropzone from './FileDropzone'
import IntakeHeader from './IntakeHeader'
import StartBar from './StartBar'

export default function IntakeScreen({ files, ready, hint, onSelect, onClear, onStart }) {
  return (
    <div className="min-h-screen grain flex flex-col">
      <IntakeHeader />

      <main className="flex-1 grid place-items-center px-6 py-12">
        <div className="w-full max-w-4xl fade-up">
          <div className="mb-10 max-w-2xl">
            <h1 className="font-display text-3xl md:text-[40px] leading-[1.05] font-600 tracking-tight">
              Reconcile a vendor statement
              <br className="hidden md:block" /> against your ledger.
            </h1>
            <p className="mt-4 text-[15px] text-mut leading-relaxed max-w-xl">
              Drop your internal transaction export and the vendor statement below. The engine
              matches line items, flags variances, and returns a full breakdown with downloadable
              master, reconciliation, and payment files.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
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
