import { useState } from 'react'
import ReviewForm from '../components/ReviewForm.jsx'
import SentimentResult from '../components/SentimentResult.jsx'
import useSingleAnalysis from '../hooks/useSingleAnalysis.js'
import useCsvAnalysis from '../hooks/useCsvAnalysis.js'
import '../styles/analyze.css'

export default function Analyze() {
  const single = useSingleAnalysis()
  const csv = useCsvAnalysis()
  const [lastAnalyzed, setLastAnalyzed] = useState(null) // 'text' | 'csv'
  const [analysisId, setAnalysisId] = useState(0)

  const hasFile = Boolean(csv.file)
  const isLoading = single.status === 'loading' || csv.status === 'loading'

  // Error yang tampil mengikuti konteks input saat ini.
  const error = hasFile ? csv.error : csv.error || single.error

  const activeResult =
    lastAnalyzed === 'csv' ? csv.result : lastAnalyzed === 'text' ? single.result : null

  // Hero hanya runtuh ketika hasil analisis tampil — bukan saat mengetik/mengunggah.
  const hideHero = Boolean(activeResult)

  function handleSelectFile(file) {
    if (single.error) single.clearError()
    csv.selectFile(file)
  }

  function handleSend() {
    if (isLoading) return
    setAnalysisId((id) => id + 1)
    if (hasFile) {
      setLastAnalyzed('csv')
      csv.analyze()
    } else {
      setLastAnalyzed('text')
      single.analyze()
    }
  }

  return (
    <>
      <div className="chat">
        <section className={`hero${hideHero ? ' hero--collapsed' : ''}`}>
          <div className="hero__mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12h4l3 8 4-16 3 8h4" />
            </svg>
          </div>
          <h1>Analisis Sentimen Ulasan Steam</h1>
        </section>

        <p className="visually-hidden" role="status">
          {isLoading ? 'Sedang menganalisis, mohon tunggu.' : ''}
        </p>

        <div className="results-region" aria-live="polite">
          {activeResult && (
            <SentimentResult
              key={analysisId}
              result={activeResult}
              fileName={hasFile ? csv.file?.name : null}
            />
          )}
        </div>
      </div>

      <div className="dock">
        <div className="chat">
          <ReviewForm
            single={single}
            csv={csv}
            hasFile={hasFile}
            isLoading={isLoading}
            error={error}
            onSend={handleSend}
            onSelectFile={handleSelectFile}
          />
        </div>
      </div>
    </>
  )
}
