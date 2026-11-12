import type {MetadataRoute} from 'next';
import {tools} from '@/lib/tools';
import {publishedPosts} from '@/lib/posts';
export const dynamic='force-dynamic';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 const base='https://toolnestweb.com';
 let articles:string[]=[];
 try{articles=(await publishedPosts()).map(p=>'/blog/'+p.slug)}catch(e){console.error('Sitemap blog lookup failed',e)}
 const paths=['','/tools','/blog','/about','/contact','/privacy','/terms',...tools.map(t=>'/tools/'+t.slug),...articles];
 return paths.map(path=>({url:base+path,changeFrequency:path.startsWith('/blog/')?'monthly':'weekly',priority:path===''?1:path.startsWith('/tools/')?0.8:0.6}));
}
