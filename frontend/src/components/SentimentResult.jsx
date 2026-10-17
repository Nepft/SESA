import CsvResult from './CsvResult.jsx'
import { SIMULATION_NOTICE } from '../services/api.js'

export default function SentimentResult({ result, fileName }) {
  if (!result) return null

  if (result.mode === 'csv') {
    return <CsvResult result={result} fileName={fileName} />
  }

  const isPositive = result.sentiment === 'Positif'

  return (
    <section className="result">
      <div className="result__head">
        <h2 className="result__title">Hasil Analisis</h2>
        <span className="tag-sim">
          [SIMULASI] <span className="visually-hidden">— {SIMULATION_NOTICE}</span>
        </span>
      </div>

      {/* Fokus utama: sentimen dengan ruang lega */}
      <div className={`sentiment-block ${isPositive ? 'is-positive' : 'is-negative'}`}>
        <span className="sentiment-block__icon" aria-hidden="true">
          {isPositive ? (
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          )}
        </span>
        <div>
          <p className="sentiment-block__label">Sentimen</p>
          <p className="sentiment-block__value">{result.sentiment}</p>
        </div>
      </div>

      <div className="result__section">
        <p className="section-label">Ulasan</p>
        <blockquote>{result.text}</blockquote>
      </div>
    </section>
  )
}
