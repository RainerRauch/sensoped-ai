export default {
 async fetch(request, env) {
  const corsHeaders=cors();
  if (request.method === "OPTIONS") return new Response(null,{headers:corsHeaders});
  if (request.method !== "POST") return new Response("POST only",{status:405,headers:corsHeaders});
  if (!env.OPENAI_API_KEY) return json({error:"API key missing"},500);
  const url=new URL(request.url);
  try {
   if(url.pathname.endsWith("/transcribe")){
    const incoming=await request.formData();
    const audio=incoming.get("audio");
    if(!audio)return json({error:"Audio missing"},400);
    const form=new FormData();form.append("file",audio,audio.name||"recording.webm");form.append("model","gpt-4o-mini-transcribe");form.append("language","de");
    const api=await fetch("https://api.openai.com/v1/audio/transcriptions",{method:"POST",headers:{"Authorization":"Bearer "+env.OPENAI_API_KEY},body:form});
    const raw=await api.json();if(!api.ok)return json({error:raw.error?.message||"Transcription failed"},api.status);
    return json({text:raw.text||""},200);
   }
   if(url.pathname.endsWith("/interpret")){const body=await request.json();const findings=body.findings||{};const prompt="Du bist ein assistierender orthopädischer Befundstrukturierer für SENSOPED. Analysiere ausschließlich die übermittelten Untersuchungstexte. Erfinde keine Werte und stelle keine Diagnose. Trenne dokumentierte Fakten, vorsichtige mögliche biomechanische Zusammenhänge und offene Prüf-Fragen. Betone Seitenvergleich und Fuß-Knie-Becken-Gang-Kette. Schreibe verständlich auf Deutsch, fachlich vorsichtig, mit klarer ärztlicher/therapeutischer Prüfung.\n\nDaten:\n"+JSON.stringify(findings);const api=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Authorization":"Bearer "+env.OPENAI_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({model:"gpt-4.1-mini",input:prompt})});const raw=await api.json();if(!api.ok)return json({error:raw.error?.message||"AI request failed"},api.status);const out=(raw.output||[]).flatMap(x=>x.content||[]).filter(x=>x.type==="output_text").map(x=>x.text).join("\\n");return json({interpretation:out},200);}\n   const {image,filename,language="de"}=await request.json();
   if(!image || !image.startsWith("data:image/")) return json({error:"Image missing or invalid"},400);
   const prompt="Analysiere das Foto eines Fußabdrucks für eine orthopädieschuhtechnische Untersuchung. Erkenne nur soweit im Bild zuverlässig: Seite (right/left/unknown), Abdrucktyp, sichtbare Formmerkmale und vorsichtige Befundhinweise. Keine Diagnose. Antworte ausschließlich als JSON mit keys side, footprint_type, foot_position, description, findings. side: right|left|unknown. Schreibe Deutsch.";
   const api=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Authorization":"Bearer "+env.OPENAI_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({model:"gpt-4.1-mini",input:[{role:"user",content:[{type:"input_text",text:prompt},{type:"input_image",image_url:image}]}]})});
   const raw=await api.json(); if(!api.ok)return json({error:raw.error?.message||"AI request failed"},api.status);
   const textout=(raw.output||[]).flatMap(x=>x.content||[]).filter(x=>x.type==="output_text").map(x=>x.text).join("\n");
   const cleaned=textout.replace(/^\s*\x60\x60\x60json/i,"").replace(/\x60\x60\x60\s*$/,"").trim();
   return json(JSON.parse(cleaned),200);
  } catch(e){return json({error:e.message||"Unexpected error"},500)}
 }
};
function cors(){return {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type","Access-Control-Allow-Methods":"POST,OPTIONS"}}
function json(value,status=200){return new Response(JSON.stringify(value),{status,headers:{...cors(),"Content-Type":"application/json"}})}
