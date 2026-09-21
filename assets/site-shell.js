const pageName = document.body.dataset.page || "index";

const pages = {
  index: "index.html",
  about: "about.html",
  services: "services.html",
  team: "team.html",
  insights: "insights.html",
  contact: "contact.html"
};

const labels = {
  index: "Beranda",
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
      <a class="brand" href="index.html">
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

const initPageAnimations = () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const revealSelector = [
    ".hero-copy > *",
    ".hero > .container > h1",
    ".hero > .container > p",
    ".page-hero .container > *",
    ".team-hero .container > *",
    ".insights-hero-grid > *",
    ".story-grid > *",
    ".performance-head > *",
    ".stats > *",
    ".vision-mission .container > *",
    ".values > *",
    ".faq-wrap > *",
    ".section-heading",
    ".service-cards-grid > *",
    ".method-head > *",
    ".steps > *",
    ".about-copy-inner > *",
    ".about-visual",
    ".awards-intro",
    ".award-list > *",
    ".team-grid > *",
    ".leadership-head > *",
    ".partner-grid > *",
    ".section-head > *",
    ".people-grid > *",
    ".cta-card > *",
    ".closing-inner > *",
    ".filters",
    ".featured-card",
    ".card-grid > *",
    ".article-layout > *",
    ".service-detail-back",
    ".service-detail-layout > *",
    ".service-detail-error > *",
    ".site-footer .footer-grid > *",
    ".site-footer .footer-bottom"
  ].join(",");
  const prepared = new WeakSet();
  let observer;

  const reveal = (element) => {
    element.classList.remove("reveal-pending");
    element.classList.add("animate-fade-slide-up");
    const clearAnimation = (event) => {
      if (event.target !== element || event.animationName !== "subtleFadeSlideUp") return;
      element.classList.remove("animate-fade-slide-up");
      element.style.removeProperty("--reveal-delay");
      element.removeEventListener("animationend", clearAnimation);
    };
    element.addEventListener("animationend", clearAnimation);
  };

  const prepare = (root = document) => {
    if (reducedMotion.matches) return;

    const candidates = [
      ...(root instanceof Element && root.matches(revealSelector) ? [root] : []),
      ...root.querySelectorAll(revealSelector)
    ];

    candidates.forEach((element) => {
      if (prepared.has(element) || element.classList.contains("animate-fade-slide-up")) return;

      prepared.add(element);
      const siblings = [...element.parentElement.children].filter(sibling => sibling.matches(revealSelector));
      const index = Math.max(0, siblings.indexOf(element));
      element.style.setProperty("--reveal-delay", `${Math.min(index * 90, 360)}ms`);
      element.classList.add("reveal-pending");

      const revealWithoutScroll = document.body.dataset.page === "services"
        && element.matches(".service-cards-grid > *");

      if (revealWithoutScroll) reveal(element);
      else if (observer) observer.observe(element);
      else reveal(element);
    });
  };

  if (reducedMotion.matches) return;

  if ("IntersectionObserver" in window) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        reveal(entry.target);
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
  }

  prepare();

  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof Element) prepare(node);
      });
    });
  });
  mutationObserver.observe(document.body, { childList: true, subtree: true });

  reducedMotion.addEventListener("change", (event) => {
    if (!event.matches) return;
    observer?.disconnect();
    document.querySelectorAll(".reveal-pending").forEach((element) => {
      element.classList.remove("reveal-pending");
      element.style.removeProperty("--reveal-delay");
    });
  });
};

const initHeaderControls = () => {
  const toggle = document.getElementById("language-toggle");
  const menu = document.getElementById("language-menu");
  const mobile = document.getElementById("menu-toggle");
  const languageCode = document.getElementById("language-code");
  const languageOptions = [...document.querySelectorAll("[data-language]")];

  if (!toggle || !menu || !mobile) {
    return;
  }

  const closeLanguageMenu = () => {
    menu.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  };

  const setLanguage = (language) => {
    const selected = language === "en" ? "en" : "id";
    document.documentElement.lang = selected;

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      if (element.dataset[selected] !== undefined) {
        element.textContent = element.dataset[selected];
      }
    });
    document.querySelectorAll("[data-alt-id]").forEach((image) => {
      image.alt = selected === "en" ? image.dataset.altEn : image.dataset.altId;
    });
    languageOptions.forEach((option) => {
      option.setAttribute("aria-checked", String(option.dataset.language === selected));
    });
    if (languageCode) languageCode.textContent = selected.toUpperCase();
    localStorage.setItem("ssg-language", selected);
    closeLanguageMenu();
  };

  toggle.addEventListener("click", (event) => {
    event.stopImmediatePropagation();
    menu.hidden = !menu.hidden;
    toggle.setAttribute("aria-expanded", String(!menu.hidden));
  }, { capture: true });

  languageOptions.forEach((option) => {
    option.addEventListener("click", (event) => {
      event.stopImmediatePropagation();
      setLanguage(option.dataset.language);
    }, { capture: true });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".language")) {
      closeLanguageMenu();
    }
  });

  mobile.addEventListener("click", (event) => {
    event.stopImmediatePropagation();
    const mainNav = document.getElementById("main-navigation");

    if (!mainNav) {
      return;
    }

    const isOpen = !mainNav.classList.contains("open");
    mainNav.classList.toggle("open", isOpen);
    mobile.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  }, { capture: true });

  setLanguage(localStorage.getItem("ssg-language") || "id");
};

initHeaderControls();
initPageAnimations();
