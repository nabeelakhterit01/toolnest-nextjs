'use client';
import Link from 'next/link';
import {useState} from 'react';
export default function Header(){
 const [open,setOpen]=useState(false);
 return <header className="header"><div className="container nav">
 <Link className="logo" href="/" aria-label="ToolNest home"><span className="logo-mark">✳</span> Tool<span>Nest</span></Link>
 <nav className={open?'nav-links nav-open':'nav-links'} aria-label="Main navigation">
 <Link href="/tools" onClick={()=>setOpen(false)}>All Tools</Link>
 <div className="nav-dropdown"><button type="button" className="nav-dropdown-trigger" aria-haspopup="true">Categories <span aria-hidden="true">⌄</span></button>
 <div className="nav-dropdown-menu">
 {['Image','Text','Developer','Security','Calculator'].map(c=><Link key={c} href={`/tools?category=${encodeURIComponent(c)}`} onClick={()=>setOpen(false)}>{c} Tools</Link>)}
 </div></div>
 <Link href="/blog" onClick={()=>setOpen(false)}>Blog</Link><Link href="/about" onClick={()=>setOpen(false)}>About</Link>
 <Link className="nav-mobile-contact" href="/contact" onClick={()=>setOpen(false)}>Contact</Link>
 </nav>
 <Link className="nav-search" href="/tools#tool-search" aria-label="Search tools" title="Search tools"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><span>Search</span></Link>
 <button type="button" className="nav-toggle" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?'✕':'☰'}</button>
 </div></header>
}