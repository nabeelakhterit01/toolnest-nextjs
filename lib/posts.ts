import 'server-only';
import fs from 'node:fs/promises';import path from 'node:path';
export type Post={id:string;slug:string;title:string;excerpt:string;content:string;category:string;status:'draft'|'published';createdAt:string;updatedAt:string;seoTitle:string;seoDescription:string};
const dir=process.env.BLOG_DATA_DIR||'./data';const file=path.join(dir,'posts.json');
export async function getPosts():Promise<Post[]>{try{return JSON.parse(await fs.readFile(file,'utf8'))}catch(e:any){if(e.code==='ENOENT')return [];throw e}}
export async function savePosts(posts:Post[]){await fs.mkdir(dir,{recursive:true});const tmp=file+'.tmp';await fs.writeFile(tmp,JSON.stringify(posts,null,2));await fs.rename(tmp,file)}
export async function publishedPosts(){return (await getPosts()).filter(p=>p.status==='published').sort((a,b)=>b.createdAt.localeCompare(a.createdAt))}
