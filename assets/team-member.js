import { loremProfile, teamMemberEnglish, teamMembers } from "./team-members-data.js?v=20260922-en";

const profileRoot = document.querySelector("[data-member-profile]");
const slug = new URLSearchParams(window.location.search).get("member") || "sopian-sitepu";
const member = teamMembers[slug];
let language = localStorage.getItem("ssg-language") === "en" ? "en" : "id";

const ui = {
  id: {
    back: "Kembali ke Tim Kami",
    portrait: "Potret",
    expertise: "Bidang Keahlian",
    expertiseHeading: "Fokus praktik utama.",
    education: "Riwayat Pendidikan",
    educationHeading: "Pendidikan.",
    associations: "Asosiasi",
    training: "Riwayat Pelatihan",
    certifications: "Sertifikasi",
    awards: "Penghargaan",
    organizations: "Pengalaman Organisasi",
    otherExperience: "Pengalaman Lain",
    schedule: "Jadwalkan Konsultasi",
    email: "Kirim Email",
    professionalProfile: "Profil Profesional",
    about: "Tentang",
    expertiseAria: "Bidang keahlian",
    memberInfo: "Informasi anggota tim",
    professionalInfo: "Informasi Profesional",
    consultation: "Konsultasi",
    discuss: "Diskusikan kebutuhan hukum Anda.",
    contactCopy: "Sampaikan gambaran awal perkara Anda kepada tim kami untuk menentukan langkah konsultasi berikutnya.",
    contact: "Hubungi SSG & Partners",
    notFoundKicker: "Profil Tidak Ditemukan",
    notFound: "Anggota tim ini belum tersedia.",
    profileFact: "Profil"
  },
  en: {
    back: "Back to Our Team",
    portrait: "Portrait of",
    expertise: "Areas of Expertise",
    expertiseHeading: "Principal areas of practice.",
    education: "Education",
    educationHeading: "Academic background.",
    associations: "Professional Associations",
    training: "Professional Training",
    certifications: "Certifications",
    awards: "Awards and Recognition",
    organizations: "Organisational Experience",
    otherExperience: "Other Experience",
    schedule: "Schedule a Consultation",
    email: "Send an Email",
    professionalProfile: "Professional Profile",
    about: "About",
    expertiseAria: "Areas of expertise",
    memberInfo: "Team member information",
    professionalInfo: "Professional Information",
    consultation: "Consultation",
    discuss: "Discuss your legal requirements.",
    contactCopy: "Provide our team with an initial overview of your matter so that we can determine the appropriate next step for consultation.",
    contact: "Contact SSG & Partners",
    notFoundKicker: "Profile Not Found",
    notFound: "This team member's profile is not yet available.",
    profileFact: "Profile"
  }
};

function escapeHtml(value = "") {
  const element = document.createElement("span");
  element.textContent = value;
  return element.innerHTML;
}

function renderSimpleList(title, items) {
  if (!items?.length) return "";
  return `
    <section class="profile-section">
      <p class="section-kicker">${escapeHtml(title)}</p>
      <ul class="profile-list">
        ${items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </section>
  `;
}

function renderSpecialties(items, copy) {
  if (!items?.length) return "";
  return `
    <section class="profile-section" aria-labelledby="expertise-heading">
      <p class="section-kicker">${copy.expertise}</p>
      <h2 id="expertise-heading">${copy.expertiseHeading}</h2>
      <ul class="expertise-list">
        ${items.map((item, index) => `
          <li>
            <span>${String(index + 1).padStart(2, "0")}</span>
            <h3>${escapeHtml(item)}</h3>
          </li>
        `).join("")}
      </ul>
    </section>
  `;
}

function renderEducation(items, copy) {
  if (!items?.length) return "";
  return `
    <section class="profile-section" aria-labelledby="education-heading">
      <p class="section-kicker">${copy.education}</p>
      <h2 id="education-heading">${copy.educationHeading}</h2>
      <ul class="profile-list profile-list--education">
        ${items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </section>
  `;
}

function renderFacts(items) {
  if (!items?.length) return "";
  return items.map(([label, value]) => `
    <div>
      <dt>${escapeHtml(label)}</dt>
      <dd>${escapeHtml(value)}</dd>
    </div>
  `).join("");
}

function selectedProfile() {
  if (!member) return null;
  const base = member.placeholder ? { ...member, ...loremProfile } : member;
  return language === "en" ? { ...base, ...(teamMemberEnglish[slug] || {}) } : base;
}

function renderProfile() {
  const copy = ui[language];
  const profile = selectedProfile();

  if (!profile) {
    document.title = language === "en" ? "Profile Not Found | SSG & Partners" : "Profil Tidak Ditemukan | SSG & Partners";
    profileRoot.innerHTML = `
      <section class="member-not-found">
        <div class="container">
          <p class="section-kicker">${copy.notFoundKicker}</p>
          <h1>${copy.notFound}</h1>
          <a class="button" href="team.html">${copy.back}</a>
        </div>
      </section>
    `;
    return;
  }

  const facts = member.placeholder ? [[copy.profileFact, "Lorem ipsum dolor sit amet"]] : profile.facts;
  document.title = `${profile.name} | SSG & Partners`;
  document.querySelector('meta[name="description"]')?.setAttribute("content", profile.lead);

  profileRoot.innerHTML = `
    <section class="member-hero" aria-labelledby="member-name">
      <div class="container">
        <a class="member-back" href="team.html">← ${copy.back}</a>
        <div class="member-hero-grid">
          <div class="member-portrait">
            <img src="${escapeHtml(profile.image)}" alt="${copy.portrait} ${escapeHtml(profile.name)}" width="800" height="1000" fetchpriority="high">
          </div>
          <div class="member-intro">
            <p class="member-eyebrow">${escapeHtml(profile.role)}</p>
            <h1 id="member-name">${escapeHtml(profile.name)}</h1>
            <p class="member-lead">${escapeHtml(profile.lead)}</p>
            ${profile.specialties?.length ? `
              <ul class="member-highlights" aria-label="${copy.expertiseAria}">
                ${profile.specialties.slice(0, 3).map(item => `<li>${escapeHtml(item)}</li>`).join("")}
              </ul>
            ` : ""}
            <div class="member-actions">
              <a class="button" href="https://wa.me/6285196513840" target="_blank" rel="noopener">${copy.schedule}</a>
              <a class="member-email" href="mailto:ssg.partnerslawfirm@gmail.com">${copy.email}</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="member-content">
      <div class="container member-content-grid">
        <article class="member-biography">
          <section class="profile-section" aria-labelledby="profile-heading">
            <p class="section-kicker">${copy.professionalProfile}</p>
            <h2 id="profile-heading">${copy.about} ${escapeHtml(profile.name)}</h2>
            ${profile.bio.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join("")}
          </section>
          ${renderSpecialties(profile.specialties, copy)}
          ${renderEducation(profile.education, copy)}
          ${renderSimpleList(copy.associations, profile.associations)}
          ${renderSimpleList(copy.training, profile.training)}
          ${renderSimpleList(copy.certifications, profile.certifications)}
          ${renderSimpleList(copy.awards, profile.awards)}
          ${renderSimpleList(copy.organizations, profile.organizations)}
          ${renderSimpleList(copy.otherExperience, profile.otherExperience)}
        </article>

        <aside class="member-sidebar" aria-label="${copy.memberInfo}">
          ${facts?.length ? `
            <div class="sidebar-card">
              <p class="section-kicker">${copy.professionalInfo}</p>
              <dl class="member-facts">${renderFacts(facts)}</dl>
            </div>
          ` : ""}
          <div class="sidebar-contact">
            <p class="section-kicker">${copy.consultation}</p>
            <h2>${copy.discuss}</h2>
            <p>${copy.contactCopy}</p>
            <a href="contact.html">${copy.contact} →</a>
          </div>
        </aside>
      </div>
    </section>
  `;
}

renderProfile();
window.addEventListener("ssg:languagechange", event => {
  language = event.detail.language === "en" ? "en" : "id";
  renderProfile();
});
