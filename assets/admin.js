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
const scheduleField = document.querySelector("[data-schedule-field]");
let posts = [];

function message(element, text, kind = "") { element.textContent = text; element.className = `notice show ${kind}`; }
function slugify(value) { return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 90); }
function isAdminError(error) { return error?.code === "PGRST116" || /permission|row-level|policy/i.test(error?.message || ""); }
function filePath(file, prefix) { return `${prefix}/${crypto.randomUUID()}-${file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-")}`; }

function updateFormatFields() {
  const fields = postForm.elements;
  const isPdf = fields.format.value === "pdf";
  bodyField.hidden = isPdf;
  pdfField.hidden = !isPdf;
  fields.body.required = !isPdf;
  fields.pdf_file.required = isPdf && !postForm.dataset.existingPdf;
}
function updateScheduleField() { const fields = postForm.elements; scheduleField.hidden = fields.status.value !== "scheduled"; fields.scheduled_at.required = fields.status.value === "scheduled"; }
function resetForm() {
  postForm.reset(); postForm.elements.post_id.value = ""; postForm.elements.reading_minutes.value = 5; postForm.dataset.existingPdf = "";
  formTitle.textContent = "Buat konten baru"; document.querySelector("[data-save-button]").textContent = "Simpan konten"; deleteZone.hidden = true; formMessage.textContent = ""; updateFormatFields(); updateScheduleField();
}
async function uploadFile(file, prefix) {
  if (!file) return null;
  const path = filePath(file, prefix);
  const { error } = await supabase.storage.from("content-assets").upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw error;
  return path;
}
function renderPosts() {
  if (!posts.length) { postsContainer.innerHTML = '<p class="empty">Belum ada konten. Buat yang pertama di panel kanan.</p>'; return; }
  postsContainer.innerHTML = posts.map(post => `<article class="post-row"><div><h3>${escapeHtml(post.title)}</h3><p>${escapeHtml(post.category)} · ${post.format === "pdf" ? "PDF" : "Artikel"} · ${post.reading_minutes} menit</p><span class="badge">${post.status}</span></div><button class="button button-secondary button-small" type="button" data-edit="${post.id}">Edit</button></article>`).join("");
}
function escapeHtml(text = "") { const el = document.createElement("span"); el.textContent = text; return el.innerHTML; }
async function loadPosts() {
  const { data, error } = await supabase.from("posts").select("*").order("updated_at", { ascending: false });
  if (error) throw error;
  posts = data; renderPosts();
}
function editPost(id) {
  const post = posts.find(item => item.id === id); if (!post) return;
  const fields = postForm.elements;
  fields.post_id.value = post.id;
  fields.kind.value = post.kind;
  fields.format.value = post.format;
  fields.title.value = post.title || "";
  fields.excerpt.value = post.excerpt || "";
  fields.body.value = post.body || "";
  fields.category.value = post.category || "";
  fields.reading_minutes.value = post.reading_minutes || 5;
  fields.author_name.value = post.author_name || "";
  fields.author_role.value = post.author_role || "";
  fields.status.value = post.status;
  fields.author_avatar.value = "";
  fields.cover_image.value = "";
  fields.pdf_file.value = "";
  postForm.elements.is_featured.checked = post.is_featured;
  postForm.dataset.existingPdf = post.pdf_path || "";
  if (post.scheduled_at) postForm.elements.scheduled_at.value = post.scheduled_at.slice(0, 16);
  formTitle.textContent = "Edit konten"; document.querySelector("[data-save-button]").textContent = "Simpan perubahan"; deleteZone.hidden = false; updateFormatFields(); updateScheduleField(); postForm.closest(".panel").scrollIntoView({ block: "start", behavior: "smooth" });
}
async function showAdmin(user) {
  const { data: role, error } = await supabase.from("content_admins").select("role").eq("user_id", user.id).maybeSingle();
  if (error || !role) { await supabase.auth.signOut(); message(loginNotice, "Email ini belum diberi akses admin.", "error"); return; }
  loginView.hidden = true; adminApp.hidden = false;
  document.querySelector("[data-admin-user]").textContent = `${user.email} · ${role.role}`;
  try { await loadPosts(); } catch (loadError) { postsContainer.innerHTML = `<p class="empty">Konten belum bisa dimuat: ${escapeHtml(loadError.message)}</p>`; }
}

loginForm.addEventListener("submit", async event => {
  event.preventDefault(); const button = loginForm.querySelector("button[type=submit]"); button.disabled = true;
  const email = loginForm.elements.email.value.trim().toLowerCase();
  const password = loginForm.elements.password.value;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  button.disabled = false;
  if (error) message(loginNotice, "Email atau password tidak cocok. Untuk login pertama, gunakan magic link di bawah.", "error");
  else await showAdmin(data.user);
});
magicButton.addEventListener("click", async () => {
  magicButton.disabled = true;
  const email = loginForm.elements.email.value.trim().toLowerCase();
  if (!email) { magicButton.disabled = false; message(loginNotice, "Masukkan email terlebih dahulu.", "error"); return; }
  const redirectTo = new URL("admin.html", window.location.href).href;
  const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true, emailRedirectTo: redirectTo } });
  magicButton.disabled = false;
  if (error) message(loginNotice, error.message, "error"); else message(loginNotice, "Magic link sudah dikirim. Buka email ini lalu klik link-nya untuk masuk.", "success");
});
passwordForm.addEventListener("submit", async event => {
  event.preventDefault();
  const fields = passwordForm.elements;
  const status = document.querySelector("[data-password-message]");
  if (fields.new_password.value !== fields.confirm_password.value) { status.textContent = "Password belum sama."; return; }
  if (fields.new_password.value.length < 6) { status.textContent = "Gunakan minimal 6 karakter."; return; }
  const { error } = await supabase.auth.updateUser({ password: fields.new_password.value });
  if (error) { status.textContent = error.message; return; }
  passwordForm.reset(); status.textContent = "Password tersimpan. Login berikutnya cukup pakai email dan password.";
});
postForm.elements.format.addEventListener("change", updateFormatFields);
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
  event.preventDefault(); const saveButton = document.querySelector("[data-save-button]"); saveButton.disabled = true; formMessage.textContent = "Menyimpan…";
  try {
    const form = new FormData(postForm); const existing = posts.find(post => post.id === form.get("post_id"));
    const coverPath = await uploadFile(form.get("cover_image"), "covers") || existing?.cover_image_path || null;
    const avatarPath = await uploadFile(form.get("author_avatar"), "avatars") || existing?.author_avatar_path || null;
    const pdfPath = await uploadFile(form.get("pdf_file"), "pdfs") || existing?.pdf_path || null;
    const status = form.get("status");
    const record = { kind:form.get("kind"), format:form.get("format"), title:form.get("title").trim(), excerpt:form.get("excerpt").trim(), body:form.get("format") === "article" ? form.get("body").trim() : null, category:form.get("category").trim(), reading_minutes:Number(form.get("reading_minutes")), author_name:form.get("author_name").trim(), author_role:form.get("author_role").trim(), author_avatar_path:avatarPath, cover_image_path:coverPath, pdf_path:pdfPath, status, is_featured:form.get("is_featured") === "on", scheduled_at:status === "scheduled" ? new Date(form.get("scheduled_at")).toISOString() : null, published_at:status === "published" ? (existing?.published_at || new Date().toISOString()) : null };
    if (!record.title || !record.excerpt || !record.category || !record.author_name || !record.author_role) throw new Error("Lengkapi semua kolom wajib.");
    if (record.format === "article" && !record.body) throw new Error("Isi artikel wajib diisi.");
    if (record.format === "pdf" && !record.pdf_path) throw new Error("Unggah file PDF untuk format ini.");
    if (status === "scheduled" && !form.get("scheduled_at")) throw new Error("Pilih tanggal dan waktu tayang.");
    if (existing) { const { error } = await supabase.from("posts").update(record).eq("id", existing.id); if (error) throw error; }
    else { record.slug = `${slugify(record.title)}-${Date.now().toString().slice(-6)}`; const { error } = await supabase.from("posts").insert(record); if (error) throw error; }
    formMessage.textContent = existing ? "Perubahan konten tersimpan." : "Konten tersimpan."; resetForm(); await loadPosts();
  } catch (error) { formMessage.textContent = error.message || "Konten gagal disimpan."; }
  finally { saveButton.disabled = false; }
});

const { data: { user } } = await supabase.auth.getUser();
if (user) await showAdmin(user);
