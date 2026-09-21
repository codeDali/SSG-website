// Replaces legacy page-local chrome with the shared header and footer before rendering.
const legacyHeader = document.querySelector("header.site-header");
const legacyFooter = document.querySelector("footer.site-footer");
const legacyWhatsapp = document.querySelector(".floating-whatsapp");

if (legacyHeader) {
  const sharedHeader = document.createElement("div");
  sharedHeader.dataset.siteHeader = "";
  legacyHeader.replaceWith(sharedHeader);
}
if (legacyFooter) {
  const sharedFooter = document.createElement("div");
  sharedFooter.dataset.siteFooter = "";
  legacyFooter.replaceWith(sharedFooter);
}
if (legacyWhatsapp) legacyWhatsapp.remove();
