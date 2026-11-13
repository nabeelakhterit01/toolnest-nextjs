import type {Post} from './posts';
const covers:Record<string,string>={'Image Guides':'image','Writing Guides':'text','Text Guides':'text','PDF Guides':'pdf','Developer Guides':'developer','Security Guides':'security','Calculator Guides':'calculator'};
export function blogCover(post:Pick<Post,'category'|'featuredImage'>){return post.featuredImage?.trim()||'/blog-covers/'+(covers[post.category]||'developer')+'.svg'}
export function estimatedReadingMinutes(content:string){const count=content.replace(/[#*\[\]()]/g,' ').trim().split(/\s+/).filter(Boolean).length;return Math.max(1,Math.ceil(count/220))}
