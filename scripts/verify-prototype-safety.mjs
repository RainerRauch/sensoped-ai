import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { validateDemoImport, normalizeStoredDemoPatients } from "../src/demoImport.js";
import { hasPatientProgressData } from "../src/patientProgress.js";
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
  ["report export reads images asynchronously", /async function exportReport\(\)[\s\S]*?const imageData=await Promise\.all\(imageFiles\.map/],
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
  ["image endpoint uses shared URL normalizer", source.includes("resolveWorkerUrl(aiEndpoint,\'image\')")],
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
  ["report export has a single async declaration", (source.match(/async function exportReport\(\)/g)||[]).length===1 && /async function exportReport\(\)[\s\S]*?const imageData=await Promise\.all\(/.test(source)],
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
checks.push(["gait-distance regex matches numeric digits", source.includes(String.raw`if(!/^\d+(?:[.,]\d+)?$/.test(gaitDistanceRaw)`)]);
checks.push(["patient view prominently states demo-only and unvalidated AI", source.includes('className="prototypeSafetyBanner"' ) && source.includes("keine klinisch validierte KI-Auswertung.")]);
checks.push(["exported report includes explicit demo-only warning", source.includes('class="prototypeSafetyBanner"') && source.includes("DEMO-ANWENDUNG – NICHT FÜR REALE PATIENTEN.")]);
checks.push(["demo import validation is integrated", source.includes("validateDemoImport(parsed,patients)") && source.includes("file.size>2*1024*1024")]);
checks.push(["demo import is available when patient list is empty", !source.includes("patients.length>0&&<label className=\"secondary\" style={{display:'inline-block',padding:10,borderRadius:8,cursor:'pointer'}}> <FileText size={16}/> Akten importieren")]);
checks.push(["stored patient records normalized on read", /function readDemoPatients\(\)[\s\S]*?normalizeStoredDemoPatients\(parsed\)/]);
checks.push(["corrupt stored patient list cleared", /function readDemoPatients\(\)[\s\S]*?sessionStorage\.removeItem\('sensoped_demo_patients'\)/]);

checks.push(["corrupt demo storage recovery is disclosed", source.includes("sensoped_demo_storage_recovery") && source.includes("Beschädigte Demo-Akten")]);

checks.push(["saving new demo records validates against the session-wide cap", source.includes("const validated=validateDemoImport({records:[record]},patients)")]);
checks.push(["saving new records preflights session storage before updating state", source.includes("sessionStorage.setItem('sensoped_demo_patients',JSON.stringify(nextPatients))") && source.includes("setPatients(nextPatients)")]);
checks.push(["demo imports preflight session storage before updating state", source.includes("const next=[...incoming,...patients];try{sessionStorage.setItem('sensoped_demo_patients',JSON.stringify(next))") && source.includes("setPatients(next);setMsg(incoming.length+' geprüfte Demo-Akten importiert.');")]);
const healthTestStart=source.indexOf("async function testAIConnection(){");
const healthTestEnd=source.indexOf("async function runAIInterpretation(){",healthTestStart);
const healthTestSource=source.slice(healthTestStart,healthTestEnd);
checks.push(["worker health check has an eight-second abort",healthTestStart>=0&&healthTestEnd>healthTestStart&&healthTestSource.includes("const controller=new AbortController();")&&healthTestSource.includes("setTimeout(()=>controller.abort(),8000)")&&healthTestSource.includes("clearTimeout(timeout)")]);
checks.push(["worker health check reports timeout clearly",healthTestSource.includes("e.name==='AbortError'?'Zeitüberschreitung nach 8 Sekunden.")]);
checks.push(["health endpoint uses shared URL normalizer",healthTestSource.includes("resolveWorkerUrl(aiEndpoint,\'health\')")]);
checks.push(["interpret endpoint uses shared URL normalizer",source.includes("resolveWorkerUrl(aiEndpoint,\'interpret\')")]);
checks.push(["patient report export requires explicit review", source.includes("async function exportReport(){if(reportMode==='patient'&&!patientViewApproved){setMsg('Bitte zuerst die Patientenansicht fachlich prüfen und freigeben.');return;}")]);
checks.push(["report step links to patient view when approval is missing", source.includes("Fachliche Prüfung erforderlich")&&source.includes("onClick={()=>setPage(\'Patientenansicht\')}")]);

checks.push(["patient view contains a data-only documentation overview", source.includes('className="patientProgress"') && source.includes("Dokumentationsübersicht") && source.includes("Diese Übersicht zeigt nur, ob Angaben vorhanden sind") && source.includes("Angaben vorhanden") && source.includes("Noch nicht dokumentiert")]);
checks.push(["patient documentation overview has five sections", source.includes("label:'Beschwerden und Alltag'") && source.includes("label:'Fußbefund'") && source.includes("label:'Statik und Haltung'") && source.includes("label:'Gang und Bewegung'") && source.includes("label:'Auswertung und Bericht'")]);
checks.push(["documentation overview responsive styles exist", styleSource.includes(".patientProgressGrid") && styleSource.includes("@media(max-width:650px){.patientProgress")]);

checks.push(["documentation overview uses shared media-aware helper", source.includes("hasPatientProgressData(item.label,data,imageFiles,videoFiles)") && source.includes("import { hasPatientProgressData } from './patientProgress.js';")]);

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
const importChecks = [];
const record = (id=1) => ({id,patient:{name:"Demo",birth:"2000-01-01"},data:{complaints:"Test"},media:{images:[],videos:[]}});
assert.equal(validateDemoImport({records:[record()] }).length,1); importChecks.push("valid record accepted");
assert.equal(validateDemoImport({records:[record(2)]},[record(2)]).length,0); importChecks.push("existing ID skipped");
assert.equal(validateDemoImport({records:[record(3),record(3)]}).length,1); importChecks.push("duplicate IDs in import skipped");
assert.throws(()=>validateDemoImport({records:[{id:1,patient:{},data:{}}]})); importChecks.push("missing name rejected");
assert.throws(()=>validateDemoImport({records:[{id:1,patient:{name:"Demo",nested:{}},data:{}}]})); importChecks.push("nested patient values rejected");
assert.throws(()=>validateDemoImport({records:[{id:1,patient:{name:"Demo"},data:[]}]})); importChecks.push("array data rejected");
assert.throws(()=>validateDemoImport({records:[{id:1,patient:{name:"Demo"},data:{nested:{x:1}}}]})); importChecks.push("nested clinical values rejected");
assert.throws(()=>validateDemoImport({records:[{id:1,patient:{name:"Demo"},data:{note:"x".repeat(5001)}}]})); importChecks.push("oversized text rejected");
assert.throws(()=>validateDemoImport({records:[{id:1,patient:{name:"Demo"},data:{},media:{images:Array(7).fill("x"),videos:[]}}]})); importChecks.push("excess image list rejected");
assert.throws(()=>validateDemoImport({records:[{id:1,patient:{name:"Demo"},data:{},media:{images:[],videos:Array(4).fill("x")}}]})); importChecks.push("excess video list rejected");
assert.throws(()=>validateDemoImport({records:Array(101).fill(null).map((_,i)=>record(i))})); importChecks.push("more than 100 records rejected");
assert.throws(()=>validateDemoImport({records:[{id:Infinity,patient:{name:"Demo"},data:{}}]})); importChecks.push("invalid ID rejected");

assert.throws(()=>validateDemoImport({records:[record(100),record(101)]},Array.from({length:99},(_,i)=>record(i+1)))); importChecks.push("session-wide record cap enforced");
assert.equal(validateDemoImport({records:[record(100)]},Array.from({length:99},(_,i)=>record(i+1))).length,1); importChecks.push("remaining session capacity accepted");
assert.throws(()=>validateDemoImport({records:[record()]},{})); importChecks.push("existing record list type checked");

assert.throws(()=>validateDemoImport({records:[record(101)]},Array.from({length:100},(_,i)=>record(i+1)))); importChecks.push("save at full session cap rejected");
assert.equal(normalizeStoredDemoPatients([record(20)]).length,1); importChecks.push("stored valid record normalized");
assert.equal(normalizeStoredDemoPatients([record(21),record(21),record(22)]).length,2); importChecks.push("duplicate stored IDs normalized");
assert.throws(()=>normalizeStoredDemoPatients({records:[record(23)]})); importChecks.push("non-array storage rejected");
assert.throws(()=>normalizeStoredDemoPatients([record(24),{id:25,patient:{name:"Demo"},data:{nested:{bad:true}}}])); importChecks.push("corrupt stored record rejected");
console.log("Demo import validation checks passed:", importChecks.length);



assert.equal(hasPatientProgressData("Beschwerden und Alltag", {complaints:"Demo"}), true); 
assert.equal(hasPatientProgressData("Fußbefund", {}, [{name:"footprint-demo.jpg"}]), true); 
assert.equal(hasPatientProgressData("Statik und Haltung", {}, [{name:"statik-frontal-demo.jpg"}]), true); 
assert.equal(hasPatientProgressData("Gang und Bewegung", {}, [], [{name:"10m-gang-demo.mp4"}]), true); 
assert.equal(hasPatientProgressData("Gang und Bewegung", {}, [], []), false); 
assert.equal(hasPatientProgressData("Fußbefund", {imageFileView0:"Fuß von oben"}, [{name:"upload-demo.jpg"}]), true); 
assert.equal(hasPatientProgressData("Statik und Haltung", {imageFileView0:"Statik – seitlich"}, [{name:"upload-demo.jpg"}]), true); 
assert.equal(hasPatientProgressData("Statik und Haltung", {imageFileView0:"Statik – dorsal"}, [{name:"upload-demo.jpg"}]), true); 
console.log("Patient documentation progress checks passed: 8");
