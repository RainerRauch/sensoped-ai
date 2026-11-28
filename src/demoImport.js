const isRecord = value => value !== null && typeof value === "object" && !Array.isArray(value);

const isScalar = value =>
  value === null ||
  typeof value === "boolean" ||
  (typeof value === "number" && Number.isFinite(value)) ||
  typeof value === "string";

function validateObjectFields(value, maxFields, maxTextLength, label) {
  if (!isRecord(value)) throw new Error(label + " muss ein Objekt sein.");
  const entries = Object.entries(value);
  if (entries.length > maxFields) throw new Error(label + " enthält zu viele Felder.");
  for (const [key, fieldValue] of entries) {
    if (key.length > 120) throw new Error(label + " enthält einen zu langen Feldnamen.");
    if (!isScalar(fieldValue)) throw new Error(label + " darf nur einfache Text- oder Zahlenwerte enthalten.");
    if (typeof fieldValue === "string" && fieldValue.length > maxTextLength) {
      throw new Error(label + " enthält einen zu langen Text.");
    }
  }
  return Object.fromEntries(entries);
}

function validateMedia(media) {
  if (media == null) return { images: [], videos: [] };
  if (!isRecord(media)) throw new Error("Medienangaben müssen ein Objekt sein.");
  const images = media.images ?? [];
  const videos = media.videos ?? [];
  if (!Array.isArray(images) || images.length > 6 || images.some(name => typeof name !== "string" || name.length > 255)) {
    throw new Error("Bildliste ungültig (maximal 6 Dateinamen).");
  }
  if (!Array.isArray(videos) || videos.length > 3 || videos.some(name => typeof name !== "string" || name.length > 255)) {
    throw new Error("Videoliste ungültig (maximal 3 Dateinamen).");
  }
  return { images: [...images], videos: [...videos] };
}

function validateRecord(record) {
  if (!isRecord(record)) throw new Error("Eine Akte ist kein gültiges Objekt.");
  const id = record.id;
  if (!((typeof id === "string" && id.trim().length > 0 && id.length <= 100) ||
        (typeof id === "number" && Number.isFinite(id)))) {
    throw new Error("Eine Akte besitzt keine gültige ID.");
  }
  const patient = validateObjectFields(record.patient, 40, 5000, "Patientendaten");
  if (typeof patient.name !== "string" || !patient.name.trim() || patient.name.length > 150) {
    throw new Error("Patientenname fehlt oder ist ungültig.");
  }
  const data = validateObjectFields(record.data, 300, 5000, "Befunddaten");
  const media = validateMedia(record.media);
  for (const key of ["date", "createdAt"]) {
    if (record[key] != null && (typeof record[key] !== "string" || record[key].length > 100)) {
      throw new Error("Datumsangabe ungültig.");
    }
  }
  return {
    id,
    createdAt: typeof record.createdAt === "string" ? record.createdAt : "",
    patient,
    data,
    media,
    date: typeof record.date === "string" ? record.date : ""
  };
}

export function validateDemoImport(payload, existingRecords = []) {
  if (!isRecord(payload) || !Array.isArray(payload.records)) {
    throw new Error("Ungültige SENSOPED-Aktenstruktur.");
  }
  if (!Array.isArray(existingRecords)) throw new Error("Vorhandene Demo-Akten müssen eine Liste sein.");
  if (payload.records.length > 100) throw new Error("Maximal 100 Akten pro Import.");
  const validated = payload.records.map(validateRecord);
  const existingIds = new Set(existingRecords.map(record => String(record?.id)));
  const seenIds = new Set();
  const additions = validated.filter(record => {
    const key = String(record.id);
    if (existingIds.has(key) || seenIds.has(key)) return false;
    seenIds.add(key);
    return true;
  });
  const availableSlots = Math.max(0, 100 - existingRecords.length);
  if (additions.length > availableSlots) {
    throw new Error("Maximal 100 Demo-Akten pro Sitzung. Bitte zuerst alte Demo-Akten löschen.");
  }
  return additions;
}
