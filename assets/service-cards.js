// Canonical content for the service cards used by home.html and services.html.
const serviceCards = [
  {
    slug: "litigasi-penyelesaian-sengketa", image: "images/service-litigation.png",
    title: { id: "Litigasi & Penyelesaian Sengketa", en: "Litigation & Dispute Resolution" }, category: { id: "Perdata, Niaga & Arbitrase", en: "Civil, Commercial & Arbitration" }, alt: { id: "Placeholder litigasi dan penyelesaian sengketa", en: "Litigation and dispute resolution placeholder" },
    description: { id: "Pendampingan dan representasi dalam berbagai sengketa perdata, komersial, korporasi, wanprestasi, perbuatan melawan hukum, sengketa kepemilikan dan perkara lainnya. Layanan mencakup penyusunan strategi perkara, negosiasi dan mediasi, proses persidangan, upaya hukum, hingga pendampingan dalam pelaksanaan putusan.", en: "Assistance and representation in civil, commercial and corporate disputes, breach of contract, unlawful acts, ownership disputes and other legal matters. Our services cover case strategy, negotiation and mediation, court proceedings, legal remedies, and assistance with the enforcement of judgments." }
  },
  {
    slug: "hukum-pidana-pidana-korporasi", image: "images/service-criminal-law.png",
    title: { id: "Hukum Perdata & Hukum Bisnis", en: "Criminal & Corporate Crime Law" }, category: { id: "White Collar Crime & Kepatuhan", en: "White Collar Crime & Compliance" }, alt: { id: "Placeholder hukum pidana dan pidana korporasi", en: "Criminal and corporate crime law placeholder" },
    description: { id: "Pendampingan hukum bagi individu, pengurus perusahaan maupun korporasi dalam menghadapi perkara pidana, baik sebagai pelapor, terlapor, saksi maupun pihak berkepentingan. Pendampingan dilakukan sejak tahap awal penanganan perkara, penyelidikan, penyidikan dan penuntutan hingga proses persidangan dan upaya hukum.", en: "Legal assistance for individuals, company officers and corporations facing criminal matters as complainants, reported parties, witnesses or interested parties. Assistance is provided from the initial case assessment through inquiry, investigation, prosecution, trial and subsequent legal remedies." }
  },
  {
    slug: "perbankan-pembiayaan-pengalihan-piutang", image: "images/service-banking.png",
    title: { id: "Perbankan, Pembiayaan & Pengalihan Piutang", en: "Banking, Finance & Debt Assignment" }, category: { id: "Cessie & Restrukturisasi Kredit", en: "Debt Assignment & Credit Restructuring" }, alt: { id: "Placeholder perbankan dan pembiayaan", en: "Banking and finance placeholder" },
    description: { id: "Konsultasi dan pendampingan terkait kredit dan pembiayaan, pengalihan piutang (cessie), Hak Tanggungan dan jaminan kebendaan, penyelesaian kredit bermasalah, restrukturisasi kewajiban, penagihan dan pemulihan piutang serta sengketa yang berkaitan dengan aktivitas perbankan dan pembiayaan.", en: "Advice and assistance concerning credit and financing, debt assignment (cessie), mortgages and security interests, non-performing loan resolution, debt restructuring, collection and recovery, and disputes arising from banking and financing activities." }
  },
  {
    slug: "lelang-eksekusi-pengamanan-aset", image: "images/service-execution.png",
    title: { id: "Lelang, Eksekusi & Pengamanan Aset", en: "Auctions, Enforcement & Asset Security" }, category: { id: "Eksekusi HT & Parate Eksekusi", en: "Mortgage & Direct Enforcement" }, alt: { id: "Placeholder lelang dan eksekusi", en: "Auction and enforcement placeholder" },
    description: { id: "Pendampingan dalam proses lelang, pelaksanaan eksekusi, pengosongan dan pengamanan aset, termasuk perlindungan kepentingan hukum kreditur, pemegang hak maupun pemenang lelang. Layanan juga mencakup penanganan keberatan dan sengketa yang timbul sebelum, selama maupun setelah proses lelang dan eksekusi.", en: "Assistance with auctions, enforcement, vacancy proceedings and asset protection, including safeguarding the legal interests of creditors, rights holders and auction winners. Our services also cover objections and disputes arising before, during or after auction and enforcement proceedings." }
  },
  {
    slug: "pertanahan-properti-real-estate", image: "images/service-property.png",
    title: { id: "Pertanahan, Properti & Real Estate", en: "Land, Property & Real Estate" }, category: { id: "Sengketa Hak Milik & Agraria", en: "Ownership & Agrarian Disputes" }, alt: { id: "Placeholder pertanahan dan properti", en: "Land and property placeholder" },
    description: { id: "Konsultasi dan pendampingan terkait kepemilikan dan penguasaan tanah, pemeriksaan legalitas aset, peralihan dan pembebanan hak, sertifikasi, pengembangan properti serta penyelesaian sengketa pertanahan dan berbagai persoalan hukum yang berkaitan dengan tanah dan properti.", en: "Advice and assistance concerning land ownership and possession, asset legality reviews, transfers and encumbrances, certification, property development, land dispute resolution and other legal issues involving land and property." }
  },
  {
    slug: "korporasi-komersial", image: "images/service-corporation.png",
    title: { id: "Korporasi & Komersial", en: "Corporate & Commercial" }, category: { id: "Legal Due Diligence & Kontrak", en: "Legal Due Diligence & Contracts" }, alt: { id: "Placeholder korporasi dan komersial", en: "Corporate and commercial placeholder" },
    description: { id: "Pendampingan hukum dalam kegiatan korporasi dan transaksi komersial, termasuk pendirian dan restrukturisasi perusahaan, penyusunan dan penelaahan kontrak, transaksi bisnis, tata kelola perusahaan, legal due diligence, pemberian legal opinion serta mitigasi risiko hukum dalam kegiatan usaha.", en: "Legal assistance for corporate activities and commercial transactions, including company establishment and restructuring, contract drafting and review, business transactions, corporate governance, legal due diligence, legal opinions and legal risk mitigation." }
  },
  {
    slug: "kepailitan-pkpu-restrukturisasi-utang", image: "images/service-bankruptcy.png",
    title: { id: "Kepailitan, PKPU & Restrukturisasi Utang", en: "Bankruptcy, Debt Suspension & Restructuring" }, category: { id: "Kepailitan & Restrukturisasi", en: "Bankruptcy & Restructuring" }, alt: { id: "Placeholder kepailitan dan PKPU", en: "Bankruptcy and debt suspension placeholder" },
    description: { id: "Pendampingan kepada kreditur maupun debitur dalam penyelesaian permasalahan utang-piutang, restrukturisasi kewajiban, Penundaan Kewajiban Pembayaran Utang (PKPU), kepailitan, verifikasi dan penagihan piutang serta berbagai tindakan hukum yang diperlukan untuk melindungi kepentingan Klien.", en: "Assistance for creditors and debtors in resolving debt matters, restructuring obligations, suspension of debt payment proceedings (PKPU), bankruptcy, claim verification and collection, and other legal actions required to protect the Client's interests." }
  },
  {
    slug: "hukum-administrasi-negara-ptun", image: "images/service-administration.png",
    title: { id: "Hukum Administrasi Negara & PTUN", en: "State Administrative Law & Administrative Court" }, category: { id: "Sengketa Administrasi Negara", en: "State Administrative Disputes" }, alt: { id: "Placeholder hukum administrasi negara", en: "State administrative law placeholder" },
    description: { id: "Konsultasi dan pendampingan dalam permasalahan hukum yang berkaitan dengan keputusan dan/atau tindakan badan atau pejabat pemerintahan, perizinan dan administrasi pemerintahan, upaya administratif serta penyelesaian sengketa melalui Pengadilan Tata Usaha Negara.", en: "Advice and assistance on legal issues involving decisions or actions of government bodies and officials, licensing and public administration, administrative remedies, and dispute resolution before the State Administrative Court." }
  },
  {
    slug: "ketenagakerjaan-hubungan-industrial", image: "images/service-worker.png",
    title: { id: "Ketenagakerjaan & Hubungan Industrial", en: "Employment & Industrial Relations" }, category: { id: "Hubungan Kerja & Perselisihan", en: "Employment & Workplace Disputes" }, alt: { id: "Placeholder ketenagakerjaan", en: "Employment law placeholder" },
    description: { id: "Konsultasi dan pendampingan dalam hubungan kerja dan ketenagakerjaan, termasuk penyusunan dan penelaahan perjanjian kerja, kebijakan perusahaan, pemutusan hubungan kerja serta penyelesaian perselisihan hubungan industrial melalui mekanisme bipartit, mediasi maupun proses persidangan.", en: "Advice and assistance on employment and industrial relations, including drafting and reviewing employment agreements, company policies, employment termination, and resolving industrial relations disputes through bipartite negotiation, mediation or court proceedings." }
  },
  {
    slug: "kontrak-dokumen-hukum-legal-opinion", image: "images/service-doc.png",
    title: { id: "Kontrak, Dokumen Hukum & Legal Opinion", en: "Contracts, Legal Documents & Legal Opinions" }, category: { id: "Kontrak & Pendapat Hukum", en: "Contracts & Legal Opinions" }, alt: { id: "Placeholder kontrak dan legal opinion", en: "Contracts and legal opinions placeholder" },
    description: { id: "Penyusunan dan penelaahan perjanjian, kontrak bisnis, memorandum, pendapat hukum (legal opinion), surat hukum dan berbagai dokumen lainnya untuk memberikan kepastian hukum, melindungi kepentingan para pihak serta mengidentifikasi dan meminimalkan potensi risiko hukum.", en: "Drafting and reviewing agreements, business contracts, memoranda, legal opinions, legal correspondence and other documents to provide legal certainty, protect the parties' interests, and identify and minimise potential legal risks." }
  },
  {
    slug: "negosiasi-mediasi-arbitrase", image: "images/service-nego.png",
    title: { id: "Negosiasi, Mediasi, Arbitrase & Penyelesaian di Luar Pengadilan", en: "Negotiation, Mediation, Arbitration & Alternative Dispute Resolution" }, category: { id: "Penyelesaian Sengketa Alternatif", en: "Alternative Dispute Resolution" }, alt: { id: "Placeholder negosiasi dan mediasi", en: "Negotiation and mediation placeholder" },
    description: { id: "Pendampingan dan representasi dalam proses negosiasi, mediasi, arbitrase, dan penyelesaian sengketa secara non-litigasi dengan mengedepankan komunikasi, kepentingan para pihak dan penyelesaian yang efektif, tanpa mengesampingkan perlindungan terhadap hak dan kepentingan hukum Klien.", en: "Assistance and representation in negotiation, mediation, arbitration and other non-litigation dispute resolution processes, prioritising communication, the parties' interests and effective outcomes while continuing to protect the Client's legal rights and interests." }
  },
  {
    slug: "hukum-islam-sengketa-waris", image: "images/service-islamic-law.png",
    title: { id: "Hukum Islam & Sengketa Waris", en: "Islamic Law & Inheritance Disputes" }, category: { id: "Waris, Hibah & Ahli Waris", en: "Inheritance, Gifts & Heirs" }, alt: { id: "Placeholder hukum islam dan sengketa waris", en: "Islamic law and inheritance disputes placeholder" },
    description: { id: "Pendampingan hukum dalam persoalan waris, hibah, wasiat, pembagian harta, penetapan ahli waris, hingga penyelesaian sengketa waris sesuai prinsip hukum Islam dan ketentuan yang berlaku. Layanan mencakup konsultasi, negosiasi, dan representasi di pengadilan untuk melindungi hak dan kepentingan keluarga serta pihak yang terlibat.", en: "Legal assistance in inheritance matters, gifts, wills, asset distribution, heir determination and the resolution of inheritance disputes under Islamic law and applicable regulations. Our services include consultation, negotiation and representation in court to protect the rights and interests of families and involved parties." }
  },
  {
    slug: "retainer-penasihat-hukum", image: "images/service-advo.png",
    title: { id: "Retainer & Penasihat Hukum", en: "Retainer & Legal Counsel" }, category: { id: "Pendampingan Hukum Berkelanjutan", en: "Ongoing Legal Assistance" }, alt: { id: "Placeholder retainer dan penasihat hukum", en: "Retainer and legal counsel placeholder" },
    description: { id: "Layanan penasihat hukum secara berkelanjutan bagi perusahaan, pelaku usaha, organisasi maupun individu dalam menghadapi kebutuhan hukum sehari-hari, pengambilan keputusan, penyusunan kebijakan dan transaksi serta pencegahan dan mitigasi risiko hukum.", en: "Ongoing legal advisory services for companies, business operators, organisations and individuals addressing day-to-day legal needs, decision-making, policy and transaction preparation, and the prevention and mitigation of legal risk." }
  }
  
];

window.SSG_SERVICES = serviceCards;

function escapeServiceCardText(value) {
  return String(value).replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

function renderServiceCards(language = localStorage.getItem("ssg-language") || "id") {
  const selectedLanguage = language === "en" ? "en" : "id";
  document.querySelectorAll("[data-service-cards]").forEach(container => {
    const requestedLimit = Number(container.dataset.limit);
    const cards = Number.isFinite(requestedLimit) && requestedLimit > 0 ? serviceCards.slice(0, requestedLimit) : serviceCards;
    container.innerHTML = cards.map(card => `
      <a class="shared-service-card" href="service-detail.html?service=${encodeURIComponent(card.slug)}" aria-label="${escapeServiceCardText(card.title[selectedLanguage])}">
        <div class="shared-service-image">
          <!-- Replace ${escapeServiceCardText(card.image)} with the final practice-area image. -->
          <img src="${escapeServiceCardText(card.image)}" alt="${escapeServiceCardText(card.alt[selectedLanguage])}" width="1200" height="600" loading="lazy">
        </div>
        <div class="shared-service-copy">
          <h3 class="shared-service-title">${escapeServiceCardText(card.title[selectedLanguage])}</h3>
          <div class="shared-service-bottom">
            <span class="shared-service-category">${escapeServiceCardText(card.category[selectedLanguage])}</span>
            <span class="shared-service-arrow" aria-hidden="true">→</span>
          </div>
        </div>
      </a>`).join("");
  });
}

renderServiceCards();
document.querySelectorAll("[data-language]").forEach(option => {
  option.addEventListener("click", () => {
    const selectedLanguage = option.dataset.language === "en" ? "en" : "id";
    localStorage.setItem("ssg-language", selectedLanguage);
    document.documentElement.lang = selectedLanguage;
    document.getElementById("language-code").textContent = selectedLanguage.toUpperCase();
    document.querySelectorAll("[data-language]").forEach(item => item.setAttribute("aria-checked", String(item.dataset.language === selectedLanguage)));
    const menu = document.getElementById("language-menu");
    const toggle = document.getElementById("language-toggle");
    if (menu) menu.hidden = true;
    if (toggle) toggle.setAttribute("aria-expanded", "false");
    renderServiceCards(selectedLanguage);
    window.dispatchEvent(new CustomEvent("ssg:languagechange", { detail: { language: selectedLanguage } }));
  });
});
