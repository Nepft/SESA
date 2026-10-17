# AGENTS.md — SteamSentiment Analyzer

## 1. Peran dan tujuan proyek

Kamu adalah AI coding agent yang membantu mengembangkan **SteamSentiment Analyzer**, aplikasi web mobile-friendly untuk mendemonstrasikan klasifikasi sentimen ulasan aplikasi Steam. Ikuti aturan dalam `RULES.md` sebagai pedoman proyek tambahan.

**Fokus pengerjaan saat ini: FRONTEND / UI-UX terlebih dahulu menggunakan vibe coding.** Jangan langsung membangun backend, REST API, mengubah model machine learning, atau mengintegrasikan Google Colab kecuali pengguna secara eksplisit meminta tahap tersebut.

Target saat ini adalah menghasilkan tampilan frontend yang rapi, konsisten, responsif, dan memiliki alur interaksi yang bisa didemonstrasikan dengan data mock. Kode harus tetap disiapkan agar integrasi API di tahap berikutnya tidak mengharuskan perombakan besar.

## 2. Ringkasan produk

Aplikasi adalah **single-page application** dengan dua cara analisis utama:
1. **Analisis satu ulasan**: pengguna mengetik atau menempelkan satu teks ulasan di composer, lalu menekan tombol kirim.
2. **Analisis file CSV**: pengguna melampirkan file `.csv` berisi banyak ulasan melalui composer (paperclip, drag-and-drop, atau file picker), lalu sistem menampilkan ringkasan sentimen positif dan negatif dalam bentuk jumlah, persentase, dan visualisasi, serta tabel hasil per baris.

Tidak ada dashboard statistik global untuk pengguna. Ringkasan dan grafik hanya muncul sebagai bagian dari **hasil analisis CSV yang baru saja dijalankan**. Jangan membuat halaman Dashboard terpisah.

Halaman dan komponen yang ditetapkan:
- `Analyze.jsx`: halaman utama; memuat judul yang runtuh saat hasil tampil, area hasil di atas, dan composer yang fixed di bagian bawah viewport.
- `Navbar.jsx`: header ringkas berisi logo dan nama produk saja (tanpa link navigasi).
- `ReviewForm.jsx`: composer input berisi textarea, tombol lampiran CSV, dan tombol kirim.
- `SentimentResult.jsx`: komponen hasil untuk analisis tunggal; meneruskan hasil CSV ke `CsvResult.jsx`.
- `CsvResult.jsx`: hasil CSV berupa meta file, statistik, donut chart + legenda, dan tabel berpaginasi.
- `hooks/`: `useSingleAnalysis.js` dan `useCsvAnalysis.js` untuk state tiap alur analisis.

Input tidak memiliki pemilihan mode (tab/segmented control). Satu composer menangani teks maupun lampiran CSV; lampiran yang ada menentukan alur mana yang dijalankan. Hasil analisis selalu muncul **di atas** composer, bukan di bawahnya.

Backend dan model final belum diintegrasikan pada tahap UI ini. Data mock harus mudah dikenali di kode dan tidak boleh diklaim sebagai hasil model sungguhan. Setiap hasil wajib menampilkan penanda `[SIMULASI]`.

## 3. Sumber instruksi

- Baca dan patuhi `RULES.md` di root repositori.
- Jika instruksi pengguna bertentangan dengan keputusan desain sebelumnya, instruksi terbaru dari pengguna menang, selama tidak bertentangan dengan batasan keamanan dan aturan teknis proyek.
- Jangan mengarang detail model, metrik penelitian, format dataset, atau hasil prediksi aktual. Jika belum diketahui, gunakan placeholder yang jelas atau minta konfirmasi.
- Jangan menambahkan file instruksi baru yang menduplikasi aturan tanpa alasan yang jelas.

## 4. Stack frontend yang dipilih

Gunakan:
- React 18
- Vite 5
- JavaScript JSX (bukan TypeScript kecuali pengguna meminta perubahan)
- CSS biasa dengan CSS variables dan media queries (tanpa framework CSS)
- `react-router-dom` untuk routing (satu route Analisis)
- `papaparse` untuk parsing CSV yang andal
- `@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals`, dan `eslint` v9 dengan flat config

Gunakan dependensi tambahan seminimal mungkin. Untuk grafik hasil CSV, pilih pendekatan ringan yang sesuai dengan proyek yang sudah ada. Saat ini visualisasi memakai **donut chart berbasis `conic-gradient` CSS murni** — tanpa library chart. Jika menambahkan library grafik, jelaskan alasan dan pastikan dependensi benar-benar dipasang serta tercatat di `package.json`. Jangan mengandalkan library yang belum terinstal.

Jangan mengganti stack atau menambahkan framework besar hanya untuk menyelesaikan kebutuhan UI.

## 5. Struktur folder yang harus dipertahankan

Pertahankan struktur utama berikut. Boleh menambah file CSS, aset, hooks, atau utilitas kecil bila memang dibutuhkan, tetapi jangan mengubah nama/tujuan folder utama tanpa alasan dan persetujuan.

```text
steam-sentiment-web/            (root proyek)
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ReviewForm.jsx
│   │   │   ├── SentimentResult.jsx
│   │   │   └── CsvResult.jsx
│   │   ├── pages/
│   │   │   └── Analyze.jsx
│   │   ├── hooks/
│   │   │   ├── useSingleAnalysis.js
│   │   │   └── useCsvAnalysis.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   ├── global.css
│   │   │   ├── navbar.css
│   │   │   └── analyze.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── eslint.config.js
│   └── package.json
├── backend/
│   ├── main.py
│   ├── schemas.py
│   ├── services/
│   │   └── predictor.py
│   ├── artifacts/
│   │   └── model_pipeline.joblib
│   ├── requirements.txt
│   └── tests/
│       └── test_api.py
├── README.md
├── AGENTS.md
├── RULES.md
└── .gitignore
```

Untuk tahap UI-first, kerjakan hanya `frontend/` dan dokumentasi frontend yang benar-benar diperlukan. Jangan membuat file model palsu atau mengisi folder backend dengan implementasi spekulatif.

## 6. Prinsip alur kerja agent

Sebelum mengubah kode:
1. Periksa struktur proyek dan file yang sudah ada.
2. Baca `AGENTS.md` dan `RULES.md`.
3. Identifikasi framework, dependensi, serta gaya kode yang sudah digunakan.
4. Buat rencana singkat yang sesuai dengan permintaan pengguna.
5. Pertahankan kode yang sudah berfungsi; jangan menghapus atau mengganti banyak file hanya demi preferensi pribadi.

Saat mengerjakan:
- Implementasikan perubahan dalam langkah kecil yang bisa diverifikasi.
- Gunakan komponen yang sudah ditetapkan dan hindari duplikasi.
- Jangan berhenti pada mockup statis bila permintaan membutuhkan interaksi; tombol, tab, upload, validasi, dan state harus berfungsi.
- Jangan mengklaim fitur berhasil sebelum memeriksa hasilnya.
- Jangan menjalankan perintah destruktif atau menghapus data/file tanpa izin eksplisit.

Setelah mengerjakan:
1. Jalankan pemeriksaan yang tersedia, minimal `npm run build` bila proyek Vite telah siap.
2. Perbaiki error yang muncul akibat perubahan.
3. Berikan ringkasan file yang diubah, interaksi yang sudah berfungsi, perintah pengujian yang dijalankan, serta keterbatasan yang masih ada.
4. Sebutkan dengan jelas jika hasil analisis masih memakai data mock.

## 7. Definisi selesai untuk tahap UI

Tahap UI dinilai selesai jika:
- Halaman analisis menangani dua alur: teks tunggal dan lampiran CSV, melalui satu composer yang sama.
- Composer berada di bagian bawah viewport (fixed dock); hasil tampil **di atas** composer.
- Input teks memiliki state, validasi, loading, hasil, dan error state; field otomatis kosong setelah analisis terkirim (teks tetap tersimpan bila gagal).
- Input teks mendukung Enter untuk mengirim dan Shift+Enter untuk baris baru.
- Upload CSV memiliki drag-and-drop, file picker (paperclip), validasi ekstensi/ukuran yang wajar, nama file, status proses, dan state hasil.
- Judul hero (ikon + teks) runtuh saat hasil tampil dan muncul kembali saat hasil di-reset.
- Hasil CSV menunjukkan jumlah dan persentase sentimen positif/negatif melalui **donut chart + legenda persentase besar**, ditambah statistik Total dan Dianalisis.
- Hasil CSV menyediakan label bagian, tabel berpaginasi yang bisa discroll pada layar kecil, dan animasi scroll ke posisi teratas tabel saat ganti halaman.
- Hasil CSV menyediakan tombol **"Unduh hasil"** yang mengekspor seluruh baris hasil (bukan hanya halaman aktif) ke file CSV dengan escaping dan nama file yang benar.
- Setiap hasil menampilkan penanda `[SIMULASI]`.
- Navbar ringkas tanpa link navigasi; tidak ada halaman About terpisah.
- Tampilan nyaman di HP dan laptop, mengikuti gaya modern minimalist.
- Tidak ada dashboard global yang berdiri sendiri.
- Tidak ada klaim bahwa prediksi mock berasal dari model ML asli.
- `api.js` menjadi batas pemisah yang jelas untuk integrasi API di masa mendatang.
- Build frontend lulus dan lint (`npm run lint`) bersih, atau kegagalan yang bukan akibat perubahan dijelaskan dengan jelas.

## 8. Cara berkomunikasi

Gunakan Bahasa Indonesia untuk teks UI dan penjelasan kepada pengguna, kecuali istilah teknis yang lazim digunakan dalam bahasa Inggris. Teks antarmuka harus natural, ringkas, dan konsisten.

Jangan memberikan penjelasan panjang sebelum melakukan perubahan kode yang diminta. Untuk permintaan implementasi yang jelas, langsung kerjakan setelah memeriksa proyek. Jika ada keputusan penting yang belum diketahui dan dapat mengubah arsitektur secara signifikan, ajukan satu pertanyaan spesifik; jika tidak, pilih default yang masuk akal dan jelaskan asumsi.
