import { useCallback, useEffect, useRef, useState } from 'react'
import { ACCEPT_ATTR, ACCEPTED_LABEL } from '../../constants/uploads'
import { useDropzone } from '../../hooks/useDropzone'
import { formatFileDetail } from '../../utils/format'
import { validateFile } from '../../utils/validateFile'
import Icon from '../common/Icon'

export default function FileDropzone({
  title,
  caption,
  file,
  onSelect,
  onClear,
  action,
  serverError = null,
}) {
  const inputRef = useRef(null)
  const [localError, setError] = useState(null)
  /* The zone's own validation wins; otherwise show the server's message for this field
     verbatim (e.g. the wrong workbook went into it). */
  const error = localError ?? serverError

  /* Blanking the native input matters after a rejection too — without it, re-picking the
     same file fires no change event and the zone looks stuck. */
  const resetInput = () => {
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleFiles = useCallback(
    (fileList) => {
      const list = Array.from(fileList ?? [])
      if (list.length === 0) return

      if (list.length > 1) {
        setError('One file at a time — drop a single file.')
        resetInput()
        return
      }

      const problem = validateFile(list[0])
      if (problem) {
        setError(problem)
        resetInput()
        return
      }

      setError(null)
      onSelect(list[0])
    },
    [onSelect],
  )

  const { active, dropHandlers } = useDropzone(handleFiles)

  useEffect(() => {
    if (!file) resetInput()
  }, [file])

  const handleRemove = (e) => {
    /* The button sits inside the label — without this the click would reopen the picker. */
    e.preventDefault()
    e.stopPropagation()
    setError(null)
    onClear()
  }

  const tone = error
    ? 'border-bad/45 bg-bad/[0.04]'
    : file
      ? 'border-emerald/30 bg-emerald/[0.03]'
      : 'border-dashed border-line2 bg-panel/60 hover:border-emerald/50'

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[13px] xl:text-[14px] font-500 text-txt">{title}</span>
        {/* An action (e.g. "Use portal file") takes the caption's place so every zone keeps
            the same header height. */}
        {action ?? <span className="text-[11px] text-mut">{caption}</span>}
      </div>

      <label
        className={`group relative flex flex-col items-center justify-center gap-3 xl:gap-3.5 h-48 xl:h-56 rounded-xl border cursor-pointer transition-colors focus-within:border-emerald/60 ${tone}${
          active ? ' drop-active' : ''
        }`}
        {...dropHandlers}
      >
        {/* sr-only rather than hidden so the control stays keyboard reachable; the label
            picks up the focus ring via focus-within. */}
        <input
          ref={inputRef}
          type="file"
          multiple={false}
          accept={ACCEPT_ATTR}
          onChange={(e) => handleFiles(e.target.files)}
          className="sr-only"
        />

        {file ? (
          <>
            <div className="relative">
              <div className="h-11 w-11 xl:h-12 xl:w-12 rounded-lg bg-emerald/10 border border-emerald/25 grid place-items-center text-emerald-soft">
                <Icon name="file" className="h-5 w-5 xl:h-6 xl:w-6" />
              </div>
              <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald border-2 border-ink grid place-items-center text-ink">
                <Icon name="check" className="h-2.5 w-2.5" />
              </span>
            </div>

            <div className="w-full px-6 text-center">
              <p className="text-[13px] xl:text-[14px] text-txt truncate">{file.name}</p>
              <p className="text-[11px] xl:text-[12px] text-mut mt-0.5 font-mono">
                {formatFileDetail(file)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line2 bg-panel px-2.5 h-7 text-[11.5px] text-mut transition-colors group-hover:text-txt group-hover:border-emerald/40">
                <Icon name="upload" className="h-3.5 w-3.5" />
                Replace
              </span>
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center gap-1.5 rounded-md border border-line2 bg-panel px-2.5 h-7 text-[11.5px] text-mut transition-colors hover:text-bad hover:border-bad/40"
              >
                <Icon name="close" className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="h-11 w-11 xl:h-12 xl:w-12 rounded-lg bg-panel2 border border-line grid place-items-center text-mut group-hover:text-emerald-soft transition-colors">
              <Icon name="upload" className="h-5 w-5 xl:h-6 xl:w-6" />
            </div>
            <div className="text-center">
              <p className="text-[13px] xl:text-[14px]">
                <span className="text-emerald-soft font-500">Browse</span> or drag file here
              </p>
              <p className="text-[11px] xl:text-[12px] text-mut mt-0.5">{ACCEPTED_LABEL}</p>
            </div>
          </>
        )}
      </label>

      {error && (
        <p className="mt-2 flex items-start gap-1.5 text-[11px] text-bad">
          <Icon name="alert" className="h-3.5 w-3.5 shrink-0 mt-px" />
          {error}
        </p>
      )}
    </div>
  )
}
