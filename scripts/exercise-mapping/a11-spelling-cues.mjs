import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile, mkdir, writeFile } from 'node:fs/promises';

const contexts = {
 'extra-L01-11': 'เติมคำกริยา: Woher ___ Sie? — Aus Thailand.',
 'extra-L01-12': 'จากประโยค Wie heißt du? ใช้รูปคำกริยาที่ยังไม่ผันของ heißt',
 'extra-L01-13': 'เติมคำกริยา: Ich ___ Deutsch in einem Kurs. ใช้รูปคำกริยาที่ยังไม่ผัน',
 'extra-L01-14': 'เติมคำกริยา: Ich bin Student. คำว่า bin มาจากรูปคำกริยาที่ยังไม่ผันคำใด',
 'extra-L01-15': 'เติมคำกริยา: Welche Sprachen ___ Sie? ใช้รูปคำกริยาที่ยังไม่ผัน',
 'extra-L01-16': 'เติมคำกริยา: Wo ___ Sie? — In Bangkok. ใช้รูปคำกริยาที่ยังไม่ผัน',
 V190: 'คู่คำเรียกผู้ใหญ่: die Frau และคำที่ใช้เรียกผู้ชายหนึ่งคน',
 V191: 'คู่คำเรียกผู้ใหญ่: der Mann และคำที่ใช้เรียกผู้หญิงหนึ่งคน',
 V192: 'พี่ชายหรือน้องชายของพ่อหรือแม่ เป็นญาติคนใดของเรา',
 V193: 'พี่สาวหรือน้องสาวของพ่อหรือแม่ เป็นญาติคนใดของเรา',
 V194: 'ลูกชายของพี่หรือน้อง เป็นญาติคนใดของเรา',
 V195: 'ลูกสาวของพี่หรือน้อง เป็นญาติคนใดของเรา',
 V196: 'ผู้ชายที่เราเรียกว่าเพื่อน หรือใช้เรียกแฟนผู้ชายได้',
 V197: 'ผู้หญิงที่เราเรียกว่าเพื่อน หรือใช้เรียกแฟนผู้หญิงได้',
 V085: 'กระดาษใบเล็กที่มอบให้ผู้มาติดต่อ มีชื่อ อาชีพ บริษัท และช่องทางติดต่อ',
 V210: 'ดูตารางรถไฟ: คอลัมน์เวลาที่รถออกจากสถานี ใช้คำสั้นสองตัวอักษรใด',
 V211: 'ดูตารางรถไฟ: คอลัมน์เวลาที่รถถึงสถานี ใช้คำสั้นสองตัวอักษรใด',
};
const flagPaths = {
 Thailand: '<path fill="#ed1c24" d="M0 0h300v200H0z"/><path fill="white" d="M0 33h300v134H0z"/><path fill="#241d4f" d="M0 67h300v66H0z"/>',
 Deutschland: '<path d="M0 0h300v67H0z"/><path fill="#d00" d="M0 67h300v66H0z"/><path fill="#ffce00" d="M0 133h300v67H0z"/>',
 Österreich: '<path fill="#ed2939" d="M0 0h300v200H0z"/><path fill="white" d="M0 67h300v66H0z"/>',
 Schweiz: '<path fill="#da291c" d="M50 0h200v200H50z"/><path fill="white" d="M130 40h40v120h-40zM90 80h120v40H90z"/>',
 Türkei: '<path fill="#e30a17" d="M0 0h300v200H0z"/><circle fill="white" cx="112" cy="100" r="50"/><circle fill="#e30a17" cx="126" cy="100" r="40"/><path fill="white" d="m161 100 32-10-20 27v-34l20 27z"/>',
 Japan: '<path fill="white" d="M0 0h300v200H0z"/><circle fill="#bc002d" cx="150" cy="100" r="60"/>',
 China: '<path fill="#de2910" d="M0 0h300v200H0z"/><g fill="#ffde00"><path d="m50 20 7 22h23l-19 14 7 22-18-14-19 14 7-22-19-14h24z"/><path id="s" d="m100 16 3 8h8l-6 5 2 8-7-5-7 5 3-8-7-5h8z"/><use href="#s" transform="translate(20 20)"/><use href="#s" transform="translate(20 47)"/><use href="#s" transform="translate(0 66)"/></g>',
 Frankreich: '<path fill="#002395" d="M0 0h100v200H0z"/><path fill="white" d="M100 0h100v200H100z"/><path fill="#ed2939" d="M200 0h100v200H200z"/>',
 Spanien: '<path fill="#aa151b" d="M0 0h300v200H0z"/><path fill="#f1bf00" d="M0 50h300v100H0z"/>',
 Italien: '<path fill="#009246" d="M0 0h100v200H0z"/><path fill="white" d="M100 0h100v200H100z"/><path fill="#ce2b37" d="M200 0h100v200H200z"/>',
};
export async function buildSpellingCues({ root, words, imageContent }) {
 const output = new URL('public/images/a11-spelling-cues/', root);
 await mkdir(output, { recursive: true });
 const migration = await readFile(new URL('supabase/migrations/20261007010000_l02_learning_content.sql', root), 'utf8');
 const professions = new Map();
 for (const match of migration.matchAll(/'(\{[^\n]*?\})'::jsonb/g)) {
  const item = JSON.parse(match[1]);
  if(item.professionContent)for(const form of ['masculine','feminine'])professions.set(item.professionContent[form],item.professionContent.conceptKey);
 }
 const entries = imageContent.lessonVocabularyImageEntries(words, Array.from({length:12},(_,i)=>'L'+String(i+1).padStart(2,'0')).flatMap(id=>imageContent.lessonVocabularyImageGroups(words,id)));
 const cues={};
 for(const word of words){
  let src;
  if(flagPaths[word.word]){
   const filename=word.id+'.svg';
   await writeFile(new URL(filename, output),'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200">'+flagPaths[word.word]+'</svg>\n');
   src='/images/a11-spelling-cues/'+filename;
  }else if(imageContent.l12MonthNumberById[word.id]){
   const number=imageContent.l12MonthNumberById[word.id];
   await writeFile(new URL(word.id+'.svg',output),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220"><rect x="20" y="15" width="260" height="190" rx="18" fill="#fff" stroke="#295640" stroke-width="3"/><path fill="#295640" d="M20 55V33q0-18 18-18h224q18 0 18 18v22z"/><text x="150" y="150" text-anchor="middle" font-family="sans-serif" font-size="82" fill="#295640">${String(number).padStart(2,'0')}</text></svg>\n`);
   src='/images/a11-spelling-cues/'+word.id+'.svg';
  }else if(professions.has(word.word))src='/images/lektion-2-profession-pairs/'+professions.get(word.word)+'.webp';
  else if(word.lessonId==='L01'){
   const image=imageContent.vocabularyImageEntries.find(entry=>entry.id===word.id)?.image;
   if(image)src='/images/lektion-1-core-vocabulary-images/'+image+'.jpg';
  }else{
   const entry=entries.find(entry=>entry.itemIds.includes(word.id));
   src=imageContent.catalogVocabularyImageSource(word.lessonId,entry?.image??word.image??word.id);
  }
  if(src&&!existsSync(new URL('public'+src,root)))src=undefined;
  if(src?.endsWith('.svg')){
   const svg=await readFile(new URL('public'+src,root),'utf8');
   const text=[...svg.matchAll(/<text[^>]*>([\s\S]*?)<\/text>/g)].map(m=>m[1].replace(/<[^>]+>/g,'')).join(' ').toLocaleLowerCase('de');
   if(word.word.split(' / ').some(form=>text.includes(form.toLocaleLowerCase('de'))))src=undefined;
  }
  const context=contexts[word.id];
  assert(src||context,`Missing reviewed spelling cue: ${word.id} ${word.word}`);
  cues[word.id]=src?{kind:'image',src,...(word.lessonId==='L02'?{context:word.article==='die'?'ใช้คำเรียกอาชีพสำหรับผู้หญิง':'ใช้คำเรียกอาชีพสำหรับผู้ชาย'}:{}),...(imageContent.l12MonthNumberById[word.id]?{context:'เดือนที่แสดงบนปฏิทิน'}:{})}:{kind:'context',context};
 }
 return cues;
}
