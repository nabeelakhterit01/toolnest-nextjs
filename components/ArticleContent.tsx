import type {ReactNode} from 'react';
function inline(text:string):ReactNode[]{
 const tokens=text.split(/(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|\*\*[^*]+\*\*|\*[^*\n]+\*)/g);
 const out:ReactNode[]=[];
 for(let i=0;i<tokens.length;i++){
  const part=tokens[i];if(!part)continue;
  const match=part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
  if(match){out.push(<a key={i} href={match[2]} target="_blank" rel="noopener noreferrer">{match[1]}</a>);continue}
  if(part.startsWith('**')&&part.endsWith('**'))out.push(<strong key={i}>{part.slice(2,-2)}</strong>);
  else if(part.startsWith('*')&&part.endsWith('*'))out.push(<em key={i}>{part.slice(1,-1)}</em>);
  else out.push(part);
 }
 return out;
}
export default function ArticleContent({content}:{content:string}){
 const blocks=content.trim().split(/\n\s*\n/).filter(Boolean);
 return <article className="article-content">{blocks.map((block,i)=>{
  if(block.startsWith('### '))return <h3 key={i}>{inline(block.slice(4))}</h3>;
  if(block.startsWith('## '))return <h2 key={i}>{inline(block.slice(3))}</h2>;
  if(block.startsWith('> '))return <blockquote key={i}>{inline(block.slice(2))}</blockquote>;
  const lines=block.split('\n');
  if(lines.every(l=>/^[-*] /.test(l)))return <ul key={i}>{lines.map((l,j)=><li key={j}>{inline(l.slice(2))}</li>)}</ul>;
  if(lines.every(l=>/^\d+\. /.test(l)))return <ol key={i}>{lines.map((l,j)=><li key={j}>{inline(l.replace(/^\d+\. /,''))}</li>)}</ol>;
  return <p key={i}>{lines.map((l,j)=><span key={j}>{j>0&&<br/>}{inline(l)}</span>)}</p>;
 })}</article>;
}
