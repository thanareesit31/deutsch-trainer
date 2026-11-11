import {execFileSync} from 'node:child_process';
import {readFile,readdir} from 'node:fs/promises';
const root=new URL('../../',import.meta.url);
for(const script of ['practice-word-help.mjs','build-a11-vocabulary.mjs','build-a11-grammar.mjs','build-a11-phrases.mjs','build-preview.mjs','build-a13-grammar-banks.mjs','build-l13-vocabulary.mjs','build-l13-phrases.mjs','build-phrase-practice-upgrade.mjs']){
 execFileSync(process.execPath,[new URL(script,import.meta.url).pathname],{cwd:root,stdio:'inherit'});
}
let count=0;
for(const file of await readdir(new URL('src/data/',root))){
 if(!file.endsWith('-preview.json'))continue;
 const {html}=JSON.parse(await readFile(new URL('src/data/'+file,root),'utf8'));
 if(html.includes('__SENTENCE_COLORS__')||html.includes('__WORD_HELP__')||html.includes('__PLANNER__')||html.includes('__BANK__'))throw new Error('Unresolved preview template: '+file);
 count++;
}
console.log(`Validated ${count} generated preview files.`);
