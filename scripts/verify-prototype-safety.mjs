import { readFileSync } from "node:fs";
const source = readFileSync("src/App.jsx", "utf8");
const workerSource = readFileSync("worker.js", "utf8");
const styleSource = readFileSync("src/style.css", "utf8");
const checks = [
  ["photo helper exists", /function addImageFiles\(e\)/],
  ["video helper exists", /function addVideoFiles\(e\)/],
  ["photo count limit", /count>=6/],
  ["photo aggregate limit", /total\+file\.size>30\*1024\*1024/],
  ["video count limit", /count>=3/],
  ["video aggregate limit", /total\+file\.size>150\*1024\*1024/],
  ["individual photo limit", /file\.size>10\*1024\*1024/],
  ["image uploads use analysis-compatible formats", /if\(!\['image\/png','image\/jpeg','image\/webp'\]\.includes\(file\.type\)\)/],
  ["image file pickers restrict accepted formats", source.split('accept="image/png,image/jpeg,image/webp"').length-1===2],
  ["individual video limit", /file\.size>100\*1024\*1024/],
  ["media gate still present", /disabled=\{!mediaUseConfirmed\}/],
  ["patient approval resets on edits", source.includes("setPatientViewApproved(false);setAiBusy(false);},[current,data,imageFiles,videoFiles,mediaUseConfirmed])")],
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
  ["reset clears patient search", /function resetDemoSession\(\)[\s\S]*?setPatientSearch\(''\)/],
  ["AI image analysis uses request generation token", source.includes("const aiRequestId=useRef(0)")],
  ["AI image analysis stores an abort controller", source.includes("aiAbortController.current=controller")],
  ["AI requests abort on stale exam edits", source.includes("if(aiAbortController.current){aiAbortController.current.abort();aiAbortController.current=null;}")],
  ["image endpoint normalizes /image and /interpret suffixes", source.includes("replace(/(?:interpret|image)\\/?$/,'')")],
  ["image request checks token after file read", source.includes("if(requestId!==aiRequestId.current)return;const endpoint=")],
  ["AI image results ignore stale request", source.includes("if(requestId!==aiRequestId.current)return;update('imageFileNote'+index,note)")],
  ["AI image request final state guarded", source.includes("if(requestId===aiRequestId.current)setAiBusy(false)")],
  ["AI requests invalidated on edits or consent change", source.includes("[current,data,imageFiles,videoFiles,mediaUseConfirmed])")],
  ["image analysis requires media confirmation", /async function analyzeImage\(file,index\)\{if\(!mediaUseConfirmed\)/],
  ["saving exams with media requires confirmation", /function save\(\)[\s\S]*?if\(\(imageFiles\.length\|\|videoFiles\.length\)\&\&!mediaUseConfirmed\)/],

  ["openRecord restores saved media filenames as placeholders", source.includes("setImageFiles((r.media?.images||[]).map(name=>({name,url:null,file:null,saved:true})))") && source.includes("setVideoFiles((r.media?.videos||[]).map(name=>({name,url:null,size:0,saved:true})))")],
  ["reopened patient view explains unavailable original media", source.includes("Originalbild nicht in der Demo-Sitzung gespeichert. Datei: {f.name}") && source.includes("Originalvideo nicht in der Demo-Sitzung gespeichert. Datei: {f.name}")],
  ["report export avoids blank image sources for saved media", source.includes("imageData[i]?'<img src=\"'+imageData[i]+'\"") && source.includes("Originalbild nicht in der Demo-Sitzung gespeichert.")],
  ["opening saved records resets media and patient-view approvals", source.includes("setMediaUseConfirmed(false);setPatientViewApproved(false);setStep(0);setPage('Untersuchung');setMsg('Gespeicherte Mediennamen wiederhergestellt.")],
  ["report export has a single async declaration", /\}async function exportReport\(\)\{try\{const imageData=await Promise\.all\(/],
  ["patient name label linked", /<label htmlFor="patient-name">Patient \/ Name<\/label><input id="patient-name"/],
  ["patient birth label linked", /<label htmlFor="patient-birth">Geburtsdatum<\/label><input id="patient-birth"/],
  ["patient MPG label linked", /<label htmlFor="patient-mpg">MPG-Nummer<\/label><input id="patient-mpg"/],
  ["patient street label linked", /<label htmlFor="patient-street">Straße und Hausnummer<\/label><input id="patient-street"/],
  ["patient postal label linked", /<label htmlFor="patient-zip">PLZ<\/label><input id="patient-zip"/],
  ["patient city label linked", /<label htmlFor="patient-city">Ort<\/label><input id="patient-city"/],
  ["patient phone label linked", /<label htmlFor="patient-phone">Telefon \(optional\)<\/label><input id="patient-phone"/],
  ["patient notes label linked", /<label htmlFor="patient-notes">Notiz \/ Anamnese kurz<\/label><textarea id="patient-notes"/],
  ["filename sanitizer uses a single Unicode combining-mark escape", source.includes("normalize('NFKD').replace(/[\\u0300-\\u036f]/g,'')")],
  ["worker image data URL validation uses a properly escaped slash", workerSource.includes("!/^data:image\\/(png|jpeg|webp);base64,/i.test(image)")],
  ["prototype status messages use polite live announcements", source.includes('role="status" aria-live="polite" aria-atomic="true"')],
  ["patient view displays per-image observation notes", source.includes("<b>Dokumentierte Beobachtung:</b> {data[\'imageFileNote\'+i]}")],
  ["patient view displays per-video observation notes", source.includes("<b>Dokumentierte Beobachtung:</b> {data[\'videoFileNote\'+i]}")],
  ["keyboard focus styling is defined", styleSource.includes(":focus-visible")],
  ["demo session uses an eight-hour expiry", source.includes("const DEMO_SESSION_TTL=8*60*60*1000")],
  ["legacy demo records without expiry are cleared", /function ensureDemoSession\(\)[\s\S]*?if\(!expiry\)\{if\(sessionStorage\.getItem\(\x27sensoped_demo_patients\x27\)\|\|sessionStorage\.getItem\(\x27sensoped_exam_draft\x27\)\)\{[\s\S]*?sessionStorage\.removeItem\(\x27sensoped_demo_patients\x27\)/],
  ["expired demo session removes records, draft and expiry", /function ensureDemoSession\(\)[\s\S]*?if\(Date\.now\(\)>=expiry\)\{[\s\S]*?sessionStorage\.removeItem\(\x27sensoped_demo_expiry\x27\)/],
  ["active demo expiry clears data and media on deadline", /useEffect\(\(\)=>\{if\(!demoExpiry\)return;let expired=false;const expire=\(\)=>\{[\s\S]*?setDemoExpiry\(0\);setMsg\(\x27Demo-Sitzung nach 8 Stunden automatisch gelöscht/],
  ["demo expiry rechecks on tab focus", source.includes("window.addEventListener('focus',checkExpiry)")],
  ["demo expiry rechecks on visibility return", source.includes("document.addEventListener('visibilitychange',checkExpiry)")],
  ["demo expiry listeners are removed on cleanup", source.includes("window.removeEventListener('focus',checkExpiry)") && source.includes("document.removeEventListener('visibilitychange',checkExpiry)")],
  ["manual privacy reset clears expiry", /function resetDemoSession\(\)[\s\S]*?sessionStorage\.removeItem\(\x27sensoped_demo_expiry\x27\)[\s\S]*?setDemoExpiry\(0\)/],
  ["eight-hour expiry is disclosed in the UI", source.includes("Demo-Daten werden nach 8 Stunden automatisch aus dieser Sitzung gelöscht.")],
]
checks.push(["app text has no double-escaped line breaks", !source.includes("\\\\n")]);
checks.push(["save validates measured gait distance range and format", source.includes("const gaitDistanceRaw=String(data.gaitDistance??'').trim()") && source.includes("gaitDistanceValue<0.1||gaitDistanceValue>100")]);
checks.push(["entered gait distance requires measured status", source.includes("Bitte die eingetragene Gangstrecke vor Ort als gemessen bestätigen.")]);
checks.push(["10m measurement status must match numeric distance", source.includes("gaitDistanceValue!==10") && source.includes("gaitDistanceValue===10")]);
checks.push(["patient view does not invent an unmeasured 10m gait distance", source.includes("data.gaitDistance?data.gaitDistance+\' m\':data.gaitDistanceStatus===\'10 m vor Ort gemessen und markiert\'") && source.includes(":\'Nicht dokumentiert\'") && !source.includes("data.gaitDistance||\'10\'")]);
checks.push(["gait distance input has no assumed default", source.includes("value={data.gaitDistance??''}") && !source.includes("value={data.gaitDistance??'10'}")]);
const failures = [];
for (const [name, pattern] of checks) {
  const passed = typeof pattern === "boolean" ? pattern : pattern.test(source);
  if (!passed) failures.push(name);
}
if (failures.length) {
  console.error("Prototype safety smoke checks failed:", failures.join(", "));
  process.exit(1);
}
console.log("Prototype safety smoke checks passed:", checks.length);
