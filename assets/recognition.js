import { supabase } from "./supabase-client.js";

const list = document.querySelector("[data-recognition-list]");
const stats = document.querySelector("[data-recognition-stats]");
let language = localStorage.getItem("ssg-language") === "en" ? "en" : "id";
let records = [];

const copy = {
  id: { verified: "Sumber terverifikasi", years: "Tahun terdokumentasi", range: "Rentang publikasi", award: "Penghargaan", media: "Liputan media", source: "Lihat sumber asli ↗", unavailable: "Rekam jejak belum dapat dimuat. Silakan muat ulang halaman." },
  en: { verified: "Verified sources", years: "Documented years", range: "Publication range", award: "Recognition", media: "Media coverage", source: "View original source ↗", unavailable: "The track record could not be loaded. Please refresh the page." }
};

const englishRecords = {
  "Dari Lampung ke Panggung Nasional, Sopian Sitepu & Partners Buktikan Law Firm Regional Mampu Bersaing di Level Elite": {
    title: "From Lampung to the National Stage: Sopian Sitepu & Partners Demonstrates That a Regional Law Firm Can Compete at the Elite Level",
    excerpt: "Hukumonline examines Sopian Sitepu & Partners' development as a regional law firm that has earned recognition at the national level."
  },
  "Peringkat 47 Top 100 Indonesian Law Firms 2026": {
    title: "Ranked 47th in the Top 100 Indonesian Law Firms 2026",
    excerpt: "Sopian Sitepu & Partners was ranked 47th and once again placed among the five leading regional law firms in 2026.",
    rank: "Rank 47"
  },
  "SSP Law Firm: Terus Beradaptasi dan Ikuti Perkembangan Regulasi Terkini Menjadi Kunci": {
    title: "SSP Law Firm: Continuous Adaptation to Regulatory Developments Is Essential",
    excerpt: "Hukumonline discusses Sopian Sitepu & Partners' efforts to adapt to regulatory developments, pursue innovation, and strengthen its competitiveness in national and international legal practice."
  },
  "Sopian Sitepu & Partners dalam Top 100 Indonesian Law Firms 2025": {
    title: "Sopian Sitepu & Partners in the Top 100 Indonesian Law Firms 2025",
    excerpt: "Hukumonline Awards ranked Sopian Sitepu & Partners 28th in the Top 100 Indonesian Law Firms 2025, 26th in the Top 50 Largest Full-Service Law Firms 2025, and 3rd among the Best Regional Law Firms 2025.",
    rank: "Ranks 28 · 26 · 3"
  },
  "Practice Leaders 2025, Motivator dan Pengakuan Firma Hukum Indonesia": {
    title: "Practice Leaders 2025: Motivation and Recognition for Indonesian Law Firms",
    excerpt: "Sopian Sitepu & Partners received the Elite One distinction in four practice areas in Practice Leaders 2025.",
    rank: "Elite One · 4 areas"
  },
  "Peringkat 5 Best Regional Law Firms 2025": {
    title: "Ranked 5th among the Best Regional Law Firms 2025",
    excerpt: "Sopian Sitepu & Partners was ranked 5th in the Best Regional Law Firms 2025 category.",
    rank: "Rank 5"
  },
  "Peringkat 28 Top 100 Indonesian Law Firms 2025": {
    title: "Ranked 28th in the Top 100 Indonesian Law Firms 2025",
    excerpt: "Sopian Sitepu & Partners was ranked 28th in the Top 100 Indonesian Law Firms 2025.",
    rank: "Rank 28"
  },
  "Sopian Sitepu & Partners: Semangat Kekeluargaan Tak Pandang Bulu": {
    title: "Sopian Sitepu & Partners: An Inclusive Culture of Collegiality",
    excerpt: "Hukumonline highlights the culture of collegiality within Sopian Sitepu & Partners."
  },
  "Sopian Sitepu & Partners: Berjibaku Menjaga Kepercayaan": {
    title: "Sopian Sitepu & Partners: Working Diligently to Maintain Trust",
    excerpt: "Coverage of Sopian Sitepu & Partners' commitment to maintaining client trust and providing legal services professionally."
  },
  "Antusiasme Tinggi Kantor Hukum Regional Meriahkan Ajang Top 100 Law Firms 2024": {
    title: "Strong Participation by Regional Law Firms in the Top 100 Law Firms 2024",
    excerpt: "Coverage of regional law firms' participation in the Top 100 Indonesian Law Firms 2024."
  },
  "Juara Largest Regional Law Firm 2024": {
    title: "Winner of the Largest Regional Law Firm 2024 Category",
    excerpt: "Sopian Sitepu & Partners was ranked first among the Largest Regional Law Firms 2024, with 37 fee earners.",
    rank: "Rank 1"
  },
  "Mengkaji Posisi Of Counsel di Firma Hukum Berbagai Daerah": {
    title: "Examining the Role of Of Counsel at Law Firms across Indonesia",
    excerpt: "An examination of the function and position of Of Counsel at law firms in various regions, including Sopian Sitepu & Partners."
  },
  "Peringkat 57 Top 100 Indonesian Law Firms 2023": {
    title: "Ranked 57th in the Top 100 Indonesian Law Firms 2023",
    excerpt: "Sopian Sitepu & Partners was ranked 57th in Hukumonline's Top 100 Indonesian Law Firms 2023. The recognition was published under the name Sopian Sitepu & Partners.",
    rank: "Rank 57"
  }
};

function escapeHtml(value = "") {
  const node = document.createElement("span");
  node.textContent = value;
  return node.innerHTML;
}

function yearOf(record) {
  return Number(record.award_year || new Date(record.source_date || record.published_at || record.created_at).getFullYear());
}

function dateLabel(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat(language === "en" ? "en-GB" : "id-ID", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(value));
}

function isAward(record) {
  return Boolean(record.rank_label) || /penghargaan|award|recognition/i.test(record.category || "");
}

function renderStats() {
  const years = [...new Set(records.map(yearOf).filter(Boolean))].sort((a, b) => a - b);
  const labels = copy[language];
  const range = years.length ? (years.length === 1 ? String(years[0]) : `${years[0]}–${years[years.length - 1]}`) : "—";
  stats.innerHTML = `
    <div class="recognition-stat"><strong>${records.length}</strong><span>${labels.verified}</span></div>
    <div class="recognition-stat"><strong>${years.length}</strong><span>${labels.years}</span></div>
    <div class="recognition-stat"><strong>${range}</strong><span>${labels.range}</span></div>`;
}

function recordCard(record) {
  const labels = copy[language];
  const sourceDate = record.source_date || record.published_at || record.created_at;
  const translation = language === "en" ? englishRecords[record.title] : null;
  const title = translation?.title || record.title;
  const excerpt = translation?.excerpt || record.excerpt;
  const rank = translation?.rank || record.rank_label;
  return `
    <a class="recognition-card" href="${escapeHtml(record.external_url)}" target="_blank" rel="noopener noreferrer">
      <div class="recognition-card-top"><span class="recognition-badge">${isAward(record) ? labels.award : labels.media}</span><span>${dateLabel(sourceDate)}</span></div>
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(excerpt)}</p>
      <div class="recognition-card-footer">
        <span>${escapeHtml(record.source_name || "Hukumonline")}</span>
        ${rank ? `<span class="recognition-rank">${escapeHtml(rank)}</span>` : `<span>${labels.source}</span>`}
      </div>
    </a>`;
}

function render() {
  renderStats();
  const grouped = new Map();
  records.forEach(record => {
    const year = yearOf(record);
    if (!grouped.has(year)) grouped.set(year, []);
    grouped.get(year).push(record);
  });
  list.innerHTML = [...grouped.entries()].sort(([yearA], [yearB]) => yearB - yearA).map(([year, entries]) => `
    <section class="recognition-year" aria-labelledby="recognition-${year}">
      <h2 class="recognition-year-heading" id="recognition-${year}">${year}</h2>
      <div class="recognition-grid">${entries.map(recordCard).join("")}</div>
    </section>`).join("");
}

async function load() {
  try {
    const { data, error } = await supabase.from("posts")
      .select("id,title,excerpt,category,external_url,source_name,source_date,award_year,rank_label,published_at,created_at")
      .eq("content_type", "external")
      .order("published_at", { ascending: false, nullsFirst: false });
    if (error) throw error;
    records = data || [];
    render();
  } catch (error) {
    list.innerHTML = `<p class="recognition-error">${copy[language].unavailable} (${escapeHtml(error.message)})</p>`;
  }
}

window.addEventListener("ssg:languagechange", event => {
  language = event.detail.language === "en" ? "en" : "id";
  if (records.length) render();
});

load();
