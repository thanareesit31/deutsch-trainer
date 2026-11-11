import {readFile,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const root=new URL('../../',import.meta.url);
export async function buildPracticeWordHelp(){
 const support=JSON.parse(await readFile(new URL('docs/exercise-mapping/practice-thai-support.json',root),'utf8'));
 const catalog=JSON.parse(await readFile(new URL('supabase/seed/catalog.json',root),'utf8'));
 const glossary={};
 for(const item of catalog.items){
  if(item.skill!=='vocabulary'||!item.meaning)continue;
  for(const form of [item.word,item.answer]){
   const word=(form||'').replace(/^(der|die|das)\s/u,'').trim();
   if(/^\p{L}+$/u.test(word))glossary[word.toLocaleLowerCase('de')]=item.meaning;
  }
 }
 for(const [word,meaning]of Object.entries(support.glossary))glossary[word]=meaning;
 return {glossary,phrases:support.phrases};
}
export async function readPracticeTemplate(){
 const template=await readFile(new URL('scripts/exercise-mapping/preview-template.html',root),'utf8');
 const styles=await readFile(new URL('src/app/globals.css',root),'utf8');
 const names=['--sentence-time','--sentence-auxiliary','--sentence-subject','--sentence-main-verb','--sentence-other'];
 const tokens=names.map(name=>{const value=styles.match(new RegExp(name+':\\s*([^;]+);'))?.[1];if(!value)throw Error('Missing sentence token '+name);return name+':'+value+';';}).join('');
 return template.replace('__SENTENCE_COLORS__',()=>tokens).replace('__WORD_HELP__',()=>JSON.stringify(sharedHelp));
}
const sharedHelp=await buildPracticeWordHelp();
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url){
 await writeFile(new URL('src/data/practice-word-help.json',root),JSON.stringify(sharedHelp)+'\n');
 console.log('Built shared word meanings:',Object.keys(sharedHelp.glossary).length);
}
