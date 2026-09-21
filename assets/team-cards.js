import { loremProfile, teamMembers } from "./team-members-data.js";

function identity(value = "") {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

const membersByName = new Map(
  Object.entries(teamMembers).map(([slug, member]) => [identity(member.name), { slug, member }])
);

document.querySelectorAll(".partner-card, .person").forEach(card => {
  const heading = card.querySelector("h2, h3");
  if (!heading) return;

  const match = membersByName.get(identity(heading.textContent));
  if (!match) return;

  const { slug, member } = match;
  const summary = member.placeholder ? loremProfile.lead : member.lead;
  const image = card.querySelector("img");
  const role = card.querySelector(".role, .person-role");
  const description = card.querySelector(".partner-top p, .person-copy p");

  heading.textContent = member.name;
  if (role) role.textContent = member.role;
  if (description) description.textContent = summary;
  if (image) {
    image.src = member.image;
    image.alt = `Potret ${member.name}`;
  }

  if (card.classList.contains("partner-card")) {
    const tags = card.querySelector(".partner-tags");
    const credentials = card.querySelector(".credentials");
    const focus = card.querySelector(".focus");
    const cardLabel = card.querySelector(".card-link");

    if (tags) {
      const tagValues = member.placeholder ? [] : (member.facts || []).slice(1).map(([, value]) => value);
      tags.innerHTML = tagValues.map(value => `<span class="tag">${value}</span>`).join("");
      tags.hidden = !tagValues.length;
    }

    if (credentials) {
      credentials.textContent = member.education?.join(" • ") || "";
      credentials.hidden = !member.education?.length;
    }

    if (focus) {
      focus.innerHTML = member.specialties?.length
        ? `<strong>Spesialisasi Fokus:</strong>${member.specialties.slice(0, 3).map(item => `<span>${item}</span>`).join("")}`
        : "";
      focus.hidden = !member.specialties?.length;
    }

    if (cardLabel) {
      cardLabel.innerHTML = `<span>${member.role}</span><span>Lihat Profil →</span>`;
    }
  }

  const link = document.createElement("a");
  link.className = "member-card-link";
  link.href = `team-member.html?member=${encodeURIComponent(slug)}`;
  link.setAttribute("aria-label", `Lihat profil ${member.name}`);
  card.append(link);
});
