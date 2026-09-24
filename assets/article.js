import { supabase } from "./supabase-client.js";

const article = document.querySelector("[data-article]");
const slug = new URLSearchParams(location.search).get("slug");
let language = localStorage.getItem("ssg-language") === "en" ? "en" : "id";
let loadedArticle = null;

const ui = {
  id: {
    back: "Kembali ke Wawasan & Publikasi",
    pdfType: "Publikasi PDF",
    carouselType: "Panduan edukasi",
    insightType: "Wawasan hukum",
    minutes: "menit baca",
    pdfAvailable: "Publikasi tersedia sebagai PDF",
    pdfDescription: "Unduh dokumen untuk membaca selengkapnya.",
    download: "Unduh PDF",
    notFound: "Publikasi tidak ditemukan.",
    unavailable: "Publikasi tidak dapat dibuka.",
    unavailableRecord: "Publikasi tidak tersedia atau belum tayang.",
    backToList: "Kembali ke daftar publikasi",
    carouselLabel: "Carousel edukasi",
    previousSlide: "Slide sebelumnya",
    nextSlide: "Slide selanjutnya",
    slide: "Slide"
  },
  en: {
    back: "Back to Insights & Publications",
    pdfType: "PDF publication",
    carouselType: "Educational guide",
    insightType: "Legal insight",
    minutes: "min read",
    pdfAvailable: "This publication is available as a PDF",
    pdfDescription: "Download the document to read the full publication.",
    download: "Download PDF",
    notFound: "Publication not found.",
    unavailable: "The publication could not be opened.",
    unavailableRecord: "This publication is unavailable or has not yet been published.",
    backToList: "Back to publications",
    carouselLabel: "Educational carousel",
    previousSlide: "Previous slide",
    nextSlide: "Next slide",
    slide: "Slide"
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

function carouselMarkup(post, media, copy) {
  if (!media.length) return "";
  const englishSlideAlts = {
    "5-mitos-hukum-yang-sering-dipercaya-orang": [
      "Cover: 5 Common Legal Myths.",
      "Myth one: a suspect is not necessarily guilty before a final and binding court judgment.",
      "Myth two: an arrest without a warrant may be made when a person is caught in the act.",
      "Myth three: stamp duty is not a requirement for a valid agreement.",
      "Myth four: living separately does not automatically terminate a marriage.",
      "Myth five: a loan agreement executed without a notary may still constitute evidence.",
      "Closing statement explaining that the content is educational and does not replace formal legal advice."
    ],
    "diberi-somasi-bukan-berarti-langsung-sidang": [
      "Cover: receiving a demand letter does not mean an immediate court hearing.",
      "Definition of a demand letter and its basis under Article 1238 of the Indonesian Civil Code.",
      "A demand letter as an initial step before litigation, including the information it generally contains.",
      "Closing guidance to review the letter, verify the claim, respond directly, and consider settlement before litigation."
    ],
    "phk-sepihak-hak-karyawan": [
      "Cover: employee rights following unilateral termination.",
      "Termination must be based on a lawful reason and process, with bipartite negotiations preceding Industrial Relations Court proceedings.",
      "Employee entitlements may include severance pay, service pay, and compensation for rights.",
      "Severance standards are minimum entitlements and eligible employees may also receive unemployment benefits.",
      "Legal references and closing guidance concerning employee rights following termination."
    ],
    "klausul-wajib-kontrak-kerja": [
      "Cover: mandatory clauses in an employment agreement.",
      "Minimum employment-agreement provisions under Article 54 of Law Number 13 of 2003.",
      "An employment agreement must be executed in two counterparts of equal legal force.",
      "The total term and extensions of a fixed-term employment agreement may not exceed five years.",
      "A probation clause is prohibited in a fixed-term employment agreement and is void by operation of law.",
      "Closing reminder to read an employment agreement carefully before signing it."
    ],
    "lembur-tanpa-dibayar-hak-karyawan": [
      "Cover: employee rights when overtime is unpaid.",
      "Introduction to the legal rules governing unpaid overtime.",
      "Definition and limits of overtime work under Government Regulation Number 35 of 2021.",
      "Overtime requires written instruction and employee consent; unpaid overtime may constitute an employment violation.",
      "Overtime-pay calculations for ordinary workdays and weekly or public holidays.",
      "Closing reminder that overtime pay is a statutory right, not a discretionary bonus."
    ]
  }[post.slug] || [];
  const slides = media.map((item, index) => `
    <figure class="article-slide" data-carousel-slide${index ? " hidden" : ""} aria-hidden="${index ? "true" : "false"}">
      <img src="${item.url}" alt="${escapeHtml((language === "en" && englishSlideAlts[index]) || item.alt_text || `${post.title} — ${copy.slide} ${index + 1}`)}" loading="${index ? "lazy" : "eager"}">
      ${item.caption ? `<figcaption>${escapeHtml(item.caption)}</figcaption>` : ""}
    </figure>
  `).join("");
  const dots = media.map((_, index) => `<button type="button" data-carousel-dot="${index}" aria-label="${copy.slide} ${index + 1}"${index ? "" : ' aria-current="true"'}></button>`).join("");

  return `
    <section class="article-carousel" data-carousel aria-label="${copy.carouselLabel}" aria-roledescription="carousel" tabindex="0">
      <div class="carousel-stage">${slides}</div>
      <div class="carousel-controls">
        <button class="carousel-arrow" type="button" data-carousel-direction="-1" aria-label="${copy.previousSlide}">←</button>
        <div class="carousel-dots" aria-label="${copy.carouselLabel}">${dots}</div>
        <p class="carousel-count" aria-live="polite"><span data-carousel-index>1</span> / ${media.length}</p>
        <button class="carousel-arrow" type="button" data-carousel-direction="1" aria-label="${copy.nextSlide}">→</button>
      </div>
    </section>
  `;
}

function initCarousel() {
  const carousel = article?.querySelector("[data-carousel]");
  if (!carousel) return;
  const slides = [...carousel.querySelectorAll("[data-carousel-slide]")];
  const dots = [...carousel.querySelectorAll("[data-carousel-dot]")];
  const counter = carousel.querySelector("[data-carousel-index]");
  let active = 0;

  const show = index => {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const selected = slideIndex === active;
      slide.hidden = !selected;
      slide.setAttribute("aria-hidden", String(!selected));
    });
    dots.forEach((dot, dotIndex) => {
      if (dotIndex === active) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
    if (counter) counter.textContent = String(active + 1);
  };

  carousel.querySelectorAll("[data-carousel-direction]").forEach(button => button.addEventListener("click", () => show(active + Number(button.dataset.carouselDirection))));
  dots.forEach(dot => dot.addEventListener("click", () => show(Number(dot.dataset.carouselDot))));
  carousel.addEventListener("keydown", event => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    show(active + (event.key === "ArrowRight" ? 1 : -1));
  });
}

function renderArticle(post, coverUrl, pdfUrl, media = []) {
  const copy = ui[language];
  post = localizedPost(post);
  const publishedDate = post.published_at || post.scheduled_at || post.created_at;
  const isPdf = post.format === "pdf";
  const isCarousel = post.content_type === "carousel";
  const categoryLabel = escapeHtml(post.category);
  const title = escapeHtml(post.title);
  const excerpt = escapeHtml(post.excerpt);
  const author = escapeHtml(post.author_name);

  document.title = `${post.title} | SSG & Partners`;
  document.querySelector('meta[name="description"]')?.setAttribute("content", post.excerpt || ui[language].insightType);

  article.innerHTML = `
    <a class="article-back" href="insights.html">← ${copy.back}</a>
    <p class="article-type">${categoryLabel} · ${isPdf ? copy.pdfType : isCarousel ? copy.carouselType : copy.insightType}</p>
    <h1 class="article-title">${title}</h1>
    <p class="article-summary">${excerpt}</p>
    <p class="content-date">${dateLabel(publishedDate)} · ${post.reading_minutes} ${copy.minutes} · ${author}</p>
    ${coverUrl && !isCarousel ? `<div class="article-cover"><img src="${coverUrl}" alt="${title}"></div>` : ""}
    ${isPdf
      ? `<section class="download-card">
          <div>
            <h2>${copy.pdfAvailable}</h2>
            <p>${copy.pdfDescription}</p>
          </div>
          ${pdfUrl ? `<a class="download-button" href="${pdfUrl}" target="_blank" rel="noopener">${copy.download}</a>` : ""}
        </section>`
      : isCarousel
        ? carouselMarkup(post, media, copy)
        : `<div class="article-body">${paragraphs(post.body)}</div>`}
  `;
  initCarousel();
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

    const { data: mediaRows, error: mediaError } = post.content_type === "carousel"
      ? await supabase.from("post_media").select("storage_path,alt_text,caption,sort_order").eq("post_id", post.id).order("sort_order")
      : { data: [], error: null };
    if (mediaError) throw mediaError;

    const [coverUrl, pdfUrl, media] = await Promise.all([
      signedUrl(post.cover_image_path),
      signedUrl(post.pdf_path, true),
      Promise.all((mediaRows || []).map(async item => ({ ...item, url: await signedUrl(item.storage_path) })))
    ]);

    loadedArticle = { post, coverUrl, pdfUrl, media };
    renderArticle(post, coverUrl, pdfUrl, media);
  } catch (error) {
    renderEmptyState(copy.unavailable, escapeHtml(error.message), copy.backToList);
  }
}

window.addEventListener("ssg:languagechange", event => {
  language = event.detail.language === "en" ? "en" : "id";
  if (loadedArticle) {
    renderArticle(loadedArticle.post, loadedArticle.coverUrl, loadedArticle.pdfUrl, loadedArticle.media);
  } else {
    loadArticle();
  }
});

loadArticle();
