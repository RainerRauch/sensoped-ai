export function guessVideoView(name) {
  const normalized = String(name || "")
    .toLowerCase()
    .replace(/ß/g, "ss")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ");
  if (/frontal|front|vorne|anterior/.test(normalized)) return "Gang frontal";
  if (/hinteransicht|von hinten|hinten|rear|posterior|back(?:\s*view)?|rueck(?:ansicht)?/.test(normalized)) return "Gang von hinten";
  if (/seitlich|seite|side|lateral|profil|sagittal/.test(normalized)) return "Gang seitlich";
  if (/schraeg|diagonal|oblique/.test(normalized)) return "Gang schräg";
  return "";
}
