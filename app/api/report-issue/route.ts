import {NextResponse} from 'next/server';
import {tools} from '@/lib/tools';
export const runtime='nodejs';
const destination='info@toolnestweb.com';
const counts=new Map<string,{n:number;until:number}>();
const clean=(value:unknown,max:number)=>typeof value==='string'?value.trim().slice(0,max):'';
export async function POST(req:Request){
 try{
  const length=Number(req.headers.get('content-length')||0);if(length>12000)return NextResponse.json({error:'Report is too long.'},{status:413});
  const body=await req.json();if(!body||typeof body!=='object')return NextResponse.json({error:'Invalid report.'},{status:400});
  if(clean(body.website,100))return NextResponse.json({ok:true});
  const tool=clean(body.tool,100),name=clean(body.name,100),email=clean(body.email,254),details=clean(body.details,3000),steps=clean(body.steps,1500);
  if(!tool||!(tool==='other'||tools.some(t=>t.slug===tool))||details.length<15||details.length>3000||typeof body.details!=='string'||body.details.length>3000)return NextResponse.json({error:'Select a tool and describe the issue (at least 15 characters).'},{status:400});
  if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return NextResponse.json({error:'Enter a valid email address.'},{status:400});
  const key=process.env.RESEND_API_KEY,from=process.env.REPORT_FROM_EMAIL;
  if(!key||!from){console.error('Issue report email service is not configured');return NextResponse.json({error:'Email reporting is temporarily unavailable.'},{status:503})}
  const ip=(req.headers.get('x-forwarded-for')||'').split(',')[0].trim()||'unknown';
  const now=Date.now();if(counts.size>2000)counts.clear();const record=counts.get(ip);if(record&&record.until>now&&record.n>=4)return NextResponse.json({error:'Too many reports. Please try again later.'},{status:429});counts.set(ip,{n:record&&record.until>now?record.n+1:1,until:record&&record.until>now?record.until:now+3600000});
  const selected=tools.find(t=>t.slug===tool);
  const subject='[ToolNest Issue] '+(selected?.name||'Website issue');
  const text=['New issue report from toolnestweb.com','','Tool: '+(selected?.name||'Other website issue'),'Tool URL: '+(selected?'https://toolnestweb.com/tools/'+selected.slug:'Not specified'),'Name: '+(name||'Not provided'),'Reply email: '+(email||'Not provided'),'','Problem description:',details,'','Steps to reproduce:',steps||'Not provided'].join('\n');
  const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({from,to:[destination],subject,text,...(email?{reply_to:email}:{})})});
  if(!response.ok){console.error('Issue report delivery failed with status',response.status);return NextResponse.json({error:'Unable to deliver report right now. Please try again later.'},{status:502})}
  return NextResponse.json({ok:true});
 }catch(e){console.error('Issue report request failed',e instanceof SyntaxError?'Invalid JSON':'Unexpected request failure');return NextResponse.json({error:'Unable to process report.'},{status:400})}
}
