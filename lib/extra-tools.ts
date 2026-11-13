export const extraToolSlugs=new Set([
'trim-text','remove-empty-lines','add-line-numbers','remove-line-numbers','reverse-lines','shuffle-lines','extract-emails','extract-urls','extract-numbers','rot13-encoder','text-to-morse','morse-to-text','word-frequency','sentence-counter','paragraph-counter','prefix-lines','suffix-lines','find-replace','remove-punctuation','remove-numbers','json-sort-keys','json-escape','json-unescape','unix-to-date','date-to-unix','url-parser','query-string-parser','query-string-builder','unicode-to-hex','hex-to-text','text-to-ascii','ascii-to-text','strip-html-tags','html-to-text','css-minifier','bmi-calculator','loan-calculator','simple-interest-calculator','compound-interest-calculator','vat-calculator','profit-margin-calculator','markup-calculator','percentage-change','ratio-calculator','speed-calculator','rectangle-area','circle-area','celsius-to-fahrenheit','fahrenheit-to-celsius','km-to-miles','miles-to-km','kg-to-lbs','lbs-to-kg','cm-to-inches','inches-to-cm'
]);
export const extraHints:Record<string,string>={
'prefix-lines':'First line: prefix. Remaining lines: text to modify.',
'suffix-lines':'First line: suffix. Remaining lines: text to modify.',
'find-replace':'First line: text to find. Second line: replacement. Remaining lines: text to edit.',
'bmi-calculator':'Weight in kg, height in meters. Example: 70 1.75',
'loan-calculator':'Loan principal, annual interest rate %, term in years. Example: 100000 6 20',
'simple-interest-calculator':'Principal, annual rate %, years. Example: 1000 5 3',
'compound-interest-calculator':'Principal, annual rate %, years. Compounded annually.',
'vat-calculator':'Price and VAT rate %. Example: 100 20',
'profit-margin-calculator':'Cost and selling price. Example: 60 100',
'markup-calculator':'Cost and selling price. Example: 60 100',
'percentage-change':'Original value and new value. Example: 80 100',
'ratio-calculator':'Two positive integers. Example: 12 18',
'speed-calculator':'Distance in kilometers and time in hours. Example: 150 2.5',
'rectangle-area':'Length and width, in the same unit. Example: 8 5',
'circle-area':'Radius. Example: 4',
'unix-to-date':'Unix timestamp in seconds, e.g. 1700000000',
'date-to-unix':'ISO date or date-time, e.g. 2026-11-13T12:00:00Z',
'query-string-builder':'One key=value pair per line.',
'query-string-parser':'Paste a query string, e.g. ?name=Jane&age=30',
'json-unescape':'Enter a valid JSON string literal, including double quotes.',
'hex-to-text':'UTF-8 hexadecimal bytes, e.g. 48 65 6c 6c 6f',
'ascii-to-text':'Decimal Unicode code points separated by spaces.',
'text-to-morse':'Use letters A–Z, digits 0–9 and spaces.',
'morse-to-text':'Separate Morse letters with spaces and words with /.'
};
const morse:Record<string,string>={A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..','0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.'};
const n=(s:string)=>{const v=Number(s);if(!s.trim()||!Number.isFinite(v))throw Error('Enter valid finite numbers.');return v};
const nums=(s:string,count:number)=>{const v=s.trim().split(/[\s,]+/);if(v.length!==count)throw Error('Enter '+count+' numbers separated by spaces or commas.');return v.map(n)};
const round=(v:number)=>{if(!Number.isFinite(v))throw Error('Result is too large.');return String(Number(v.toFixed(8)))};
const gcd=(a:number,b:number):number=>b?gcd(b,a%b):a;
export function runExtraTool(slug:string,input:string):string{
 const lines=input.split(/\r?\n/);let a:number,b:number,c:number;
 switch(slug){
 case 'trim-text':return input.trim();
 case 'remove-empty-lines':return lines.filter(x=>x.trim().length>0).join('\n');
 case 'add-line-numbers':return lines.map((x,i)=>(i+1)+'. '+x).join('\n');
 case 'remove-line-numbers':return lines.map(x=>x.replace(/^\s*\d+[.):\-]\s*/,'')).join('\n');
 case 'reverse-lines':return lines.reverse().join('\n');
 case 'shuffle-lines':{const result=[...lines];for(let i=result.length-1;i>0;i--){const values=new Uint32Array(1);crypto.getRandomValues(values);const j=values[0]%(i+1);[result[i],result[j]]=[result[j],result[i]]}return result.join('\n')}
 case 'extract-emails':return [...new Set(input.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)||[])].join('\n');
 case 'extract-urls':return [...new Set(input.match(/https?:\/\/[^\s<>"']+/gi)||[])].join('\n');
 case 'extract-numbers':return (input.match(/[-+]?\d+(?:\.\d+)?/g)||[]).join('\n');
 case 'rot13-encoder':return input.replace(/[a-z]/gi,ch=>String.fromCharCode(ch.charCodeAt(0)+(ch.toLowerCase()<='m'?13:-13)));
 case 'text-to-morse':return input.toUpperCase().split(' ').map(word=>[...word].map(ch=>{if(!morse[ch])throw Error('Only A-Z, 0-9 and spaces are supported.');return morse[ch]}).join(' ')).join(' / ');
 case 'morse-to-text':{const reverse=Object.fromEntries(Object.entries(morse).map(([k,v])=>[v,k]));return input.trim().split(/\s*\/\s*/).map(word=>word.split(/\s+/).map(code=>{if(!reverse[code])throw Error('Invalid Morse code: '+code);return reverse[code]}).join('')).join(' ')}
 case 'word-frequency':{const words=input.toLowerCase().match(/[\p{L}\p{N}']+/gu)||[];const counts=new Map<string,number>();words.forEach(w=>counts.set(w,(counts.get(w)||0)+1));return [...counts].sort((x,y)=>y[1]-x[1]||x[0].localeCompare(y[0])).map(([w,count])=>w+': '+count).join('\n')}
 case 'sentence-counter':return 'Estimated sentences: '+(input.trim()?(input.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[]).filter(x=>x.trim()).length:0);
 case 'paragraph-counter':return 'Paragraphs: '+(input.trim()?input.trim().split(/\n\s*\n/).filter(x=>x.trim()).length:0);
 case 'prefix-lines':if(lines.length<2)throw Error('Enter a prefix on the first line and text below.');return lines.slice(1).map(x=>lines[0]+x).join('\n');
 case 'suffix-lines':if(lines.length<2)throw Error('Enter a suffix on the first line and text below.');return lines.slice(1).map(x=>x+lines[0]).join('\n');
 case 'find-replace':if(lines.length<3||!lines[0])throw Error('Enter search text, replacement text and content on separate lines.');return lines.slice(2).join('\n').split(lines[0]).join(lines[1]);
 case 'remove-punctuation':return input.replace(/[^\p{L}\p{N}\s]/gu,'');
 case 'remove-numbers':return input.replace(/\p{N}/gu,'');
 case 'json-sort-keys':{const sort=(v:unknown):unknown=>Array.isArray(v)?v.map(sort):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b)).map(([k,val])=>[k,sort(val)])):v;return JSON.stringify(sort(JSON.parse(input)),null,2)}
 case 'json-escape':return JSON.stringify(input);
 case 'json-unescape':{const value=JSON.parse(input);if(typeof value!=='string')throw Error('Input must be a JSON string literal.');return value}
 case 'unix-to-date':{const seconds=n(input);const date=new Date(seconds*1000);if(!Number.isFinite(date.getTime()))throw Error('Invalid timestamp.');return date.toISOString()}
 case 'date-to-unix':{const time=Date.parse(input);if(!Number.isFinite(time))throw Error('Enter a valid ISO date.');return String(Math.floor(time/1000))}
 case 'url-parser':{const u=new URL(input.trim());if(!['http:','https:'].includes(u.protocol))throw Error('Enter an HTTP or HTTPS URL.');return ['Protocol: '+u.protocol,'Host: '+u.host,'Path: '+u.pathname,'Query: '+u.search,'Fragment: '+u.hash].join('\n')}
 case 'query-string-parser':{const q=input.trim().replace(/^\?/,'');return [...new URLSearchParams(q)].map(([k,v])=>k+' = '+v).join('\n')}
 case 'query-string-builder':{const q=new URLSearchParams();lines.filter(x=>x.trim()).forEach(line=>{const i=line.indexOf('=');if(i<1)throw Error('Each line must be key=value.');q.append(line.slice(0,i).trim(),line.slice(i+1).trim())});return '?'+q.toString()}
 case 'unicode-to-hex':return [...new TextEncoder().encode(input)].map(x=>x.toString(16).padStart(2,'0')).join(' ');
 case 'hex-to-text':{const clean=input.replace(/\s+/g,'');if(!clean||clean.length%2||!/^[0-9a-f]+$/i.test(clean))throw Error('Enter an even number of hex digits.');return new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(clean.match(/../g)!,x=>parseInt(x,16)))}
 case 'text-to-ascii':return [...input].map(x=>x.codePointAt(0)).join(' ');
 case 'ascii-to-text':return nums(input,input.trim().split(/[\s,]+/).length).map(x=>{if(!Number.isInteger(x)||x<0||x>0x10ffff||(x>=0xd800&&x<=0xdfff))throw Error('Invalid Unicode code point.');return String.fromCodePoint(x)}).join('');
 case 'strip-html-tags':return new DOMParser().parseFromString(input,'text/html').body.textContent||'';
 case 'html-to-text':return new DOMParser().parseFromString(input,'text/html').body.innerText||new DOMParser().parseFromString(input,'text/html').body.textContent||'';
 case 'css-minifier':return input.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s*([{}:;,])\s*/g,'$1').replace(/;\}/g,'}').trim();
 case 'bmi-calculator':[a,b]=nums(input,2);if(a<=0||b<=0||b>3)throw Error('Enter positive weight (kg) and height (meters).');return 'BMI: '+round(a/(b*b))+' (screening estimate, not a diagnosis)';
 case 'loan-calculator':{[a,b,c]=nums(input,3);if(a<0||b<0||c<=0||c>100)throw Error('Enter nonnegative principal/rate and term 0–100 years.');const months=c*12,rate=b/1200;return 'Estimated monthly payment: '+round(rate===0?a/months:a*rate/(1-Math.pow(1+rate,-months)))}
 case 'simple-interest-calculator':[a,b,c]=nums(input,3);if(a<0||b<0||c<0)throw Error('Enter nonnegative values.');return 'Interest: '+round(a*b*c/100)+'\nTotal: '+round(a*(1+b*c/100));
 case 'compound-interest-calculator':[a,b,c]=nums(input,3);if(a<0||b<0||c<0||c>100)throw Error('Enter nonnegative values and up to 100 years.');return 'Final balance: '+round(a*Math.pow(1+b/100,c))+'\nInterest earned: '+round(a*(Math.pow(1+b/100,c)-1));
 case 'vat-calculator':[a,b]=nums(input,2);if(a<0||b<0)throw Error('Enter nonnegative price and tax rate.');return 'VAT: '+round(a*b/100)+'\nTotal including VAT: '+round(a*(1+b/100));
 case 'profit-margin-calculator':[a,b]=nums(input,2);if(a<0||b<=0)throw Error('Selling price must be greater than zero.');return 'Profit: '+round(b-a)+'\nGross margin: '+round((b-a)/b*100)+'%';
 case 'markup-calculator':[a,b]=nums(input,2);if(a<=0||b<0)throw Error('Cost must be greater than zero.');return 'Markup: '+round((b-a)/a*100)+'%\nProfit: '+round(b-a);
 case 'percentage-change':[a,b]=nums(input,2);if(a===0)throw Error('Original value cannot be zero.');return 'Percentage change: '+round((b-a)/Math.abs(a)*100)+'%';
 case 'ratio-calculator':[a,b]=nums(input,2);if(!Number.isSafeInteger(a)||!Number.isSafeInteger(b)||a<=0||b<=0)throw Error('Enter two positive integers.');{const d=gcd(a,b);return a/d+':'+b/d}
 case 'speed-calculator':[a,b]=nums(input,2);if(a<0||b<=0)throw Error('Distance must be nonnegative and time positive.');return 'Speed: '+round(a/b)+' km/h';
 case 'rectangle-area':[a,b]=nums(input,2);if(a<0||b<0)throw Error('Dimensions cannot be negative.');return 'Area: '+round(a*b)+' square units';
 case 'circle-area':a=n(input);if(a<0)throw Error('Radius cannot be negative.');return 'Area: '+round(Math.PI*a*a)+' square units';
 case 'celsius-to-fahrenheit':return round(n(input)*9/5+32)+' °F';
 case 'fahrenheit-to-celsius':return round((n(input)-32)*5/9)+' °C';
 case 'km-to-miles':return round(n(input)*0.6213711922)+' miles';
 case 'miles-to-km':return round(n(input)/0.6213711922)+' km';
 case 'kg-to-lbs':return round(n(input)*2.2046226218)+' lb';
 case 'lbs-to-kg':return round(n(input)/2.2046226218)+' kg';
 case 'cm-to-inches':return round(n(input)/2.54)+' inches';
 case 'inches-to-cm':return round(n(input)*2.54)+' cm';
 default:throw Error('Tool is not supported');
 }
}
