'use client';
import {useRef,useState} from 'react';
import ArticleContent from '@/components/ArticleContent';
type Props={value:string;onChange:(value:string)=>void};
export default function MarkdownEditor({value,onChange}:Props){
 const ref=useRef<HTMLTextAreaElement>(null);
 const [preview,setPreview]=useState(false);
 const apply=(before:string,after='',placeholder='text',line=false)=>{
  const el=ref.current;if(!el)return;
  const start=el.selectionStart,end=el.selectionEnd;
  const lineStart=line?value.lastIndexOf('\n',Math.max(0,start-1))+1:start;
  const selected=value.slice(line?lineStart:start,end)||placeholder;
  const next=value.slice(0,lineStart)+before+selected+after+value.slice(end);
  onChange(next);
  requestAnimationFrame(()=>{el.focus();el.setSelectionRange(lineStart+before.length,lineStart+before.length+selected.length)});
 };
 const tools=[{name:'H2',run:()=>apply('## ','','Heading',true)},{name:'H3',run:()=>apply('### ','','Subheading',true)},{name:'Bold',run:()=>apply('**','**','bold text')},{name:'Italic',run:()=>apply('*','*','italic text')},{name:'Link',run:()=>apply('[','](https://example.com)','link text')},{name:'List',run:()=>apply('- ','','List item',true)},{name:'Numbered',run:()=>apply('1. ','','List item',true)},{name:'Quote',run:()=>apply('> ','','Quote',true)}];
 return <div className="markdown-editor">
  <div className="markdown-toolbar" role="toolbar" aria-label="Article formatting">
   {tools.map(t=><button key={t.name} type="button" disabled={preview} onClick={t.run}>{t.name}</button>)}
   <span style={{flex:1}}/>
   <button type="button" aria-pressed={!preview} onClick={()=>setPreview(false)} style={{borderColor:!preview?'#5c60ef':undefined}}>Edit</button>
   <button type="button" aria-pressed={preview} onClick={()=>setPreview(true)} style={{borderColor:preview?'#5c60ef':undefined}}>Visual preview</button>
  </div>
  {preview?<div className="markdown-visual-preview"><ArticleContent content={value||'Your formatted article preview will appear here.'}/></div>:<textarea ref={ref} rows={16} value={value} onChange={e=>onChange(e.target.value)} placeholder="Write your article here. Use the toolbar for headings, bold text, links and lists."/>}
  <small>{preview?'This is how your article formatting will appear after publishing. Click Edit to make changes.':'Use Visual preview to see headings, bold text and lists as they will appear on the blog.'}</small>
 </div>
}
