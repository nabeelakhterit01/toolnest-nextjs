import Link from 'next/link';
import {publishedPosts} from '@/lib/posts';
import {blogCover,estimatedReadingMinutes} from '@/lib/blog-media';
import BlogSidebar from '@/components/BlogSidebar';
export const dynamic='force-dynamic';
export const metadata={title:'Online Tool Guides & Tutorials',description:'Explore practical guides to image compression, PDF editing, text utilities, JSON formatting and online calculators from ToolNest.',alternates:{canonical:'/blog'}};
type Props={searchParams:Promise<{q?:string;category?:string}>};
export default async function Blog({searchParams}:Props){
 const params=await searchParams;
 const q=(params.q||'').trim().slice(0,120);
 const category=(params.category||'').trim().slice(0,100);
 const posts=await publishedPosts();
 const filtered=posts.filter(p=>(!category||p.category===category)&&(!q||[p.title,p.excerpt,p.category].some(value=>value.toLowerCase().includes(q.toLowerCase()))));
 return <main className="journal-page">
  <section className="journal-hero"><div className="container journal-hero-inner"><div><div className="journal-crumb"><Link href="/">Home</Link><span>›</span><span>Blog</span></div><div className="journal-kicker">THE TOOLNEST JOURNAL</div><h1>ToolNest Blog<span className="accent-dot">.</span></h1><p>Clear, practical guides for working with images, PDFs, text and code. Learn the details, then put them into practice with free online tools.</p><Link href="/tools" className="journal-hero-link">Explore free tools →</Link></div><div className="journal-hero-art" aria-hidden="true"><div className="journal-art-window"><span className="journal-art-dots">● ● ●</span><div className="journal-art-line long"/><div className="journal-art-line"/><div className="journal-art-line medium"/><div className="journal-art-card">✦ &nbsp; Practical guides</div></div><div className="journal-art-sheet">PDF<br/><span>+</span></div><div className="journal-art-badge">TN</div></div></div></section>
  <div className="container journal-layout"><div className="journal-main"><div className="journal-section-heading"><div><span className="journal-kicker">{q||category?'MATCHING ARTICLES':'LATEST ARTICLES'}</span><h2>{q?'Search results for “'+q+'”':category||'Learn something useful'}</h2></div><span className="journal-count">{filtered.length} {filtered.length===1?'guide':'guides'}</span></div>
  {filtered.length>0?<div className="journal-grid">{filtered.map(p=><Link href={'/blog/'+p.slug} className="journal-card" key={p.id}><div className="journal-card-image"><img src={blogCover(p)} alt={p.title+' illustration'} loading="lazy" width={960} height={540}/><span className="journal-chip">{p.category}</span></div><div className="journal-card-body"><h3>{p.title}</h3><p>{p.excerpt}</p><div className="journal-card-meta"><span>ToolNest Team</span><span>{new Date(p.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</span><span>{estimatedReadingMinutes(p.content)} min read</span></div></div></Link>)}</div>:<div className="journal-empty"><h3>No matching guides found</h3><p>Try a different keyword or browse all our guides.</p><Link href="/blog">View all guides →</Link></div>}</div><BlogSidebar posts={posts} activeCategory={category} search={q}/></div>
 </main>
}
