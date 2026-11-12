import {NextResponse} from 'next/server';
import {isAdmin} from '@/lib/auth';
import crypto from 'node:crypto';
export const runtime='nodejs';
export async function POST(req:Request){
 if(!await isAdmin())return NextResponse.json({error:'Unauthorized'},{status:401});
 try{
  const form=await req.formData();const file=form.get('file');
  if(!(file instanceof File))return NextResponse.json({error:'Select an image'},{status:400});
  const types:Record<string,string>={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/gif':'gif'};
  const ext=types[file.type];if(!ext)return NextResponse.json({error:'Only JPG, PNG, WebP and GIF allowed'},{status:400});
  if(file.size>5*1024*1024||file.size===0)return NextResponse.json({error:'Image must be under 5 MB'},{status:400});
  const base=process.env.SUPABASE_URL?.replace(/\/$/,'');const key=process.env.SUPABASE_SECRET_KEY;
  if(!base||!key)return NextResponse.json({error:'Hostinger is missing SUPABASE_URL or SUPABASE_SECRET_KEY'},{status:503});
  let parsed:URL;try{parsed=new URL(base);if(parsed.protocol!=='https:')throw new Error('Invalid protocol')}catch{return NextResponse.json({error:'SUPABASE_URL must be a full https:// URL, without spaces'},{status:503})}
  const path=crypto.randomUUID()+'.'+ext;
  const res=await fetch(parsed.origin+'/storage/v1/object/blog-images/'+path,{method:'POST',headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':file.type,'x-upsert':'false'},body:Buffer.from(await file.arrayBuffer())});
  if(!res.ok){const body=await res.text();console.error('Image upload failed',res.status,body.slice(0,300));return NextResponse.json({error:res.status===401||res.status===403?'Supabase rejected the secret key or storage permission':res.status===404?'Supabase blog-images bucket not found':'Supabase Storage returned HTTP '+res.status},{status:502})}
  return NextResponse.json({url:parsed.origin+'/storage/v1/object/public/blog-images/'+path});
 }catch(e){console.error('Image upload error',e);const cause=e instanceof Error&&'cause' in e?(e as Error & {cause?:{code?:string}}).cause?.code:undefined;return NextResponse.json({error:cause==='ENOTFOUND'||cause==='EAI_AGAIN'?'Hostinger cannot resolve the Supabase hostname (DNS). Verify SUPABASE_URL and server DNS.':cause==='ETIMEDOUT'||cause==='UND_ERR_CONNECT_TIMEOUT'?'Hostinger connection to Supabase timed out. Check server outbound connectivity.':'Image upload service unavailable. Check Hostinger Runtime logs for the underlying error.'},{status:503})}
}
