# SteamSentiment Analyzer

Aplikasi web mobile-friendly untuk **mendemonstrasikan klasifikasi sentimen ulasan Steam** menjadi **Positif** atau **Negatif**. Pengguna bisa menganalisis satu teks ulasan secara langsung, maupun banyak ulasan sekaligus lewat file CSV, lengkap dengan ringkasan jumlah dan persentase, visualisasi, tabel hasil per baris, serta unduhan hasil klasifikasi.

> ⚠️ **Status: hasil simulasi.** Saat ini **semua hasil analisis berasal dari data mock** di `frontend/src/services/api.js` dan **bukan prediksi model machine learning sungguhan**. Setiap hasil ditandai label `[SIMULASI]`. Model dan backend akan diintegrasikan pada tahap berikutnya.

## ✨ Fitur

- **Analisis satu ulasan** — ketik atau tempel teks ulasan, kirim dengan Enter (Shift+Enter untuk baris baru), dan lihat hasilnya langsung di atas kolom input.
- **Analisis massal CSV** — lampirkan file `.csv` lewat tombol lampiran (paperclip), drag-and-drop, atau file picker. File divalidasi (ekstensi `.csv`, ukuran maksimal 5 MB, kolom `content`).
- **Ringkasan hasil CSV** — statistik jumlah total dan jumlah yang berhasil dianalisis, serta **donut chart** dengan legenda persentase besar untuk perbandingan sentimen positif vs negatif.
- **Tabel hasil per ulasan** — bernomor, dengan pagination, dan animasi scroll halus ke posisi teratas tabel saat berpindah halaman.
- **Unduh hasil klasifikasi** — ekspor seluruh baris hasil (bukan hanya halaman yang sedang tampil) ke file CSV.
- **Desain modern minimalist** — tema gelap terinspirasi identitas Steam, hasil analisis selalu tampil di atas composer input yang menempel di bagian bawah viewport.
- **Responsif** — nyaman digunakan di layar HP maupun desktop.

## 🛠️ Teknologi

| Teknologi | Peran |
| --- | --- |
| [React 18](https://react.dev/) | Library UI (functional components + hooks) |
| [Vite 5](https://vitejs.dev/) | Build tool & dev server |
| JavaScript (JSX) | Bahasa sumber |
| [PapaParse](https://www.papaparse.com/) | Parsing & ekspor CSV yang andal |
| [React Router](https://reactrouter.com/) | Routing |
| CSS murni | Styling dengan CSS variables & media queries (tanpa framework CSS) |

Visualisasi donut chart dibuat dengan `conic-gradient` CSS murni — tanpa library chart tambahan.

## 🚀 Cara Menjalankan

**Prasyarat:** [Node.js](https://nodejs.org/) (versi LTS disarankan) dan npm.

```bash
# 1. Clone repositori
git clone <url-repositori>
cd <nama-folder-repositori>

# 2. Masuk ke folder frontend dan instal dependensi
cd frontend
npm install

# 3. Jalankan server pengembangan
npm run dev
```

Aplikasi berjalan di alamat yang ditampilkan di terminal (biasanya `http://localhost:5173`).

Perintah lain yang tersedia:

```bash
npm run build    # Build produksi ke folder dist/
npm run preview  # Pratinjau hasil build produksi
npm run lint     # Periksa kode dengan ESLint
```

## 📁 Struktur Proyek

```text
frontend/src/
├── components/
│   ├── Navbar.jsx           # Header ringkas (logo + nama produk)
│   ├── ReviewForm.jsx       # Composer: teks, lampiran CSV, tombol kirim
│   ├── SentimentResult.jsx  # Hasil analisis tunggal / penerus hasil CSV
│   └── CsvResult.jsx        # Hasil CSV: statistik, donut chart, tabel, unduh
├── pages/
│   └── Analyze.jsx          # Halaman utama (satu halaman)
├── hooks/
│   ├── useSingleAnalysis.js # State alur analisis teks tunggal
│   └── useCsvAnalysis.js    # State alur analisis CSV
├── services/
│   └── api.js               # Batas integrasi frontend <-> backend (mock saat ini)
├── styles/
│   ├── global.css           # Design tokens, basis, utilitas
│   ├── navbar.css           # Gaya navbar
│   └── analyze.css          # Gaya halaman analisis
├── App.jsx
└── main.jsx
```

## 🔌 Integrasi Backend (Tahap Berikutnya)

Semua interaksi data difokuskan di **`frontend/src/services/api.js`**, sehingga penggantian mock ke API sungguhan cukup dilakukan di lapisan tersebut tanpa menulis ulang komponen.

Rencana backend: **Python + FastAPI**, dengan endpoint untuk prediksi teks tunggal dan analisis CSV/batch yang memakai model terbaik hasil penelitian. Kontrak bentuk data frontend sudah didefinisikan agar mock dan API saling menggantikan secara mulus.

## 🗺️ Roadmap

- [ ] Integrasi backend (FastAPI) dan model machine learning sungguhan
- [ ] Menghubungkan analisis CSV ke endpoint batch
- [ ] Evaluasi model pada dataset ulasan Steam yang sesungguhnya
- [ ] Menyempurnakan label sentimen sesuai kemampuan model final

## 📸 Tampilan

<!--
  Placeholder screenshot — tambahkan gambar setelah diunggah, misalnya:
  ![Tampilan utama](docs/screenshot.png)
-->

## 📄 Catatan

Proyek ini dibangun untuk keperluan demonstrasi/pembelajaran klasifikasi sentimen teks. Hasil analisis saat ini bersifat simulasi sampai integrasi model selesai.
