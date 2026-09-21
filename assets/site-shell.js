const pageName = document.body.dataset.page || "home";

const pages = {
  home: "home.html",
  about: "about.html",
  services: "services.html",
  team: "team.html",
  insights: "insights.html",
  contact: "contact.html"
};

const labels = {
  home: "Beranda",
  about: "Tentang Kami",
  services: "Keahlian & Layanan",
  team: "Tim Kami",
  insights: "Wawasan & Publikasi",
  contact: "Kontak"
};

const header = document.querySelector("[data-site-header]");
const footer = document.querySelector("[data-site-footer]");

const buildNav = (navPages, currentPage = pageName) =>
  Object.entries(navPages)
    .map(([key, href]) => `<a href="${href}"${key === currentPage ? ' aria-current="page"' : ""}>${labels[key]}</a>`)
    .join("");

const headerNav = buildNav(pages);
const footerNav = buildNav(
  Object.fromEntries(Object.entries(pages).filter(([key]) => key !== "contact"))
);

const headerMarkup = `
  <header class="site-header">
    <div class="header-inner">
      <a class="brand" href="home.html">
        <img src="images/ssg-logo.svg" alt="SSG and Partners Law Firm logo">
      </a>
      <nav class="desktop-nav" id="main-navigation" aria-label="Navigasi utama">
        ${headerNav}
      </nav>
      <div class="header-actions">
        <div class="language">
          <button class="language-toggle" id="language-toggle" aria-expanded="false" aria-controls="language-menu">
            <span class="language-code" id="language-code">ID</span>
            <span class="language-chevron">⌄</span>
          </button>
          <ul class="language-menu" id="language-menu" hidden>
            <li><button class="language-option" data-language="id" aria-checked="true">Bahasa Indonesia</button></li>
            <li><button class="language-option" data-language="en" aria-checked="false">English</button></li>
          </ul>
        </div>
        <a class="button header-cta" href="https://wa.me/6285196513840" target="_blank" rel="noopener">Konsultasi Sekarang</a>
        <button class="menu-toggle" id="menu-toggle" aria-expanded="false" aria-controls="main-navigation">
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </header>
`;

const footerMarkup = `
  <footer class="site-footer" id="contact">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <img src="images/ssg-logo.svg" alt="SSG and Partners Law Firm logo">
          <p>Firma hukum dan konsultan hukum berbasis di Sudirman Financial District, Jakarta. Terdaftar dan berakreditasi resmi pada organisasi advokat dan kepailitan Indonesia.</p>
        </div>
        <div>
          <h2 class="footer-heading">Kantor Pusat</h2>
          <p class="footer-address">Gedung Plaza Sentral, Lantai 14<br>Jl. Jend. Sudirman, RT.5/RW.4<br>Karet Semanggi, Setiabudi, Jakarta Selatan 12940<br>DKI Jakarta, Indonesia</p>
          <p class="footer-contact"><strong>Jam Operasional:</strong> Senin–Jumat, 09.00–17.00 WIB<br><strong>Email:</strong> ssg.partnerslawfirm@gmail.com<br><strong>WhatsApp:</strong> +62 851-9651-3840</p>
        </div>
        <div class="footer-nav-column">
          <h2 class="footer-heading">Navigasi Cepat</h2>
          <nav class="footer-nav">
            ${footerNav}
            <a href="contact.html"${pageName === "contact" ? ' aria-current="page"' : ""}>Hubungi Kami</a>
          </nav>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} SSG & Partners Law Firm. Hak cipta dilindungi.</span>
        <div class="footer-legal">
          <span>Kebijakan Privasi</span>
          <span>Disclaimer Hukum</span>
        </div>
        <span>People • Solution • Trust</span>
      </div>
    </div>
  </footer>
  <a class="floating-whatsapp" href="https://wa.me/6285196513840" target="_blank" rel="noopener">
    <img src="images/icon-whatsapp.svg" alt="">
    <span>Konsultasi WhatsApp</span>
  </a>
`;

if (header) {
  header.innerHTML = headerMarkup;
}

if (footer) {
  footer.innerHTML = footerMarkup;
}

const initHeaderControls = () => {
  const toggle = document.getElementById("language-toggle");
  const menu = document.getElementById("language-menu");
  const mobile = document.getElementById("menu-toggle");

  if (!toggle || !menu || !mobile) {
    return;
  }

  toggle.addEventListener("click", () => {
    menu.hidden = !menu.hidden;
    toggle.setAttribute("aria-expanded", String(!menu.hidden));
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".language")) {
      menu.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  mobile.addEventListener("click", () => {
    const mainNav = document.getElementById("main-navigation");

    if (!mainNav) {
      return;
    }

    const isOpen = !mainNav.classList.contains("open");
    mainNav.classList.toggle("open", isOpen);
    mobile.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });
};

initHeaderControls();
