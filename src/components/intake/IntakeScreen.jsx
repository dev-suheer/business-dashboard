import { CATEGORIES, CATEGORY_KEYS } from '../../constants/categories'
import Icon from '../common/Icon'
import FileDropzone from './FileDropzone'
import IntakeHeader from './IntakeHeader'
import StartBar from './StartBar'

/* One picker per API field of the chosen category. The same workbook may go into more
   than one field — the server finds each field's sheet by its headers. */
export default function IntakeScreen({
  category,
  onCategoryChange,
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
  const config = CATEGORIES[category]

  /* eShop's portal export and discount sheet are usually two tabs of one workbook. */
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
          <div
            role="tablist"
            aria-label="Reconciliation category"
            className="mb-8 inline-flex rounded-lg border border-line overflow-hidden text-[13px]"
          >
            {CATEGORY_KEYS.map((key, i) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={key === category}
                disabled={busy}
                onClick={() => onCategoryChange(key)}
                className={`px-5 h-10 ${i > 0 ? 'border-l border-line ' : ''}${
                  key === category
                    ? 'bg-emerald/12 text-emerald-soft font-500'
                    : 'text-mut hover:text-txt'
                }`}
              >
                {CATEGORIES[key].label}
              </button>
            ))}
          </div>

          <div className="mb-10 xl:mb-12 max-w-2xl xl:max-w-3xl">
            <h1 className="font-display text-3xl md:text-[40px] xl:text-[44px] leading-[1.05] font-600 tracking-tight">
              {config.heading[0]}
              <br className="hidden md:block" /> {config.heading[1]}
            </h1>
            <p className="mt-4 text-[15px] xl:text-[16px] text-mut leading-relaxed max-w-xl xl:max-w-2xl">
              {config.intro}
            </p>
          </div>

          <div
            className={`grid gap-4 xl:gap-5 ${
              config.zones.length > 3
                ? 'md:grid-cols-2 xl:grid-cols-4'
                : config.zones.length > 2
                  ? 'md:grid-cols-3'
                  : 'md:grid-cols-2'
            }`}
          >
            {config.zones.map(({ key, title, caption }) => (
              <FileDropzone
                key={key}
                title={title}
                caption={caption}
                file={files[key]}
                action={category === 'eshop' && key === 'promo' ? usePortalForPromo : undefined}
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
