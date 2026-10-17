import { useEffect, useRef, useState } from 'react'
import {
  MAX_TEXT_LENGTH,
  MAX_FILE_SIZE_BYTES,
  EXPECTED_COLUMN,
} from '../services/api.js'
import '../styles/analyze.css'

const MAX_FILE_MB = MAX_FILE_SIZE_BYTES / (1024 * 1024)

function formatSize(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

export default function ReviewForm({
  single,
  csv,
  hasFile,
  isLoading,
  error,
  onSend,
  onSelectFile,
}) {
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  // Auto-grow mengikuti isi textarea.
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [single.text])

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      onSend()
    }
  }

  function handlePick(file) {
    if (file) onSelectFile(file)
  }

  function handleDrop(event) {
    event.preventDefault()
    setDragging(false)
    handlePick(event.dataTransfer.files?.[0])
  }

  function openPicker() {
    fileInputRef.current?.click()
  }

  const canSend = hasFile || single.text.trim().length > 0
  const showCounter = !hasFile && single.text.length > 0

  return (
    <form
      className="composer"
      onSubmit={(event) => {
        event.preventDefault()
        onSend()
      }}
      noValidate
    >
      <div
        className={[
          'composer__box',
          dragging ? 'is-dragging' : '',
          hasFile ? 'has-file' : '',
          error ? 'is-error' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        {isLoading && <span className="composer__progress" aria-hidden="true" />}

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          className="visually-hidden"
          tabIndex={-1}
          onChange={(event) => {
            handlePick(event.target.files?.[0])
            event.target.value = ''
          }}
        />

        {hasFile && (
          <div className="composer__file">
            <div className="file-card">
              <span className="file-card__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                  <path d="M14 3v5h5" />
                </svg>
              </span>
              <div className="file-card__body">
                <p className="file-card__name">{csv.file.name}</p>
                <p className="file-card__meta">{formatSize(csv.file.size)}</p>
              </div>
              <button
                type="button"
                className="file-card__remove"
                onClick={csv.clearFile}
                aria-label={`Hapus lampiran ${csv.file.name}`}
                title="Hapus lampiran"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <textarea
          ref={textareaRef}
          className="composer__textarea"
          value={single.text}
          maxLength={MAX_TEXT_LENGTH}
          disabled={hasFile}
          placeholder={hasFile ? 'File CSV terlampir.' : 'Tulis ulasan Steam…'}
          aria-label="Tulis ulasan Steam"
          aria-invalid={error ? 'true' : undefined}
          onChange={(event) => single.changeText(event.target.value)}
          onKeyDown={handleKeyDown}
        />

        <div className="composer__bar">
          <button
            type="button"
            className="composer__icon-btn"
            onClick={openPicker}
            disabled={isLoading}
            aria-label="Lampirkan file CSV"
            title="Lampirkan file CSV"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          </button>

          <span className="composer__bar-spacer" />

          {showCounter && (
            <span className="composer__counter" aria-hidden="true">
              {single.text.length}/{MAX_TEXT_LENGTH}
            </span>
          )}

          <button
            type="submit"
            className="composer__send"
            disabled={!canSend || isLoading}
            aria-label={hasFile ? 'Mulai analisis file CSV' : 'Mulai analisis ulasan teks'}
            title={hasFile ? 'Analisis file CSV' : 'Analisis ulasan'}
          >
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5" />
              <path d="M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>

        {dragging && <span className="composer__overlay">Lepaskan file</span>}
      </div>

      {error && (
        <p className="composer__error" role="alert">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v5M12 16.5v.01" />
          </svg>
          {error}
        </p>
      )}

      <p className="composer__hint">
        {hasFile
          ? 'Hapus lampiran untuk menulis ulasan'
          : `CSV · kolom ${EXPECTED_COLUMN} · maks ${MAX_FILE_MB} MB · Enter kirim`}
      </p>
    </form>
  )
}
