-- Reproducible schema upgrade for external sources and visual carousels.
-- Applied to project cbqlbkgvxsgflyxeaijy through the Supabase SQL Editor.

alter table public.posts
  add column if not exists content_type text,
  add column if not exists external_url text,
  add column if not exists source_name text,
  add column if not exists source_date date,
  add column if not exists award_year smallint,
  add column if not exists rank_label text;

update public.posts
set content_type = case when format = 'pdf' then 'pdf' else 'article' end
where content_type is null;

alter table public.posts
  alter column content_type set default 'article',
  alter column content_type set not null;

-- Preserve the original body requirement for web articles while allowing
-- content types that render from an external URL or a slide collection.
alter table public.posts drop constraint if exists posts_article_has_body;
alter table public.posts
  add constraint posts_article_has_body
  check (content_type <> 'article' or body is not null);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'posts_content_type_check'
      and conrelid = 'public.posts'::regclass
  ) then
    alter table public.posts
      add constraint posts_content_type_check
      check (content_type in ('article', 'pdf', 'external', 'carousel'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'posts_external_url_check'
      and conrelid = 'public.posts'::regclass
  ) then
    alter table public.posts
      add constraint posts_external_url_check
      check (content_type <> 'external' or external_url ~ '^https?://');
  end if;
end $$;

create table if not exists public.post_media (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  storage_path text not null,
  alt_text text not null default '',
  caption text,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  unique (post_id, sort_order)
);

create index if not exists post_media_post_id_idx on public.post_media (post_id);

alter table public.post_media enable row level security;
revoke all on table public.post_media from anon, authenticated;
grant select on table public.post_media to anon;
grant select, insert, update, delete on table public.post_media to authenticated;

drop policy if exists "Public can read media for published posts" on public.post_media;
create policy "Public can read media for published posts"
on public.post_media for select to anon
using (
  exists (
    select 1 from public.posts
    where posts.id = post_media.post_id
      and posts.status = 'published'
      and (posts.scheduled_at is null or posts.scheduled_at <= now())
  )
);

drop policy if exists "Content admins can read post media" on public.post_media;
create policy "Content admins can read post media"
on public.post_media for select to authenticated
using (exists (select 1 from public.content_admins where content_admins.user_id = (select auth.uid())));

drop policy if exists "Content admins can insert post media" on public.post_media;
create policy "Content admins can insert post media"
on public.post_media for insert to authenticated
with check (exists (select 1 from public.content_admins where content_admins.user_id = (select auth.uid())));

drop policy if exists "Content admins can update post media" on public.post_media;
create policy "Content admins can update post media"
on public.post_media for update to authenticated
using (exists (select 1 from public.content_admins where content_admins.user_id = (select auth.uid())))
with check (exists (select 1 from public.content_admins where content_admins.user_id = (select auth.uid())));

drop policy if exists "Content admins can delete post media" on public.post_media;
create policy "Content admins can delete post media"
on public.post_media for delete to authenticated
using (exists (select 1 from public.content_admins where content_admins.user_id = (select auth.uid())));

-- Extend the existing public asset policy so carousel slides are readable only
-- when their parent post is already live. Admin-specific Storage policies remain
-- separate and continue to cover uploads, updates, and deletions.
drop policy if exists "Public can read files attached to live posts" on storage.objects;
create policy "Public can read files attached to live posts"
on storage.objects for select
to anon, authenticated
using (
  bucket_id = 'content-assets'
  and (
    exists (
      select 1 from public.posts
      where (
        posts.cover_image_path = objects.name
        or posts.pdf_path = objects.name
        or posts.author_avatar_path = objects.name
      )
      and (
        posts.status = 'published'
        or (posts.status = 'scheduled' and posts.scheduled_at <= now())
      )
    )
    or exists (
      select 1
      from public.post_media
      join public.posts on posts.id = post_media.post_id
      where post_media.storage_path = objects.name
        and (
          posts.status = 'published'
          or (posts.status = 'scheduled' and posts.scheduled_at <= now())
        )
    )
  )
);

insert into public.posts (
  kind, format, content_type, slug, title, excerpt, body,
  author_name, author_role, category, reading_minutes,
  status, is_featured, published_at,
  external_url, source_name, source_date, award_year, rank_label
)
select
  'publikasi', 'article', 'external',
  'ssp-law-firm-terus-beradaptasi-hukumonline-2025',
  'SSP Law Firm: Terus Beradaptasi dan Ikuti Perkembangan Regulasi Terkini Menjadi Kunci',
  'Hukumonline mengulas upaya Sopian Sitepu & Partners untuk terus beradaptasi terhadap perkembangan regulasi, berinovasi, dan memperkuat daya saing dalam praktik hukum nasional maupun global.',
  null, 'Tim Publikasi Hukumonline', 'Sumber eksternal', 'Liputan Media', 4,
  'published', false, '2025-08-01T00:00:00+07:00',
  'https://www.hukumonline.com/berita/a/ssp-law-firm--terus-beradaptasi-dan-ikuti-perkembangan-regulasi-terkini-menjadi-kunci-lt688c98c4ad567/',
  'Hukumonline', '2025-08-01', 2025, null
where not exists (
  select 1 from public.posts
  where external_url = 'https://www.hukumonline.com/berita/a/ssp-law-firm--terus-beradaptasi-dan-ikuti-perkembangan-regulasi-terkini-menjadi-kunci-lt688c98c4ad567/'
);

insert into public.posts (
  kind, format, content_type, slug, title, excerpt, body,
  author_name, author_role, category, reading_minutes,
  status, is_featured, published_at,
  external_url, source_name, source_date, award_year, rank_label
)
select
  'publikasi', 'article', 'external',
  'peringkat-57-top-100-indonesian-law-firms-2023',
  'Peringkat 57 Top 100 Indonesian Law Firms 2023',
  'Sopian Sitepu & Partners tercatat pada peringkat ke-57 dalam pemeringkatan Top 100 Indonesian Law Firms 2023 yang diselenggarakan oleh Hukumonline. Pengakuan ini tercatat atas nama Sopian Sitepu & Partners.',
  null, 'Hukumonline Awards', 'Penyelenggara', 'Penghargaan & Pengakuan', 1,
  'published', false, '2023-06-30T00:00:00+07:00',
  'https://awards.hukumonline.com/top-100-law-firms-2023',
  'Hukumonline Awards', null, 2023, 'Peringkat 57'
where not exists (
  select 1 from public.posts
  where external_url = 'https://awards.hukumonline.com/top-100-law-firms-2023'
);

insert into public.posts (
  kind, format, content_type, slug, title, excerpt, body,
  author_name, author_role, category, reading_minutes,
  status, is_featured, published_at,
  external_url, source_name, source_date, award_year, rank_label
)
select
  'publikasi', 'article', 'external',
  'sopian-sitepu-partners-top-100-law-firms-2025',
  'Sopian Sitepu & Partners dalam Top 100 Indonesian Law Firms 2025',
  'Hukumonline Awards mencatat Sopian Sitepu & Partners pada peringkat ke-28 Top 100 Indonesian Law Firms 2025, peringkat ke-26 Top 50 Largest Full-Service Law Firms 2025, serta peringkat ke-3 Best Regional Law Firms 2025.',
  null, 'Hukumonline Awards', 'Penyelenggara', 'Penghargaan & Pengakuan', 1,
  'published', false, '2025-06-30T00:00:00+07:00',
  'https://awards.hukumonline.com/top-100-law-firms-2025/best-regional-law-firms-2025/sopian-sitepu-and-partners',
  'Hukumonline Awards', null, 2025, 'Peringkat 28 · 26 · 3'
where not exists (
  select 1 from public.posts
  where external_url = 'https://awards.hukumonline.com/top-100-law-firms-2025/best-regional-law-firms-2025/sopian-sitepu-and-partners'
);

-- Additional Hukumonline coverage and awards supplied by the client.
-- Each insert is keyed by the exact source URL so this script can be rerun safely.
insert into public.posts (
  kind, format, content_type, slug, title, excerpt, body,
  author_name, author_role, category, reading_minutes,
  status, is_featured, published_at,
  external_url, source_name, source_date, award_year, rank_label
)
select
  'publikasi', 'article', 'external',
  'dari-lampung-ke-panggung-nasional-ssp-2026',
  'Dari Lampung ke Panggung Nasional, Sopian Sitepu & Partners Buktikan Law Firm Regional Mampu Bersaing di Level Elite',
  'Hukumonline mengulas kiprah Sopian Sitepu & Partners sebagai firma hukum regional yang mampu memperoleh pengakuan pada tingkat nasional dan bersaing dalam jajaran firma hukum terkemuka.',
  null, 'Tim Publikasi Hukumonline', 'Sumber eksternal', 'Liputan Media', 3,
  'published', false, '2026-07-14T00:00:00+07:00',
  'https://www.hukumonline.com/berita/a/dari-lampung-ke-panggung-nasional--sopian-sitepu-partners-buktikan-law-firm-regional-mampu-bersaing-di-level-elite-lt6a55fcbc15dab/',
  'Hukumonline', '2026-07-14', 2026, null
where not exists (
  select 1 from public.posts
  where external_url = 'https://www.hukumonline.com/berita/a/dari-lampung-ke-panggung-nasional--sopian-sitepu-partners-buktikan-law-firm-regional-mampu-bersaing-di-level-elite-lt6a55fcbc15dab/'
);

insert into public.posts (
  kind, format, content_type, slug, title, excerpt, body,
  author_name, author_role, category, reading_minutes,
  status, is_featured, published_at,
  external_url, source_name, source_date, award_year, rank_label
)
select
  'publikasi', 'article', 'external',
  'antusiasme-kantor-hukum-regional-top-100-2024',
  'Antusiasme Tinggi Kantor Hukum Regional Meriahkan Ajang Top 100 Law Firms 2024',
  'Liputan Hukumonline mengenai partisipasi dan kontribusi kantor-kantor hukum regional dalam ajang Top 100 Indonesian Law Firms 2024.',
  null, 'Mochamad Januar Rizki', 'Sumber eksternal', 'Liputan Media', 4,
  'published', false, '2024-07-01T00:00:00+07:00',
  'https://www.hukumonline.com/berita/a/antusiasme-tinggi-kantor-hukum-regional-meriahkan-ajang-top-100-law-firms-2024-lt6682394144850/',
  'Hukumonline', '2024-07-01', 2024, null
where not exists (
  select 1 from public.posts
  where external_url = 'https://www.hukumonline.com/berita/a/antusiasme-tinggi-kantor-hukum-regional-meriahkan-ajang-top-100-law-firms-2024-lt6682394144850/'
);

insert into public.posts (
  kind, format, content_type, slug, title, excerpt, body,
  author_name, author_role, category, reading_minutes,
  status, is_featured, published_at,
  external_url, source_name, source_date, award_year, rank_label
)
select
  'publikasi', 'article', 'external',
  'mengkaji-posisi-of-counsel-di-firma-hukum-daerah',
  'Mengkaji Posisi Of Counsel di Firma Hukum Berbagai Daerah',
  'Hukumonline mengkaji fungsi dan kedudukan Of Counsel pada firma hukum di berbagai daerah, termasuk pandangan dan praktik yang diterapkan oleh Sopian Sitepu & Partners.',
  null, 'Ferinda K. Fachri', 'Sumber eksternal', 'Liputan Media', 5,
  'published', false, '2024-01-15T00:00:00+07:00',
  'https://www.hukumonline.com/berita/a/mengkaji-posisi-of-counsel-di-firma-hukum-berbagai-daerah-lt65a5891641cbf/?page=2',
  'Hukumonline', '2024-01-15', 2024, null
where not exists (
  select 1 from public.posts
  where external_url = 'https://www.hukumonline.com/berita/a/mengkaji-posisi-of-counsel-di-firma-hukum-berbagai-daerah-lt65a5891641cbf/?page=2'
);

insert into public.posts (
  kind, format, content_type, slug, title, excerpt, body,
  author_name, author_role, category, reading_minutes,
  status, is_featured, published_at,
  external_url, source_name, source_date, award_year, rank_label
)
select
  'publikasi', 'article', 'external',
  'sopian-sitepu-partners-berjibaku-menjaga-kepercayaan',
  'Sopian Sitepu & Partners: Berjibaku Menjaga Kepercayaan',
  'Liputan Hukumonline mengenai komitmen Sopian Sitepu & Partners dalam menjaga kepercayaan klien serta menjalankan layanan hukum secara profesional.',
  null, 'Hukumonline', 'Sumber eksternal', 'Liputan Media', 3,
  'published', false, '2024-09-13T00:00:00+07:00',
  'https://www.hukumonline.com/berita/a/sopian-sitepu-partners--berjibaku-menjaga-kepercayaan-lt66e4127856998/',
  'Hukumonline', '2024-09-13', 2024, null
where not exists (
  select 1 from public.posts
  where external_url = 'https://www.hukumonline.com/berita/a/sopian-sitepu-partners--berjibaku-menjaga-kepercayaan-lt66e4127856998/'
);

insert into public.posts (
  kind, format, content_type, slug, title, excerpt, body,
  author_name, author_role, category, reading_minutes,
  status, is_featured, published_at,
  external_url, source_name, source_date, award_year, rank_label
)
select
  'publikasi', 'article', 'external',
  'sopian-sitepu-partners-semangat-kekeluargaan',
  'Sopian Sitepu & Partners: Semangat Kekeluargaan Tak Pandang Bulu',
  'Hukumonline menyoroti budaya kekeluargaan yang menjadi salah satu nilai dalam lingkungan kerja Sopian Sitepu & Partners.',
  null, 'Hukumonline', 'Sumber eksternal', 'Liputan Media', 3,
  'published', false, '2024-09-13T00:00:00+07:00',
  'https://www.hukumonline.com/berita/a/sopian-sitepu-partners--semangat-kekeluargaan-tak-pandang-bulu-lt66e41024387ac/',
  'Hukumonline', '2024-09-13', 2024, null
where not exists (
  select 1 from public.posts
  where external_url = 'https://www.hukumonline.com/berita/a/sopian-sitepu-partners--semangat-kekeluargaan-tak-pandang-bulu-lt66e41024387ac/'
);

insert into public.posts (
  kind, format, content_type, slug, title, excerpt, body,
  author_name, author_role, category, reading_minutes,
  status, is_featured, published_at,
  external_url, source_name, source_date, award_year, rank_label
)
select
  'publikasi', 'article', 'external',
  'peringkat-47-top-100-indonesian-law-firms-2026',
  'Peringkat 47 Top 100 Indonesian Law Firms 2026',
  'Sopian Sitepu & Partners tercatat pada peringkat ke-47 Top 100 Indonesian Law Firms 2026 dan kembali berada dalam jajaran lima besar firma hukum regional.',
  null, 'Hukumonline Awards', 'Penyelenggara', 'Penghargaan & Pengakuan', 1,
  'published', false, '2026-06-21T00:00:00+07:00',
  'https://awards.hukumonline.com/top-100-law-firms-2026/top-100-indonesian-law-firms-2026/sopian-sitepu-and-partners',
  'Hukumonline Awards', null, 2026, 'Peringkat 47'
where not exists (
  select 1 from public.posts
  where external_url = 'https://awards.hukumonline.com/top-100-law-firms-2026/top-100-indonesian-law-firms-2026/sopian-sitepu-and-partners'
);

insert into public.posts (
  kind, format, content_type, slug, title, excerpt, body,
  author_name, author_role, category, reading_minutes,
  status, is_featured, published_at,
  external_url, source_name, source_date, award_year, rank_label
)
select
  'publikasi', 'article', 'external',
  'peringkat-28-top-100-indonesian-law-firms-2025',
  'Peringkat 28 Top 100 Indonesian Law Firms 2025',
  'Hukumonline Awards mencatat Sopian Sitepu & Partners pada peringkat ke-28 dalam Top 100 Indonesian Law Firms 2025.',
  null, 'Hukumonline Awards', 'Penyelenggara', 'Penghargaan & Pengakuan', 1,
  'published', false, '2025-06-20T00:00:00+07:00',
  'https://awards.hukumonline.com/top-100-law-firms-2025/top-100-indonesian-law-firms-2025/sopian-sitepu-and-partners',
  'Hukumonline Awards', null, 2025, 'Peringkat 28'
where not exists (
  select 1 from public.posts
  where external_url = 'https://awards.hukumonline.com/top-100-law-firms-2025/top-100-indonesian-law-firms-2025/sopian-sitepu-and-partners'
);

insert into public.posts (
  kind, format, content_type, slug, title, excerpt, body,
  author_name, author_role, category, reading_minutes,
  status, is_featured, published_at,
  external_url, source_name, source_date, award_year, rank_label
)
select
  'publikasi', 'article', 'external',
  'largest-regional-law-firm-2024-sopian-sitepu-partners',
  'Juara Largest Regional Law Firm 2024',
  'Sopian Sitepu & Partners meraih peringkat pertama kategori Largest Regional Law Firms 2024 dengan 37 fee earners, sebagaimana diberitakan oleh Hukumonline.',
  null, 'Ferinda K. Fachri', 'Sumber eksternal', 'Penghargaan & Pengakuan', 2,
  'published', false, '2024-06-29T00:00:00+07:00',
  'https://www.hukumonline.com/berita/a/kantor-hukum-asal-lampung-ini-juara-kategori-largest-regional-law-firm-2024-lt667fc04680648/',
  'Hukumonline', '2024-06-29', 2024, 'Peringkat 1'
where not exists (
  select 1 from public.posts
  where external_url = 'https://www.hukumonline.com/berita/a/kantor-hukum-asal-lampung-ini-juara-kategori-largest-regional-law-firm-2024-lt667fc04680648/'
);

insert into public.posts (
  kind, format, content_type, slug, title, excerpt, body,
  author_name, author_role, category, reading_minutes,
  status, is_featured, published_at,
  external_url, source_name, source_date, award_year, rank_label
)
select
  'publikasi', 'article', 'external',
  'practice-leaders-2025-motivator-dan-pengakuan',
  'Practice Leaders 2025, Motivator dan Pengakuan Firma Hukum Indonesia',
  'Hukumonline menyoroti Practice Leaders 2025 sebagai bentuk pengakuan bagi firma hukum nasional dan regional. Sopian Sitepu & Partners memperoleh predikat Elite One pada empat bidang praktik.',
  null, 'Hanifah Dwi Jayanti', 'Sumber eksternal', 'Penghargaan & Pengakuan', 4,
  'published', false, '2025-06-21T00:00:00+07:00',
  'https://www.hukumonline.com/berita/a/practice-leaders-2025--motivator-dan-pengakuan-firma-hukum-indonesia-lt6856d9e3a1746/',
  'Hukumonline', '2025-06-21', 2025, 'Elite One · 4 bidang'
where not exists (
  select 1 from public.posts
  where external_url = 'https://www.hukumonline.com/berita/a/practice-leaders-2025--motivator-dan-pengakuan-firma-hukum-indonesia-lt6856d9e3a1746/'
);

insert into public.posts (
  kind, format, content_type, slug, title, excerpt, body,
  author_name, author_role, category, reading_minutes,
  status, is_featured, published_at,
  external_url, source_name, source_date, award_year, rank_label
)
select
  'publikasi', 'article', 'external',
  'peringkat-5-best-regional-law-firms-2025',
  'Peringkat 5 Best Regional Law Firms 2025',
  'Sopian Sitepu & Partners tercatat pada peringkat ke-5 dalam kategori Best Regional Law Firms 2025 yang diselenggarakan oleh Hukumonline Awards.',
  null, 'Hukumonline Awards', 'Penyelenggara', 'Penghargaan & Pengakuan', 1,
  'published', false, '2025-06-20T00:00:00+07:00',
  'https://awards.hukumonline.com/top-100-law-firms-2025/ranking?ranking=best-regional-law-firms-2025',
  'Hukumonline Awards', null, 2025, 'Peringkat 5'
where not exists (
  select 1 from public.posts
  where external_url = 'https://awards.hukumonline.com/top-100-law-firms-2025/ranking?ranking=best-regional-law-firms-2025'
);
