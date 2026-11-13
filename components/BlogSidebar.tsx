import Link from 'next/link';
import {blogCover} from '@/lib/blog-media';
import type {Post} from '@/lib/posts';
type Props={posts:Post[];activeCategory?:string;search?:string};
export default function BlogSidebar({posts,activeCategory='',search=''}:Props){
 const categories=[...new Set(posts.map(p=>p.category))].sort();
 const popular=posts.slice(0,4);
 return <aside className="journal-sidebar" aria-label="Blog sidebar">
  <section className="journal-widget"><h2>Search articles</h2><form action="/blog" method="get" role="search" className="journal-search"><label className="sr-only" htmlFor="journal-search">Search blog guides</label><input id="journal-search" name="q" defaultValue={search} placeholder="Search helpful guides..." /><button type="submit" aria-label="Search articles">⌕</button></form></section>
  <section className="journal-widget"><h2>Browse topics</h2><nav aria-label="Blog topics"><Link className={!activeCategory?'journal-category active':'journal-category'} href="/blog"><span>All guides</span><span>{posts.length}</span></Link>{categories.map(category=><Link key={category} className={activeCategory===category?'journal-category active':'journal-category'} href={'/blog?category='+encodeURIComponent(category)}><span>{category}</span><span>{posts.filter(p=>p.category===category).length}</span></Link>)}</nav></section>
  <section className="journal-widget"><h2>Featured guides</h2><div className="journal-popular">{popular.map(p=><Link key={p.slug} href={'/blog/'+p.slug} className="journal-popular-item"><img src={blogCover(p)} width={76} height={58} loading="lazy" alt="" /><span><strong>{p.title}</strong><small>{p.category}</small></span></Link>)}</div></section>
  <section className="journal-widget journal-help"><h2>Need a quick tool?</h2><p>Try our free online utilities for images, PDF files, text and development tasks.</p><Link href="/tools">Explore all tools →</Link></section>
 </aside>
}
