/**
 * Vento's reusable HTML email shell.
 * Approved editorial copy stays separate from provider transport.
 * Never interpolate unescaped user-supplied content into HTML.
 */
const escapeHtml=(value:string)=>value.replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]||char));
export function brandedEmail({heading,body,referralUrl}:{heading:string;body:string;referralUrl?:string}){
  const origin=(process.env.NEXT_PUBLIC_SITE_URL||"https://vento-u.s.com").replace(/\/$/,"");
  const link=referralUrl?escapeHtml(referralUrl):null;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#17191a;color:#f5f2ec;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#17191a"><tr><td align="center" style="padding:56px 22px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;text-align:left">
<tr><td style="padding-bottom:72px"><a href="${origin}" style="color:#f5f2ec;text-decoration:none;font-family:Georgia,serif;font-size:44px;letter-spacing:-3px" aria-label="Vento">V.</a></td></tr>
<tr><td><h1 style="font-family:Georgia,serif;font-size:43px;line-height:1.1;font-weight:400;letter-spacing:-1.5px;margin:0 0 30px">${escapeHtml(heading)}</h1>
<p style="font-size:16px;line-height:1.8;color:#d1ceca;margin:0 0 32px">${escapeHtml(body)}</p>
<p style="font-size:16px;line-height:1.6;margin:0 0 44px">talk soon.</p></td></tr>
${link?`<tr><td style="border-top:1px solid #454747;padding:30px 0"><p style="font-size:16px;margin:0 0 12px">good things are better shared.</p><a href="${link}" style="font-size:14px;color:#f5f2ec;text-decoration:underline">your personal invite link ↗</a></td></tr>`:""}
<tr><td style="border-top:1px solid #454747;padding-top:25px;font-size:12px;color:#999">good things happen offline. &nbsp;·&nbsp; <a href="${origin}" style="color:#aaa">vento-u.s.com</a></td></tr>
</table></td></tr></table></body></html>`;
}
export function waitlistConfirmationEmail(referralUrl:string){return brandedEmail({heading:"you're on the list.",body:"we're building a new way to bring people together to meet, connect, and experience more.",referralUrl});}
