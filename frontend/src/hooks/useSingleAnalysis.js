import { useState } from 'react'
import { predictReview, validateReviewText } from '../services/api.js'

// Mengelola alur analisis satu teks ulasan: idle / loading / success / error.
export default function useSingleAnalysis() {
  const [text, setText] = useState('')
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function changeText(value) {
    setText(value)
    if (error) setError('')
    if (status === 'error') setStatus('idle')
  }

  async function analyze() {
    const validationError = validateReviewText(text)
    if (validationError) {
      setError(validationError)
      setStatus('error')
      return
    }

    setStatus('loading')
    setError('')
    setResult(null)

    try {
      const data = await predictReview(text)
      setResult(data)
      setStatus('success')
      // Kosongkan field begitu analisis terkirim; kalau gagal, teks tetap tersimpan.
      setText('')
    } catch (err) {
      setError(err?.message || 'Terjadi kesalahan saat menganalisis ulasan. Coba lagi.')
      setStatus('error')
    }
  }

  function clearError() {
    if (error) setError('')
    if (status === 'error') setStatus('idle')
  }

  function reset() {
    setText('')
    setResult(null)
    setError('')
    setStatus('idle')
  }

  return { text, changeText, clearError, status, result, error, analyze, reset }
}
