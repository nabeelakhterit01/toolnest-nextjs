'use client';
import {useEffect,useRef,useState} from 'react';
import ArticleContent from '@/components/ArticleContent';
type Props={value:string;onChange:(value:string)=>void};
const escapeHtml=(s:string)=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
function inlineHtml(s:string){
 return escapeHtml(s).replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,(_m,label,url)=>'<a href="'+url+'">'+label+'</a>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\*([^*\n]+)\*/g,'<em>$1</em>');
}
function markdownToHtml(md:string){
 return md.split(/\n\s*\n/).filter(Boolean).map(block=>{
  const image=block.match(/^!\\[([^\\]]*)\\]\\((https:\\/\\/[^\\s)]+)\\)$/);if(image)return '<p><img src="'+escapeHtml(image[2])+'" alt="'+escapeHtml(image[1])+'" style="max-width:100%;height:auto" /></p>';
  if(block.startsWith('### '))return '<h3>'+inlineHtml(block.slice(4))+'</h3>';
  if(block.startsWith('## '))return '<h2>'+inlineHtml(block.slice(3))+'</h2>';
  if(block.startsWith('> '))return '<blockquote>'+inlineHtml(block.slice(2))+'</blockquote>';
  const lines=block.split('\n');
  if(lines.every(l=>/^[-*] /.test(l)))return '<ul>'+lines.map(l=>'<li>'+inlineHtml(l.slice(2))+'</li>').join('')+'</ul>';
  if(lines.every(l=>/^\d+\. /.test(l)))return '<ol>'+lines.map(l=>'<li>'+inlineHtml(l.replace(/^\d+\. /,''))+'</li>').join('')+'</ol>';
  return '<p>'+lines.map(inlineHtml).join('<br>')+'</p>';
 }).join('');
}
function nodeMarkdown(node:Node):string{
 if(node.nodeType===Node.TEXT_NODE)return node.textContent||'';
 if(node.nodeType!==Node.ELEMENT_NODE)return '';
 const el=node as HTMLElement,tag=el.tagName.toLowerCase();
 const inner=Array.from(el.childNodes).map(nodeMarkdown).join('');
 if(tag==='br')return '\n';
 if(tag==='strong'||tag==='b')return '**'+inner+'**';
 if(tag==='em'||tag==='i')return '*'+inner+'*';
 if(tag==='a'){const href=el.getAttribute('href')||'';return /^https?:\/\//.test(href)?'['+inner+']('+href+')':inner}
 if(tag==='h2')return '## '+inner.trim()+'\n\n';
 if(tag==='h3')return '### '+inner.trim()+'\n\n';
 if(tag==='blockquote')return '> '+inner.trim()+'\n\n';
 if(tag==='ul'||tag==='ol')return Array.from(el.children).map((li,i)=>(tag==='ul'?'- ':(i+1)+'. ')+Array.from(li.childNodes).map(nodeMarkdown).join('').trim()).join('\n')+'\n\n';
 if(tag==='p'||tag==='div')return inner.trim()+'\n\n';
 return inner;
}
export default function MarkdownEditor({value,onChange}:Props){
 const ref=useRef<HTMLDivElement>(null),last=useRef<string|null>(null);
 const [mode,setMode]=useState<'visual'|'source'|'preview'>('visual');
 useEffect(()=>{
  if(mode!=='visual'||!ref.current)return;
  if(last.current!==value){ref.current.innerHTML=markdownToHtml(value);last.current=value}
 },[value,mode]);
 const sync=()=>{if(!ref.current)return;const md=Array.from(ref.current.childNodes).map(nodeMarkdown).join('').trim();last.current=md;onChange(md)};
 const command=(name:string)=>{
  if(mode!=='visual')return;
  ref.current?.focus();
  if(name==='H2'||name==='H3')document.execCommand('formatBlock',false,name==='H2'?'h2':'h3');
  else if(name==='Bold')document.execCommand('bold');
  else if(name==='Italic')document.execCommand('italic');
  else if(name==='List')document.execCommand('insertUnorderedList');
  else if(name==='Numbered')document.execCommand('insertOrderedList');
  else if(name==='Quote')document.execCommand('formatBlock',false,'blockquote');
  else if(name==='Link'){const url=window.prompt('Enter a full https:// link');if(url&&/^https?:\/\//i.test(url))document.execCommand('createLink',false,url)}
  sync();
 };
 const tools=['H2','H3','Bold','Italic','Link','List','Numbered','Quote'];
 return <div className="markdown-editor">
  <div className="markdown-toolbar" role="toolbar" aria-label="Article formatting">
   {tools.map(t=><button key={t} type="button" disabled={mode!=='visual'} onMouseDown={e=>e.preventDefault()} onClick={()=>command(t)}>{t}</button>)}
   <span style={{flex:1}}/>
   {(['visual','source','preview'] as const).map(m=><button key={m} type="button" aria-pressed={mode===m} onClick={()=>setMode(m)} style={{borderColor:mode===m?'#5c60ef':undefined}}>{m==='visual'?'Visual editor':m==='source'?'Markdown': 'Preview'}</button>)}
  </div>
  <div ref={ref} contentEditable={mode==='visual'} suppressContentEditableWarning role="textbox" aria-label="Article content" aria-multiline="true" onInput={sync} className="markdown-visual-preview markdown-editable" style={{display:mode==='visual'?'block':'none'}} data-placeholder="Start writing your article..."/>
  {mode==='source'&&<textarea rows={16} value={value} onChange={e=>{last.current=null;onChange(e.target.value)}} aria-label="Markdown source"/>}
  {mode==='preview'&&<div className="markdown-visual-preview"><ArticleContent content={value||'Your article preview will appear here.'}/></div>}
  <small>{mode==='visual'?'Select text and apply formatting directly. Save article when finished.':'Switch to Visual editor to format text directly.'}</small>
 </div>;
}
