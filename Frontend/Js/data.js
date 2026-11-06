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
  bank: {
    contact: "Layanan Nasabah",
    start: "bank-awal",
    minAnswers: 4,
    followUp: ["bank-tindak-lanjut", "bank-penutup"],
    steps: [
      {
        id: "bank-awal",
        hr: [
          "Selamat siang, Kak. Kami menerima permintaan konfirmasi untuk transaksi di rekening Kakak.",
          "Kalau transaksi itu bukan dari Kakak, saya bisa bantu arahkan proses pengecekannya."
        ],
        choices: [
          { text: "Saya cek dari aplikasi bank dulu ya, bukan lewat chat.", good: true, next: "bank-cek-sendiri",
            reply: ["Boleh, Kak. Tapi kalau ada kendala, kabari saya di sini saja."],
            tip: "Buka aplikasi sendiri atau cari nomor resmi secara mandiri, bukan dari tautan atau nomor di pesan." },
          { text: "Transaksi yang mana? Saya memang sedang menunggu pembayaran.", good: false, next: "bank-transaksi",
            reply: ["Transaksinya tercatat sebagai transaksi keluar yang belum selesai. Saya perlu mencocokkan data sebelum memberi detail."],
            tip: "Jangan mengonfirmasi aktivitas rekening kepada pengirim yang belum dipastikan identitasnya." },
          { text: "Apa ada risiko rekening saya dibatasi?", good: false, next: "bank-panik",
            reply: ["Kalau statusnya belum dikonfirmasi, beberapa layanan bisa tertunda. Saya bantu cek langkahnya."],
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
          "Untuk mencari catatannya, mohon konfirmasi nama lengkap dan empat angka terakhir kartu.",
          "Saya juga akan kirim permintaan verifikasi. Sebutkan kode yang masuk supaya pencatatannya bisa dilanjutkan."
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
      },
      {
        id: "bank-tindak-lanjut",
        hr: [
          "Saya catat Kakak ingin cek lewat aplikasi. Status transaksi masih menunggu konfirmasi.",
          "Agar tidak salah langkah, jangan bagikan kode atau menyetujui notifikasi yang tidak Kakak mulai."
        ],
        choices: [
          { text: "Saya tutup chat ini dan hubungi bank dari aplikasi resmi.", good: true,
            reply: ["Baik, Kak. Silakan gunakan menu bantuan di aplikasi."],
            tip: "Hubungi bank melalui aplikasi resmi atau nomor di kartu, bukan dengan membalas pesan ini." },
          { text: "Saya tetap di chat ini saja, tolong pandu langkahnya.", good: false,
            reply: ["Saya kirim langkah pembatalannya lewat tautan agar lebih cepat."],
            tip: "Jangan mengikuti tautan atau instruksi dari pengirim yang identitasnya belum dipastikan." },
          { text: "Kalau ada notifikasi masuk, saya kirim tangkapan layarnya.", good: false,
            reply: ["Boleh, Kak. Pastikan kode yang terlihat ikut terbaca."],
            tip: "Jangan membagikan tangkapan layar yang berisi kode, saldo, atau informasi rekening." }
        ]
      },
      {
        id: "bank-penutup",
        hr: [
          "Untuk keamanan, jangan kirim OTP, PIN, CVV, atau foto kartu ke siapa pun lewat chat.",
          "Jika sudah sempat membagikan data, segera hubungi bank dari kanal resmi dan minta bantuan."
        ],
        choices: [
          { text: "Saya hubungi bank lewat nomor resmi dan cek mutasi sendiri.", good: true,
            reply: ["Itu langkah yang tepat. Jangan gunakan nomor atau tautan dari pesan mencurigakan."],
            tip: "Periksa rekening dan laporkan aktivitas mencurigakan langsung ke bank." },
          { text: "Saya kirim detail rekening di sini agar cepat dibantu.", good: false,
            reply: ["Jangan kirim detail rekening di chat ini. Hubungi bank lewat aplikasi resminya."],
            tip: "Jangan membagikan data rekening melalui kontak yang belum diverifikasi." },
          { text: "Saya buka tautannya sekali lagi untuk memastikan.", good: false,
            reply: ["Tidak perlu membuka tautan. Gunakan aplikasi yang sudah terpasang atau nomor resmi."],
            tip: "Hindari tautan dari pesan. Buka aplikasi bank secara langsung." }
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
    minAnswers: 4,
    followUp: ["hadiah-tindak-lanjut", "hadiah-penutup"],
    steps: [
      {
        id: "hadiah-awal",
        hr: [
          "Halo, Kak. Saya menghubungi soal hadiah ponsel dari program undian pelanggan.",
          "Nomor Kakak masuk daftar penerima undian pelanggan. Boleh saya tahu nama lengkap untuk mencocokkan data?"
        ],
        choices: [
          { text: "Program undian yang mana? Saya mau cocokkan dengan informasi resminya.", good: true, next: "hadiah-cek",
            reply: ["Undian pelanggan akhir bulan, Kak. Nama programnya tercantum di pesan pengumuman."],
            tip: "Pastikan dulu kamu memang mengikuti program itu. Cari pengumuman melalui kanal resmi yang kamu temukan sendiri." },
          { text: "Hadiah ponselnya tipe apa dan dari penyelenggara mana?", good: false, next: "hadiah-detail",
            reply: ["Tipe dan jadwal kirimnya saya cekkan. Untuk saat ini tercatat sebagai satu unit ponsel."],
            tip: "Jangan berikan data pribadi sebelum tahu penyelenggara dan program yang dimaksud." },
          { text: "Nama saya [nama lengkap]. Cara ambil hadiahnya gimana?", good: false, next: "hadiah-data",
            reply: ["Makasih, Kak. Saya cocokkan dulu dengan daftar pemenang."],
            tip: "Hindari mengonfirmasi data pribadi ke pengirim yang belum terverifikasi." }
        ]
      },
      {
        id: "hadiah-cek",
        hr: [
          "Kalau nama programnya sudah cocok, tahap berikutnya konfirmasi alamat dan pengiriman. Biaya kirimnya Rp85 ribu.",
          "Setelah pembayaran tercatat, nomor resi akan dikirim."
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
          "Hadiah yang tercatat berupa satu unit ponsel. Pengiriman perlu biaya Rp85 ribu.",
          "Untuk cek jangkauan kurir, boleh kirim kecamatan atau kode pos dulu?"
        ],
        choices: [
          { text: "Saya belum kasih alamat atau bayar sebelum tahu siapa penyelenggaranya.", good: true,
            reply: ["Iya, Kak. Alamatnya nanti saja kalau sudah siap dikirim."],
            tip: "Alamat rumah juga data pribadi. Pastikan program dan penyelenggaranya lebih dulu." },
          { text: "Alamat saya ..., kirim saja kalau sudah siap.", good: false,
            reply: ["Baik, alamatnya saya catat untuk estimasi pengiriman."],
            tip: "Jangan mengirim alamat ke orang yang belum diverifikasi." },
          { text: "Saya bayar ongkirnya kalau paketnya sudah siap.", good: false,
            reply: ["Boleh, Kak. Saya kirim nomor rekening untuk tanda jadinya dulu."],
            tip: "Jangan kirim uang muka sebelum memastikan undian dan identitas pengirim." }
        ]
      },
      {
        id: "hadiah-data",
        hr: [
          "Untuk validasi klaim, formulir meminta foto KTP dan kode verifikasi yang masuk ke HP.",
          "Pencatatan penerima ditutup sore ini."
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
      },
      {
        id: "hadiah-tindak-lanjut",
        hr: [
          "Saya cek lagi, status hadiah masih tercatat untuk nomor Kakak.",
          "Kalau mau lanjut, data penerima dan biaya kirim perlu diselesaikan sebelum pengiriman dijadwalkan."
        ],
        choices: [
          { text: "Saya tidak kirim data atau uang sebelum mengonfirmasi program ke penyelenggara.", good: true,
            reply: ["Baik, Kak. Silakan konfirmasi dulu melalui kanal resmi penyelenggara."],
            tip: "Verifikasi program, pemenang, dan biaya melalui kontak resmi yang kamu cari sendiri." },
          { text: "Saya kirim alamat dulu supaya paketnya bisa disiapkan.", good: false,
            reply: ["Baik, alamatnya saya catat untuk pengiriman."],
            tip: "Jangan membagikan alamat kepada pengirim yang belum terverifikasi." },
          { text: "Kirim nomor rekeningnya, nanti saya selesaikan biaya kirim.", good: false,
            reply: ["Saya kirim detail pembayarannya. Simpan bukti transfer untuk klaim."],
            tip: "Jangan membayar biaya klaim sebelum memastikan undian dan penyelenggaranya benar." }
        ]
      },
      {
        id: "hadiah-penutup",
        hr: [
          "Untuk melanjutkan klaim, jangan kirim OTP atau PIN. Pastikan nama program dan pengumumannya benar-benar ada.",
          "Kalau tidak bisa diverifikasi, hentikan komunikasi dan laporkan pesannya."
        ],
        choices: [
          { text: "Saya hentikan chat dan cek pengumuman dari penyelenggara secara mandiri.", good: true,
            reply: ["Baik, Kak. Jangan gunakan tautan atau nomor yang dikirim dari pesan ini."],
            tip: "Tepat. Periksa sumber resmi dan jangan bagikan data atau uang untuk klaim yang belum terbukti." },
          { text: "Saya kirim KTP saja, tanpa kode.", good: false,
            reply: ["Jangan kirim dokumen dulu sebelum memastikan penyelenggaranya."],
            tip: "KTP tetap merupakan data sensitif. Jangan mengirimkannya ke pengirim yang belum terverifikasi." },
          { text: "Saya transfer ongkirnya sekarang biar cepat.", good: false,
            reply: ["Jangan transfer sebelum program dan penerima pembayaran dipastikan lewat kanal resmi."],
            tip: "Jangan biarkan janji hadiah mendorongmu membayar biaya yang belum terverifikasi." }
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
    minAnswers: 4,
    followUp: ["form-tindak-lanjut", "form-penutup"],
    steps: [
      {
        id: "form-awal",
        hr: [
          "Pagi, Kak. Ada pendataan penerima bantuan sembako untuk warga di wilayah sini.",
          "Kalau mau mengajukan, formulirnya bisa diisi hari ini: https://data-bantuan.example"
        ],
        choices: [
          { text: "Program ini dari instansi mana? Saya konfirmasi dulu ke pengurus wilayah.", good: true, next: "form-sumber",
            reply: ["Silakan, Kak. Nama program dan kontak pengelola seharusnya bisa dicocokkan sebelum mengisi."],
            tip: "Pastikan penyelenggara dan cari informasi program melalui kontak resmi sebelum membuka formulir." },
          { text: "Saya buka dulu link-nya, lihat isinya.", good: false, next: "form-buka",
            reply: ["Oke. Kalau sudah kebuka, isi semua yang wajib ya."],
            tip: "Tautan dari pesan belum tentu resmi. Jangan masukkan data sebelum memeriksa siapa pengelolanya." },
          { text: "Saya teruskan ke keluarga dulu, mungkin mereka juga perlu.", good: false, next: "form-teruskan",
            reply: ["Boleh, tapi sebaiknya pastikan dulu informasinya sebelum dibagikan."],
            tip: "Jangan teruskan tautan yang belum diverifikasi; orang lain juga bisa terdorong menyerahkan data." }
        ]
      },
      {
        id: "form-sumber",
        hr: [
          "Programnya pendataan bantuan warga. Nama pengelola dan syaratnya ada di halaman informasi formulir.",
          "Untuk pencocokan penerima, formulir meminta NIK dan foto KTP."
        ],
        choices: [
          { text: "Saya tahan dulu. Saya cari tahu nama instansi dan tujuan penggunaan datanya.", good: true,
            reply: ["Boleh, Kak. Cek dulu apakah nama program dan pengelolanya cocok dengan informasi dari kantor wilayah."],
            tip: "Pastikan pengelola dan tujuan pengumpulan data sebelum memberikan NIK atau foto KTP." },
          { text: "Kalau cuma NIK dan KTP, saya isi saja.", good: false,
            reply: ["Oke, Kak. Kalau ada kendala isi, kirim fotonya ke saya."],
            tip: "NIK dan foto KTP adalah data sensitif. Jangan serahkan sebelum pengelola formulir terverifikasi." },
          { text: "Boleh saya kirim foto KTP lewat chat saja?", good: false,
            reply: ["Sebaiknya masukkan hanya melalui formulir setelah memastikan pengelolanya, jangan kirim di chat ini."],
            tip: "Jangan mengirim foto identitas ke perantara yang tidak jelas." }
        ]
      },
      {
        id: "form-buka",
        hr: [
          "Di formulir ada kolom NIK, nama ibu kandung, nomor kartu ATM, dan PIN.",
          "Kolomnya ditandai wajib diisi sebelum pengajuan dikirim."
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
          "Tautannya juga dibagikan di grup warga pagi tadi. Saya kira keluarga boleh ikut mengajukan.",
          "Di formulir tertulis pendaftaran dibuka sampai sore ini."
        ],
        choices: [
          { text: "Saya urungkan dulu. Kita cek ke pengurus atau instansi setempat.", good: true,
            reply: ["Iya, lebih baik dipastikan dulu ya, Kak."],
            tip: "Hentikan penyebaran sampai program dan formulirnya dikonfirmasi oleh pihak yang berwenang." },
          { text: "Saya kirim ke keluarga, tapi bilang jangan isi data sensitif.", good: false,
            reply: ["Kalau mau dibagikan, sertakan juga pesan supaya mereka mengecek sumbernya sebelum mengisi."],
            tip: "Jangan sebarkan tautan tak terverifikasi. Peringatan saja belum cukup untuk mencegah orang membuka formulir." },
          { text: "Saya isi dulu buat contoh, baru saya kabari mereka.", good: false,
            reply: ["Oke, Kak. Kalau sudah selesai kirim bukti ya."],
            tip: "Mengisi formulir untuk mencoba tetap dapat membocorkan data. Verifikasi sumbernya sebelum mengisi." }
        ]
      },
      {
        id: "form-tindak-lanjut",
        hr: [
          "Saya cek statusnya, pendaftaran masih bisa dibuka hari ini.",
          "Sebelum mengisi, pastikan nama program, pengelola, dan tujuan penggunaan datanya tercantum jelas."
        ],
        choices: [
          { text: "Saya tidak akan isi dulu. Saya konfirmasi ke instansi dari kontak resminya.", good: true,
            reply: ["Baik, Kak. Jangan kirim data lewat chat ini sebelum mendapat konfirmasi."],
            tip: "Cari sendiri kontak instansi dan pastikan formulir tersebut memang digunakan untuk program itu." },
          { text: "Saya isi data dasar dulu sambil menunggu konfirmasi.", good: false,
            reply: ["Kalau belum yakin, jangan masukkan NIK atau dokumen dulu."],
            tip: "Jangan memasukkan data pribadi ke formulir yang pengelolanya belum jelas." },
          { text: "Saya kirim NIK lewat chat supaya didaftarkan manual.", good: false,
            reply: ["Jangan kirim NIK lewat chat ini. Gunakan hanya kanal resmi setelah diverifikasi."],
            tip: "Jangan mengirim NIK atau dokumen identitas ke perantara yang belum jelas." }
        ]
      },
      {
        id: "form-penutup",
        hr: [
          "Kalau ada yang meminta PIN, OTP, atau biaya untuk bantuan, jangan dilanjutkan.",
          "Tutup formulir yang mencurigakan dan konfirmasi program ke instansi terkait."
        ],
        choices: [
          { text: "Saya tutup formulir dan melaporkan tautannya ke pengurus atau instansi.", good: true,
            reply: ["Itu langkah yang tepat. Jangan teruskan formulir sebelum sumbernya dikonfirmasi."],
            tip: "Laporkan tautan dan hindari membagikannya lagi sampai keasliannya dipastikan." },
          { text: "Saya isi tanpa PIN, tapi tetap kirim NIK dan foto KTP.", good: false,
            reply: ["Jangan kirim data dulu. Pastikan siapa yang mengelola formulir."],
            tip: "NIK dan foto KTP tetap sensitif. Verifikasi tujuan dan pengelola data terlebih dahulu." },
          { text: "Saya bayar biaya kecilnya saja supaya pengajuan masuk.", good: false,
            reply: ["Jangan bayar biaya pengajuan sebelum memastikan bantuan dan instansi penyelenggaranya."],
            tip: "Biaya untuk menerima bantuan patut dicurigai. Konfirmasi melalui kanal resmi." }
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
