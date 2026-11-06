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
   Pilihan tanpa next mengakhiri percakapan setelah balasan kontak. */
const SIM_SCENARIOS = {
  lowongan: {
    contact: "Mira · Rekrutmen",
    start: "lowongan-awal",
    steps: [
      {
        id: "lowongan-awal",
        hr: [
          "Halo, Kak. Saya Mira, dapat nomor Kakak dari grup info kerja. Lagi cari kerja admin?",
          "Kebetulan ada posisi admin toko online. Kerjanya dari rumah, jamnya fleksibel."
        ],
        choices: [
          { text: "Iya, masih cari. Ini lowongan dari perusahaan apa? Saya mau cek dulu.", good: true, next: "lowongan-identitas",
            reply: ["Bisa, Kak. Tapi biasanya nama toko baru dibuka setelah data pelamar masuk."],
            tip: "Kamu mencoba memverifikasi perekrut sebelum lanjut. Perhatikan apakah dia memberi informasi yang bisa dicek." },
          { text: "Iya, minat sih. Kerjanya ngapain aja?", good: false, next: "lowongan-minat",
            reply: ["Admin chat, balas pesanan sama bantu input order. Gampang kok, nanti saya pandu."],
            tip: "Bertanya soal tugas itu wajar, tapi identitas perekrut dan detail lowongan juga perlu dipastikan." },
          { text: "Boleh, kirim syaratnya. Saya lihat dulu.", good: false, next: "lowongan-syarat",
            reply: ["Siap, Kak. Syaratnya simpel banget, bisa langsung mulai dari rumah."],
            tip: "Meminta syarat belum berarti lowongannya terverifikasi. Lihat apakah detail perusahaan dan proses seleksinya jelas." }
        ]
      },
      {
        id: "lowongan-identitas",
        hr: [
          "Wajar kok mau cek dulu. Cuma ini lowongan titipan, jadi saya belum bisa kasih nama toko sebelum pendaftaran.",
          "Biar saya cocokkan, boleh kirim nama lengkap dan foto KTP?"
        ],
        choices: [
          { text: "Saya belum kirim KTP. Bisa kasih nama perusahaan atau tautan lowongan resminya dulu?", good: true,
            reply: ["Kalau belum nyaman nggak apa-apa, Kak. Tapi saya memang belum bisa kasih detailnya."],
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
          "Balas chat pelanggan sama input pesanan aja. Nggak perlu pengalaman, jadwalnya atur sendiri.",
          "Sebelum mulai ada deposit akun Rp150 ribu. Katanya bisa balik bareng gaji pertama."
        ],
        choices: [
          { text: "Saya nggak bayar deposit untuk mulai kerja. Saya cek lowongannya dulu.", good: true,
            reply: ["Saya paham, Kak. Tapi depositnya memang prosedur dari toko."],
            tip: "Jangan membayar biaya awal ke perekrut yang belum terverifikasi. Minta rincian tertulis dan cek langsung ke perusahaan." },
          { text: "Kalau nanti balik, boleh. Kirim rekeningnya.", good: false,
            reply: ["Oke, saya kirim nomor rekening adminnya ya."],
            tip: "Janji pengembalian tidak menjamin uang kembali. Verifikasi lowongan dan penerima uang sebelum transfer." },
          { text: "Bisa dipotong dari gaji aja nggak?", good: false,
            reply: ["Belum bisa, Kak. Akunnya harus diaktifkan dulu sebelum mulai."],
            tip: "Jangan bernegosiasi soal biaya sebelum memastikan pekerjaan dan pihak perekrutnya nyata." }
        ]
      },
      {
        id: "lowongan-syarat",
        hr: [
          "Syaratnya cuma punya HP, KTP, sama rekening aktif. Nggak ada wawancara, bisa langsung kerja.",
          "Ada formulir singkat di sini: https://daftar-kerja.example"
        ],
        choices: [
          { text: "Saya cek nama perusahaan dan lowongannya lewat sumber resmi dulu.", good: true,
            reply: ["Silakan, Kak. Kalau sudah ada kabar, chat saya lagi."],
            tip: "Cari perusahaan dan lowongannya secara mandiri sebelum mengisi tautan atau mengirim dokumen." },
          { text: "Saya isi dulu, nanti kalau ada yang janggal baru berhenti.", good: false,
            reply: ["Oke, setelah isi kirim foto KTP-nya ke saya juga ya."],
            tip: "Formulir bisa meminta data sensitif. Verifikasi sumbernya sebelum mengisi." },
          { text: "Nggak ada wawancara? Berarti saya bisa mulai hari ini?", good: false,
            reply: ["Bisa, Kak. Tinggal selesaikan pendaftaran dan aktivasi akun."],
            tip: "Proses instan bukan bukti lowongan itu asli. Pastikan detail pemberi kerja masuk akal." }
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
  bank: {
    contact: "Layanan Nasabah",
    start: "bank-awal",
    steps: [
      {
        id: "bank-awal",
        hr: [
          "Selamat siang, Kak. Ada transaksi yang tertunda di rekening Kakak.",
          "Kalau merasa bukan melakukan, kabari saya ya. Saya bantu cek dari sini."
        ],
        choices: [
          { text: "Saya cek dari aplikasi bank dulu ya, bukan lewat chat.", good: true, next: "bank-cek-sendiri",
            reply: ["Boleh, Kak. Tapi kalau ada kendala, kabari saya di sini saja."],
            tip: "Buka aplikasi sendiri atau cari nomor resmi secara mandiri, bukan dari tautan atau nomor di pesan." },
          { text: "Transaksi apa? Saya memang lagi nunggu pembayaran.", good: false, next: "bank-transaksi",
            reply: ["Katanya ada transaksi keluar yang tertahan, Kak. Saya cekkan ya."],
            tip: "Jangan mengonfirmasi aktivitas rekening kepada pengirim yang belum dipastikan identitasnya." },
          { text: "Waduh, rekening saya bakal diblokir nggak?", good: false, next: "bank-panik",
            reply: ["Bisa dibekukan sementara kalau nggak segera dikonfirmasi, Kak."],
            tip: "Pesan yang membuat panik bisa mendorongmu mengikuti instruksi tanpa sempat memeriksa." }
        ]
      },
      {
        id: "bank-cek-sendiri",
        hr: [
          "Sambil dicek, saya kirim tautan pembatalan ya: https://cek-mutasi.example",
          "Buka saja dari HP, nanti muncul notifikasi persetujuan."
        ],
        choices: [
          { text: "Saya nggak buka tautan dari chat. Saya hubungi bank dari aplikasi resmi.", good: true,
            reply: ["Baik, Kak. Silakan hubungi lewat aplikasi saja."],
            tip: "Abaikan tautan dan konfirmasi aktivitas rekening langsung melalui aplikasi resmi." },
          { text: "Saya buka dulu, tapi nggak akan isi apa-apa.", good: false,
            reply: ["Nanti ikuti petunjuknya ya, Kak, supaya transaksinya bisa dibatalkan."],
            tip: "Halaman palsu bisa meniru tampilan resmi dan meminta data atau persetujuan. Jangan buka tautan itu." },
          { text: "Kalau muncul notifikasi, saya setujui aja?", good: false,
            reply: ["Iya, setujui supaya proses pembatalannya masuk."],
            tip: "Jangan menyetujui notifikasi transaksi yang tidak kamu mulai. Cek lewat aplikasi resmi." }
        ]
      },
      {
        id: "bank-transaksi",
        hr: [
          "Saya perlu cocokkan dulu. Boleh kirim empat angka terakhir kartu dan nama lengkap?",
          "Kalau muncul kode di SMS, kirim juga biar saya pastikan transaksinya."
        ],
        choices: [
          { text: "Saya nggak kirim kode apa pun. Saya cek transaksinya lewat aplikasi bank.", good: true,
            reply: ["Oke, Kak. Kalau ada transaksi, silakan laporkan lewat menu bantuan di aplikasi."],
            tip: "Jangan membagikan OTP atau kode SMS. Cek mutasi dan laporkan aktivitas mencurigakan lewat aplikasi resmi." },
          { text: "Empat angka terakhirnya 4821, nama saya ...", good: false,
            reply: ["Terima kasih, Kak. Sekarang kirim kode yang masuk supaya saya lanjutkan."],
            tip: "Hindari membagikan data rekening ke pengirim yang belum diverifikasi. Jangan berikan kode SMS atau OTP." },
          { text: "Belum ada SMS. Saya kirim kalau sudah masuk.", good: false,
            reply: ["Siap, saya tunggu kodenya ya, Kak."],
            tip: "Jangan kirim kode yang masuk. Kode itu bisa digunakan untuk menyetujui transaksi atau masuk ke akun." }
        ]
      },
      {
        id: "bank-panik",
        hr: [
          "Biar rekeningnya nggak tertahan, saya bantu amankan sekarang.",
          "Tolong foto kartu ATM dan sebutkan kode OTP yang baru dikirim."
        ],
        choices: [
          { text: "Saya tidak kirim foto kartu atau OTP. Saya telepon nomor resmi bank sekarang.", good: true,
            reply: ["Baik, Kak. Pastikan hubungi nomor yang ada di kartu atau situs resmi."],
            tip: "Bank tidak memerlukan OTP atau foto kartu melalui chat. Hubungi nomor resmi yang kamu cari sendiri." },
          { text: "Saya kirim foto kartunya dulu, OTP jangan ya.", good: false,
            reply: ["Boleh, Kak. Pastikan fotonya jelas supaya cepat."],
            tip: "Foto kartu memuat informasi sensitif. Jangan bagikan kepada kontak yang belum dipastikan resmi." },
          { text: "Saya sebutkan OTP-nya saja biar rekening aman.", good: false,
            reply: ["Terima kasih, Kak. Saya proses dulu ya."],
            tip: "Jangan pernah memberitahukan OTP. Jika sudah terlanjur, segera hubungi bank lewat kanal resminya." }
        ]
      }
    ],
    redflags: [
      "Membuat panik dengan ancaman transaksi atau rekening diblokir",
      "Meminta OTP, foto kartu, atau data rekening lewat chat",
      "Mengirim tautan dan meminta persetujuan transaksi",
      "Meminta mengabaikan peringatan keamanan"
    ]
  },
  hadiah: {
    contact: "Info Pemenang",
    start: "hadiah-awal",
    steps: [
      {
        id: "hadiah-awal",
        hr: [
          "Hai, Kak. Selamat ya, nomor Kakak terpilih dapat hadiah ponsel.",
          "Saya bantu proses klaimnya. Boleh minta nama lengkap?"
        ],
        choices: [
          { text: "Saya ikut undian dari mana, ya? Saya mau cek dulu pengumuman resminya.", good: true, next: "hadiah-cek",
            reply: ["Dari undian pelanggan, Kak. Nanti saya kirim detailnya kalau sudah masuk proses."],
            tip: "Pastikan dulu kamu memang mengikuti program itu. Cari pengumuman melalui kanal resmi yang kamu temukan sendiri." },
          { text: "Wah, hadiah apa? Saya mau tahu detailnya dulu.", good: false, next: "hadiah-detail",
            reply: ["Ponsel, Kak. Tinggal klaim saja, kebetulan nama Kakak keluar."],
            tip: "Jangan berikan data pribadi sebelum tahu penyelenggara dan program yang dimaksud." },
          { text: "Nama saya [nama lengkap]. Cara ambil hadiahnya gimana?", good: false, next: "hadiah-data",
            reply: ["Makasih, Kak. Saya cocokkan dulu dengan daftar pemenang."],
            tip: "Hindari mengonfirmasi data pribadi ke pengirim yang belum terverifikasi." }
        ]
      },
      {
        id: "hadiah-cek",
        hr: [
          "Saya nggak pegang link pengumumannya, Kak. Kalau mau diproses, cukup bayar ongkir Rp85 ribu.",
          "Nanti hadiahnya dikirim hari ini."
        ],
        choices: [
          { text: "Saya cek penyelenggaranya dulu. Saya nggak transfer lewat chat ini.", good: true,
            reply: ["Baik, Kak. Kalau sudah dapat konfirmasi, kabari saya lagi."],
            tip: "Verifikasi undian dan biaya melalui penyelenggara resmi sebelum membayar." },
          { text: "Boleh kirim nomor rekeningnya? Saya bayar setelah cek sebentar.", good: false,
            reply: ["Ini rekening adminnya, Kak. Saya tunggu bukti transfernya."],
            tip: "Jangan membayar sebelum memastikan program dan penerimanya resmi." },
          { text: "Kalau saya bayar, hari ini pasti sampai?", good: false,
            reply: ["Iya, Kak, asal transfernya sebelum kurir tutup."],
            tip: "Janji pengiriman bukan bukti hadiah itu nyata. Verifikasi dulu tanpa membayar." }
        ]
      },
      {
        id: "hadiah-detail",
        hr: [
          "Ponsel baru, Kak. Ongkirnya Rp85 ribu saja, nanti saya kirim nomor rekening.",
          "Boleh kirim alamat rumah biar saya siapkan paketnya?"
        ],
        choices: [
          { text: "Saya belum kasih alamat atau bayar sebelum tahu siapa penyelenggaranya.", good: true,
            reply: ["Iya, Kak. Alamatnya nanti saja kalau sudah siap dikirim."],
            tip: "Alamat rumah juga data pribadi. Pastikan program dan penyelenggaranya lebih dulu." },
          { text: "Alamat saya ..., kirim saja kalau sudah siap.", good: false,
            reply: ["Siap, Kak. Saya catat dulu alamatnya."],
            tip: "Jangan mengirim alamat ke orang yang belum diverifikasi." },
          { text: "Saya bayar ongkirnya kalau paketnya sudah siap.", good: false,
            reply: ["Boleh, Kak. Saya kirim nomor rekening untuk tanda jadinya dulu."],
            tip: "Jangan kirim uang muka sebelum memastikan undian dan identitas pengirim." }
        ]
      },
      {
        id: "hadiah-data",
        hr: [
          "Biar cocok, kirim foto KTP ya, Kak. Sekalian kode OTP yang baru masuk ke HP.",
          "Saya tunggu sebentar, soalnya klaimnya mau ditutup."
        ],
        choices: [
          { text: "Saya tidak kirim KTP atau OTP. Saya cek undiannya lewat penyelenggara resmi.", good: true,
            reply: ["Baik, Kak. Tidak perlu kirim kalau belum yakin."],
            tip: "Jangan kirim KTP atau OTP, meskipun pengirim mengaku perlu memvalidasi hadiah." },
          { text: "Saya kirim foto KTP, tapi OTP jangan diminta ya.", good: false,
            reply: ["Oke, Kak. Foto KTP-nya saja dulu."],
            tip: "Jangan mengirim dokumen identitas ke pihak yang belum terverifikasi." },
          { text: "Saya kirim OTP-nya saja biar klaimnya nggak hangus.", good: false,
            reply: ["Terima kasih, Kak. Saya lanjutkan prosesnya."],
            tip: "OTP bersifat rahasia. Jangan pernah membagikannya kepada siapa pun." }
        ]
      }
    ],
    redflags: [
      "Dijanjikan hadiah tanpa penjelasan program atau penyelenggara",
      "Diminta membayar ongkir atau biaya ke rekening pribadi",
      "Diminta alamat, foto KTP, atau kode OTP",
      "Ditekan dengan batas waktu klaim"
    ]
  },
  formulir: {
    contact: "Info Pendataan",
    start: "form-awal",
    steps: [
      {
        id: "form-awal",
        hr: [
          "Pagi, Kak. Saya dapat nomor Kakak dari grup warga. Lagi ada pendataan bantuan sembako.",
          "Ini link formulirnya. Katanya ditutup sore ini: https://data-bantuan.example"
        ],
        choices: [
          { text: "Dari instansi mana, ya? Saya cek ke pengurus setempat dulu.", good: true, next: "form-sumber",
            reply: ["Saya cuma diminta teruskan, Kak. Coba tanya admin grup saja."],
            tip: "Pastikan penyelenggara dan cari informasi program melalui kontak resmi sebelum membuka formulir." },
          { text: "Saya buka dulu link-nya, lihat isinya.", good: false, next: "form-buka",
            reply: ["Oke. Kalau sudah kebuka, isi semua yang wajib ya."],
            tip: "Tautan dari pesan belum tentu resmi. Jangan masukkan data sebelum memeriksa siapa pengelolanya." },
          { text: "Saya teruskan ke keluarga dulu, siapa tahu mereka butuh.", good: false, next: "form-teruskan",
            reply: ["Boleh, Kak. Makin banyak yang isi makin cepat didata katanya."],
            tip: "Jangan teruskan tautan yang belum diverifikasi; orang lain juga bisa terdorong menyerahkan data." }
        ]
      },
      {
        id: "form-sumber",
        hr: [
          "Saya kurang tahu nama instansinya. Yang sebar bilang bantuannya dari program wilayah.",
          "Formulirnya minta NIK dan foto KTP. Katanya buat validasi penerima."
        ],
        choices: [
          { text: "Saya tahan dulu. Saya cari tahu nama instansi dan tujuan penggunaan datanya.", good: true,
            reply: ["Iya, Kak. Saya juga belum tahu detailnya, cuma diminta bantu sebar."],
            tip: "Pastikan pengelola dan tujuan pengumpulan data sebelum memberikan NIK atau foto KTP." },
          { text: "Kalau cuma NIK dan KTP, saya isi saja.", good: false,
            reply: ["Oke, Kak. Kalau ada kendala isi, kirim fotonya ke saya."],
            tip: "NIK dan foto KTP adalah data sensitif. Jangan serahkan sebelum pengelola formulir terverifikasi." },
          { text: "Boleh kirim foto KTP saya lewat chat saja?", good: false,
            reply: ["Boleh, Kak. Kirim di sini saja biar saya bantu masukkan."],
            tip: "Jangan mengirim foto identitas ke perantara yang tidak jelas." }
        ]
      },
      {
        id: "form-buka",
        hr: [
          "Sudah kebuka, Kak? Ada kolom NIK, nama ibu kandung, nomor kartu ATM, sama PIN.",
          "Semua wajib diisi biar bantuannya bisa masuk."
        ],
        choices: [
          { text: "Saya tutup dulu. Saya nggak akan isi PIN atau data kartu.", good: true,
            reply: ["Iya, Kak. Kalau begitu jangan dilanjutkan dulu sebelum jelas."],
            tip: "PIN dan nomor kartu tidak diperlukan untuk formulir bantuan. Tutup formulir dan verifikasi pengelolanya." },
          { text: "Saya isi nama dan NIK saja, bagian ATM saya lewati.", good: false,
            reply: ["Tapi semua kolom harus lengkap supaya pengajuan masuk, Kak."],
            tip: "Jangan lanjutkan formulir yang meminta rahasia perbankan. Pastikan sumber dan kebutuhan data terlebih dulu." },
          { text: "Saya isi semua, nanti PIN bisa saya ganti.", good: false,
            reply: ["Siap, Kak. Setelah itu kirim screenshot bukti pengisiannya ya."],
            tip: "Jangan masukkan PIN ke formulir. Mengubahnya nanti tidak menghapus risiko data yang terlanjur dibagikan." }
        ]
      },
      {
        id: "form-teruskan",
        hr: [
          "Makasih sudah bantu sebar. Saya sendiri belum tahu siapa yang bikin formulirnya.",
          "Kalau keluarga Kakak isi sekarang, katanya bisa langsung masuk daftar."
        ],
        choices: [
          { text: "Saya urungkan dulu. Kita cek ke pengurus atau instansi setempat.", good: true,
            reply: ["Iya, lebih baik dipastikan dulu ya, Kak."],
            tip: "Hentikan penyebaran sampai program dan formulirnya dikonfirmasi oleh pihak yang berwenang." },
          { text: "Saya kirim ke keluarga, tapi bilang jangan isi data sensitif.", good: false,
            reply: ["Boleh, Kak. Nanti saya kirim link yang sama ke mereka."],
            tip: "Jangan sebarkan tautan tak terverifikasi. Peringatan saja belum cukup untuk mencegah orang membuka formulir." },
          { text: "Saya isi dulu buat contoh, baru saya kabari mereka.", good: false,
            reply: ["Oke, Kak. Kalau sudah selesai kirim bukti ya."],
            tip: "Mengisi formulir untuk mencoba tetap dapat membocorkan data. Verifikasi sumbernya sebelum mengisi." }
        ]
      }
    ],
    redflags: [
      "Tidak jelas siapa penyelenggara dan pengelola formulir",
      "Meminta PIN, nomor kartu, nama ibu kandung, atau data berlebihan",
      "Meminta foto KTP lewat chat atau formulir tak terverifikasi",
      "Menggunakan tenggat waktu agar formulir segera diisi"
    ]
  }
};
