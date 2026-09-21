import { loremProfile, teamMembers } from "./team-members-data.js";

const profileRoot = document.querySelector("[data-member-profile]");
const slug = new URLSearchParams(window.location.search).get("member") || "sopian-sitepu";
const member = teamMembers[slug];

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

function renderSpecialties(items) {
  if (!items?.length) return "";
  return `
    <section class="profile-section" aria-labelledby="expertise-heading">
      <p class="section-kicker">Bidang Keahlian</p>
      <h2 id="expertise-heading">Fokus praktik utama.</h2>
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

function renderEducation(items) {
  if (!items?.length) return "";
  return `
    <section class="profile-section" aria-labelledby="education-heading">
      <p class="section-kicker">Riwayat Pendidikan</p>
      <h2 id="education-heading">Pendidikan.</h2>
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

function renderProfile(selectedMember) {
  const isPlaceholder = selectedMember.placeholder;
  const profile = isPlaceholder ? { ...selectedMember, ...loremProfile } : selectedMember;
  const facts = isPlaceholder ? [["Profil", "Lorem ipsum dolor sit amet"]] : profile.facts;

  document.title = `${profile.name} | SSG & Partners`;
  document.querySelector('meta[name="description"]')?.setAttribute("content", profile.lead);

  profileRoot.innerHTML = `
    <section class="member-hero" aria-labelledby="member-name">
      <div class="container">
        <a class="member-back" href="team.html">← Kembali ke Tim Kami</a>
        <div class="member-hero-grid">
          <div class="member-portrait">
            <img src="${escapeHtml(profile.image)}" alt="Potret ${escapeHtml(profile.name)}" width="800" height="1000" fetchpriority="high">
          </div>
          <div class="member-intro">
            <p class="member-eyebrow">${escapeHtml(profile.role)}</p>
            <h1 id="member-name">${escapeHtml(profile.name)}</h1>
            <p class="member-lead">${escapeHtml(profile.lead)}</p>
            ${profile.specialties?.length ? `
              <ul class="member-highlights" aria-label="Bidang keahlian">
                ${profile.specialties.slice(0, 3).map(item => `<li>${escapeHtml(item)}</li>`).join("")}
              </ul>
            ` : ""}
            <div class="member-actions">
              <a class="button" href="https://wa.me/6285196513840" target="_blank" rel="noopener">Jadwalkan Konsultasi</a>
              <a class="member-email" href="mailto:ssg.partnerslawfirm@gmail.com">Kirim Email</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="member-content">
      <div class="container member-content-grid">
        <article class="member-biography">
          <section class="profile-section" aria-labelledby="profile-heading">
            <p class="section-kicker">Profil Profesional</p>
            <h2 id="profile-heading">Tentang ${escapeHtml(profile.name)}</h2>
            ${profile.bio.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join("")}
          </section>
          ${renderSpecialties(profile.specialties)}
          ${renderEducation(profile.education)}
          ${renderSimpleList("Asosiasi", profile.associations)}
          ${renderSimpleList("Riwayat Pelatihan", profile.training)}
          ${renderSimpleList("Penghargaan", profile.awards)}
          ${renderSimpleList("Pengalaman Organisasi", profile.organizations)}
          ${renderSimpleList("Pengalaman Lain", profile.otherExperience)}
        </article>

        <aside class="member-sidebar" aria-label="Informasi anggota tim">
          ${facts?.length ? `
            <div class="sidebar-card">
              <p class="section-kicker">Informasi Profesional</p>
              <dl class="member-facts">${renderFacts(facts)}</dl>
            </div>
          ` : ""}
          <div class="sidebar-contact">
            <p class="section-kicker">Konsultasi</p>
            <h2>Diskusikan kebutuhan hukum Anda.</h2>
            <p>Sampaikan gambaran awal perkara Anda kepada tim kami untuk menentukan langkah konsultasi berikutnya.</p>
            <a href="contact.html">Hubungi SSG &amp; Partners →</a>
          </div>
        </aside>
      </div>
    </section>
  `;
}

if (!member) {
  profileRoot.innerHTML = `
    <section class="member-not-found">
      <div class="container">
        <p class="section-kicker">Profil Tidak Ditemukan</p>
        <h1>Anggota tim ini belum tersedia.</h1>
        <a class="button" href="team.html">Kembali ke Tim Kami</a>
      </div>
    </section>
  `;
} else {
  renderProfile(member);
}
