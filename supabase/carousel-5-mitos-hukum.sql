-- Publish the first educational carousel exported from the client's Canva file.
-- The statement is idempotent: rerunning it updates the seven media rows.

with inserted_post as (
  insert into public.posts (
    kind,
    format,
    content_type,
    slug,
    title,
    excerpt,
    body,
    author_name,
    author_role,
    category,
    reading_minutes,
    status,
    is_featured,
    published_at,
    cover_image_path
  )
  select
    'publikasi',
    'article',
    'carousel',
    '5-mitos-hukum-yang-sering-dipercaya-orang',
    '5 Mitos Hukum yang Sering Dipercaya Orang',
    'Lima anggapan hukum yang kerap dipercaya masyarakat, mulai dari status tersangka, penangkapan tanpa surat, meterai, perceraian, hingga perjanjian utang-piutang.',
    null,
    'Sopian Sitepu & Partners',
    'Edukasi hukum',
    'Edukasi Hukum',
    4,
    'published',
    false,
    '2026-09-24T12:00:00+08:00',
    'carousels/5-mitos-hukum/1.webp'
  where not exists (
    select 1 from public.posts
    where slug = '5-mitos-hukum-yang-sering-dipercaya-orang'
  )
  returning id
), target_post as (
  select id from inserted_post
  union all
  select id from public.posts
  where slug = '5-mitos-hukum-yang-sering-dipercaya-orang'
  limit 1
), media (storage_path, alt_text, sort_order) as (
  values
    ('carousels/5-mitos-hukum/1.webp', 'Sampul: 5 Mitos Hukum yang Sering Dipercaya Orang.', 0),
    ('carousels/5-mitos-hukum/2.webp', 'Mitos pertama: seorang tersangka belum tentu bersalah sebelum ada putusan pengadilan berkekuatan hukum tetap.', 1),
    ('carousels/5-mitos-hukum/3.webp', 'Mitos kedua: penangkapan tanpa surat dapat dilakukan dalam keadaan tertangkap tangan.', 2),
    ('carousels/5-mitos-hukum/4.webp', 'Mitos ketiga: meterai bukan syarat sah suatu perjanjian.', 3),
    ('carousels/5-mitos-hukum/5.webp', 'Mitos keempat: berpisah rumah tidak secara otomatis mengakhiri perkawinan.', 4),
    ('carousels/5-mitos-hukum/6.webp', 'Mitos kelima: perjanjian utang-piutang tanpa notaris tetap dapat menjadi alat bukti.', 5),
    ('carousels/5-mitos-hukum/7.webp', 'Penutup dan pernyataan bahwa konten bersifat edukatif, bukan pengganti nasihat hukum formal.', 6)
)
insert into public.post_media (post_id, storage_path, alt_text, sort_order)
select target_post.id, media.storage_path, media.alt_text, media.sort_order
from target_post
cross join media
on conflict (post_id, sort_order) do update
set storage_path = excluded.storage_path,
    alt_text = excluded.alt_text;
