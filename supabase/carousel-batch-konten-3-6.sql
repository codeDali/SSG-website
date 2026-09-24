-- Publish educational carousel content 3–6 supplied by the client.
-- Safe to rerun: posts are matched by slug and media by post/order.

begin;

insert into public.posts (
  kind, format, content_type, slug, title, excerpt, body,
  author_name, author_role, category, reading_minutes,
  status, is_featured, published_at, cover_image_path
)
select
  'publikasi', 'article', 'carousel', source.slug, source.title, source.excerpt, null,
  'Sopian Sitepu & Partners', 'Edukasi hukum', 'Edukasi Hukum', source.reading_minutes,
  'published', false, source.published_at::timestamptz, source.cover_image_path
from (values
  (
    'diberi-somasi-bukan-berarti-langsung-sidang',
    'Diberi Somasi? Bukan Berarti Langsung Sidang',
    'Penjelasan ringkas mengenai somasi, dasar hukumnya, unsur yang lazim dicantumkan, dan langkah yang dapat ditempuh sebelum sengketa berlanjut ke pengadilan.',
    3,
    '2026-09-24T12:10:00+08:00',
    'carousels/surat-somasi/1.webp'
  ),
  (
    'phk-sepihak-hak-karyawan',
    'PHK Sepihak: Karyawan Punya Hak Apa Saja?',
    'Panduan ringkas mengenai prosedur pemutusan hubungan kerja serta hak karyawan atas pesangon, penghargaan masa kerja, penggantian hak, dan jaminan kehilangan pekerjaan.',
    4,
    '2026-09-24T12:20:00+08:00',
    'carousels/hak-karyawan-phk/1.webp'
  ),
  (
    'klausul-wajib-kontrak-kerja',
    'Kontrak Kerja Wajib Memuat Klausul Ini',
    'Ketentuan pokok dalam perjanjian kerja, batas lima tahun untuk PKWT, serta larangan mencantumkan masa percobaan dalam hubungan kerja waktu tertentu.',
    4,
    '2026-09-24T12:30:00+08:00',
    'carousels/klausul-kontrak-kerja/1.webp'
  ),
  (
    'lembur-tanpa-dibayar-hak-karyawan',
    'Lembur Tanpa Dibayar, Legal Nggak Sih?',
    'Panduan praktis mengenai batas waktu lembur, persetujuan karyawan, perhitungan upah lembur, dan langkah yang tersedia apabila upah lembur tidak dibayarkan.',
    4,
    '2026-09-24T12:40:00+08:00',
    'carousels/hak-saat-lembur/1.webp'
  )
) as source (slug, title, excerpt, reading_minutes, published_at, cover_image_path)
where not exists (
  select 1 from public.posts where posts.slug = source.slug
);

with media (slug, storage_path, alt_text, sort_order) as (values
  ('diberi-somasi-bukan-berarti-langsung-sidang', 'carousels/surat-somasi/1.webp', 'Sampul: Diberi Somasi? Bukan Berarti Langsung Sidang.', 0),
  ('diberi-somasi-bukan-berarti-langsung-sidang', 'carousels/surat-somasi/2.webp', 'Pengertian somasi dan dasar hukumnya dalam Pasal 1238 Kitab Undang-Undang Hukum Perdata.', 1),
  ('diberi-somasi-bukan-berarti-langsung-sidang', 'carousels/surat-somasi/3.webp', 'Somasi sebagai langkah awal sebelum pengadilan beserta unsur yang lazim dicantumkan.', 2),
  ('diberi-somasi-bukan-berarti-langsung-sidang', 'carousels/surat-somasi/4.webp', 'Panduan memeriksa isi somasi, memastikan kebenaran tuduhan, merespons, dan mempertimbangkan penyelesaian sebelum litigasi.', 3),

  ('phk-sepihak-hak-karyawan', 'carousels/hak-karyawan-phk/1.webp', 'Sampul: PHK Sepihak, Karyawan Punya Hak Apa Saja?', 0),
  ('phk-sepihak-hak-karyawan', 'carousels/hak-karyawan-phk/2.webp', 'PHK harus didasarkan pada alasan dan proses yang sah, dengan perundingan bipartit sebelum penyelesaian melalui Pengadilan Hubungan Industrial.', 1),
  ('phk-sepihak-hak-karyawan', 'carousels/hak-karyawan-phk/3.webp', 'Hak karyawan dapat meliputi pesangon, penghargaan masa kerja, dan penggantian hak.', 2),
  ('phk-sepihak-hak-karyawan', 'carousels/hak-karyawan-phk/4.webp', 'Pesangon merupakan batas minimum dan pekerja yang memenuhi syarat dapat memperoleh Jaminan Kehilangan Pekerjaan.', 3),
  ('phk-sepihak-hak-karyawan', 'carousels/hak-karyawan-phk/5.webp', 'Dasar hukum dan penutup mengenai hak karyawan setelah pemutusan hubungan kerja.', 4),

  ('klausul-wajib-kontrak-kerja', 'carousels/klausul-kontrak-kerja/1.webp', 'Sampul: Kontrak Kerja Wajib Memuat Klausul Ini.', 0),
  ('klausul-wajib-kontrak-kerja', 'carousels/klausul-kontrak-kerja/2.webp', 'Ketentuan minimum perjanjian kerja menurut Pasal 54 Undang-Undang Nomor 13 Tahun 2003.', 1),
  ('klausul-wajib-kontrak-kerja', 'carousels/klausul-kontrak-kerja/3.webp', 'Perjanjian kerja dibuat dalam dua rangkap yang memiliki kekuatan hukum setara.', 2),
  ('klausul-wajib-kontrak-kerja', 'carousels/klausul-kontrak-kerja/4.webp', 'Jangka waktu dan perpanjangan PKWT secara keseluruhan tidak boleh melebihi lima tahun.', 3),
  ('klausul-wajib-kontrak-kerja', 'carousels/klausul-kontrak-kerja/5.webp', 'Masa percobaan dilarang dalam PKWT dan batal demi hukum apabila tetap dicantumkan.', 4),
  ('klausul-wajib-kontrak-kerja', 'carousels/klausul-kontrak-kerja/6.webp', 'Pengingat untuk membaca kontrak kerja secara cermat sebelum menandatanganinya.', 5),

  ('lembur-tanpa-dibayar-hak-karyawan', 'carousels/hak-saat-lembur/1.webp', 'Sampul: Lembur Tanpa Dibayar, Legal Nggak Sih?', 0),
  ('lembur-tanpa-dibayar-hak-karyawan', 'carousels/hak-saat-lembur/2.webp', 'Pembuka mengenai ketentuan hukum atas lembur yang tidak dibayarkan.', 1),
  ('lembur-tanpa-dibayar-hak-karyawan', 'carousels/hak-saat-lembur/3.webp', 'Pengertian dan batas waktu lembur menurut Peraturan Pemerintah Nomor 35 Tahun 2021.', 2),
  ('lembur-tanpa-dibayar-hak-karyawan', 'carousels/hak-saat-lembur/4.webp', 'Lembur memerlukan perintah tertulis dan persetujuan karyawan; upah lembur yang tidak dibayar dapat menjadi pelanggaran ketenagakerjaan.', 3),
  ('lembur-tanpa-dibayar-hak-karyawan', 'carousels/hak-saat-lembur/5.webp', 'Perhitungan upah lembur untuk hari kerja biasa dan hari istirahat mingguan atau hari libur resmi.', 4),
  ('lembur-tanpa-dibayar-hak-karyawan', 'carousels/hak-saat-lembur/6.webp', 'Pengingat bahwa upah lembur merupakan hak karyawan, bukan bonus kebijakan perusahaan.', 5)
)
insert into public.post_media (post_id, storage_path, alt_text, sort_order)
select posts.id, media.storage_path, media.alt_text, media.sort_order
from media
join public.posts on posts.slug = media.slug
on conflict (post_id, sort_order) do update
set storage_path = excluded.storage_path,
    alt_text = excluded.alt_text;

commit;
