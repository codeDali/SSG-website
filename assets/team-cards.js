import { loremProfile, teamMemberEnglish, teamMembers } from "./team-members-data.js?v=20260922-en";

function identity(value = "") {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

function escapeHtml(value = "") {
  const node = document.createElement("span");
  node.textContent = value;
  return node.innerHTML;
}

const membersByName = new Map(
  Object.entries(teamMembers).map(([slug, member]) => [identity(member.name), { slug, member }])
);

const cards = [...document.querySelectorAll(".partner-card, .person")]
  .map(card => {
    const heading = card.querySelector("h2, h3");
    const match = heading ? membersByName.get(identity(heading.textContent)) : null;
    return match ? { card, heading, ...match } : null;
  })
  .filter(Boolean);

function renderTeamCards(requestedLanguage = localStorage.getItem("ssg-language") || "id") {
  const language = requestedLanguage === "en" ? "en" : "id";

  cards.forEach(({ card, heading, slug, member }) => {
    const translated = language === "en" ? teamMemberEnglish[slug] || {} : {};
    const profile = { ...member, ...translated };
    const summary = member.placeholder ? loremProfile.lead : profile.lead;
    const image = card.querySelector("img");
    const role = card.querySelector(".role, .person-role");
    const description = card.querySelector(".partner-top p, .person-copy p");

    heading.textContent = member.name;
    if (role) role.textContent = profile.role;
    if (description) description.textContent = summary;
    if (image) {
      image.src = member.image;
      image.alt = language === "en" ? `Portrait of ${member.name}` : `Potret ${member.name}`;
    }

    if (card.classList.contains("partner-card")) {
      const tags = card.querySelector(".partner-tags");
      const credentials = card.querySelector(".credentials");
      const focus = card.querySelector(".focus");
      const cardLabel = card.querySelector(".card-link");

      if (tags) {
        const tagValues = member.placeholder ? [] : (profile.facts || []).slice(1).map(([, value]) => value);
        tags.innerHTML = tagValues.map(value => `<span class="tag">${escapeHtml(value)}</span>`).join("");
        tags.hidden = !tagValues.length;
      }

      if (credentials) {
        credentials.textContent = profile.education?.join(" • ") || "";
        credentials.hidden = !profile.education?.length;
      }

      if (focus) {
        focus.innerHTML = profile.specialties?.length
          ? `<strong>${language === "en" ? "Practice Focus:" : "Spesialisasi Fokus:"}</strong>${profile.specialties.slice(0, 3).map(item => `<span>${escapeHtml(item)}</span>`).join("")}`
          : "";
        focus.hidden = !profile.specialties?.length;
      }

      if (cardLabel) {
        cardLabel.innerHTML = `<span>${escapeHtml(profile.role)}</span><span>${language === "en" ? "View Profile" : "Lihat Profil"} →</span>`;
      }
    }

    let link = card.querySelector(".member-card-link");
    if (!link) {
      link = document.createElement("a");
      link.className = "member-card-link";
      card.append(link);
    }
    link.href = `team-member.html?member=${encodeURIComponent(slug)}`;
    link.setAttribute("aria-label", language === "en" ? `View the profile of ${member.name}` : `Lihat profil ${member.name}`);
  });
}

renderTeamCards();
window.addEventListener("ssg:languagechange", event => renderTeamCards(event.detail.language));
