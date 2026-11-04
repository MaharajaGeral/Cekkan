/* ==========================================================
   CEKKAN – data.js
   Isi statis: skenario simulasi & contoh input.
   Mau tambah skenario baru? Salin objek "lowongan" di bawah,
   ganti kuncinya (mis. "bank"), lalu tambahkan <section> baru di
   index.html dengan data-route="/simulasi/bank" data-scenario="bank"
   dan ubah href kartunya.
   ========================================================== */

const SAMPLES = {
  pesan: "Buka loker Junior Programmer. Gaji 15 juta/bulan tanpa pengalaman, bekerja secara remote, dan jam kerja hanya 1 jam/hari. Transfer biaya seragam Rp1.500.000 hari ini, kuota terbatas. Kunjungi http://kecap-karir.xyz/daftar untuk konfirmasi.",
  tautan: "http://kecap-karir.xyz/daftar",
  dokumen: "CV\nFotokopi KTP\nFoto selfie sambil memegang KTP\nNomor rekening dan PIN ATM\nBiaya administrasi Rp300.000"
};

/* Tiap "step": pesan dari HR (boleh lebih dari satu), lalu pilihan jawaban.
   good: true  -> pilihan yang tepat
   tip         -> penjelasan yang tampil setelah user memilih */
const SIM_SCENARIOS = {
  lowongan: {
    contact: "HR PT KECAP",
    steps: [
      {
        hr: [
          "Halo kak! Kami dari PT KECAP membuka lowongan Admin Online.",
          "Gaji 8 juta/bulan, kerja dari rumah cuma 2 jam sehari, tanpa pengalaman. Tertarik?"
        ],
        choices: [
          { text: "Terima kasih infonya. Boleh tahu alamat kantor dan situs resmi PT KECAP?", good: true,
            tip: "Tepat. Perusahaan asli bisa menunjukkan alamat dan situs resminya. Gaji besar dengan syarat longgar adalah tanda yang perlu diwaspadai." },
          { text: "Wah gajinya besar! Saya mau, bagaimana cara daftarnya?", good: false,
            tip: "Terlalu cepat tertarik. Gaji tinggi tanpa syarat apa pun adalah umpan yang sering dipakai penipu. Verifikasi dulu perusahaannya." },
          { text: "Boleh, langsung kirim saja lowongannya ke sini.", good: false,
            tip: "Kamu belum menanyakan apa pun tentang perusahaannya. Biasakan bertanya identitas perusahaan sebelum lanjut." }
        ]
      },
      {
        hr: [
          "Kantor kami di Jakarta, tapi semua proses online lewat WhatsApp ya kak.",
          "Untuk daftar, kirim foto KTP, foto selfie sambil pegang KTP, dan nomor rekening kakak."
        ],
        choices: [
          { text: "Maaf, data pribadi belum bisa saya kirim sebelum perusahaannya jelas. Bisa wawancara resmi dulu?", good: true,
            tip: "Tepat. Data seperti KTP, selfie KTP, dan rekening bisa disalahgunakan. Berikan hanya setelah perusahaan terverifikasi." },
          { text: "Baik, ini saya kirim foto KTP dan selfie-nya.", good: false,
            tip: "Selfie dengan KTP sering dipakai untuk membuat pinjaman online atau akun palsu atas namamu." },
          { text: "Oke, ini nomor rekening saya, sekalian saya kirim KTP-nya.", good: false,
            tip: "Nomor rekening dan KTP di tahap awal tanpa wawancara adalah tanda bahaya." }
        ]
      },
      {
        hr: [
          "Wawancara tidak perlu kak, kakak langsung DITERIMA 🎉",
          "Tinggal bayar biaya seragam dan pelatihan Rp1.500.000. Transfer hari ini ya, kuota tinggal 2 orang!"
        ],
        choices: [
          { text: "Perusahaan resmi tidak meminta biaya dari pelamar. Saya tidak akan transfer.", good: true,
            tip: "Tepat. Diterima tanpa seleksi lalu diminta bayar di awal adalah ciri paling umum penipuan loker." },
          { text: "Baik, saya transfer sekarang.", good: false,
            tip: "Jangan transfer. Setelah uang masuk, pelaku biasanya meminta biaya tambahan atau menghilang." },
          { text: "Boleh dicicil atau dipotong dari gaji pertama saja?", good: false,
            tip: "Menawar tidak membantu. Intinya tetap sama: pelamar tidak seharusnya diminta membayar." }
        ]
      },
      {
        hr: [
          "Kalau tidak transfer hari ini, posisi kakak kami berikan ke orang lain lho.",
          "Ini link konfirmasinya: http://kecap-karir.xyz/daftar"
        ],
        choices: [
          { text: "Saya berhenti di sini dan akan memeriksa lowongan ini lewat sumber resmi.", good: true,
            tip: "Tepat. Kamu berhak berhenti kapan saja. Tekanan waktu adalah cara agar kamu tidak sempat berpikir." },
          { text: "Saya klik linknya dulu.", good: false,
            tip: "Tautan dengan domain aneh bisa mencuri data atau memasang aplikasi berbahaya. Jangan dibuka." },
          { text: "Oke, saya transfer sekarang biar posisinya tidak hangus.", good: false,
            tip: "Itulah tujuan tekanan waktu: membuatmu panik dan menyerahkan uang." }
        ]
      }
    ],
    redflags: [
      "Gaji besar, kerja ringan, tanpa syarat pengalaman",
      "Meminta KTP, selfie KTP, dan rekening di awal",
      "Diterima tanpa wawancara",
      "Meminta biaya seragam/pelatihan",
      "Menekan agar transfer hari itu juga",
      "Mengarahkan ke tautan dengan domain tidak resmi"
    ]
  }
};
