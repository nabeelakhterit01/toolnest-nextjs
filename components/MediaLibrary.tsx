'use client';
import {useCallback,useEffect,useState} from 'react';
type Media={name:string;url:string;createdAt:string;size:number};
export default function MediaLibrary({onSelect,onClose}:{onSelect:(url:string)=>void;onClose:()=>void}){
 const [items,setItems]=useState<Media[]>([]),[busy,setBusy]=useState(false),[error,setError]=useState(''),[search,setSearch]=useState('');
 const load=useCallback(async()=>{try{setError('');const r=await fetch('/api/admin/media',{cache:'no-store'});const data=await r.json();if(!r.ok)throw Error(data.error||'Could not load images');setItems(data)}catch(e){setError(e instanceof Error?e.message:'Could not load images')}},[]);
 useEffect(()=>{void load()},[load]);
 const upload=async(files:FileList|null)=>{if(!files?.length)return;setBusy(true);setError('');try{for(const file of Array.from(files)){const body=new FormData();body.append('file',file);const res=await fetch('/api/admin/upload',{method:'POST',body});const data=await res.json();if(!res.ok)throw Error(data.error||'Upload failed')}await load()}catch(e){setError(e instanceof Error?e.message:'Upload failed')}finally{setBusy(false)}};
 const remove=async(item:Media)=>{if(!confirm('Delete this image permanently? Articles using it may show a broken image.'))return;setBusy(true);try{const r=await fetch('/api/admin/media',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:item.name})});const data=await r.json();if(!r.ok)throw Error(data.error||'Delete failed');await load()}catch(e){setError(e instanceof Error?e.message:'Delete failed')}finally{setBusy(false)}};
 return <div className="media-overlay" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><section className="media-modal" role="dialog" aria-modal="true" aria-label="Media library">
  <div className="media-head"><div><h2>Media Library</h2><p>Upload, reuse or insert images from Supabase Storage.</p></div><button type="button" onClick={onClose} aria-label="Close media library">✕</button></div>
  <div className="media-actions"><label className="media-upload">+ Upload images<input type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" disabled={busy} onChange={e=>{void upload(e.target.files);e.target.value=''}}/></label><input aria-label="Search images" placeholder="Search images..." value={search} onChange={e=>setSearch(e.target.value)}/><button type="button" onClick={()=>void load()} disabled={busy}>Refresh</button></div>
  {busy&&<p>Processing images...</p>}{error&&<p className="notice" role="alert">{error}</p>}
  <div className="media-grid">{items.filter(x=>x.name.toLowerCase().includes(search.toLowerCase())).map(item=><div className="media-item" key={item.name}><img src={item.url} alt={item.name} loading="lazy"/><small title={item.name}>{item.name}</small><div className="media-item-actions"><button type="button" onClick={()=>onSelect(item.url)}>Use image</button><button type="button" onClick={()=>void navigator.clipboard.writeText(item.url)}>Copy URL</button><button type="button" disabled={busy} onClick={()=>void remove(item)}>Delete</button></div></div>)}</div>
  {items.length===0&&!error&&<p>No images yet. Upload your first image.</p>}
 </section></div>;
}
