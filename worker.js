export default {
 async fetch(request, env) {
  if (request.method === "OPTIONS") return new Response(null,{headers:cors()});
  if (request.method !== "POST") return new Response("POST only",{status:405,headers:cors()});
  if (!env.OPENAI_API_KEY) return json({error:"API key missing"},500);
  try {
   const {image,filename,language="de"}=await request.json();
   if(!image || !image.startsWith("data:image/")) return json({error:"Image missing or invalid"},400);
   const prompt="Analysiere das Foto eines Fußabdrucks für eine orthopädieschuhtechnische Untersuchung. Erkenne nur soweit im Bild zuverlässig: Seite (right/left/unknown), Abdrucktyp (Blauabdruck, digital, Foto, unknown), beschreibbare sichtbare Formmerkmale und vorsichtige Befundhinweise. Keine Diagnose. Wenn Seite nicht sicher erkennbar ist, unknown. Antworte ausschließlich als JSON mit keys side, footprint_type, foot_position, description, findings. side: right|left|unknown. Schreibe Deutsch.";
   const api=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Authorization":"Bearer "+env.OPENAI_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({model:"gpt-4.1-mini",input:[{role:"user",content:[{type:"input_text",text:prompt},{type:"input_image",image_url:image}]}]})});
   const raw=await api.json(); if(!api.ok)return json({error:raw.error?.message||"AI request failed"},api.status);
   const textout=(raw.output||[]).flatMap(x=>x.content||[]).filter(x=>x.type==="output_text").map(x=>x.text).join("\n");
   const cleaned=textout.replace(/^\s*\x60\x60\x60json/i,"").replace(/\x60\x60\x60\s*$/,"").trim();
   const parsed=JSON.parse(cleaned);
   return json(parsed,200);
  } catch(e){return json({error:e.message||"Unexpected error"},500)}
 }
};
function cors(){return {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type","Access-Control-Allow-Methods":"POST,OPTIONS"}}
function json(value,status=200){return new Response(JSON.stringify(value),{status,headers:{...cors(),"Content-Type":"application/json"}})}
