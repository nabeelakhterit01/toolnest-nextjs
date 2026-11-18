import type {MetadataRoute} from 'next';
import {tools,categories} from '@/lib/tools';
import {publishedPosts} from '@/lib/posts';
export const dynamic='force-dynamic';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 const base='https://toolnestweb.com';
 let articles:{path:string;lastModified:Date}[]=[];
 try{articles=(await publishedPosts()).map(p=>({path:'/blog/'+p.slug,lastModified:new Date(p.updatedAt||p.createdAt)}))}catch(e){console.error('Sitemap blog lookup failed',e)}
 const paths=['','/tools','/blog','/about','/contact','/privacy','/terms-and-conditions','/cookies-policy','/gdpr',...categories.filter(c=>c!=='All').map(c=>'/category/'+c.toLowerCase()),...tools.map(t=>'/tools/'+t.slug)];
 const sitePages=paths.map(path=>({url:base+path,changeFrequency:path.startsWith('/blog/')?'monthly' as const:'weekly' as const,priority:path===''?1:path.startsWith('/tools/')?0.8:0.6}));
 const blogPages=articles.filter(a=>!Number.isNaN(a.lastModified.getTime())).map(a=>({url:base+a.path,lastModified:a.lastModified,changeFrequency:'monthly' as const,priority:0.6}));
 return [...sitePages,...blogPages];
}
