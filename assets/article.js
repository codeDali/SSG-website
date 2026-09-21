import { supabase } from "./supabase-client.js";

const article = document.querySelector("[data-article]");
const slug = new URLSearchParams(location.search).get("slug");

function escapeHtml(value = "") {
  const node = document.createElement("span");
  node.textContent = value;
  return node.innerHTML;
}

function dateLabel(value) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

async function signedUrl(path, download = false) {
  if (!path) return "";

  const { data } = await supabase.storage
    .from("content-assets")
    .createSignedUrl(path, 3600, download ? { download: true } : undefined);

  return data?.signedUrl || "";
}

function paragraphs(body = "") {
  return body
    .split(/\n{2,}/)
    .map((part) => `<p>${escapeHtml(part).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function renderEmptyState(title, message, linkText = "Kembali ke Wawasan & Publikasi") {
  if (!article) return;

  article.innerHTML = `
    <section class="empty-state">
      <h2>${title}</h2>
      <p>${message}</p>
      <p><a href="insights.html">${linkText}</a></p>
    </section>
  `;
}

async function loadArticle() {
  if (!article) return;

  if (!slug) {
    renderEmptyState("Publikasi tidak ditemukan.", "", "Kembali ke Wawasan & Publikasi");
    return;
  }

  try {
    const { data: post, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;
    if (!post) throw new Error("Publikasi tidak tersedia atau belum tayang.");

    const [coverUrl, pdfUrl] = await Promise.all([
      signedUrl(post.cover_image_path),
      signedUrl(post.pdf_path, true),
    ]);

    const publishedDate = post.published_at || post.scheduled_at || post.created_at;
    const isPdf = post.format === "pdf";
    const categoryLabel = escapeHtml(post.category);
    const title = escapeHtml(post.title);
    const excerpt = escapeHtml(post.excerpt);
    const author = escapeHtml(post.author_name);

    document.title = `${post.title} | SSG & Partners`;

    article.innerHTML = `
      <a class="article-back" href="insights.html">← Kembali ke Wawasan & Publikasi</a>
      <p class="article-type">${categoryLabel} · ${isPdf ? "Publikasi PDF" : "Wawasan hukum"}</p>
      <h1 class="article-title">${title}</h1>
      <p class="article-summary">${excerpt}</p>
      <p class="content-date">${dateLabel(publishedDate)} · ${post.reading_minutes} menit baca · ${author}</p>
      ${coverUrl ? `<div class="article-cover"><img src="${coverUrl}" alt="${title}"></div>` : ""}
      ${
        isPdf
          ? `<section class="download-card">
              <div>
                <h2>Publikasi tersedia sebagai PDF</h2>
                <p>Unduh dokumen untuk membaca selengkapnya.</p>
              </div>
              ${pdfUrl ? `<a class="download-button" href="${pdfUrl}" target="_blank" rel="noopener">Unduh PDF</a>` : ""}
            </section>`
          : `<div class="article-body">${paragraphs(post.body)}</div>`
      }
    `;
  } catch (error) {
    renderEmptyState(
      "Publikasi tidak dapat dibuka.",
      escapeHtml(error.message),
      "Kembali ke daftar publikasi"
    );
  }
}

loadArticle();
