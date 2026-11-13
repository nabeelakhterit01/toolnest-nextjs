'use client';
import Link from 'next/link';
import {useState} from 'react';
import {tools,categories} from '@/lib/tools';
export default function Header(){
 const [open,setOpen]=useState(false);
 const [expanded,setExpanded]=useState<string|null>(null);
 const close=()=>{setOpen(false);setExpanded(null)};
 return <header className="header"><div className="container nav">
 <Link className="logo" href="/" aria-label="ToolNest home" onClick={close}><span className="logo-mark">✳</span> Tool<span>Nest</span></Link>
 <nav className={open?'nav-links nav-open':'nav-links'} aria-label="Main navigation">
 <Link href="/tools" onClick={close}>All Tools</Link>
 {categories.filter(x=>x!=='All').map(category=><div className="nav-dropdown" key={category}>
 <div className="nav-category-head"><Link href={'/category/'+category.toLowerCase()} onClick={close}>{category} Tools</Link><button type="button" className="nav-dropdown-trigger" aria-label={'Show '+category+' tools'} aria-expanded={expanded===category} onClick={()=>setExpanded(expanded===category?null:category)}>⌄</button></div>
 <div className={'nav-dropdown-menu'+(expanded===category?' nav-expanded':'')}><Link className="nav-category-all" href={'/category/'+category.toLowerCase()} onClick={close}>View all {category} tools →</Link>{tools.filter(t=>t.category===category).map(t=><Link href={'/tools/'+t.slug} key={t.slug} onClick={close}>{t.name}</Link>)}</div>
 </div>)}
 <Link href="/blog" onClick={close}>Blog</Link><Link href="/about" onClick={close}>About</Link>
 <Link className="nav-mobile-contact" href="/contact" onClick={close}>Contact</Link>
 </nav>
 <Link className="nav-search" href="/tools#tool-search" aria-label="Search tools" title="Search tools"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><span>Search</span></Link>
 <button type="button" className="nav-toggle" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?'✕':'☰'}</button>
 </div></header>
}