/* ============ Utilidades ============ */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ============ Año footer ============ */
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============ Menú mobile ============ */
const navToggle = $("#navToggle");
const navMenu = $("#navMenu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Cerrar menú al clickear un link
  $$("#navMenu a").forEach(a => {
    a.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ============ Selector de planes -> pre-llenar contacto ============ */
const planButtons = $$(".js-select-plan");
const topicSelect = $("#topic");

planButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const plan = btn.dataset.plan || "Pro";
    if (topicSelect) {
      // Si el usuario ya eligió algo, lo respetamos
      if (!topicSelect.value) topicSelect.value = "Mantenimiento mensual";
    }
    // Scroll suave al contacto
    document.querySelector("#contacto")?.scrollIntoView({ behavior: "smooth" });

    // Feedback liviano
    const status = $("#formStatus");
    if (status) status.textContent = `Seleccionaste el plan ${plan}. Contame cuántos equipos tenés y listo.`;
  });
});

/* ============ Calculadora demo ============ */
const calcForm = $("#calcForm");
const calcDevices = $("#calcDevices");
const calcUrgencies = $("#calcUrgencies");
const calcPlan = $("#calcPlan");
const calcOutput = $("#calcOutput");

function basePrice(plan) {
  switch (plan) {
    case "Base": return 49;
    case "Pro": return 89;
    case "Empresa": return 149;
    default: return 89;
  }
}

function calculate() {
  const devices = Math.max(1, Number(calcDevices?.value || 1));
  const urg = Math.max(0, Number(calcUrgencies?.value || 0));
  const plan = String(calcPlan?.value || "Pro");

  // Fórmula simple (demo):
  // base + (equipos extra * 7) + (urgencias * 18)
  const base = basePrice(plan);
  const extraDevices = Math.max(0, devices - 3);
  const total = base + (extraDevices * 7) + (urg * 18);

  if (calcOutput) calcOutput.textContent = `$${total}/mes`;
}

if (calcForm) {
  calcForm.addEventListener("submit", (e) => {
    e.preventDefault();
    calculate();
  });
  ["input", "change"].forEach(evt => {
    calcDevices?.addEventListener(evt, calculate);
    calcUrgencies?.addEventListener(evt, calculate);
    calcPlan?.addEventListener(evt, calculate);
  });
  calculate();
}

/* ============ Copiar email ============ */
const copyEmailBtn = $("#copyEmail");
const copyHint = $("#copyHint");

if (copyEmailBtn) {
  copyEmailBtn.addEventListener("click", async () => {
    const email = copyEmailBtn.dataset.copy || "hola@nexoit.demo";
    try {
      await navigator.clipboard.writeText(email);
      if (copyHint) copyHint.textContent = "Copiado ✔";
      setTimeout(() => { if (copyHint) copyHint.textContent = "Click para copiar"; }, 1400);
    } catch {
      if (copyHint) copyHint.textContent = "No se pudo copiar";
      setTimeout(() => { if (copyHint) copyHint.textContent = "Click para copiar"; }, 1400);
    }
  });
}

/* ============ Form demo -> genera mensaje para WhatsApp/mail ============ */
const form = $("#contactForm");
const formStatus = $("#formStatus");
const whatsappBtn = $("#whatsappBtn");

function buildMessage() {
  const name = ($("#name")?.value || "").trim();
  const email = ($("#email")?.value || "").trim();
  const topic = ($("#topic")?.value || "").trim();
  const message = ($("#message")?.value || "").trim();

  return `Hola, soy ${name}.
Mi email: ${email}
Tema: ${topic}

Mensaje:
${message}`.trim();
}

function setWhatsAppLink(text) {
  // Número demo; cambiá por uno real si querés.
  const phone = "59800000000"; // Uruguay (demo)
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  if (whatsappBtn) whatsappBtn.href = url;
}

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Validación mínima
    if (!$("#name")?.value || !$("#email")?.value || !$("#topic")?.value || !$("#message")?.value) {
      if (formStatus) formStatus.textContent = "Completá todos los campos.";
      return;
    }

    const text = buildMessage();
    setWhatsAppLink(text);

    if (formStatus) {
      formStatus.textContent = "Listo. Se generó el mensaje (demo). Podés abrir WhatsApp o copiar el texto.";
    }

    // Intento copiar al portapapeles (no siempre permitido)
    navigator.clipboard?.writeText(text).catch(() => {});
  });

  // Actualiza el link mientras escribe
  ["input", "change"].forEach(evt => {
    form.addEventListener(evt, () => setWhatsAppLink(buildMessage()));
  });
  setWhatsAppLink(buildMessage());
}
