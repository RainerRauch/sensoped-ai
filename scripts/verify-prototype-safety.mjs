import { readFileSync } from "node:fs";
const source = readFileSync("src/App.jsx", "utf8");
const checks = [
  ["photo helper exists", /function addImageFiles\(e\)/],
  ["video helper exists", /function addVideoFiles\(e\)/],
  ["photo count limit", /count>=6/],
  ["photo aggregate limit", /total\+file\.size>30\*1024\*1024/],
  ["video count limit", /count>=3/],
  ["video aggregate limit", /total\+file\.size>150\*1024\*1024/],
  ["individual photo limit", /file\.size>10\*1024\*1024/],
  ["individual video limit", /file\.size>100\*1024\*1024/],
  ["media gate still present", /disabled=\{!mediaUseConfirmed\}/],
  ["patient approval resets on edits", /setPatientViewApproved\(false\);\},\[current,data,imageFiles,videoFiles\]/],
  ["report values HTML-escaped", /String\(value\)\.replace\(/],
  ["media not persisted in session draft", /imageFiles:\[\],videoFiles:\[\]/],
  ["report export reads images asynchronously", /async function exportReport\(\)\{try\{const imageData=await Promise\.all\(imageFiles\.map/],
  ["saved image notes retained without media", /imageFiles\.length===0&&\/\^imageFileNote\\d\+\$\/.test\(k\)/],
  ["saved video notes retained without media", /videoFiles\.length===0&&\/\^videoFileNote\\d\+\$\/.test\(k\)/],
  ["video notes use readable labels", /Videodokumentation – Video/],
  ["demo reset confirms before deletion", /function resetDemoSession\(\)\{if\(!window\.confirm\(/],
  ["demo reset clears saved records and draft", /function resetDemoSession\(\)[\s\S]*?sessionStorage\.removeItem\(\x27sensoped_demo_patients\x27\)[\s\S]*?sessionStorage\.removeItem\(\x27sensoped_exam_draft\x27\)/],
  ["demo reset revokes temporary media URLs", /function resetDemoSession\(\)[\s\S]*?imageFiles\.forEach\(f=>\{if\(f\.url\)URL\.revokeObjectURL\(f\.url\)\}\)[\s\S]*?videoFiles\.forEach\(f=>\{if\(f\.url\)URL\.revokeObjectURL\(f\.url\)\}\)/],
  ["privacy page exposes reset action", /onClick=\{resetDemoSession\}[^>]*>Demo-Sitzung vollständig zurücksetzen/],
  ["empty patient list removes session record", /if\(patients\.length\)\{sessionStorage\.setItem\(\x27sensoped_demo_patients\x27,JSON\.stringify\(patients\)\)\}else\{sessionStorage\.removeItem\(\x27sensoped_demo_patients\x27\)\}/],

];
const failures = [];
for (const [name, pattern] of checks) {
  if (!pattern.test(source)) failures.push(name);
}
if (failures.length) {
  console.error("Prototype safety smoke checks failed:", failures.join(", "));
  process.exit(1);
}
console.log("Prototype safety smoke checks passed:", checks.length);
