# Cekkan

**Cek dulu sebelum lamar.**

Pernah menerima pesan "Selamat, kamu lolos seleksi!" padahal tidak pernah melamar? Cekkan membantu pencari kerja mengenali kejanggalan pada lowongan kerja sebelum terlanjur membagikan data atau mengirim uang.

- Website: https://cekkan-frontend.vercel.app
- Video demo: [ISI: tautan video demo]

---

## Masalah yang kami angkat

Tawaran kerja palsu beredar luas lewat WhatsApp, DM, dan media sosial. Polanya mirip: diminta bayar di awal, gaji tidak masuk akal, ditekan supaya cepat transfer, atau diminta data sensitif tanpa proses seleksi. Banyak pencari kerja sulit membedakan mana yang tepercaya, dan setelah sadar pun sering bingung harus berbuat apa.

Target pengguna kami adalah **pencari kerja**, terutama mahasiswa dan lulusan baru.

## Fitur

Cekkan mengikuti tiga arah dari studi kasus: **mengenali, belajar, bertindak**.

### 1. Periksa (mengenali)
Tempel teksnya, dan Cekkan menunjukkan tanda yang janggal beserta alasannya.

- **Pesan Loker**: pesan tawaran kerja dari chat atau broadcast.
- **Tautan Lowongan**: tautan pendaftaran atau formulir kerja. Tautannya **tidak dibuka**, hanya bentuk alamatnya yang dianalisis.
- **Dokumen Persyaratan**: daftar dokumen dan syarat yang diminta pemberi kerja, dibedakan mana yang lazim dan mana yang janggal.

Hasilnya berupa tingkat kewaspadaan (**Rendah / Sedang / Tinggi**), daftar tanda yang ditemukan, ringkasan, dan saran langkah berikutnya.

### 2. Simulasi (belajar)
Simulasi chat interaktif dengan skenario lowongan pekerjaan fiktif. Kamu memilih respons, lalu langsung mendapat umpan balik dan tips.

## Petunjuk penggunaan

### Memeriksa pesan, tautan, atau dokumen
1. Buka beranda, lalu klik **Periksa**.
2. Pilih yang ingin kamu periksa: **Pesan Loker**, **Tautan Lowongan**, atau **Dokumen Persyaratan**.
3. Tempel teksnya di kolom yang tersedia. Belum punya contoh? Klik **Coba Contoh** untuk mengisi dengan contoh fiktif.
4. Klik tombol **Periksa** dan tunggu beberapa detik.
5. Baca hasilnya di kotak kanan:
   - **Tingkat risiko**: Rendah, Sedang, atau Tinggi.
   - **Daftar tanda** yang janggal, lengkap dengan alasannya.
   - **Ringkasan** dan saran langkah berikutnya.
6. Klik **Apa yang harus dilakukan?** untuk panduan tindak lanjut.

### Berlatih lewat simulasi
1. Buka beranda, lalu klik **Simulasi**.
2. Pilih skenario: [ISI: daftar skenario yang sudah tersedia].
3. Baca percakapan, lalu pilih respons di setiap langkah.
4. Kamu langsung mendapat umpan balik dan tips setelah memilih. Di akhir ada ringkasan.

### Tips memakai Cekkan
- **Jangan menempelkan data pribadi asli** (NIK, nomor rekening, nomor telepon). Samarkan dulu.
- Hasilnya **indikasi, bukan kepastian**. Tidak ada tanda yang ditemukan bukan berarti aman. Selalu verifikasi lewat kanal resmi perusahaan.
- Cekkan tidak membuka tautan yang kamu tempel. Jangan membukanya sebelum yakin aman.

### Kalau muncul pesan gagal

Pesan muncul di kotak hasil. Ini artinya dan yang bisa kamu lakukan:

| Pesan yang muncul | Artinya | Yang bisa dilakukan |
|---|---|---|
| Isi dulu sebelum diperiksa / Isi dulu bagian yang akan diperiksa | Kolom masih kosong | Tempel teks atau klik **Coba Contoh** |
| Teks terlalu panjang (maks ... karakter) | Isi melebihi batas | Persingkat, atau periksa per bagian |
| Terlalu banyak permintaan | Batas 15 pemeriksaan per 10 menit tercapai | Tunggu beberapa menit |
| Kuota pemeriksaan hari ini sudah habis | Batas harian seluruh pengguna tercapai | Coba lagi besok |
| Layanan AI sedang ramai / AI terlalu lama merespons / Layanan AI sedang bermasalah / Tidak dapat terhubung ke layanan AI | Layanan AI sedang sibuk atau tidak merespons | Tunggu sebentar, lalu coba lagi |
| AI tidak memberikan jawaban / Jawaban AI tidak bisa dibaca | AI membalas dengan format yang tidak terbaca | Coba lagi, atau ubah sedikit isinya |
| Data yang kamu masukkan tidak bisa diperiksa (atau penjelasan singkat dari AI) | Isi tidak sesuai fitur yang dipilih | Pastikan yang ditempel memang pesan lowongan, tautan, atau daftar persyaratan |
| Tidak bisa terhubung ke server | Koneksi internetmu terputus, atau server Cekkan sedang tidak tersedia | Cek koneksi, lalu coba lagi. Kalau berulang, kabari tim |
| Server belum dikonfigurasi / API key ditolak / Model atau alamat AI tidak ditemukan / Permintaan ke AI ditolak | Masalah pengaturan di sisi server, bukan kesalahanmu | Hubungi tim pengembang |
| Pemeriksaan gagal. Coba lagi sebentar. | Kesalahan umum | Coba lagi |
