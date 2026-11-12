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
  if(!base||!key)return NextResponse.json({error:'Supabase environment variables are missing'},{status:503});
  const path=crypto.randomUUID()+'.'+ext;
  const res=await fetch(base+'/storage/v1/object/blog-images/'+path,{method:'POST',headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':file.type,'x-upsert':'false'},body:Buffer.from(await file.arrayBuffer())});
  if(!res.ok){console.error('Image upload failed',res.status,await res.text());return NextResponse.json({error:'Image upload failed. Confirm blog-images public bucket exists.'},{status:502})}
  return NextResponse.json({url:base+'/storage/v1/object/public/blog-images/'+path});
 }catch(e){console.error('Image upload error',e);return NextResponse.json({error:'Image upload service unavailable'},{status:503})}
}
