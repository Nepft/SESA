# RULES.md — Aturan Proyek SteamSentiment Analyzer

Dokumen ini adalah aturan kerja rinci untuk AI coding agent. Aturan ini melengkapi `AGENTS.md`.

## 1. Ruang lingkup produk — jangan melebar

### Fitur yang wajib ada

**A. Analisis satu teks ulasan**
- Pengguna mengetik atau menempelkan teks ulasan pada composer.
- Tekan Enter untuk mengirim; Shift+Enter untuk baris baru; tombol kirim juga tersedia.
- Tidak ada pemilihan mode input; satu composer menangani teks maupun lampiran CSV.
- Tampilkan label sentimen **Positif** atau **Negatif** sesuai respons analisis.
- Tampilkan status loading, input tidak valid, error, dan hasil yang berhasil.
- Setelah analisis teks berhasil, kosongkan field otomatis. Bila analisis gagal atau tidak valid, biarkan teks pengguna tetap tersimpan.
- Jangan menambahkan label Netral kecuali pengguna atau model aktual memang mendukung kelas tersebut.

**B. Analisis massal melalui CSV**
- Pengguna melampirkan file `.csv` melalui composer: tombol lampiran (paperclip), drag-and-drop ke area composer, atau file picker.
- Berikan instruksi format file dan contoh kolom yang diharapkan di dekat kontrol file.
- Validasi file yang dipilih sebelum analisis.
- Setelah analisis, tampilkan:
  - nama file dan jumlah total baris ulasan yang dianalisis;
  - jumlah ulasan positif dan negatif;
  - persentase positif dan negatif;
  - visualisasi perbandingan sentimen (donut chart + legenda);
  - tabel hasil per ulasan, minimal nomor baris, teks ulasan, dan label prediksi.
- Sediakan cara yang jelas untuk memilih file lain: chip lampiran dapat dilepas lewat tombol X pada composer.
- Sediakan tombol **"Unduh hasil"** untuk mengunduh hasil klasifikasi sebagai file CSV (lihat bagian Tabel hasil).
- Jangan menampilkan hasil analisis CSV sebelum ada file yang dipilih dan proses analisis dijalankan, kecuali dalam tampilan preview demo yang diberi label eksplisit.

**C. Responsif**
- Antarmuka harus berfungsi pada layar HP kecil, tablet, laptop, dan desktop.
- Jangan mengandalkan hover untuk tindakan utama.
- Semua kontrol dapat dioperasikan dengan sentuhan maupun keyboard.

### Fitur yang tidak boleh dibuat tanpa permintaan

- Dashboard global atau halaman dashboard terpisah.
- Halaman About/Tentang terpisah. Aplikasi ini single-page; cukup satu halaman Analisis dengan composer fixed di bawah.
- Link navigasi pada navbar; cukup logo dan nama produk.
- Pemilihan mode input berupa tab/segmented control; sudah ada satu composer yang menangani teks dan CSV.
- Login/registrasi/role pengguna.
- Database dan riwayat pengguna.
- Scraping Google Play Store atau Steam secara otomatis.
- Integrasi API eksternal yang tidak diminta.
- Retraining model dari UI.
- Pilihan algoritma di UI final; kebutuhan saat ini adalah menggunakan satu model terbaik.
- Halaman admin, notifikasi, sistem poin, atau fitur lain di luar lingkup.
- Unggahan selain CSV pada alur analisis massal.
- Kelas sentimen ketiga yang tidak didukung model.

Jangan menambah fitur hanya karena dianggap umum pada aplikasi dashboard.

## 2. Tahap pengerjaan sekarang: UI-first / vibe coding

Untuk tahap ini:
- Prioritaskan desain, layout, komponen, responsivitas, dan interaksi frontend.
- Gunakan data mock yang terisolasi untuk demo UI bila backend belum tersedia.
- Pisahkan data mock dari komponen visual dan dari service API.
- Beri penamaan yang jelas, misalnya `mockPredictReview()` atau `mockAnalyzeCsv()`.
- Tambahkan komentar atau indikator UI yang menjelaskan bahwa data hasil adalah simulasi/demo jika hasil mock ditampilkan.
- Jangan menulis hasil mock seolah-olah berasal dari model yang sudah dilatih.
- Jangan membangun backend atau memodifikasi model Colab kecuali diminta pada tahap berikutnya.
- Jangan membuat file `model_pipeline.joblib` palsu atau placeholder biner.
- Rancang komponen agar penggantian mock ke API sungguhan cukup dilakukan pada lapisan `services/api.js`, bukan dengan menulis ulang seluruh halaman.

## 3. Arahan visual dan identitas UI

### Prinsip desain utama

Gaya yang berlaku: **modern minimalist**. Empat prinsip yang diurutkan berdasarkan kepentingan:

1. **Kesederhanaan** — hindari kotak/kartu yang berlebihan; struktur dibangun dari whitespace dan garis tipis (hairline), bukan dari banyak container bercorak.
2. **Hierarki visual** — informasi utama (sentimen, persentase, angka besar) tampil paling menonjol; label kecil dan metadata tampil lebih tenang.
3. **Ruang kosong** — beri jarak yang cukup antar bagian (misalnya 40px antar bagian utama); jangan memadatkan konten.
4. **Informasi mudah dibaca** — kontras memadai, angka rapi, teks label eksplisit.

Pendukung:
- Hasil analisis tampil **di atas** composer yang fixed di bagian bawah viewport (gaya chat).
- Animasi hanya sederhana (fade, slide pendek, transisi halus); selalu hormati `prefers-reduced-motion`. Jangan membuat animasi panjang atau berlebihan.
- Hindari glassmorphism berat, efek neon, gradient mencolok, dan dekorasi berlebihan.

### Identitas warna: Steam

Gunakan palet yang terinspirasi dari identitas visual Steam. Jadikan warna gelap biru-abu sebagai fondasi, dengan biru muda Steam sebagai aksen. Jangan menggunakan ungu elektrik sebagai warna utama proyek ini.

Palet awal yang disarankan:
- `#171A21` — warna dasar gelap / identitas Steam.
- `#1B2838` — permukaan atau panel gelap.
- `#2A475E` — warna sekunder untuk elemen pendukung.
- `#66C0F4` — aksen biru Steam untuk tombol utama, tautan aktif, fokus, atau highlight.
- `#C7D5E0` — teks sekunder pada tema gelap.
- `#FFFFFF` — teks utama pada latar gelap.
- `#F5F7FA` — alternatif latar terang bila desain memakai permukaan terang.
- `#DCE3EA` — border netral pada tema terang.

Gunakan palet ini secara konsisten melalui CSS variables/design tokens, misalnya `--color-bg`, `--color-surface`, `--color-accent`, `--color-text`, dan `--color-border`. Nilai warna boleh disesuaikan agar kontras dan keterbacaan baik, tetapi identitas keseluruhan harus tetap selaras dengan Steam.

Untuk sentimen:
- **Positif:** gunakan indikator hijau yang tenang.
- **Negatif:** gunakan indikator merah yang tenang.
- Jangan memakai biru Steam sebagai satu-satunya penanda sentimen; warna aksen brand dan warna status memiliki fungsi berbeda.
- Selalu sertakan teks label “Positif” atau “Negatif”, bukan warna saja.

Tema gelap boleh menjadi arah utama karena selaras dengan Steam, tetapi keterbacaan tetap nomor satu. Jika memilih tema gelap, pastikan area input, teks panjang, tabel, chart, dan pesan status memiliki kontras yang memadai. Hindari membuat seluruh elemen memiliki tingkat kegelapan yang sama; bedakan latar halaman, panel, input, dan border dengan halus.

### Arah visual dan layout

- Utamakan kesederhanaan, hierarki visual, ruang kosong, dan informasi yang mudah dibaca.
- Struktur dibangun dari whitespace dan garis tipis (hairline), bukan banyak kartu/kotak bercorak.
- Angka statistik tampil sebagai blok angka + label tanpa kotak; gunakan `tabular-nums` agar angka rapi.
- Hasil analisis selalu muncul di atas composer; composer fixed di bawah viewport (dock) dengan padding aman untuk safe-area HP.
- Navbar ringkas berisi logo dan nama produk saja; tidak ada link navigasi.
- Berikan whitespace yang cukup; jangan memadatkan semua konten ke dalam banyak kartu kecil.
- Gunakan container dengan lebar maksimum yang masuk akal pada desktop, sementara konten utama tetap mudah ditemukan.
- Hindari meniru tampilan dashboard admin generik. Tidak ada halaman dashboard global dalam ruang lingkup produk ini.
- Gunakan radius, border, shadow, dan spacing secara konsisten. Shadow sebaiknya tipis dan digunakan seperlunya.
- Hindari gradient mencolok, glassmorphism berat, efek neon, dekorasi yang berlebihan, animasi panjang, dan background bergerak.
- Transisi hover/focus sederhana diperbolehkan, tetapi seluruh fungsi utama harus tetap jelas tanpa hover.
- Hormati `prefers-reduced-motion`; matikan atau sederhanakan animasi bila pengguna memintanya.
- Jangan menggunakan emoji sebagai pengganti ikon utama pada UI final.
- Gunakan ikon dari satu library yang konsisten jika library tersebut sudah tersedia atau memang diperlukan. Jangan mengimpor paket ikon tanpa memasangnya.

### Tipografi

- Gunakan satu keluarga font sans-serif modern (font sistem yang sudah ada) untuk seluruh teks.
- Gunakan font monospace **hanya untuk angka** (statistik, pagination, counter karakter, penanda `[SIMULASI]`), dengan `font-variant-numeric: tabular-nums` agar angka rapi dan tidak goyang.
- Buat ukuran heading, body text, label, dan metadata memiliki hierarki yang konsisten.
- Hindari teks terlalu kecil, kontras rendah, dan paragraf yang terlalu lebar.
- Gunakan bobot font untuk membangun hierarki; jangan membuat semua teks tebal.
- Jangan memuat font eksternal jika manfaat visualnya tidak sebanding dengan tambahan dependensi jaringan.

### Responsivitas

- Terapkan pendekatan mobile-first.
- Pada HP, susun form, ringkasan, visualisasi, dan tabel secara vertikal.
- Pada desktop, gunakan ruang horizontal secara efisien; jangan sekadar memperbesar seluruh komponen mobile.
- Hindari overflow horizontal pada keseluruhan halaman.
- Tabel hasil CSV boleh memiliki area scroll horizontal sendiri atau berubah menjadi kartu per baris pada layar sempit.
- Grafik harus menyesuaikan lebar container.
- Navbar harus tetap ringkas dan mudah dioperasikan dengan sentuhan.
- Tombol utama dan area interaksi harus cukup besar untuk disentuh.
- Uji setidaknya viewport mobile sekitar 360–390 px dan desktop sekitar 1280 px bila preview tersedia.

### Bahasa UI

Gunakan Bahasa Indonesia yang natural dan konsisten. Contoh label:
- “Analisis Sentimen Ulasan Steam” (judul)
- “Hasil Analisis” (judul hasil)
- “Sentimen”, “Positif”, “Negatif”
- “Ulasan”, “Proporsi sentimen”, “Detail per ulasan” (label bagian)
- “Total”, “Dianalisis”
- “Baris”, “ulasan”
- “Sebelumnya”, “Berikutnya” (pagination)
- “Unduh hasil”
- “Lepaskan file” (drag-and-drop)
- Pesan error/hint yang jelas dan dapat ditindaklanjuti

Istilah “CSV” dan “API” boleh dipakai apa adanya.

## 4. Struktur halaman dan komponen

### `pages/Analyze.jsx`
Halaman utama aplikasi (satu-satunya halaman).
- Memuat judul (hero) yang **runtuh saat hasil tampil** dan muncul kembali saat hasil di-reset.
- Menyusun area hasil **di atas** composer; hasil tumbuh ke atas saat muncul.
- Memuat composer dalam **fixed dock** di bagian bawah viewport, dengan `env(safe-area-inset-bottom)` untuk HP.
- Meneruskan `fileName` ke komponen hasil CSV dan mengatur animasi muncul ulang hasil via `key`.
- Jangan menjadi tempat menumpuk semua detail logika parsing CSV, prediksi, chart, dan validasi.
- Mengelola alur state tingkat halaman atau mendelegasikannya ke hook kecil jika diperlukan.

### `components/Navbar.jsx`
- Header ringkas berisi **logo dan nama produk saja** (tanpa link navigasi).
- Sticky di atas dengan hairline pemisah; jangan menambahkan tautan Dashboard, Analisis, atau Tentang.

### `components/ReviewForm.jsx`
- Composer berisi: textarea, tombol lampiran (paperclip), dan tombol kirim.
- Mendukung **Enter untuk mengirim** dan **Shift+Enter untuk baris baru**.
- Menyediakan **drag-and-drop** ke area composer; file picker tetap wajib ada (tombol paperclip).
- Menampilkan chip lampiran berisi nama file + ukuran dengan tombol lepas.
- Menampilkan penghitung karakter (mono, `tabular-nums`) dan garis progres tipis saat loading.
- Komponen form tidak boleh memalsukan hasil model; gunakan service mock/API.
- Tampilkan validasi dekat dengan kontrol yang bermasalah.

### `components/SentimentResult.jsx`
- Menampilkan hasil teks tunggal: judul + penanda `[SIMULASI]`, blok sentimen (ikon + label + nilai besar), dan bagian "Ulasan" berisi kutipan teks.
- Untuk hasil CSV, meneruskan ke `CsvResult.jsx` beserta `fileName`.
- Tidak menyediakan tombol reset; cukup komposer yang selalu siap menerima ulasan baru.

### `components/CsvResult.jsx`
- Urutan hasil CSV: judul + `[SIMULASI]`, meta nama file, statistik **Total** dan **Dianalisis**, lalu bagian berlabel **"Proporsi sentimen"** (donut chart + legenda persentase besar), lalu bagian berlabel **"Detail per ulasan"** (tabel + pagination).
- Label Positif dan Negatif harus ditulis eksplisit; jangan hanya dibedakan dengan warna.
- Tampilkan jumlah absolut dan persentase bersama-sama.
- Gunakan **donut chart berbasis `conic-gradient` CSS** (tanpa library); legenda menampilkan persentase besar dan jumlah ulasan. Jangan menambahkan grafik lain yang mengulang informasi sama.
- Pagination: saat menekan "Berikutnya"/"Sebelumnya", **scroll halus ke posisi teratas tabel** (`scrollIntoView` + `scroll-margin-top` agar tidak tertutup navbar sticky); hormati `prefers-reduced-motion`.
- Sediakan tombol **"Unduh hasil"** pada baris header bagian "Detail per ulasan" (label di kiri, tombol di kanan). Ikon unduh memakai SVG inline tanpa library ikon.
- Tidak menyediakan tombol reset/ganti file pada hasil; chip lampiran di composer (tombol X) sudah cukup untuk melepas atau mengganti file.
- Batasi jumlah baris per halaman; jangan merender ribuan baris sekaligus.

### `services/api.js`
Ini adalah batas integrasi frontend dengan backend.
- Sediakan fungsi terpisah untuk analisis teks tunggal dan CSV.
- Pada tahap UI-first, fungsi dapat menggunakan mock data, tetapi penamaan dan kontraknya harus jelas.
- Jangan memanggil `fetch()` ke URL backend yang belum tersedia tanpa fallback dan penanganan error yang layak.
- Jangan mencampur data mock dengan komponen JSX.
- Saat backend siap, ganti implementasi service dengan request HTTP tanpa mengubah desain komponen secara besar-besaran.

### `App.jsx` dan `main.jsx`
- Menjadi entry point aplikasi.
- Gunakan pola navigasi yang sederhana sesuai dependensi yang tersedia.
- Jangan menambahkan router baru jika navigasi dua halaman bisa dilakukan secara bersih dengan setup yang sudah ada. Jika router sudah terpasang, gunakan router tersebut secara konsisten.

## 5. Perilaku analisis teks tunggal

Alur yang diharapkan:
1. Pengguna mengetik ulasan pada composer (tanpa memilih mode; composer selalu aktif).
2. Pengguna mengirim dengan Enter atau tombol kirim.
3. Selama memproses, composer menampilkan garis progres tipis dan tombol kirim nonaktif (tidak memicu permintaan ganda).
4. Hero (judul + ikon) runtuh saat hasil tampil; hasil tampil **di atas** composer.
5. Service mengembalikan hasil; komponen hasil menampilkan sentimen dan penanda `[SIMULASI]`.
6. Field teks **otomatis kosong** setelah analisis berhasil.
7. Jika terjadi error atau validasi gagal, tampilkan pesan yang dapat dipahami dan **biarkan teks pengguna tetap tersimpan** (jangan mengosongkan field pada kegagalan).
8. Tidak ada tombol "Analisis lagi"; cukup ketik ulasan baru dan kirim untuk mengganti hasil.

Validasi:
- Tolak teks kosong atau hanya spasi.
- Terapkan batas panjang yang wajar dan konsisten dengan API yang direncanakan.
- Jangan menghapus kata atau mengubah isi teks secara diam-diam selain normalisasi ringan yang memang diperlukan untuk validasi.
- Jangan mengklaim confidence score jika backend/model tidak menyediakannya.
- Jangan menampilkan probabilitas prediksi yang dibuat-buat.

## 6. Perilaku analisis CSV

### Input dan format
- Terima file dengan ekstensi `.csv`.
- Validasi tipe/ekstensi dan ukuran file. Tentukan batas ukuran yang wajar dan tampilkan batas tersebut kepada pengguna; misalnya 5 MB untuk demo awal, kecuali ada alasan teknis lain.
- Jangan mengasumsikan nama kolom secara diam-diam. Sediakan pesan yang menyebutkan kolom teks yang diharapkan atau pemetaan kolom jika memang dibutuhkan.
- Format yang direkomendasikan untuk rancangan UI: satu kolom teks ulasan, misalnya `content`. Nama kolom final harus dikonfirmasi dari dataset/pipeline yang sebenarnya.
- Beri contoh format CSV yang bisa diunduh atau ditampilkan dalam area bantuan.
- Tangani CSV kosong, header tanpa baris data, baris kosong, teks yang tidak valid, dan format yang tidak sesuai.
- Untuk parsing CSV pada frontend, gunakan parser CSV yang andal bila dependensi tersedia atau diperlukan. Jangan memecah baris dengan `split(",")` karena teks ulasan dapat mengandung koma, tanda kutip, dan newline.
- Jangan mengirim isi file ke layanan pihak ketiga yang tidak diminta.

### Hasil agregat
Untuk N baris valid yang berhasil dianalisis:
- `total = positiveCount + negativeCount`.
- `positivePercentage = positiveCount / total * 100`.
- `negativePercentage = negativeCount / total * 100`.
- Jika total nol, jangan melakukan pembagian nol; tampilkan keadaan kosong dan pesan yang jelas.
- Persentase harus konsisten dengan jumlah hasil. Pembulatan tampilan boleh membuat jumlah persentase menjadi 99,9% atau 100,1%; gunakan jumlah desimal yang konsisten.
- Jelaskan denominator secara jelas, misalnya “Dari 250 ulasan berhasil dianalisis.”
- Jika sebagian baris gagal, bedakan total baris, baris berhasil, dan baris yang gagal. Jangan menyembunyikan kegagalan parsing/prediksi.
- Donut chart dan legenda harus memakai data hasil analisis yang sama dengan angka ringkasan, bukan nilai statis yang berbeda.

### Visualisasi
- Implementasi saat ini: **satu donut chart** (basis `conic-gradient` CSS, tanpa library) dengan jumlah total di pusatnya, disertai **legenda** yang menampilkan persentase besar dan jumlah ulasan per kelas.
- Donut diberi `role="img"` dan `aria-label"` yang memuat angka; elemen grafik dekoratif lain (jika ada) diberi `aria-hidden` agar pembaca layar tidak mendengar informasi ganda.
- Jangan menambahkan grafik lain (bar chart, pie kedua, line chart, dst.) yang mengulang informasi sama dengan donut+legenda.
- Grafik harus mudah dibaca di layar kecil dan tidak meluber keluar viewport; pada HP, susun donut dan legenda secara vertikal.
- Sertakan label, keterangan, jumlah, dan persentase; jangan mengandalkan warna saja untuk membedakan kelas.
- Gunakan radius kecil dan warna datar tanpa glow/bayangan berlebihan, selaras dengan gaya modern minimalist.

### Tabel hasil
- Tampilkan setidaknya kolom nomor, teks ulasan, dan sentimen.
- Beri **label bagian** yang jelas (misalnya “Detail per ulasan”) di atas tabel.
- Pertimbangkan teks panjang: gunakan wrapping yang baik dan jangan membuat seluruh halaman melebar.
- Pada HP, tabel ditempatkan dalam container scroll horizontal dengan `tabIndex={0}` dan `role="region"` agar bisa di-scroll keyboard.
- Untuk file besar, gunakan pagination (misalnya 10 baris per halaman); jangan membuat browser tidak responsif.
- Saat pengguna menekan "Berikutnya" atau "Sebelumnya", **scroll halus ke posisi teratas tabel** dengan `scrollIntoView({ behavior: 'smooth', block: 'start' })`; gunakan `scroll-margin-top` agar konten tidak tertutup navbar sticky, dan hormati `prefers-reduced-motion` (kembali ke `behavior: 'auto'`).
- Tombol unduh hasil CSV **sudah diimplementasikan** di header bagian "Detail per ulasan". Ketentuannya:
  - File harus berisi **seluruh baris hasil** (bukan hanya halaman aktif), dengan kolom yang konsisten dengan tabel (nomor, ulasan, sentimen).
  - Gunakan parser/generator CSV yang menangani escaping dengan benar (misalnya `Papa.unparse` dari papaparse); jangan menyusun CSV dengan `join(",")`.
  - Sisipkan **UTF-8 BOM** (`\uFEFF`) agar aplikasi spreadsheet membaca teks non-ASCII dengan benar.
  - Sanitasi nama file hasil unduhan; jangan memakai nama file mentah pengguna apa adanya.
  - Bersihkan `URL.createObjectURL` dengan `URL.revokeObjectURL` setelah unduhan dipicu.

## 7. Kontrak data frontend untuk integrasi masa depan

Jaga bentuk data internal tetap konsisten agar mock service mudah diganti API.

Contoh hasil satu teks:

```js
{
  mode: "single",
  text: "Contoh ulasan",
  sentiment: "Positif"
}
```

Contoh hasil CSV:

```js
{
  mode: "csv",
  totalRows: 100,
  analyzedRows: 100,
  failedRows: 0,
  positiveCount: 65,
  negativeCount: 35,
  positivePercentage: 65,
  negativePercentage: 35,
  rows: [
    {
      rowNumber: 1,
      text: "Contoh ulasan",
      sentiment: "Positif"
    }
  ]
}
```

Contoh di atas hanya kontrak ilustratif. Jangan gunakan angka ini sebagai data demo default tanpa memberi label simulasi. Untuk hasil model sungguhan, gunakan respons backend sebagai sumber kebenaran.

Gunakan hanya dua nilai label sentimen bila model final memang binary: `"Positif"` dan `"Negatif"`. Jika model memakai label internal seperti `1` dan `0`, lakukan pemetaan terpusat di service/adapter berdasarkan definisi label yang telah dikonfirmasi, bukan berdasarkan tebakan.

## 8. Aksesibilitas dan pengalaman pengguna

- Gunakan elemen semantik HTML yang tepat.
- Semua input memiliki label.
- Tombol mempunyai teks atau accessible name yang jelas.
- Status loading/error/hasil dapat diketahui pembaca layar jika memungkinkan, misalnya melalui `aria-live`.
- Pastikan fokus keyboard terlihat.
- Kontras teks dan latar harus memadai.
- Jangan menghilangkan outline fokus tanpa pengganti.
- Jangan menggunakan warna sebagai satu-satunya indikator hasil.
- Hindari animasi yang mengganggu; hormati `prefers-reduced-motion` bila menggunakan animasi.
- Area klik tombol dan tab cukup besar untuk sentuhan.
- Jangan menampilkan pesan error teknis mentah kepada pengguna umum.

## 9. Kualitas kode dan arsitektur

- Gunakan functional components dan React hooks.
- Pisahkan logika service, tampilan, dan state.
- Hindari satu komponen raksasa yang mengerjakan semua hal.
- Jangan membuat abstraksi berlebihan untuk fitur yang sederhana.
- Gunakan nama komponen, fungsi, dan variabel yang deskriptif.
- Hindari duplikasi markup dan CSS.
- Hindari `any`-style data tidak terstruktur; validasi respons service.
- Bersihkan event listener atau object URL jika dibuat.
- Jangan menyimpan isi ulasan sensitif atau file pengguna ke penyimpanan persisten tanpa kebutuhan dan persetujuan.
- Jangan menambahkan dependency yang tidak digunakan.
- Jangan mengubah konfigurasi build, lockfile, atau paket tanpa alasan.
- Jangan menonaktifkan linting atau pemeriksaan untuk menyembunyikan error.
- Jangan menyatakan pekerjaan selesai hanya berdasarkan kode yang tampak benar; jalankan build dan tes yang tersedia.

## 10. Penanganan error dan state UI

Setiap alur utama harus mempertimbangkan:
- idle / belum ada input;
- input tidak valid;
- file dipilih tetapi belum dianalisis;
- sedang memproses;
- berhasil;
- gagal;
- hasil kosong;
- sebagian data gagal diproses.

Pesan error harus memberi tahu pengguna apa yang dapat dilakukan selanjutnya. Contoh: “Kolom ulasan tidak ditemukan. Pastikan file memiliki kolom `content`, lalu coba lagi.” Sesuaikan nama kolom setelah format final dikonfirmasi.

Jangan menampilkan stack trace, path lokal, atau detail internal ke UI pengguna.

## 11. Keamanan dan privasi

- Jangan meminta API key atau secret ditulis langsung ke source code.
- Jangan mengunggah file pengguna ke server/layanan eksternal selain endpoint proyek yang disepakati.
- Jangan menyimpan file CSV secara permanen tanpa kebutuhan.
- Batasi ukuran file dan jumlah baris yang dapat diproses untuk mencegah UI freeze.
- Jangan menjalankan isi CSV sebagai kode.
- Perlakukan isi ulasan sebagai data tidak tepercaya; jangan render sebagai HTML mentah.
- Jika file diunduh, sanitasi nama file.
- File model `joblib` hanya boleh dimuat dari artefak tepercaya; file joblib/pickle dari sumber tak tepercaya dapat menjalankan kode saat dimuat.

## 12. Backend dan integrasi model pada tahap berikutnya

Aturan ini menjadi pedoman ketika pengguna secara eksplisit meminta backend:
- Backend menggunakan Python dan FastAPI sesuai rancangan awal, kecuali pengguna mengubah keputusan.
- Pisahkan route/schema dari logika prediksi.
- Sediakan endpoint health check, prediksi teks tunggal, dan analisis CSV atau batch.
- Validasi input dan kembalikan error terstruktur.
- Jangan mengasumsikan nama artefak, label kelas, vectorizer, atau preprocessing sebelum memeriksa notebook/artefak aktual.
- Jangan melatih ulang model pada setiap request.
- Jangan menjalankan SMOTE-Tomek pada data prediksi baru. Teknik tersebut digunakan pada tahap pelatihan sesuai eksperimen.
- Pertahankan preprocessing dan vectorizer yang sama dengan pelatihan.
- Jangan mengklaim prediksi atau metrik yang tidak dihasilkan model.
- Jangan mengekspos model/artefak ke frontend.
- CORS harus dibatasi ke origin yang dibutuhkan saat deployment; jangan menggunakan konfigurasi terbuka tanpa alasan.
- Tambahkan tes untuk input valid, input kosong/tidak valid, error model, dan batch CSV.

## 13. Verifikasi sebelum menyatakan selesai

Untuk setiap tugas:
1. Jalankan perintah build frontend yang sesuai dengan `package.json`, biasanya `npm run build`.
2. Jalankan lint (`npm run lint`) dan test bila script tersebut tersedia. Perbaiki error yang muncul akibat perubahan, jangan menonaktifkan aturan lint untuk menyembunyikannya.
3. Periksa console/build error dan perbaiki masalah yang disebabkan perubahan.
4. Verifikasi responsivitas di viewport sempit dan lebar jika browser preview tersedia.
5. Periksa semua tombol, upload, pesan validasi, dan reset state.
6. Pastikan tidak ada link mati atau referensi ke halaman yang tidak ada (misalnya About).
7. Pastikan angka agregat berasal dari hasil baris yang sama.
8. Pastikan tidak ada angka evaluasi atau hasil model fiktif yang disajikan sebagai fakta; penanda `[SIMULASI]` tetap ada.
9. Ringkas hasil dan tuliskan perintah yang benar-benar dijalankan. Jangan mengaku telah menjalankan tes jika tidak dilakukan.

## 14. Prioritas keputusan ketika ada konflik

Urutan prioritas:
1. Instruksi eksplisit terbaru dari pengguna.
2. Kebutuhan produk dan batasan pada dokumen ini.
3. Struktur dan pola yang sudah ada di repository.
4. Praktik rekayasa perangkat lunak yang sederhana dan dapat dipelihara.
5. Preferensi estetika agent.

Jika ragu, pilih solusi paling sederhana yang memenuhi fitur wajib, jaga integrasi masa depan, dan jangan menambah scope tanpa persetujuan.
