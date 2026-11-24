export default {
 async fetch(request, env) {
  const corsHeaders=cors(request, env);
  if (request.method === "OPTIONS") return new Response(null,{status:204,headers:corsHeaders});
  if (request.method !== "POST") return json({error:"POST only"},405,corsHeaders);
  const url=new URL(request.url);
  const route=url.pathname.endsWith("/transcribe")?"/transcribe":url.pathname.endsWith("/interpret")?"/interpret":"/image";
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
    const prompt="Du bist ein assistierender orthopädischer Befundstrukturierer für SENSOPED. Analysiere ausschließlich die übermittelten Untersuchungstexte. Erfinde keine Werte und stelle keine Diagnose. Trenne dokumentierte Fakten, vorsichtige mögliche biomechanische Zusammenhänge und offene Prüf-Fragen. Betone Seitenvergleich und Fuß-Knie-Becken-Gang-Kette. Schreibe verständlich auf Deutsch, fachlich vorsichtig, mit klarer ärztlicher/therapeutischer Prüfung.\n\nDaten:\n"+JSON.stringify(findings);
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
