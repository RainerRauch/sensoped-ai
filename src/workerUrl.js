const ROUTES = new Set(["health", "interpret", "image", "transcribe"]);

export function resolveWorkerUrl(value, route) {
  if (!ROUTES.has(route)) throw new Error("Unbekannte Worker-Funktion.");
  const raw = String(value ?? "").trim();
  if (!raw) throw new Error("Bitte Worker-Adresse eintragen.");

  let base;
  try {
    base = new URL(raw);
  } catch {
    throw new Error("Bitte eine gültige Worker-Adresse eingeben.");
  }

  if (base.username || base.password) {
    throw new Error("Worker-Adresse darf keine eingebetteten Zugangsdaten enthalten.");
  }
  if (base.protocol !== "https:" && !(base.protocol === "http:" && ["localhost", "127.0.0.1"].includes(base.hostname))) {
    throw new Error("Worker-Adresse muss HTTPS verwenden (HTTP nur lokal).");
  }

  const basePath = base.pathname.replace(/\/(?:health|interpret|image|transcribe)\/?$/i, "").replace(/\/+$/, "");
  base.search = "";
  base.hash = "";
  base.pathname = basePath + "/" + route;
  return base.toString();
}
