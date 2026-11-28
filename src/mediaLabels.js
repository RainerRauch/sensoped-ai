export function guessVideoView(name) {
  const normalized = String(name || "")
    .toLowerCase()
    .replace(/[ä]/g, "ae")
    .replace(/[ö]/g, "oe")
    .replace(/[ü]/g, "ue");
  if (/frontal|front|vorne|anterior/.test(normalized)) return "Gang frontal";
  if (/hinten|rear|posterior/.test(normalized)) return "Gang von hinten";
  if (/seitlich|seite|side|lateral|profil|sagittal/.test(normalized)) return "Gang seitlich";
  if (/schraeg|diagonal/.test(normalized)) return "Gang schräg";
  return "";
}
