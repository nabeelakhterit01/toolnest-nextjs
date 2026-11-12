'use client';
import {useRef} from 'react';
type Props={value:string;onChange:(value:string)=>void};
export default function MarkdownEditor({value,onChange}:Props){
 const ref=useRef<HTMLTextAreaElement>(null);
 const apply=(before:string,after:string=before,placeholder='text',line=false)=>{
  const el=ref.current;if(!el)return;
  const start=el.selectionStart,end=el.selectionEnd;
  const selected=value.slice(start,end)||placeholder;
  const lineStart=line?value.lastIndexOf('\n',start-1)+1:start;
  const next=value.slice(0,lineStart)+before+selected+after+value.slice(end);
  onChange(next);requestAnimationFrame(()=>{el.focus();el.setSelectionRange(lineStart+before.length,lineStart+before.length+selected.length)});
 };
 const tools=[{name:'H2',run:()=>apply('## ','','Heading',true)},{name:'H3',run:()=>apply('### ','','Subheading',true)},{name:'Bold',run:()=>apply('**','**','bold text')},{name:'Italic',run:()=>apply('*','*','italic text')},{name:'Link',run:()=>apply('[','](https://example.com)','link text')},{name:'List',run:()=>apply('- ','','List item',true)},{name:'Numbered',run:()=>apply('1. ','','List item',true)},{name:'Quote',run:()=>apply('> ','','Quote',true)}];
 return <div className="markdown-editor"><div className="markdown-toolbar" role="toolbar" aria-label="Article formatting">{tools.map(t=><button key={t.name} type="button" onClick={t.run}>{t.name}</button>)}</div><textarea ref={ref} rows={16} value={value} onChange={e=>onChange(e.target.value)} placeholder="Write your article here. Use the toolbar for headings, bold text, links and lists."/><small>Formatting uses Markdown. Paragraphs are separated by a blank line. Changes are saved when you click Save article.</small></div>
}
