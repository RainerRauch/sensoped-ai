export default {
 async fetch(request, env) {
  const corsHeaders=cors(request, env);
  const url=new URL(request.url);
  if (request.method === "GET" && url.pathname.endsWith("/health")) return json({status:"ok",service:"SENSOPED AI Worker",message:"Worker erreichbar; KI-Schlüsselstatus wird nicht offengelegt."},200,corsHeaders);
  if (request.method === "OPTIONS") return new Response(null,{status:204,headers:corsHeaders});
  if (request.method !== "POST") return json({error:"POST only"},405,corsHeaders);
  const route=url.pathname.endsWith("/transcribe")?"/transcribe":url.pathname.endsWith("/interpret")?"/interpret":url.pathname.endsWith("/image")?"/image":null;
  if(!route)return json({error:"Unknown route"},404,corsHeaders);
  if (!env.OPENAI_API_KEY) return json({error:"API key missing"},500,corsHeaders);
  try {
   if(route==="/transcribe"){
    const incoming=await request.formData();const audio=incoming.get("audio");
    if(!audio||typeof audio.arrayBuffer!=="function")return json({error:"Audio missing"},400,corsHeaders);
    if(audio.size>25*1024*1024)return json({error:"Audio file too large (max 25 MB)"},413,corsHeaders);
    const form=new FormData();form.append("file",audio,audio.name||"recording.webm");form.append("model","gpt-4o-mini-transcribe");form.append("language","de");
    const api=await fetch("https://api.openai.com/v1/audio/transcriptions",{method:"POST",headers:{"Authorization":"Bearer "+env.OPENAI_API_KEY},body:form});
    const raw=await api.json();if(!api.ok)return json({error:raw.error?.message||"Transcription failed"},api.status,corsHeaders);
    return json({text:raw.text||""},200,corsHeaders);
   }
   if(route==="/interpret"){
    const body=await request.json();const findings=body.findings||{};
    const prompt="Du bist der strukturierende Untersuchungsassistent von SENSOPED für orthopädische Fuß- und Bewegungsbefunde. Verwende ausschließlich die eingegebenen Befunddaten. Erfinde keine Messwerte, fehlende Angaben, Untersuchungsergebnisse oder Diagnosen. Unterscheide strikt zwischen dokumentierten Beobachtungen und Hypothesen. Achte auf Rechts/Links und benenne Seitenunterschiede nur wenn Daten dafür vorliegen. Prüfe mögliche Zusammenhänge entlang Fuß/Rückfuß, Sprunggelenk, Knie, Hüfte/Becken und Gang, ohne eine Kausalität zu behaupten. Bitte beachte: Textnotizen sind keine echte Bild-, Video- oder Messanalyse.\n\nAntworte in genau dieser Gliederung und verständlichem, professionellem Deutsch:\n1. Kurzüberblick (nur wenn Daten vorhanden)\n2. Dokumentierte Befunde – nach rechts/links und Untersuchungsbereich sortieren; fehlende Bereiche ausdrücklich nicht bewerten\n3. Mögliche biomechanische Zusammenhänge – vorsichtig formulierte Hypothesen, jeweils Bezug zu konkreten Angaben\n4. Auffälligkeiten und Seitenvergleich – nur belegte Unterschiede\n5. Offene Fragen / gezielte Untersuchungen – konkrete Schritte, die zur Klärung dienen können\n6. Therapeutische Überlegungen – unverbindliche Optionen zur fachlichen Prüfung, keine Verordnung\n7. Grenzen – keine Diagnose, fachliche Bestätigung durch Untersucher erforderlich\n\nDaten:\n"+JSON.stringify(findings);
    const api=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Authorization":"Bearer "+env.OPENAI_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({model:"gpt-4.1-mini",input:prompt})});
    const raw=await api.json();if(!api.ok)return json({error:raw.error?.message||"AI request failed"},api.status,corsHeaders);
    const out=(raw.output||[]).flatMap(x=>x.content||[]).filter(x=>x.type==="output_text").map(x=>x.text).join("\n");return json({interpretation:out},200,corsHeaders);
   }
   const body=await request.json();const image=body?.image;
   if(!image||typeof image!=="string"||!image.startsWith("data:image/"))return json({error:"Image missing or invalid"},400,corsHeaders);
   if(image.length>15*1024*1024)return json({error:"Image payload too large"},413,corsHeaders);
   const prompt="Analysiere das Foto eines Fußabdrucks für eine orthopädieschuhtechnische Untersuchung. Erkenne nur soweit im Bild zuverlässig: Seite (right/left/unknown), Abdrucktyp, sichtbare Formmerkmale und vorsichtige Befundhinweise. Keine Diagnose. Antworte ausschließlich als JSON mit keys side, footprint_type, foot_position, description, findings. side: right|left|unknown. Schreibe Deutsch.";
   const api=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Authorization":"Bearer "+env.OPENAI_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({model:"gpt-4.1-mini",input:[{role:"user",content:[{type:"input_text",text:prompt},{type:"input_image",image_url:image}]}]})});
   const raw=await api.json();if(!api.ok)return json({error:raw.error?.message||"AI request failed"},api.status,corsHeaders);
   const textout=(raw.output||[]).flatMap(x=>x.content||[]).filter(x=>x.type==="output_text").map(x=>x.text).join("\n");
   const cleaned=textout.replace(/^\s*\x60\x60\x60json/i,"").replace(/\x60\x60\x60\s*$/,"").trim();
   return json(JSON.parse(cleaned),200,corsHeaders);
  } catch(e){return json({error:e.message||"Unexpected error"},500,corsHeaders)}
 }
};
function cors(request,env){return {"Access-Control-Allow-Origin":env.ALLOWED_ORIGIN||"*","Access-Control-Allow-Headers":"Content-Type","Access-Control-Allow-Methods":"POST,OPTIONS","Vary":"Origin"}}
function json(value,status=200,headers){return new Response(JSON.stringify(value),{status,headers:{...(headers||cors()),"Content-Type":"application/json"}})}
