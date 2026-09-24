import { supabase } from "./supabase-client.js";

const loginView = document.querySelector("[data-login-view]");
const adminApp = document.querySelector("[data-admin-app]");
const loginForm = document.querySelector("[data-login-form]");
const loginNotice = document.querySelector("[data-login-notice]");
const magicButton = document.querySelector("[data-send-magic]");
const passwordForm = document.querySelector("[data-password-form]");
const postForm = document.querySelector("[data-post-form]");
const postsContainer = document.querySelector("[data-posts]");
const formMessage = document.querySelector("[data-form-message]");
const formTitle = document.querySelector("[data-form-title]");
const deleteZone = document.querySelector("[data-delete-zone]");
const bodyField = document.querySelector("[data-body-field]");
const pdfField = document.querySelector("[data-pdf-field]");
const externalField = document.querySelector("[data-external-field]");
const carouselField = document.querySelector("[data-carousel-field]");
const existingSlides = document.querySelector("[data-existing-slides]");
const scheduleField = document.querySelector("[data-schedule-field]");
let posts = [];

const CONTENT_LABELS = { article: "Artikel", pdf: "PDF", external: "Sumber eksternal", carousel: "Carousel edukasi" };
const IMAGE_PRESETS = {
  cover: { maxWidth: 1600, maxHeight: 900, quality: 0.82, label: "Sampul" },
  avatar: { maxWidth: 800, maxHeight: 800, quality: 0.8, label: "Foto penulis" },
  slide: { maxWidth: 1600, maxHeight: 2000, quality: 0.82, label: "Slide" }
};

function message(element, text, kind = "") { element.textContent = text; element.className = `notice show ${kind}`; }
function slugify(value) { return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 90); }
function filePath(file, prefix) { return `${prefix}/${crypto.randomUUID()}-${file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-")}`; }
function escapeHtml(text = "") { const el = document.createElement("span"); el.textContent = text; return el.innerHTML; }
function formatBytes(bytes) { if (bytes < 1024) return `${bytes} B`; if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`; return `${(bytes / (1024 * 1024)).toFixed(1)} MB`; }
function canvasToBlob(canvas, type, quality) { return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("Browser tidak dapat mengompres gambar ini.")), type, quality)); }

async function compressImage(file, preset) {
  if (!file || !file.size) return { file: null, summary: "" };
  if (!file.type.startsWith("image/")) throw new Error(`${preset.label} harus berupa gambar PNG, JPG, atau WebP.`);
  if (file.size > 25 * 1024 * 1024) throw new Error(`${preset.label} terlalu besar. Batas file asli adalah 25 MB.`);
  let bitmap;
  try { bitmap = await createImageBitmap(file, { imageOrientation: "from-image" }); }
  catch { throw new Error(`${preset.label} tidak dapat dibaca. Gunakan gambar PNG, JPG, atau WebP yang valid.`); }
  const scale = Math.min(1, preset.maxWidth / bitmap.width, preset.maxHeight / bitmap.height);
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width; canvas.height = height;
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) { bitmap.close(); throw new Error("Browser tidak mendukung kompresi gambar."); }
  context.imageSmoothingEnabled = true; context.imageSmoothingQuality = "high";
  context.drawImage(bitmap, 0, 0, width, height); bitmap.close();
  const blob = await canvasToBlob(canvas, "image/webp", preset.quality);
  if (scale === 1 && blob.size >= file.size) return { file, summary: `${preset.label}: ${formatBytes(file.size)} (file asli dipertahankan)` };
  const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
  const compressedFile = new File([blob], `${baseName}.webp`, { type: "image/webp", lastModified: Date.now() });
  const savedPercent = Math.max(0, Math.round((1 - compressedFile.size / file.size) * 100));
  return { file: compressedFile, summary: `${preset.label}: ${formatBytes(file.size)} → ${formatBytes(compressedFile.size)} (${width}×${height}, hemat ${savedPercent}%)` };
}

function contentTypeFor(post) { return post.content_type || (post.format === "pdf" ? "pdf" : "article"); }
function updateContentFields() {
  const fields = postForm.elements;
  const type = fields.content_type.value;
  bodyField.hidden = type !== "article"; pdfField.hidden = type !== "pdf"; externalField.hidden = type !== "external"; carouselField.hidden = type !== "carousel";
  fields.body.required = type === "article";
  fields.pdf_file.required = type === "pdf" && !postForm.dataset.existingPdf;
  fields.external_url.required = type === "external"; fields.source_name.required = type === "external";
  fields.carousel_images.required = type === "carousel" && !postForm.dataset.existingSlides;
}
function updateScheduleField() { const fields = postForm.elements; scheduleField.hidden = fields.status.value !== "scheduled"; fields.scheduled_at.required = fields.status.value === "scheduled"; }
function resetForm() {
  postForm.reset(); postForm.elements.post_id.value = ""; postForm.elements.reading_minutes.value = 5;
  postForm.dataset.existingPdf = ""; postForm.dataset.existingSlides = ""; existingSlides.textContent = "";
  formTitle.textContent = "Buat konten baru"; document.querySelector("[data-save-button]").textContent = "Simpan konten";
  deleteZone.hidden = true; formMessage.textContent = ""; updateContentFields(); updateScheduleField();
}
async function uploadFile(file, prefix) {
  if (!file || !file.size) return null;
  const path = filePath(file, prefix);
  const { error } = await supabase.storage.from("content-assets").upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw error;
  return path;
}

function renderPosts() {
  if (!posts.length) { postsContainer.innerHTML = '<p class="empty">Belum ada konten. Buat yang pertama di panel kanan.</p>'; return; }
  postsContainer.innerHTML = posts.map(post => {
    const type = contentTypeFor(post);
    return `<article class="post-row"><div><h3>${escapeHtml(post.title)}</h3><p>${escapeHtml(post.category)} · ${CONTENT_LABELS[type] || type} · ${post.reading_minutes} menit</p><span class="badge">${escapeHtml(post.status)}</span></div><button class="button button-secondary button-small" type="button" data-edit="${post.id}">Edit</button></article>`;
  }).join("");
}
async function loadPosts() {
  let { data, error } = await supabase.from("posts").select("*,post_media(id,storage_path,alt_text,caption,sort_order)").order("updated_at", { ascending: false });
  if (error && /post_media|relationship|schema cache/i.test(error.message || "")) {
    ({ data, error } = await supabase.from("posts").select("*").order("updated_at", { ascending: false }));
    data = data?.map(post => ({ ...post, post_media: [] }));
  }
  if (error) throw error; posts = data; renderPosts();
}
function editPost(id) {
  const post = posts.find(item => item.id === id); if (!post) return;
  const fields = postForm.elements;
  const media = [...(post.post_media || [])].sort((a, b) => a.sort_order - b.sort_order);
  fields.post_id.value = post.id; fields.kind.value = post.kind; fields.content_type.value = contentTypeFor(post);
  fields.title.value = post.title || ""; fields.excerpt.value = post.excerpt || ""; fields.body.value = post.body || "";
  fields.category.value = post.category || ""; fields.reading_minutes.value = post.reading_minutes || 5;
  fields.author_name.value = post.author_name || ""; fields.author_role.value = post.author_role || "";
  fields.source_name.value = post.source_name || ""; fields.external_url.value = post.external_url || ""; fields.source_date.value = post.source_date || "";
  fields.award_year.value = post.award_year || ""; fields.rank_label.value = post.rank_label || "";
  fields.carousel_alt_text.value = media.map(item => item.alt_text).join("\n"); fields.status.value = post.status;
  fields.author_avatar.value = ""; fields.cover_image.value = ""; fields.pdf_file.value = ""; fields.carousel_images.value = "";
  fields.is_featured.checked = post.is_featured;
  postForm.dataset.existingPdf = post.pdf_path || ""; postForm.dataset.existingSlides = media.length ? String(media.length) : "";
  existingSlides.textContent = media.length ? `${media.length} slide tersimpan. Pilih gambar baru hanya jika ingin mengganti semuanya.` : "";
  fields.scheduled_at.value = post.scheduled_at ? post.scheduled_at.slice(0, 16) : "";
  formTitle.textContent = "Edit konten"; document.querySelector("[data-save-button]").textContent = "Simpan perubahan"; deleteZone.hidden = false;
  updateContentFields(); updateScheduleField(); postForm.closest(".panel").scrollIntoView({ block: "start", behavior: "smooth" });
}
async function showAdmin(user) {
  const { data: role, error } = await supabase.from("content_admins").select("role").eq("user_id", user.id).maybeSingle();
  if (error || !role) { await supabase.auth.signOut(); message(loginNotice, "Email ini belum diberi akses admin.", "error"); return; }
  loginView.hidden = true; adminApp.hidden = false; document.querySelector("[data-admin-user]").textContent = `${user.email} · ${role.role}`;
  try { await loadPosts(); } catch (loadError) { postsContainer.innerHTML = `<p class="empty">Konten belum bisa dimuat: ${escapeHtml(loadError.message)}</p>`; }
}

loginForm.addEventListener("submit", async event => {
  event.preventDefault(); const button = loginForm.querySelector("button[type=submit]"); button.disabled = true;
  const email = loginForm.elements.email.value.trim().toLowerCase(); const password = loginForm.elements.password.value;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password }); button.disabled = false;
  if (error) message(loginNotice, "Email atau password tidak cocok. Untuk login pertama, gunakan magic link di bawah.", "error"); else await showAdmin(data.user);
});
magicButton.addEventListener("click", async () => {
  magicButton.disabled = true; const email = loginForm.elements.email.value.trim().toLowerCase();
  if (!email) { magicButton.disabled = false; message(loginNotice, "Masukkan email terlebih dahulu.", "error"); return; }
  const redirectTo = new URL("admin.html", window.location.href).href;
  const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true, emailRedirectTo: redirectTo } }); magicButton.disabled = false;
  if (error) message(loginNotice, error.message, "error"); else message(loginNotice, "Magic link sudah dikirim. Buka email ini lalu klik link-nya untuk masuk.", "success");
});
passwordForm.addEventListener("submit", async event => {
  event.preventDefault(); const fields = passwordForm.elements; const status = document.querySelector("[data-password-message]");
  if (fields.new_password.value !== fields.confirm_password.value) { status.textContent = "Password belum sama."; return; }
  if (fields.new_password.value.length < 6) { status.textContent = "Gunakan minimal 6 karakter."; return; }
  const { error } = await supabase.auth.updateUser({ password: fields.new_password.value });
  if (error) { status.textContent = error.message; return; } passwordForm.reset(); status.textContent = "Password tersimpan. Login berikutnya cukup pakai email dan password.";
});

postForm.elements.content_type.addEventListener("change", updateContentFields);
postForm.elements.status.addEventListener("change", updateScheduleField);
document.querySelector("[data-reset-form]").addEventListener("click", resetForm);
postsContainer.addEventListener("click", event => { const button = event.target.closest("[data-edit]"); if (button) editPost(button.dataset.edit); });
document.querySelector("[data-sign-out]").addEventListener("click", async () => { await supabase.auth.signOut(); location.reload(); });
document.querySelector("[data-delete-post]").addEventListener("click", async () => {
  if (!postForm.elements.post_id.value || !confirm("Hapus konten ini? Aksi ini tidak bisa dibatalkan.")) return;
  const { error } = await supabase.from("posts").delete().eq("id", postForm.elements.post_id.value);
  if (error) { formMessage.textContent = error.message; return; } resetForm(); await loadPosts();
});

postForm.addEventListener("submit", async event => {
  event.preventDefault(); const saveButton = document.querySelector("[data-save-button]"); saveButton.disabled = true; formMessage.textContent = "Mengoptimalkan gambar…";
  try {
    const form = new FormData(postForm); const existing = posts.find(post => post.id === form.get("post_id")); const contentType = form.get("content_type");
    const rawSlides = [...postForm.elements.carousel_images.files].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    if (rawSlides.length > 12) throw new Error("Maksimal 12 slide untuk satu carousel.");
    const [coverResult, avatarResult, slideResults] = await Promise.all([
      compressImage(form.get("cover_image"), IMAGE_PRESETS.cover), compressImage(form.get("author_avatar"), IMAGE_PRESETS.avatar),
      Promise.all(rawSlides.map(file => compressImage(file, IMAGE_PRESETS.slide)))
    ]);
    formMessage.textContent = "Mengunggah konten…";
    const uploadedSlides = await Promise.all(slideResults.map(result => uploadFile(result.file, "carousels")));
    const coverPath = await uploadFile(coverResult.file, "covers") || existing?.cover_image_path || (contentType === "carousel" ? uploadedSlides[0] : null) || null;
    const avatarPath = await uploadFile(avatarResult.file, "avatars") || existing?.author_avatar_path || null;
    const pdfPath = await uploadFile(form.get("pdf_file"), "pdfs") || existing?.pdf_path || null;
    const status = form.get("status");
    let externalUrl = null;
    if (contentType === "external") {
      const parsedUrl = new URL(form.get("external_url").trim());
      if (!/^https?:$/.test(parsedUrl.protocol)) throw new Error("URL sumber harus menggunakan http atau https."); externalUrl = parsedUrl.href;
    }
    const record = {
      kind: form.get("kind"), format: contentType === "pdf" ? "pdf" : "article", content_type: contentType,
      title: form.get("title").trim(), excerpt: form.get("excerpt").trim(), body: contentType === "article" ? form.get("body").trim() : null,
      category: form.get("category").trim(), reading_minutes: Number(form.get("reading_minutes")),
      author_name: form.get("author_name").trim(), author_role: form.get("author_role").trim(), author_avatar_path: avatarPath,
      cover_image_path: coverPath, pdf_path: pdfPath, external_url: externalUrl,
      source_name: contentType === "external" ? form.get("source_name").trim() : null,
      source_date: contentType === "external" && form.get("source_date") ? form.get("source_date") : null,
      award_year: contentType === "external" && form.get("award_year") ? Number(form.get("award_year")) : null,
      rank_label: contentType === "external" ? form.get("rank_label").trim() || null : null,
      status, is_featured: form.get("is_featured") === "on",
      scheduled_at: status === "scheduled" ? new Date(form.get("scheduled_at")).toISOString() : null,
      published_at: status === "published" ? (existing?.published_at || new Date().toISOString()) : null
    };
    if (!record.title || !record.excerpt || !record.category || !record.author_name || !record.author_role) throw new Error("Lengkapi semua kolom wajib.");
    if (contentType === "article" && !record.body) throw new Error("Isi artikel wajib diisi.");
    if (contentType === "pdf" && !record.pdf_path) throw new Error("Unggah file PDF untuk format ini.");
    if (contentType === "external" && (!record.external_url || !record.source_name)) throw new Error("Nama dan URL sumber wajib diisi.");
    if (contentType === "carousel" && !uploadedSlides.length && !existing?.post_media?.length) throw new Error("Unggah minimal satu gambar slide.");
    if (status === "scheduled" && !form.get("scheduled_at")) throw new Error("Pilih tanggal dan waktu tayang.");
    let savedPost;
    if (existing) {
      const { data, error } = await supabase.from("posts").update(record).eq("id", existing.id).select().single(); if (error) throw error; savedPost = data;
    } else {
      record.slug = `${slugify(record.title)}-${Date.now().toString().slice(-6)}`;
      const { data, error } = await supabase.from("posts").insert(record).select().single(); if (error) throw error; savedPost = data;
    }
    if (contentType === "carousel" && uploadedSlides.length) {
      if (existing?.post_media?.length) { const { error } = await supabase.from("post_media").delete().eq("post_id", savedPost.id); if (error) throw error; }
      const altLines = form.get("carousel_alt_text").split("\n").map(line => line.trim());
      const mediaRows = uploadedSlides.map((storagePath, index) => ({ post_id: savedPost.id, storage_path: storagePath, alt_text: altLines[index] || `${record.title} — slide ${index + 1}`, sort_order: index }));
      const { error } = await supabase.from("post_media").insert(mediaRows); if (error) throw error;
    }
    const compressionSummary = [coverResult.summary, avatarResult.summary, ...slideResults.map(result => result.summary)].filter(Boolean).join(" ");
    const successMessage = `${existing ? "Perubahan konten tersimpan." : "Konten tersimpan."}${compressionSummary ? ` ${compressionSummary}` : ""}`;
    resetForm(); formMessage.textContent = successMessage; await loadPosts();
  } catch (error) { formMessage.textContent = error.message || "Konten gagal disimpan."; }
  finally { saveButton.disabled = false; }
});

const { data: { user } } = await supabase.auth.getUser();
if (user) await showAdmin(user);
