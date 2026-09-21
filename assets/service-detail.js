const detailRoot = document.querySelector("[data-service-detail]");
const serviceSlug = new URLSearchParams(window.location.search).get("service");

function renderServiceDetail(language = localStorage.getItem("ssg-language") || "id") {
  const selectedLanguage = language === "en" ? "en" : "id";
  const service = window.SSG_SERVICES.find(item => item.slug === serviceSlug);

  document.documentElement.lang = selectedLanguage;

  if (!service) {
    document.title = selectedLanguage === "en" ? "Service Not Found | SSG & Partners" : "Layanan Tidak Ditemukan | SSG & Partners";
    detailRoot.innerHTML = `
      <div class="service-detail-error">
        <h1>${selectedLanguage === "en" ? "Service not found" : "Layanan tidak ditemukan"}</h1>
        <p>${selectedLanguage === "en" ? "The service link may be incomplete or no longer available." : "Tautan layanan mungkin tidak lengkap atau sudah tidak tersedia."}</p>
        <a class="button" href="services.html">${selectedLanguage === "en" ? "View all services" : "Lihat semua layanan"}</a>
      </div>`;
    return;
  }

  document.title = `${service.title[selectedLanguage]} | SSG & Partners`;
  detailRoot.innerHTML = `
    <a class="service-detail-back" href="services.html"><span aria-hidden="true">←</span> ${selectedLanguage === "en" ? "All Services" : "Semua Layanan"}</a>
    <article class="service-detail-layout">
      <div class="service-detail-image">
        <!-- Replace ${escapeServiceCardText(service.image)} with the final practice-area image. -->
        <img src="${escapeServiceCardText(service.image)}" alt="${escapeServiceCardText(service.alt[selectedLanguage])}" width="1200" height="750">
      </div>
      <div class="service-detail-copy">
        <p class="service-detail-category">${escapeServiceCardText(service.category[selectedLanguage])}</p>
        <h1 class="service-detail-title">${escapeServiceCardText(service.title[selectedLanguage])}</h1>
        <p class="service-detail-description">${escapeServiceCardText(service.description[selectedLanguage])}</p>
        <div class="service-detail-actions">
          <a class="button" href="https://wa.me/6285196513840" target="_blank" rel="noopener noreferrer">${selectedLanguage === "en" ? "Discuss Your Matter" : "Konsultasikan Perkara"}</a>
        </div>
      </div>
    </article>`;
}

renderServiceDetail();
window.addEventListener("ssg:languagechange", event => renderServiceDetail(event.detail.language));
