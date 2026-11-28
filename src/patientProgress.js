const SECTION_KEYS = {
  "Beschwerden und Alltag": ["complaints", "duration", "activity", "history", "pain"],
  "Fußbefund": ["footShape", "Rechtsarch", "Linksarch", "Rechtshindfoot", "Linkshindfoot", "Rechtsforefoot", "Linksforefoot", "Rechtstoes", "Linkstoes", "Rechtsmotion", "Linksmotion"],
  "Statik und Haltung": ["Rechtsstand", "Linksstand", "Rechtsknee", "Linksknee", "pelvis", "weight", "staticNotes", "imageNotes", "axis", "RechtsstandDetail", "LinksstandDetail", "RechtskneeDetail", "LinkskneeDetail"],
  "Gang und Bewegung": ["gaitNotes", "strideRhythm", "rhythm", "symmetry", "gaitDistance", "gaitDistanceStatus", "widthStep", "trunkArms", "movementPatterns", "videoNotes", "rollRight", "rollLeft", "rotationRight", "rotationLeft", "RechtsgaitDetail", "LinksgaitDetail"],
  "Auswertung und Bericht": ["assessment", "recommendations", "summary", "doctorDiagnosis", "doctorNotes"]
};

const FOOT_VIEW = /(?:fuß|foot|sole|plantar|abdruck|rückfuß|vorfuß|zehen|heel|forefoot|footprint|instep|dorsal|seitenansicht)/i;
const STATIC_VIEW = /(?:statik|stand|frontal|hinten|alignment|achsen|posterior|anterior)/i;

function hasText(value) {
  return typeof value === "string" ? value.trim().length > 0 : value != null && String(value).trim().length > 0;
}

function indexedImageData(data, images) {
  const indexes = new Set(images.map((_, index) => index));
  for (const key of Object.keys(data)) {
    const match = key.match(/^imageFile(?:View|Note|Side)(\d+)$/);
    if (match) indexes.add(Number(match[1]));
  }
  return [...indexes].map(index => ({
    view: String(data["imageFileView" + index] || images[index]?.name || images[index]?.view || ""),
    note: String(data["imageFileNote" + index] || "")
  }));
}

function hasVideoDocumentation(data, videos) {
  if (videos.length > 0) return true;
  return Object.keys(data).some(key => /^videoFile(?:View|Note)\d+$/.test(key) && hasText(data[key]));
}

export function hasPatientProgressData(section, data = {}, images = [], videos = []) {
  const values = data && typeof data === "object" ? data : {};
  const keys = SECTION_KEYS[section] || [];
  if (keys.some(key => hasText(values[key]))) return true;

  if (section === "Fußbefund") {
    return indexedImageData(values, images).some(item => FOOT_VIEW.test(item.view) && (hasText(item.view) || hasText(item.note)));
  }
  if (section === "Statik und Haltung") {
    return indexedImageData(values, images).some(item => STATIC_VIEW.test(item.view) && (hasText(item.view) || hasText(item.note)));
  }
  if (section === "Gang und Bewegung") return hasVideoDocumentation(values, videos);
  return false;
}
