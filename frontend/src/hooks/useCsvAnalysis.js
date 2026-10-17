import { useState } from 'react'
import { analyzeCsv, validateCsvFile } from '../services/api.js'

// Mengelola alur analisis CSV: pilih file -> siap -> loading -> success / error.
export default function useCsvAnalysis() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function selectFile(nextFile) {
    if (!nextFile) return
    const validationError = validateCsvFile(nextFile)
    if (validationError) {
      setError(validationError)
      setStatus('idle')
      return
    }
    setFile(nextFile)
    setResult(null)
    setError('')
    setStatus('ready')
  }

  function clearFile() {
    setFile(null)
    setResult(null)
    setError('')
    setStatus('idle')
  }

  async function analyze() {
    if (!file) {
      setError('Pilih file CSV terlebih dahulu.')
      setStatus('error')
      return
    }

    setStatus('loading')
    setError('')
    setResult(null)

    try {
      const data = await analyzeCsv(file)
      setResult(data)
      setStatus('success')
    } catch (err) {
      setError(err?.message || 'Terjadi kesalahan saat menganalisis file. Coba lagi.')
      setStatus('error')
    }
  }

  return { file, status, result, error, selectFile, clearFile, analyze }
}
