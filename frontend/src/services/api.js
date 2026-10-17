import Papa from 'papaparse'

// ---------------------------------------------------------------------------
// Lapisan batas frontend <-> backend.
//
// Pada tahap UI-first ini SEMUA hasil adalah MOCK / simulasi yang dihasilkan
// oleh fungsi `mockPredictReview()` dan `mockAnalyzeCsv()`. Hasil tersebut
// BUKAN prediksi model machine learning sungguhan.
//
// Saat backend tersedia, cukup ganti isi `predictReview()` dan `analyzeCsv()`
// dengan request HTTP (fetch) tanpa mengubah komponen. Kontrak bentuk data
// mengikuti RULES.md bagian 7.
// ---------------------------------------------------------------------------

export const MAX_TEXT_LENGTH = 2000
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB
export const EXPECTED_COLUMN = 'content'
export const SIMULATION_NOTICE =
  'Hasil ini adalah simulasi/demo dari data mock dan belum terhubung ke model machine learning.'

const SIMULATED_DELAY_MS = 700

// Kamus kata sederhana HANYA untuk keperluan simulasi UI.
// Ini bukan model, tidak dilatih, dan tidak boleh diklaim sebagai model.
const POSITIVE_WORDS = [
  'bagus', 'keren', 'seru', 'mantap', 'suka', 'puas', 'recommended', 'rekomendasi',
  'asyik', 'menyenangkan', 'stabil', 'halus', 'terbaik', 'love', 'great', 'good',
  'fun', 'enjoy', 'awesome', 'excellent', 'best', 'smooth', 'worth', 'top',
]

const NEGATIVE_WORDS = [
  'jelek', 'buruk', 'lag', 'lemot', 'crash', 'bug', 'scam', 'payah', 'bosan',
  'membosankan', 'susah', 'ribet', 'error', 'gagal', 'parah', 'kecewa', 'rusak',
  'mahal', 'buruk', 'bad', 'worst', 'poor', 'boring', 'broken', 'slow', 'waste',
  'terrible', 'hate',
]

const POSITIVE_SET = new Set(POSITIVE_WORDS)
const NEGATIVE_SET = new Set(NEGATIVE_WORDS)

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function round1(value) {
  return Math.round(value * 10) / 10
}

// Heuristik kata kunci yang deterministik — hanya untuk demo UI.
function keywordSentiment(text) {
  const tokens = String(text).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)
  let positive = 0
  let negative = 0
  for (const token of tokens) {
    if (POSITIVE_SET.has(token)) positive += 1
    else if (NEGATIVE_SET.has(token)) negative += 1
  }
  if (negative > positive) return 'Negatif'
  return 'Positif'
}

function normalizeHeader(field) {
  return String(field).replace(/^\uFEFF/, '').trim().toLowerCase()
}

// ---------------------------------------------------------------------------
// Mock implementation
// ---------------------------------------------------------------------------

async function mockPredictReview(text) {
  await sleep(SIMULATED_DELAY_MS)
  return { mode: 'single', text, sentiment: keywordSentiment(text) }
}

async function mockAnalyzeCsv({ totalRows, validRows }) {
  await sleep(Math.min(SIMULATED_DELAY_MS + validRows.length * 2, 2500))

  const rows = validRows.map((item) => ({
    rowNumber: item.rowNumber,
    text: item.text,
    sentiment: keywordSentiment(item.text),
  }))

  const analyzedRows = rows.length
  const positiveCount = rows.filter((row) => row.sentiment === 'Positif').length
  const negativeCount = rows.filter((row) => row.sentiment === 'Negatif').length
  const failedRows = totalRows - analyzedRows

  return {
    mode: 'csv',
    totalRows,
    analyzedRows,
    failedRows,
    positiveCount,
    negativeCount,
    positivePercentage: analyzedRows > 0 ? round1((positiveCount / analyzedRows) * 100) : 0,
    negativePercentage: analyzedRows > 0 ? round1((negativeCount / analyzedRows) * 100) : 0,
    rows,
  }
}

// ---------------------------------------------------------------------------
// Validasi input (dipakai komponen lewat hooks)
// ---------------------------------------------------------------------------

export function validateReviewText(text) {
  if (!text || !text.trim()) return 'Tulis ulasan terlebih dahulu.'
  if (text.length > MAX_TEXT_LENGTH) {
    return `Ulasan terlalu panjang. Maksimal ${MAX_TEXT_LENGTH} karakter.`
  }
  return null
}

export function validateCsvFile(file) {
  if (!file) return 'Pilih file CSV terlebih dahulu.'
  const name = file.name || ''
  if (!name.toLowerCase().endsWith('.csv')) {
    return 'Format file harus .csv. Pilih file dengan ekstensi .csv.'
  }
  const maxMb = MAX_FILE_SIZE_BYTES / (1024 * 1024)
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `Ukuran file maksimal ${maxMb} MB. File yang dipilih terlalu besar.`
  }
  if (file.size === 0) return 'File kosong. Pilih file yang berisi data.'
  return null
}

// ---------------------------------------------------------------------------
// Parsing CSV (frontend, memakai papaparse — bukan split(","))
// ---------------------------------------------------------------------------

function parseCsvFile(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy',
      complete(results) {
        const fields = (results.meta && results.meta.fields) || []
        const contentField = fields.find((field) => normalizeHeader(field) === EXPECTED_COLUMN)

        if (!contentField) {
          reject(
            new Error(
              `Kolom ulasan tidak ditemukan. Pastikan file memiliki kolom "${EXPECTED_COLUMN}" sebagai header, lalu coba lagi.`,
            ),
          )
          return
        }

        const data = Array.isArray(results.data) ? results.data : []
        if (data.length === 0) {
          reject(
            new Error('File tidak berisi baris data. Tambahkan minimal satu baris ulasan di bawah header.'),
          )
          return
        }

        const totalRows = data.length
        const validRows = []

        data.forEach((row, index) => {
          const raw = row[contentField]
          const value = (raw == null ? '' : String(raw)).trim()
          if (!value) return
          validRows.push({ rowNumber: index + 1, text: value })
        })

        if (validRows.length === 0) {
          reject(new Error('Semua baris pada kolom teks kosong. Pastikan kolom berisi teks ulasan.'))
          return
        }

        resolve({ totalRows, validRows })
      },
      error() {
        reject(new Error('File tidak dapat dibaca. Pastikan file CSV valid, lalu coba lagi.'))
      },
    })
  })
}

// ---------------------------------------------------------------------------
// Kontrak publik (batas integrasi). Ganti isi fungsi ini saat backend siap.
// ---------------------------------------------------------------------------

export async function predictReview(text) {
  // TODO(backend): ganti dengan fetch() ke endpoint prediksi teks tunggal.
  return mockPredictReview(text)
}

export async function analyzeCsv(file) {
  const parsed = await parseCsvFile(file)
  // TODO(backend): ganti dengan upload/parsing di server bila tersedia.
  return mockAnalyzeCsv(parsed)
}
