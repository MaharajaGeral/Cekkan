/* ==========================================================
   CEKKAN – data.js
   Isi statis: contoh input dan alur simulasi.
   ========================================================== */

const SAMPLES = {
  pesan: "Halo, kami sedang mencari admin toko online. Bisa kerja dari rumah, jadwal fleksibel. Sebelum mulai ada biaya aktivasi akun Rp150.000, nanti saya kirim link pendaftarannya ya.",
  tautan: "https://pendaftaran-lowongan.example",
  dokumen: "CV\nFotokopi KTP\nFoto selfie sambil memegang KTP\nNomor rekening dan PIN ATM\nBiaya administrasi Rp300.000"
};

/* Setiap pilihan bisa membawa chat ke langkah berbeda.
   Pilihan tanpa next menuju penutup setelah jumlah jawaban minimum tercapai. */
const SIM_SCENARIOS = {
  lowongan: {
    contact: "Mira · Rekrutmen",
    start: "lowongan-awal",
    minAnswers: 4,
    followUp: ["lowongan-tindak-lanjut", "lowongan-penutup"],
    steps: [
      {
        id: "lowongan-awal",
        hr: [
          "Halo, Kak. Saya Mira, dari tim rekrutmen. Kontak Kakak saya dapat dari grup info kerja.",
          "Kami lagi cari admin untuk bantu balas chat pesanan. Sistemnya remote dan jadwalnya fleksibel."
        ],
        choices: [
          { text: "Iya, masih cari. Boleh tahu nama perusahaan dan detail lowongannya?", good: true, next: "lowongan-identitas",
            reply: ["Posisinya untuk toko online yang sedang menambah tim admin. Info pendaftaran ada di formulir yang saya kirim."],
            tip: "Kamu mencoba memverifikasi perekrut sebelum lanjut. Perhatikan apakah dia memberi informasi yang bisa dicek." },
          { text: "Iya, boleh jelasin tugas hariannya seperti apa?", good: false, next: "lowongan-minat",
            reply: ["Sehari-hari membalas pertanyaan pelanggan dan mencatat pesanan. Panduan kerja diberikan setelah pendaftaran."],
            tip: "Bertanya soal tugas itu wajar, tapi identitas perekrut dan detail lowongan juga perlu dipastikan." },
          { text: "Boleh, kirim info dan syaratnya, nanti saya pelajari.", good: false, next: "lowongan-syarat",
            reply: ["Baik, Kak. Untuk awal cukup ponsel dan rekening aktif. Saya kirim formulirnya."],
            tip: "Meminta syarat belum berarti lowongannya terverifikasi. Lihat apakah detail perusahaan dan proses seleksinya jelas." }
        ]
      },
      {
        id: "lowongan-identitas",
        hr: [
          "Nama toko dan detail penempatan tercantum di formulir pendaftaran. Setelah data awal masuk, tim akan menghubungi kandidat.",
          "Untuk pencocokan data, formulirnya meminta nama lengkap dan foto KTP."
        ],
        choices: [
          { text: "Saya ingin cek nama perusahaan dulu sebelum mengirim KTP. Ada situs atau kontak resminya?", good: true,
            reply: ["Informasi perusahaan bisa Kakak lihat setelah formulir awal dikirim. Kalau belum berkenan, tidak perlu dilanjutkan."],
            tip: "Tahan dokumen identitas sampai perusahaan, lowongan, dan tujuan pengumpulan datanya bisa diverifikasi." },
          { text: "Saya kirim nama lengkap dulu, KTP-nya menyusul.", good: false,
            reply: ["Oke, nanti sekalian tanggal lahir juga ya buat data kandidat."],
            tip: "Data sederhana pun bisa dipakai untuk meminta informasi tambahan. Pastikan perekrutnya dulu." },
          { text: "Saya kirim foto KTP biar cepat diproses.", good: false,
            reply: ["Makasih, Kak. Saya teruskan dulu ke bagian pendaftaran."],
            tip: "KTP berisi data sensitif. Jangan mengirim foto identitas ke perekrut yang belum terverifikasi." }
        ]
      },
      {
        id: "lowongan-minat",
        hr: [
          "Tugasnya membalas chat pelanggan dan memasukkan pesanan. Pengalaman tidak wajib; jadwalnya bisa dibicarakan.",
          "Sebelum mulai ada deposit aktivasi akun Rp150 ribu. Biayanya dikembalikan setelah gaji pertama sesuai prosedur."
        ],
        choices: [
          { text: "Saya nggak bayar deposit untuk mulai kerja. Saya cek lowongannya dulu.", good: true,
            reply: ["Saya paham, Kak. Tapi depositnya memang prosedur dari toko."],
            tip: "Jangan membayar biaya awal ke perekrut yang belum terverifikasi. Minta rincian tertulis dan cek langsung ke perusahaan." },
          { text: "Kalau depositnya dikembalikan, prosedurnya tertulis di mana?", good: false,
            reply: ["Rinciannya ada di panduan aktivasi. Setelah akun dibuat, saya kirimkan ke Kakak."],
            tip: "Janji pengembalian tidak menjamin uang kembali. Verifikasi lowongan dan penerima uang sebelum transfer." },
          { text: "Boleh minta rincian tertulis biaya ini sebelum saya memutuskan?", good: false,
            reply: ["Bisa, Kak. Rincian lengkap diberikan setelah data awal masuk ke sistem."],
            tip: "Jangan bernegosiasi soal biaya sebelum memastikan pekerjaan dan pihak perekrutnya nyata." }
        ]
      },
      {
        id: "lowongan-syarat",
        hr: [
          "Untuk pendaftaran awal perlu ponsel, KTP, dan rekening aktif. Seleksi dilakukan lewat formulir, jadi belum ada wawancara langsung.",
          "Ini tautan formulirnya: https://daftar-kerja.example"
        ],
        choices: [
          { text: "Saya cek nama perusahaan dan lowongannya lewat sumber resmi dulu.", good: true,
            reply: ["Silakan, Kak. Kalau sudah ada kabar, chat saya lagi."],
            tip: "Cari perusahaan dan lowongannya secara mandiri sebelum mengisi tautan atau mengirim dokumen." },
          { text: "Saya isi dulu, nanti kalau ada yang janggal baru berhenti.", good: false,
            reply: ["Oke, setelah isi kirim foto KTP-nya ke saya juga ya."],
            tip: "Formulir bisa meminta data sensitif. Verifikasi sumbernya sebelum mengisi." },
          { text: "Kalau lolos, proses berikutnya apa?", good: false,
            reply: ["Tim akan menghubungi lewat chat ini untuk aktivasi akun dan jadwal mulai."],
            tip: "Proses instan bukan bukti lowongan itu asli. Pastikan detail pemberi kerja masuk akal." }
        ]
      },
      {
        id: "lowongan-tindak-lanjut",
        hr: [
          "Saya paham Kakak mau memastikan dulu. Untuk semua kandidat memang ada tahap aktivasi sebelum jadwal kerja dibagikan.",
          "Kalau mau, saya bisa tahan slotnya sampai sore sambil Kakak cek informasinya."
        ],
        choices: [
          { text: "Saya tetap tidak akan kirim data atau bayar sebelum perusahaan bisa diverifikasi.", good: true,
            reply: ["Baik, Kak. Slotnya belum bisa saya tahan tanpa data pendaftaran."],
            tip: "Jangan biarkan janji menahan posisi membuatmu melewati verifikasi perusahaan dan lowongannya." },
          { text: "Kalau slotnya ditahan, saya kirim data awal dulu.", good: false,
            reply: ["Baik. Setelah data masuk, saya kirim langkah aktivasi berikutnya."],
            tip: "Data awal dapat menjadi pintu untuk permintaan data atau biaya tambahan. Verifikasi pemberi kerja lebih dulu." },
          { text: "Saya bayar depositnya saja supaya prosesnya jalan.", good: false,
            reply: ["Saya kirim detail pembayaran dan formulir aktivasi setelah ini."],
            tip: "Jangan membayar biaya untuk mendapatkan pekerjaan sebelum perusahaan dan prosesnya jelas." }
        ]
      },
      {
        id: "lowongan-penutup",
        hr: [
          "Sebelum jadwal orientasi, sistem meminta foto KTP dan pembayaran aktivasi.",
          "Kalau belum siap, jangan kirim apa-apa dulu. Silakan cek lowongan ini lewat kanal resmi."
        ],
        choices: [
          { text: "Saya berhenti di sini dan mencari kontak perusahaan secara mandiri.", good: true,
            reply: ["Baik, Kak. Saya tutup pengajuannya. Semoga lancar mencari kerja."],
            tip: "Akhiri chat dan verifikasi lewat sumber yang kamu cari sendiri. Jangan gunakan tautan atau kontak dari pesan ini." },
          { text: "Saya kirim KTP saja, pembayaran nanti.", good: false,
            reply: ["Baik, data KTP-nya saya catat untuk proses kandidat."],
            tip: "Jangan mengirim dokumen identitas ke perekrut yang belum diverifikasi." },
          { text: "Saya lanjutkan aktivasi dan transfer sekarang.", good: false,
            reply: ["Saya kirim instruksinya. Pastikan semua tahap selesai hari ini."],
            tip: "Jangan membayar atau mengirim dokumen karena merasa harus segera menyelesaikan proses." }
        ]
      }
    ],
    redflags: [
      "Identitas perusahaan dan detail lowongan tidak diberikan",
      "Meminta KTP atau data pribadi sebelum proses rekrutmen jelas",
      "Meminta deposit atau biaya aktivasi sebelum mulai bekerja",
      "Mengarahkan ke formulir atau tautan yang belum terverifikasi"
    ]
  },
  
};
