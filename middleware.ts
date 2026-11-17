import {NextRequest,NextResponse} from 'next/server';

export function middleware(request:NextRequest){
 const accept=request.headers.get('accept')||'';
 const wantsMarkdown=/(?:^|,)\s*text\/markdown(?:\s*;|\s*,|\s*$)/i.test(accept);
 if(wantsMarkdown){
  const url=request.nextUrl.clone();url.pathname='/index.md';
  const response=NextResponse.rewrite(url);
  response.headers.set('Content-Type','text/markdown; charset=utf-8');
  response.headers.set('Vary','Accept');
  response.headers.set('Link','</llms.txt>; rel="describedby"; type="text/plain", </index.md>; rel="alternate"; type="text/markdown"');
  return response;
 }
 const response=NextResponse.next();
 response.headers.set('Vary','Accept');
 response.headers.set('Link','</llms.txt>; rel="describedby"; type="text/plain", </index.md>; rel="alternate"; type="text/markdown"');
 return response;
}
export const config={matcher:['/']};
