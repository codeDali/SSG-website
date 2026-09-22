import { supabase } from "./supabase-client.js";

const article = document.querySelector("[data-article]");
const slug = new URLSearchParams(location.search).get("slug");
let language = localStorage.getItem("ssg-language") === "en" ? "en" : "id";
let loadedArticle = null;

const ui = {
  id: {
    back: "Kembali ke Wawasan & Publikasi",
    pdfType: "Publikasi PDF",
    insightType: "Wawasan hukum",
    minutes: "menit baca",
    pdfAvailable: "Publikasi tersedia sebagai PDF",
    pdfDescription: "Unduh dokumen untuk membaca selengkapnya.",
    download: "Unduh PDF",
    notFound: "Publikasi tidak ditemukan.",
    unavailable: "Publikasi tidak dapat dibuka.",
    unavailableRecord: "Publikasi tidak tersedia atau belum tayang.",
    backToList: "Kembali ke daftar publikasi"
  },
  en: {
    back: "Back to Insights & Publications",
    pdfType: "PDF publication",
    insightType: "Legal insight",
    minutes: "min read",
    pdfAvailable: "This publication is available as a PDF",
    pdfDescription: "Download the document to read the full publication.",
    download: "Download PDF",
    notFound: "Publication not found.",
    unavailable: "The publication could not be opened.",
    unavailableRecord: "This publication is unavailable or has not yet been published.",
    backToList: "Back to publications"
  }
};

function escapeHtml(value = "") {
  const node = document.createElement("span");
  node.textContent = value;
  return node.innerHTML;
}

function dateLabel(value) {
  return new Intl.DateTimeFormat(language === "en" ? "en-GB" : "id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric"
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
    .map(part => `<p>${escapeHtml(part).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function renderEmptyState(title, message, linkText) {
  if (!article) return;
  article.innerHTML = `
    <section class="empty-state">
      <h2>${title}</h2>
      <p>${message}</p>
      <p><a href="insights.html">${linkText}</a></p>
    </section>
  `;
}

function renderArticle(post, coverUrl, pdfUrl) {
  const copy = ui[language];
  const publishedDate = post.published_at || post.scheduled_at || post.created_at;
  const isPdf = post.format === "pdf";
  const categoryLabel = escapeHtml(post.category);
  const title = escapeHtml(post.title);
  const excerpt = escapeHtml(post.excerpt);
  const author = escapeHtml(post.author_name);

  document.title = `${post.title} | SSG & Partners`;
  document.querySelector('meta[name="description"]')?.setAttribute("content", post.excerpt || ui[language].insightType);

  article.innerHTML = `
    <a class="article-back" href="insights.html">← ${copy.back}</a>
    <p class="article-type">${categoryLabel} · ${isPdf ? copy.pdfType : copy.insightType}</p>
    <h1 class="article-title">${title}</h1>
    <p class="article-summary">${excerpt}</p>
    <p class="content-date">${dateLabel(publishedDate)} · ${post.reading_minutes} ${copy.minutes} · ${author}</p>
    ${coverUrl ? `<div class="article-cover"><img src="${coverUrl}" alt="${title}"></div>` : ""}
    ${isPdf
      ? `<section class="download-card">
          <div>
            <h2>${copy.pdfAvailable}</h2>
            <p>${copy.pdfDescription}</p>
          </div>
          ${pdfUrl ? `<a class="download-button" href="${pdfUrl}" target="_blank" rel="noopener">${copy.download}</a>` : ""}
        </section>`
      : `<div class="article-body">${paragraphs(post.body)}</div>`}
  `;
}

async function loadArticle() {
  if (!article) return;
  const copy = ui[language];

  if (!slug) {
    renderEmptyState(copy.notFound, "", copy.back);
    return;
  }

  try {
    const { data: post, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;
    if (!post) throw new Error(copy.unavailableRecord);

    const [coverUrl, pdfUrl] = await Promise.all([
      signedUrl(post.cover_image_path),
      signedUrl(post.pdf_path, true)
    ]);

    loadedArticle = { post, coverUrl, pdfUrl };
    renderArticle(post, coverUrl, pdfUrl);
  } catch (error) {
    renderEmptyState(copy.unavailable, escapeHtml(error.message), copy.backToList);
  }
}

window.addEventListener("ssg:languagechange", event => {
  language = event.detail.language === "en" ? "en" : "id";
  if (loadedArticle) {
    renderArticle(loadedArticle.post, loadedArticle.coverUrl, loadedArticle.pdfUrl);
  } else {
    loadArticle();
  }
});

loadArticle();
