import Link from 'next/link';
export default function NotFound(){
 return <main className="container" style={{maxWidth:760,padding:'96px 20px',textAlign:'center'}}>
  <p style={{fontWeight:700,letterSpacing:2}}>404 — PAGE NOT FOUND</p>
  <h1>We could not find that page</h1>
  <p>The address may be mistyped, or the page may have moved. You can still use ToolNest's free tools and guides.</p>
  <div style={{display:'flex',justifyContent:'center',gap:18,flexWrap:'wrap',marginTop:28}}>
   <Link href="/tools">Browse tools</Link>
   <Link href="/blog">Read guides</Link>
   <Link href="/contact">Report a broken link</Link>
  </div>
 </main>;
}
