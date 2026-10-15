import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap { const base=process.env.NEXT_PUBLIC_SITE_URL||"https://vento-us.com"; return ["","/about","/messages","/privacy","/terms"].map((path)=>({url:`${base}${path}`,lastModified:new Date(),changeFrequency:path?"monthly":"weekly",priority:path?0.6:1})); }
