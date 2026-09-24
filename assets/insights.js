import { supabase } from "./supabase-client.js";

const area = document.querySelector("[data-content-area]");
const count = document.querySelector("[data-results-count]");
const pagination = document.querySelector("[data-pagination]");
const searchForm = document.querySelector("[data-search-form]");
const searchInput = document.querySelector("[data-search-input]");
const pageSize = 6;
let posts = [];
let activeFilter = "all";
let query = "";
let page = 1;
let language = localStorage.getItem("ssg-language") === "en" ? "en" : "id";

const ui = {
  id: {
    read: "Baca",
    viewSource: "Lihat sumber",
    minutes: "menit baca",
    featured: "Analisis pilihan utama",
    previous: "Halaman sebelumnya",
    next: "Halaman selanjutnya",
    noMatch: "Belum ada publikasi yang cocok.",
    tryAgain: "Coba kata kunci atau filter lain.",
    showing: (from, to, total) => `Menampilkan ${from}–${to} dari ${total} publikasi`,
    loadError: "Publikasi belum dapat dimuat. Silakan muat ulang halaman."
  },
  en: {
    read: "Read",
    viewSource: "View source",
    minutes: "min read",
    featured: "Featured analysis",
    previous: "Previous page",
    next: "Next page",
    noMatch: "No matching publications were found.",
    tryAgain: "Try a different keyword or filter.",
    showing: (from, to, total) => `Showing ${from}–${to} of ${total} publications`,
    loadError: "Publications could not be loaded. Please refresh the page."
  }
};

const englishPostCopy = {
  "5-mitos-hukum-yang-sering-dipercaya-orang": {
    title: "5 Common Legal Myths",
    excerpt: "Five common legal misconceptions concerning suspect status, arrests without a warrant, stamp duty, divorce, and loan agreements."
  },
  "diberi-somasi-bukan-berarti-langsung-sidang": {
    title: "Received a Demand Letter? It Does Not Mean Immediate Litigation",
    excerpt: "An overview of demand letters, their legal basis, essential contents, and the steps that may be taken before a dispute proceeds to court."
  },
  "phk-sepihak-hak-karyawan": {
    title: "Unilateral Termination: What Rights Do Employees Have?",
    excerpt: "A concise guide to the procedure for employment termination and employees' rights to severance pay, service pay, compensation, and unemployment benefits."
  },
  "klausul-wajib-kontrak-kerja": {
    title: "Mandatory Clauses in an Employment Agreement",
    excerpt: "The essential provisions of an employment agreement, the five-year limit for fixed-term agreements, and the prohibition of probation clauses in fixed-term employment."
  },
  "lembur-tanpa-dibayar-hak-karyawan": {
    title: "Unpaid Overtime: Is It Lawful?",
    excerpt: "A practical overview of overtime limits, employee consent, overtime-pay calculations, and the remedies available when overtime remains unpaid."
  }
};

function localizedPost(post) {
  const translation = language === "en" ? englishPostCopy[post.slug] : null;
  return translation ? { ...post, ...translation, author_role: "Legal education", category: "Legal Education" } : post;
}

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

function initials(name = "SSG") {
  return name.split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase();
}

async function signedUrl(path) {
  if (!path) return "";
  const { data } = await supabase.storage.from("content-assets").createSignedUrl(path, 3600);
  return data?.signedUrl || "";
}

async function decoratePost(post) {
  const [coverUrl, avatarUrl] = await Promise.all([
    signedUrl(post.cover_image_path),
    signedUrl(post.author_avatar_path)
  ]);
  return { ...localizedPost(post), coverUrl, avatarUrl };
}

function postUrl(post) {
  if (post.content_type === "external" && post.external_url) return post.external_url;
  return `article.html?slug=${encodeURIComponent(post.slug)}`;
}

function linkAttributes(post) {
  return post.content_type === "external" ? ' target="_blank" rel="noopener noreferrer"' : "";
}

function contentDate(post) {
  return post.source_date || post.published_at || post.scheduled_at || post.created_at;
}

function contentMetaLabel(post, copy) {
  if (post.content_type === "external") return escapeHtml(post.rank_label || post.source_name || copy.viewSource);
  return `${post.reading_minutes} ${copy.minutes}`;
}

function imageMarkup(post, className = "") {
  const label = escapeHtml(post.title);
  return `<div class="${className}">${post.coverUrl ? `<img src="${post.coverUrl}" alt="${label}" loading="lazy">` : ""}<div class="image-fallback"${post.coverUrl ? " hidden" : ""}>SSG &amp; Partners</div></div>`;
}

function authorMarkup(post) {
  return `<div class="author">${post.avatarUrl ? `<img src="${post.avatarUrl}" alt="${escapeHtml(post.author_name)}">` : `<span class="author-fallback" aria-hidden="true">${initials(post.author_name)}</span>`}<p><strong>${escapeHtml(post.author_name)}</strong>${escapeHtml(post.author_role)}</p></div>`;
}

function card(post) {
  const copy = ui[language];
  const action = post.content_type === "external" ? copy.viewSource : copy.read;
  const arrow = post.content_type === "external" ? "↗" : "→";
  return `<article class="content-card"><a class="content-card-link" href="${escapeHtml(postUrl(post))}"${linkAttributes(post)} aria-label="${action} ${escapeHtml(post.title)}">${imageMarkup(post, "card-image")}<div class="card-copy"><div class="card-topline"><span>${dateLabel(contentDate(post))}</span><span>${contentMetaLabel(post, copy)}</span></div><h2>${escapeHtml(post.title)}</h2><p class="content-excerpt">${escapeHtml(post.excerpt)}</p><div class="content-meta">${authorMarkup(post)}<span class="round-link" aria-hidden="true">${arrow}</span></div></div></a></article>`;
}

function featured(post) {
  const copy = ui[language];
  const action = post.content_type === "external" ? copy.viewSource : copy.read;
  const arrow = post.content_type === "external" ? "↗" : "→";
  return `<article><a class="featured-card featured-card-link" href="${escapeHtml(postUrl(post))}"${linkAttributes(post)} aria-label="${action} ${escapeHtml(post.title)}"><div class="featured-image"><span class="content-tag">${copy.featured}</span>${post.coverUrl ? `<img src="${post.coverUrl}" alt="${escapeHtml(post.title)}">` : ""}<div class="image-fallback"${post.coverUrl ? " hidden" : ""}>SSG &amp; Partners</div></div><div class="featured-copy"><div><p class="content-date">${dateLabel(contentDate(post))}</p><h2>${escapeHtml(post.title)}</h2><p class="content-excerpt">${escapeHtml(post.excerpt)}</p></div><div class="content-meta">${authorMarkup(post)}<span class="round-link" aria-hidden="true">${arrow}</span></div></div></a></article>`;
}

function filteredPosts() {
  const needle = query.toLowerCase();
  return posts.filter(post => (
    post.content_type !== "external"
    && (activeFilter === "all" || post.kind === activeFilter || post.content_type === activeFilter)
    && (!needle || [post, localizedPost(post)].flatMap(item => [item.title, item.excerpt, item.category, item.author_name, item.source_name, item.rank_label])
      .some(value => value?.toLowerCase().includes(needle)))
  ));
}

function renderPagination(totalPages) {
  if (totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  const copy = ui[language];
  const buttons = Array.from({ length: totalPages }, (_, index) => `<button type="button" data-page="${index + 1}"${page === index + 1 ? ' aria-current="page"' : ""}>${index + 1}</button>`);
  pagination.innerHTML = `<button type="button" data-page="${page - 1}"${page === 1 ? " disabled" : ""} aria-label="${copy.previous}">‹</button>${buttons}<button type="button" data-page="${page + 1}"${page === totalPages ? " disabled" : ""} aria-label="${copy.next}">›</button>`;
}

async function render() {
  const copy = ui[language];
  const matched = filteredPosts();

  if (!matched.length) {
    area.innerHTML = `<section class="empty-state"><h2>${copy.noMatch}</h2><p>${copy.tryAgain}</p></section>`;
    count.textContent = "";
    pagination.innerHTML = "";
    return;
  }

  const main = matched.find(post => post.is_featured) || matched[0];
  const remaining = matched.filter(post => post.id !== main.id);
  const totalPages = Math.max(1, 1 + Math.ceil(Math.max(0, remaining.length - (pageSize - 1)) / pageSize));
  if (page > totalPages) page = 1;
  const start = page === 1 ? 0 : (pageSize - 1) + ((page - 2) * pageSize);
  const visible = remaining.slice(start, start + (page === 1 ? pageSize - 1 : pageSize));
  const decorated = await Promise.all((page === 1 ? [main, ...visible] : visible).map(decoratePost));
  const featuredPost = page === 1 ? decorated[0] : null;
  const visiblePosts = page === 1 ? decorated.slice(1) : decorated;
  area.innerHTML = `${featuredPost ? featured(featuredPost) : ""}<div class="card-grid">${visiblePosts.map(card).join("")}</div>`;
  const from = page === 1 ? 1 : start + 2;
  const renderedCount = page === 1 ? 1 + visible.length : visible.length;
  const to = Math.min(matched.length, from + renderedCount - 1);
  count.textContent = copy.showing(from, to, matched.length);
  renderPagination(totalPages);
}

async function load() {
  try {
    let { data, error } = await supabase
      .from("posts")
      .select("id,slug,kind,format,content_type,title,excerpt,cover_image_path,author_name,author_role,author_avatar_path,category,reading_minutes,status,is_featured,published_at,scheduled_at,created_at,external_url,source_name,source_date,award_year,rank_label")
      .order("published_at", { ascending: false, nullsFirst: false });
    if (error && /content_type|external_url|source_name|source_date|award_year|rank_label|schema cache/i.test(error.message || "")) {
      ({ data, error } = await supabase
        .from("posts")
        .select("id,slug,kind,format,title,excerpt,cover_image_path,author_name,author_role,author_avatar_path,category,reading_minutes,status,is_featured,published_at,scheduled_at,created_at")
        .order("published_at", { ascending: false, nullsFirst: false }));
      data = data?.map(post => ({ ...post, content_type: post.format === "pdf" ? "pdf" : "article" }));
    }
    if (error) throw error;
    posts = data;
    await render();
  } catch (error) {
    area.innerHTML = `<section class="load-error">${ui[language].loadError} (${escapeHtml(error.message)})</section>`;
  }
}

document.querySelectorAll("[data-filter]").forEach(button => button.addEventListener("click", () => {
  activeFilter = button.dataset.filter;
  page = 1;
  document.querySelectorAll("[data-filter]").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
  render();
}));

searchForm.addEventListener("submit", event => {
  event.preventDefault();
  query = searchInput.value.trim();
  page = 1;
  render();
});

pagination.addEventListener("click", event => {
  const button = event.target.closest("[data-page]");
  if (!button || button.disabled) return;
  page = Number(button.dataset.page);
  render();
  document.querySelector(".insights-content")?.scrollIntoView({ behavior: "smooth", block: "start" });
});

window.addEventListener("ssg:languagechange", event => {
  language = event.detail.language === "en" ? "en" : "id";
  render();
});

load();
