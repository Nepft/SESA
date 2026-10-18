import { useEffect, useRef, useState } from 'react'
import Papa from 'papaparse'
import { SIMULATION_NOTICE } from '../services/api.js'

const PAGE_SIZE = 10

// Nama file hasil unduhan: diturunkan dari nama file asli, karakter tak aman dibersihkan.
function buildDownloadName(originalName) {
  const base = originalName
    ? originalName.replace(/\.csv$/i, '')
    : 'hasil-analisis'
  const safe = base
    .replace(/[^a-zA-Z0-9-_ ]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60)
  return `${safe || 'hasil-analisis'}-sentimen.csv`
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <p className="stat__value">{value}</p>
      <p className="stat__label">{label}</p>
    </div>
  )
}

export default function CsvResult({ result, fileName }) {
  const [page, setPage] = useState(1)

  const {
    totalRows,
    analyzedRows,
    failedRows,
    positiveCount,
    negativeCount,
    positivePercentage,
    negativePercentage,
    rows,
  } = result

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const pageRows = rows.slice(start, start + PAGE_SIZE)

  // Sudut segmen donut dihitung dari jumlah agar total selalu tepat 360°.
  const positiveAngle = (positiveCount / analyzedRows) * 360

  // Scroll halaman tabel ke posisi teratas saat user ganti halaman.
  const tableSectionRef = useRef(null)

  function goToPage(updater) {
    setPage(updater)
    const el = tableSectionRef.current
    if (!el) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
  }

  // Unduh seluruh baris hasil (bukan hanya halaman aktif) sebagai file CSV.
  function handleDownload() {
    const csv = Papa.unparse({
      fields: ['No', 'Ulasan', 'Sentimen'],
      data: rows.map((row) => [row.rowNumber, row.text, row.sentiment]),
    })
    // BOM agar Excel membaca UTF-8 dengan benar.
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = buildDownloadName(fileName)
    link.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    setPage(1)
  }, [result])

  return (
    <section className="result">
      <div className="result__head">
        <h2 className="result__title">Hasil Analisis</h2>
        <span className="tag-sim">
          [SIMULASI] <span className="visually-hidden">— {SIMULATION_NOTICE}</span>
        </span>
      </div>

      {fileName && <p className="result__meta">{fileName}</p>}

      <div className="summary-grid">
        <Stat label="Total" value={totalRows} />
        <Stat label="Dianalisis" value={analyzedRows} />
      </div>

      {failedRows > 0 && (
        <p className="notice notice--warn">
          {failedRows} baris kosong — dilewati.
        </p>
      )}

      {analyzedRows > 0 ? (
        <>
          <div className="result__section">
            <p className="section-label">Proporsi sentimen</p>

            <div className="viz">
              <div className="viz__donut-row">
                <div
                  className="donut"
                  style={{ '--positive-angle': `${positiveAngle}deg` }}
                  role="img"
                  aria-label={`Positif ${positiveCount} ulasan (${positivePercentage} persen), Negatif ${negativeCount} ulasan (${negativePercentage} persen), dari total ${analyzedRows} ulasan yang berhasil dianalisis.`}
                >
                  <div className="donut__center">
                    <span className="donut__total">{analyzedRows}</span>
                    <span className="donut__caption">ulasan</span>
                  </div>
                </div>

                <ul className="legend">
                  <li className="legend__item">
                    <span className="dot dot--positive" aria-hidden="true" />
                    <div className="legend__body">
                      <p className="legend__label">Positif</p>
                      <p className="legend__row">
                        <span className="legend__pct legend__pct--positive">
                          {positivePercentage}%
                        </span>
                        <span className="legend__count">{positiveCount} ulasan</span>
                      </p>
                    </div>
                  </li>
                  <li className="legend__item">
                    <span className="dot dot--negative" aria-hidden="true" />
                    <div className="legend__body">
                      <p className="legend__label">Negatif</p>
                      <p className="legend__row">
                        <span className="legend__pct legend__pct--negative">
                          {negativePercentage}%
                        </span>
                        <span className="legend__count">{negativeCount} ulasan</span>
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <p className="result__caption">
              Dari {analyzedRows} ulasan berhasil dianalisis.
            </p>
          </div>

          <div className="result__section" ref={tableSectionRef}>
            <div className="section-head">
              <p className="section-label">Detail per ulasan</p>
              <button type="button" className="btn btn--sm" onClick={handleDownload}>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Unduh hasil
              </button>
            </div>

            <div
              className="table-wrap"
              tabIndex={0}
              role="region"
              aria-label="Tabel hasil analisis ulasan"
            >
              <table className="table">
                <caption className="visually-hidden">Hasil analisis sentimen per ulasan</caption>
                <thead>
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">Ulasan</th>
                    <th scope="col">Sentimen</th>
                  </tr>
                </thead>
                {/* key per halaman agar animasi masuk baris berjalan ulang tiap ganti halaman */}
                <tbody key={currentPage}>
                  {pageRows.map((row, index) => (
                    <tr key={row.rowNumber} style={{ '--i': index }}>
                      <td className="table__num">{row.rowNumber}</td>
                      <td className="table__text">{row.text}</td>
                      <td>
                        <span
                          className={`tag ${
                            row.sentiment === 'Positif' ? 'tag--positive' : 'tag--negative'
                          }`}
                        >
                          {row.sentiment}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <span className="pagination__info">
                {start + 1}–{Math.min(start + PAGE_SIZE, rows.length)} / {rows.length}
              </span>
              <div className="pagination__controls">
                <button
                  type="button"
                  className="btn btn--sm"
                  disabled={currentPage <= 1}
                  onClick={() => goToPage((value) => Math.max(1, value - 1))}
                >
                  Sebelumnya
                </button>
                <span className="pagination__page">
                  {currentPage}/{totalPages}
                </span>
                <button
                  type="button"
                  className="btn btn--sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => goToPage((value) => Math.min(totalPages, value + 1))}
                >
                  Berikutnya
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="notice">Tidak ada ulasan untuk dianalisis.</p>
      )}
    </section>
  )
}
