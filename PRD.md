# PRD — Website SSG & Partners

Status: Draft v0.1  
Bahasa: Indonesia dan Inggris  
Tujuan: Menjadi acuan sederhana untuk desain dan pembangunan website.

## 1. Tujuan Produk

Membangun website resmi SSG & Partners yang profesional, responsif, mudah dibaca, dan mudah dikelola oleh admin tanpa mengubah kode.

## 2. Pengguna

- Pengunjung yang ingin mengenal firma, keahlian, tim, dan publikasi SSG & Partners.
- Admin internal yang mengelola konten Wawasan dan Publikasi.

## 3. Halaman Publik

1. Home
2. Tentang Kami
3. Keahlian Kami
4. Tim Kami
5. Wawasan dan Publikasi
6. Detail Wawasan atau Publikasi
7. Kontak — masih dalam pertimbangan dan belum menjadi scope final.

Semua halaman mengikuti desain desktop dari Figma. Tampilan mobile akan dibuat saat implementasi dengan versi sederhana, konsisten, dan responsif.

## 4. Wawasan dan Publikasi

### Halaman daftar

- Menampilkan konten yang sudah dipublikasikan.
- Setiap kartu minimal menampilkan gambar, judul, tipe konten, dan tanggal publikasi.
- Pengunjung dapat membuka halaman detail.
- Desain mengikuti frame Figma yang sudah tersedia.

### Halaman detail

- Layout membaca sederhana seperti Medium.
- Memprioritaskan keterbacaan di desktop dan mobile.
- Menampilkan judul, gambar utama, tanggal publikasi, isi artikel, dan/atau tombol untuk membuka PDF.
- Konten yang belum dipublikasikan tidak dapat diakses publik.

## 5. Admin

Admin tersedia dalam website yang sama melalui route `/admin` dan wajib login.

### Fitur versi pertama

- Login dan logout admin.
- Melihat daftar konten.
- Membuat, mengubah, dan menghapus konten.
- Menulis konten teks.
- Mengunggah PDF.
- Mengunggah gambar utama.
- Menyimpan konten sebagai draft.
- Mempublikasikan konten langsung.
- Menjadwalkan waktu publikasi.
- Mengarsipkan konten.

Desain admin akan dibuat sederhana dan mengutamakan fungsi. Fitur tambahan di luar daftar ini wajib dikonfirmasi sebelum dikerjakan.

## 6. Data Konten

Setiap konten minimal memiliki:

- Judul
- Slug unik
- Tipe: wawasan atau publikasi
- Ringkasan
- Isi teks, file PDF, atau keduanya
- Gambar utama
- Status: draft, scheduled, published, atau archived
- Waktu publikasi
- Penulis, jika diperlukan
- Tanggal dibuat dan terakhir diperbarui

## 7. Backend

Website menggunakan satu project Supabase untuk:

- Database konten
- Autentikasi admin
- Penyimpanan gambar dan PDF

Website publik hanya dapat membaca konten berstatus `published` yang waktu publikasinya sudah tiba. Admin yang terautentikasi dapat mengelola konten sesuai hak akses.

RLS wajib digunakan. Secret atau service-role key tidak boleh berada di browser.

## 8. Desain dan Aset

- Figma menjadi referensi utama tampilan desktop.
- Versi mobile dibuat saat implementasi berdasarkan desain desktop.
- State dasar komponen dibuat saat implementasi: default, hover, focus, active, disabled, loading, empty, success, dan error sesuai kebutuhan.
- Foto yang belum tersedia menggunakan placeholder.
- Lokasi pemanggilan file foto harus diberi komentar kode yang jelas agar mudah diganti.
- Aset final dari pengguna akan menggantikan placeholder tanpa mengubah layout utama.

## 9. Kebutuhan Umum

- Responsif untuk desktop, tablet, dan mobile.
- Navigasi dapat digunakan dengan keyboard.
- Kontras dan focus state harus jelas.
- Gambar memiliki alternative text.
- Halaman publik memiliki metadata SEO dasar.
- Loading, empty, dan error state tersedia untuk data dari Supabase.
- Bahasa Indonesia dan Inggris mengikuti kebutuhan desain saat implementasi.

## 10. Di Luar Scope Versi Pertama

- Multi-role admin yang kompleks.
- Sistem komentar publik.
- Newsletter.
- Analytics dashboard khusus.
- Approval workflow bertingkat.
- Fitur baru lain yang belum dikonfirmasi.

## 11. Kriteria Selesai

- Semua halaman final dapat digunakan pada desktop dan mobile.
- Tampilan desktop mengikuti Figma secara dekat.
- Admin dapat menjalankan seluruh alur CRUD tanpa mengubah kode.
- Konten draft dan scheduled yang belum waktunya tidak terlihat oleh publik.
- Konten published tampil di daftar dan halaman detail.
- Upload gambar dan PDF berhasil.
- Placeholder dan lokasi penggantian aset terdokumentasi jelas di kode.
- Hak akses Supabase telah diuji sebagai pengunjung dan admin.
- Tidak ada secret key di frontend.

## 12. Keputusan yang Masih Terbuka

- Apakah halaman Kontak akan menjadi halaman tersendiri atau cukup section/form di halaman lain.
- Apakah semua konten wajib tersedia dalam dua bahasa.
- Apakah nama penulis ditampilkan kepada publik.
- Apakah penghapusan konten bersifat permanen atau hanya dipindahkan ke arsip.
- Zona waktu penjadwalan publikasi; rekomendasi awal: Asia/Jakarta.

