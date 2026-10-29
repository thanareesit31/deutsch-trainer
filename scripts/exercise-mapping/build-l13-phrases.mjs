import ts from 'typescript';
import { buildPhraseSequence } from './l13-phrase-sequence.mjs';
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../../',import.meta.url);const read=p=>readFile(new URL(p,root),'utf8');
const catalog=JSON.parse(await read('supabase/seed/catalog.json'));const items=catalog.items.filter(i=>i.lessonId==='L13'&&i.skill==='phrases');
const groups=[{slug:'rating',group:'Orte bewerten',title:'แสดงความคิดเห็นต่อสถานที่'},{slug:'city',group:'Es gibt in der Stadt',title:'สิ่งที่มีในเมือง'},{slug:'favorite',group:'Lieblingsort',title:'สถานที่โปรด'},{slug:'opinions',group:'Meinung & Fragen',title:'ถามและแลกเปลี่ยนความคิดเห็น'}].map(g=>({...g,topicId:'L13-phrases-'+g.slug,ids:items.filter(i=>i.group===g.group).map(i=>i.id)}));
const situations=[
'คุณอยากบอกว่าชอบเบอร์ลิน โดยยังไม่เน้นว่าชอบมาก',
'คุณชอบเบอร์ลินมาก และต้องการเน้นระดับความชอบ',
'คุณกำลังชี้สิ่งหนึ่งและบอกว่าชอบสิ่งนั้นเป็นพิเศษ',
'คุณอยากชมว่าเมืองนี้ยอดเยี่ยม โดยใช้ ich finde',
'คุณอยากบอกว่าเบอร์ลินน่าสนใจ โดยใช้ ich finde',
'คุณอยากบอกว่าเมืองนี้แตกต่างจริง ๆ โดยไม่ได้บอกว่าใหญ่หรือเล็ก',
'คุณรู้สึกว่าเมืองนี้ใหญ่เกินไป โดยเริ่มพูดถึง die Stadt',
'เพื่อนบอกข่าวดี คุณตอบรับด้วยคำว่า super',
'เพื่อนเล่าเรื่องน่าตื่นเต้น คุณตอบรับด้วยคำว่า cool',
'คุณต้องการถามว่าที่นี่มีอะไรบ้าง',
'คุณต้องการบอกว่าที่นี่มีสวนสาธารณะ',
'คุณต้องการบอกว่ามีโบสถ์หลายแห่ง',
'คุณกำลังเพิ่มข้อมูลว่ามีคาเฟ่ด้วย',
'คุณต้องการบอกว่าบริเวณใกล้เคียงมีทะเลสาบด้วย',
'คุณเสียดายที่ไม่มีท่าเรือ',
'คุณต้องการบอกว่าไม่มีย่านเมืองเก่า โดยไม่เพิ่มความรู้สึกเสียดาย',
'คุณถามคู่สนทนาอย่างสุภาพว่าสถานที่โปรดคือที่ไหน',
'คุณบอกว่าสถานที่โปรดของคุณคือสวนสาธารณะ',
'คุณบอกว่ารักธรรมชาติ',
'คุณบอกว่าสามารถเดินเล่นที่นั่นได้',
'คุณเพิ่มข้อมูลว่าสามารถตกปลาที่นั่นได้ด้วย',
'คุณบอกว่าพวกเราพบเพื่อนที่นั่น',
'คุณเสียดายที่ไม่มีสนามฟุตบอล',
'คุณถามความเห็นของคู่สนทนาอย่างสุภาพเกี่ยวกับเบอร์ลิน',
'คุณถามอย่างสุภาพว่าอยากไปเที่ยวเบอร์ลินไหม',
'คุณคิดว่าเบอร์ลินน่าสนใจมาก และต้องการเริ่มด้วย ich glaube',
'คุณอยากบอกความเห็นว่าเมืองนี้ใหญ่เกินไป โดยใช้ ich finde',
'คุณถามคู่สนทนาอย่างสุภาพว่าชอบอะไรเป็นพิเศษ',
'คุณถามอย่างสุภาพว่าคู่สนทนารู้สึกว่าขาดอะไร',
];
const gaps=['gefällt','sehr','besonders','finde','interessant','anders','zu','super','cool','gibt','einen','viele','auch','Nähe','keinen','keine','Ihr','Mein','liebe','spazieren','angeln','treffen','keinen','finden','besuchen','glaube,','groß','Ihnen','fehlt'];
const completionNotes=[
'gefallen ใช้บอกสิ่งที่ชอบ ในประโยคนี้ Berlin เป็นเอกพจน์จึงใช้ gefällt',
'sehr ช่วยเน้นว่าชอบมากกว่าการพูดเพียง Berlin gefällt mir',
'besonders gut ใช้เน้นว่าชอบสิ่งนั้นเป็นพิเศษ',
'เมื่อประธานเป็น ich กริยา finden ใช้รูป finde',
'interessant หมายถึงน่าสนใจ ใช้บอกความเห็นต่อเบอร์ลิน',
'anders หมายถึงแตกต่าง ใช้บอกลักษณะของเมืองนี้',
'zu groß หมายถึงใหญ่เกินไป คำว่า zu จึงเปลี่ยนความหมายจากแค่ใหญ่',
'super เป็นคำชมว่าเยี่ยมหรือยอดเยี่ยม',
'cool เป็นคำแสดงความรู้สึกเชิงบวกว่าเจ๋ง',
'คำถาม Was gibt es hier? ใช้โครงสร้าง es gibt เพื่อถามว่าสถานที่นี้มีอะไร',
'Park เป็นคำนามเพศชาย หลัง es gibt จึงใช้ einen Park',
'Kirchen เป็นพหูพจน์ ใช้ viele เพื่อบอกว่ามีหลายแห่ง',
'auch หมายถึงด้วย ใช้เพิ่มข้อมูลว่ามีคาเฟ่เช่นกัน',
'in der Nähe หมายถึงในบริเวณใกล้เคียง โดย Nähe ขึ้นต้นด้วย N ตัวใหญ่และใช้ ä',
'Hafen เป็นคำนามเพศชาย หลัง es gibt ใช้ keinen Hafen เพื่อบอกว่าไม่มีท่าเรือ',
'Altstadt เป็นคำนามเพศหญิง รูปปฏิเสธในประโยคนี้จึงเป็น keine Altstadt',
'Ihr ในคำถามนี้หมายถึงของคุณ ใช้ถามคู่สนทนาอย่างสุภาพ',
'Mein Lieblingsort หมายถึงสถานที่โปรดของฉัน โดย Lieblingsort ใช้ der จึงเป็น mein เมื่อขึ้นต้นประโยคจึงเขียน Mein',
'เมื่อประธานเป็น ich กริยา lieben ใช้รูป liebe',
'spazieren gehen เป็นวลีหมายถึงเดินเล่น ต้องมีทั้งสองคำ',
'angeln หมายถึงตกปลา ในประโยคที่มี kann กริยาหลักอยู่ท้ายในรูป Infinitiv',
'เมื่อประธานเป็น wir กริยา treffen ใช้รูป treffen',
'Fußballplatz เป็นคำนามเพศชาย หลัง es gibt ใช้ keinen Fußballplatz เพื่อบอกว่าไม่มี',
'Sie รูปสุภาพใช้ finden ในคำถาม Wie finden Sie Berlin?',
'möchten ใช้คู่กับกริยา besuchen ในรูป Infinitiv ที่ท้ายประโยค',
'Ich glaube ใช้เริ่มบอกความคิดหรือความเห็นของผู้พูด',
'groß หมายถึงใหญ่ เมื่อมี zu อยู่ข้างหน้าจึงหมายถึงใหญ่เกินไป และคำนี้ใช้ ß',
'gefallen ใช้ Dativ รูปสุภาพของ Sie จึงเป็น Ihnen',
'fehlen ใช้ถามถึงสิ่งที่ขาด คำถามนี้จึงใช้ Was fehlt Ihnen?',
];
function orderNote(item,tokens){
 if(item.id==='L13-R026')return 'หลัง Ich glaube, เป็นข้อความบอกความเห็น โดย Berlin ist เป็นลำดับประธานตามด้วยกริยา';
 if(item.id==='L13-R025')return 'คำถามนี้เริ่มด้วย Möchten ตามด้วย Sie และวาง besuchen ไว้ท้ายประโยค';
 if(item.id==='L13-R014')return 'In der Nähe เป็นส่วนบอกสถานที่หนึ่งชุด ตามด้วย gibt es แล้วจึงบอกสิ่งที่มี';
 if(item.id==='L13-R018')return 'Mein Lieblingsort เป็นประธานหนึ่งชุด ตามด้วย ist แล้วจึงบอกสถานที่';
 if(item.answer.startsWith('Die Stadt'))return 'Die Stadt เป็นประธานหนึ่งชุด ตามด้วย ist แล้วจึงบอกลักษณะของเมือง';
 if(item.answer.startsWith('Dort kann'))return 'Dort อยู่ต้นประโยค ตามด้วย kann และวางกริยาหลักไว้ท้ายประโยค';
 if(item.answer.startsWith('Was ')||item.answer.startsWith('Wie '))return 'คำถามนี้เริ่มด้วย '+tokens[0]+' ตามด้วยคำกริยา '+tokens[1];
 if(item.answer.startsWith('Leider'))return 'Leider อยู่ต้นประโยค ตามด้วย gibt es แล้วจึงบอกสิ่งที่ไม่มี';
 return 'ประโยคนี้เริ่มด้วย '+tokens[0]+' ตามด้วยคำกริยา '+tokens[1];
}
const questions=[];const provenance=[];
for(const item of items){
 const index=Number(item.id.slice(-3))-1;
 const group=groups.find(g=>g.group===item.group);assert(group&&situations[index]&&gaps[index]);
 const base={version:1,itemId:item.id,requiredItemIds:[item.id],topicId:group.topicId,topicName:group.title,difficulty:1,knownErrors:{},translation:item.meaning,feedbackAnswer:item.answer};
 const distractors=items.filter(i=>i.id!==item.id&&i.answer!==item.answer);const options=[item.answer,...Array.from({length:3},(_,n)=>distractors[(index+n*7)%distractors.length].answer)];assert.equal(new Set(options).size,4);
 questions.push({...base,id:item.id+'-context',kind:'choice',subskill:'phrase_context',prompt:'เลือกประโยคให้เหมาะกับสถานการณ์',sentence:situations[index]+' — ___',sentenceLang:'th',options,acceptedAnswers:[item.answer],explanation:''});
 // Keep attached punctuation outside the answer blank.
 const gap=gaps[index].replace(/[,!?\.]+$/u,'');const position=item.answer.indexOf(gap);assert(position>=0,item.id);const sentence=item.answer.slice(0,position)+'___'+item.answer.slice(position+gap.length);
 questions.push({...base,id:item.id+'-completion',kind:'cloze',subskill:'phrase_completion',prompt:'เติมคำให้ได้ประโยคที่เรียน',sentence,acceptedAnswers:[gap],explanation:completionNotes[index]});
 const tokens=item.answer.split(' ');questions.push({...base,id:item.id+'-order',kind:'order',subskill:'phrase_order',prompt:'เรียงประโยคที่เรียน โดยเริ่มด้วย '+tokens[0],tokens,acceptedAnswers:[item.answer],explanation:orderNote(item,tokens),difficulty:2});
 provenance.push({itemId:item.id,sourceId:'DEUTSCH_TRAINER_ORIGINAL',repositoryFile:'supabase/seed/catalog.json',originalGroup:item.group,method:'repository_inspection',publisherPage:null,questionIds:questions.filter(q=>q.itemId===item.id).map(q=>q.id),inspectedAt:'2026-10-22',note:'Original web tasks derived from existing project phrases; not a claim of inspected publisher exercises.'});
}
for(const [first,second] of [['L13-R010','L13-R011'],['L13-R017','L13-R018'],['L13-R024','L13-R026']]){
 const a=items.find(i=>i.id===first),b=items.find(i=>i.id===second),group=groups.find(g=>g.group===a.group);assert(group&&a&&b);
 questions.push({id:first+'-dialogue',version:1,itemId:first,requiredItemIds:[first,second],topicId:group.topicId,topicName:group.title,kind:'order',subskill:'phrase_dialogue',prompt:'เรียงบทสนทนาให้คำถามมาก่อนคำตอบ',tokens:[a.answer,b.answer],orderUnit:'ประโยค',acceptedAnswers:[a.answer+' '+b.answer],feedbackAnswer:a.answer+' '+b.answer,translation:a.meaning+' / '+b.meaning,explanation:'เริ่มจากคำถาม แล้วตามด้วยคำตอบที่ให้ข้อมูลตรงกับคำถาม',difficulty:2,knownErrors:{}});
 provenance.push({questionId:first+'-dialogue',sourceItemIds:[first,second],sourceId:'DEUTSCH_TRAINER_ORIGINAL',method:'repository_inspection',publisherPage:null,inspectedAt:'2026-10-22',note:'New dialogue task combines two existing learned project phrases.'});
}
for(const group of groups){
 const related=items.filter(item=>item.group===group.group).slice(3,6);
 questions.push({id:related[0].id+'-comprehension',version:1,itemId:related[0].id,requiredItemIds:related.map(item=>item.id),topicId:group.topicId,topicName:group.title,kind:'choice',subskill:'phrase_comprehension',prompt:'อ่านข้อความ แล้วเลือกความหมายของประโยคแรก',sentence:related.map(item=>item.answer).join(' '),sentenceLang:'de',options:related.map(item=>item.meaning),optionsLang:'th',acceptedAnswers:[related[0].meaning],feedbackAnswer:related.map(item=>item.answer).join(' '),translation:related.map(item=>item.meaning).join(' · '),explanation:'พิจารณาประโยคแรก แล้วเทียบกับความหมายภาษาไทยที่เลือก',difficulty:2,knownErrors:{}});
 const required=group.ids.slice(0,Math.min(3,group.ids.length));
 provenance.push({questionId:related[0].id+'-comprehension',sourceIds:related.map(item=>item.id),sourceId:'DEUTSCH_TRAINER_ORIGINAL',repositoryFile:'supabase/seed/catalog.json',method:'repository_inspection',publisherPage:null,inspectedAt:'2026-10-22',note:'New reading comprehension built from three learned project phrases; not copied from a publisher activity.'});
 questions.push({id:group.topicId+'-write',version:2,itemId:required[0],requiredItemIds:required,topicId:group.topicId,topicName:group.title,kind:'write',subskill:'phrase_application',prompt:group.slug==='favorite'?'เขียน 2–3 ประโยคเกี่ยวกับสถานที่โปรดของคุณ':group.slug==='city'?'เขียน 2–3 ประโยคบอกว่ามีอะไรในเมืองที่คุณรู้จัก':group.slug==='opinions'?'เขียน 2–3 ประโยคถามหรือบอกความคิดเห็นเกี่ยวกับเมือง': 'เขียน 2–3 ประโยคบอกความคิดเห็นเกี่ยวกับสถานที่ที่คุณชอบ',writeMinimum:30,rubric:['เขียน 2–3 ประโยคเกี่ยวกับสถานที่หรือหัวข้อที่เลือก','บอกความเห็นหรือข้อมูลให้เข้าใจได้','ใช้สำนวนจากบทเรียนอย่างน้อยหนึ่งประโยค'],acceptedAnswers:[],feedbackAnswer:'',translation:'งานเขียนของคุณ',explanation:'ใช้เกณฑ์ด้านล่างทบทวนงานเขียนด้วยตัวเอง คำตอบนี้ไม่ถูกตัดสินด้วยเฉลยประโยคเดียว',difficulty:3,knownErrors:{}});
 provenance.push({questionId:group.topicId+'-write',sourceIds:required,sourceId:'DEUTSCH_TRAINER_ORIGINAL',repositoryFile:'supabase/seed/catalog.json',method:'repository_inspection',publisherPage:null,inspectedAt:'2026-10-22',note:'New short free-writing task synthesizing learned project phrases; self-reviewed, not publisher content.'});
}
const authoredVariants=questions.splice(0);
const legacyQuestions=authoredVariants;
const legacyProvenance=provenance.splice(0);
const guidedQuestions=buildPhraseSequence(items,groups);
const scoredVariants=authoredVariants.filter(q=>q.kind!=='write');
questions.push(...guidedQuestions,...scoredVariants);
assert.equal(items.length,29);assert.equal(guidedQuestions.length,20);assert.equal(scoredVariants.length,94);assert.equal(questions.length,114);assert.equal(new Set(questions.map(q=>q.id)).size,questions.length);
for(const q of guidedQuestions){
 const firstLine=q.sentence?.split('\n',1)[0]||'';
 assert(!/^เลือก(?:คำถาม|คำตอบ).*(?:ให้ตรงกับ|ให้เหมาะกับ)/u.test(firstLine),`${q.id}: task instruction is duplicated in the sentence`);
}
for(const group of groups){
 const topic=guidedQuestions.filter(q=>q.topicId===group.topicId);
 assert.equal(topic.length,5);assert.equal(new Set(topic.map(q=>q.itemId)).size,5);
 assert.deepEqual(topic.map(q=>q.subskill),['phrase_context','phrase_context','phrase_match','phrase_match','phrase_order']);
 assert.deepEqual(topic.map(q=>q.difficulty),[1,1,2,2,3]);
 assert.equal(topic.filter(q=>q.interaction==='match').length,2);
 const pairs=topic.filter(q=>q.interaction==='match');
 assert.equal(new Set(pairs.map(q=>q.acceptedAnswers[0])).size,2);
 assert.equal(new Set(pairs.map(q=>q.matchGroupId)).size,1);
 for(const q of pairs)assert.deepEqual([...q.options].sort(),pairs.map(q=>q.acceptedAnswers[0]).sort());
 for(const q of topic){assert(q.requiredItemIds.every(id=>items.some(item=>item.id===id)));if(q.kind==='order')assert(q.context);}
}
provenance.push(...questions.map(q=>({questionId:q.id,sourceItemIds:q.requiredItemIds,sourceId:'DEUTSCH_TRAINER_ORIGINAL',repositoryFile:'supabase/seed/catalog.json',designFile:'scripts/exercise-mapping/l13-phrase-sequence.mjs',method:'repository_inspection',publisherPage:null,inspectedAt:'2026-10-22',note:'Existing learned target phrase; new dialogue cue, factual context and distractors authored for this web activity, not copied publisher exercises.'})));
const skillLabels={phrase_context:'เลือกคำตอบ',phrase_match:'จับคู่คำถาม–คำตอบ',phrase_order:'เรียงคำเป็นประโยค'};
const template=await read('scripts/exercise-mapping/preview-template.html');const planner=ts.transpileModule(await read('src/lib/practice-planner.ts'),{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.ES2020}}).outputText.replace(/^export /gm,'');
const base={title:'ประโยคและสำนวนบท 13',sequenceByTopic:true,topicOrder:groups.map(g=>g.topicId),requireLearned:true,historySkill:'phrases',learnLabel:'ไปเรียนประโยคและสำนวน',emptyMessage:'ยังไม่มีประโยคที่เรียนแล้วในหัวข้อนี้',manualHref:'/practice/L13/phrases',learnHref:'/learn/L13/phrases',dailyHref:'/practice/L13/phrases/daily',skillLabels,skillCycle:['phrase_context','phrase_match','phrase_order'],thaiSupport:{translations:Object.fromEntries([...legacyQuestions,...questions].map(q=>[q.id,q.translation])),glossary:{},phrases:{}}};
const matchingRuntime=await read('scripts/exercise-mapping/phrase-matching-runtime.js');
const sections=groups.map(g=>({topicId:g.topicId,title:g.title,count:5}));
const banks=groups.map(g=>({slug:g.slug,title:g.title,questions:guidedQuestions.filter(q=>q.topicId===g.topicId),defaultCount:5}));
banks.push({slug:'basic',title:base.title,questions:guidedQuestions,defaultCount:20,workflow:'guided',sections},{slug:'daily',title:'ฝึกประโยคและสำนวนต่อวันนี้',questions,defaultCount:10,workflow:'daily'});
for(const bank of banks){const nextTopics=bank.workflow?[]:groups.slice(groups.findIndex(g=>g.slug===bank.slug)+1).map(g=>({title:g.title,href:'/practice/L13/phrases/'+g.slug,itemIds:g.ids}));const publicBank={...base,...bank,nextTopics,id:'l13-phrases-'+bank.slug+'-v1',storageKey:'deutsch-trainer:review-prototype:l13-phrases-'+bank.slug+':v1'};const html=template.replace('/*__PHRASE_MATCHING__*/',()=>matchingRuntime).replace('__PLANNER__',()=>planner).replace('__BANK__',()=>JSON.stringify(publicBank).replaceAll('<','\\u003c'));await writeFile(new URL('src/data/l13-phrases-'+bank.slug+'-preview.json',root),JSON.stringify({html})+'\n');}
await writeFile(new URL('src/data/l13-phrases-catalog.json',root),JSON.stringify({groups,questions:questions.map(({id,itemId,requiredItemIds,coverageItemIds,topicId,kind,subskill})=>({id,itemId,requiredItemIds,coverageItemIds,topicId,kind,subskill}))})+'\n');
await writeFile(new URL('docs/exercise-mapping/l13-phrases-bank.json',root),JSON.stringify({phraseCount:29,questionCount:questions.length,groups,questions,provenance,legacyQuestions,legacyProvenance},null,2)+'\n');
const cells=value=>String(value).replaceAll('|','\\|').replaceAll('\n','<br>');
const rows=questions.map(q=>`| ${q.id} | ${q.itemId} | ${q.requiredItemIds.join(', ')} | ${q.sequence} | ${q.difficulty} | ${q.subskill} | ${cells(q.context||q.sentence)} | ${cells(q.acceptedAnswers.join(' / '))} |`).join('\n');
await writeFile(new URL('docs/exercise-mapping/L13_PHRASES_TOPIC_SEQUENCE.md',root),`# L13 phrase topic sequence\n\nGenerated from scripts/exercise-mapping/l13-phrase-sequence.mjs. Internal content review, 2026-10-28.\n\nThe guided round remains 20 tasks: 20 distinct phrase targets, five per learning topic. Each topic contains two contextual choices, two matching responses on one screen, and one contextual word-order task. Extra variants are available only to the history-based daily selector; one phrase target can occur at most once per round. The full catalog contains ${questions.length} scored variants. Four self-reviewed writing activities remain excluded from scored-round counts. Difficulty values indicate task demand and assistance, not calibrated learner levels.\n\nTarget answers come from supabase/seed/catalog.json. Dialogue cues, factual contexts and distractors are product-authored. Source metadata remains internal. Historical question IDs and submitted answers are retained. Required learned items include supporting phrase targets used in contexts; only the target response receives coverage credit.\n\n| Question ID | Target item | Required learned items | Topic position | Difficulty | Subskill | Cue / context | Accepted answer |\n| --- | --- | --- | ---: | ---: | --- | --- | --- |\n${rows}\n`);
const definitions=questions.map(({id,version,itemId,requiredItemIds,topicId,subskill,kind,tokens,acceptedAnswers,interaction,matchGroupId,options})=>({id,version,itemId,requiredItemIds,topicId,subskill,kind,tokens,acceptedAnswers,interaction,matchGroupId,options}));
const guard=await read('scripts/exercise-mapping/vocabulary-session-guard.sql');
const extensionDefinitions=definitions.filter(q=>!guidedQuestions.some(guided=>guided.id===q.id));
const migration="begin;\ninsert into public.phrase_practice_questions(id,version,definition) select value->>'id',(value->>'version')::integer,value from jsonb_array_elements($phrase_extension$"+JSON.stringify(extensionDefinitions)+"$phrase_extension$::jsonb) on conflict(id,version) do nothing;\n"+guard+'\ncommit;\n';
await writeFile(new URL('supabase/migrations/20261028010000_l13_phrase_variants.sql',root),migration);
console.log(`Built L13 phrases: 29 learning items, ${questions.length} scored questions (20 guided + ${scoredVariants.length} history-selected), 4 topics × 5 guided questions; 4 self-reviewed writing activities are excluded from the scored count.`);
