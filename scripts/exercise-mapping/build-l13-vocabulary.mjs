import ts from 'typescript';
import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const root = new URL('../../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const catalog = JSON.parse(await read('supabase/seed/catalog.json'));
const paletteSource = ts.transpileModule(await read('src/lib/profession-learning.ts'), { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ES2020 } }).outputText;
const { articleColors } = await import('data:text/javascript;base64,' + Buffer.from(paletteSource).toString('base64'));
const source = ts.transpileModule(await read('src/lib/vocabulary-image-content.ts'), { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ES2020 } }).outputText;
const { l13VocabularyImageGroups } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const words = catalog.items.filter(item => item.lessonId === 'L13' && item.skill === 'vocabulary');
const groups = l13VocabularyImageGroups.map(group => ({ slug: group.id.replace('l13-',''), title: group.title, ids: group.wordOrder }));
const imageIds = new Set(groups.flatMap(group => group.ids));
groups.push({ slug: 'extra', title: 'คำศัพท์เพิ่มเติม', ids: words.filter(word => !imageIds.has(word.id)).map(word => word.id) });
const aliases = { 'Geschäft': ['Laden'], 'Laden': ['Geschäft'], 'Zoo': ['Tierpark'], 'Tierpark': ['Zoo'] };
const topicId = group => 'L13-vocab-' + group.slug;
const skillLabels = { vocabulary_meaning: 'จำความหมาย', vocabulary_article: 'เลือก Artikel', vocabulary_spelling: 'พิมพ์คำภาษาเยอรมัน' };
const questions = [];
const provenance = [];
for (const group of groups) for (const id of group.ids) {
  const word = words.find(word => word.id === id);
  assert(word?.word && word.meaning, 'Missing vocabulary ' + id);
  const forms = word.word.split(' / ').map(value => value.trim());
  const title = word.article ? word.article + ' ' + word.word : word.pluralOnly ? 'die '+word.word : forms.join(' / ');
  const base = { feedbackAnswer: title, version: 1, itemId: id, topicId: topicId(group), topicName: group.title, difficulty: 1, knownErrors: {} };
  // Options differ in meaning, not merely in item ID. Zoo/Tierpark never compete.
  const distractors = [...new Set(words.filter(other => other.id !== id && !(aliases[word.word] ?? []).includes(other.word) && other.meaning !== word.meaning).map(other => other.meaning))];
  const offset = words.indexOf(word) % distractors.length;
  const options = [word.meaning, ...Array.from({length:3}, (_, i) => distractors[(offset+i)%distractors.length])];
  questions.push({ ...base, id: id+'-meaning', kind: 'choice', subskill: 'vocabulary_meaning', optionsLang: 'th', prompt: 'เลือกความหมายของคำนี้', sentence: title+' — ___', options, acceptedAnswers: [word.meaning], explanation: '', translation: word.meaning });
  if (['der','die','das'].includes(word.article)) questions.push({ ...base, id: id+'-article', kind: 'choice', subskill: 'vocabulary_article', prompt: 'เลือก Artikel ของคำนาม', sentence: '___ '+word.word, options: ['der','die','das'], acceptedAnswers: [word.article], explanation: word.word+' เป็นคำนาม'+({der:'เพศชาย',die:'เพศหญิง',das:'เพศกลาง'}[word.article])+' จึงใช้ '+word.article, translation: word.meaning });
  const spellingNotes = {
    'leider':'เขียน leider เป็นคำเดียว ขึ้นต้นด้วยตัวพิมพ์เล็ก',
    'in der Nähe':'เขียนแยกเป็นสามคำ โดย Nähe ใช้ ä และขึ้นต้นด้วย N ตัวใหญ่',
    'Leute':'Leute เป็นรูปพหูพจน์ ใช้ L ตัวใหญ่',
    'Kinder':'Kinder เป็นรูปพหูพจน์ ใช้ K ตัวใหญ่',
    'spazieren gehen':'เขียน spazieren gehen แยกเป็นสองคำ และขึ้นต้นด้วยตัวพิมพ์เล็ก',
    'angeln':'angeln เป็นคำกริยาในรูป Infinitiv จึงขึ้นต้นด้วยตัวพิมพ์เล็ก',
    'ein Boot mieten':'เขียนแยกเป็นสามคำ โดย Boot เป็นคำนามจึงใช้ B ตัวใหญ่',
    'sich mit Freunden treffen':'เขียนแยกเป็นสี่คำ โดย Freunden เป็นคำนามจึงใช้ F ตัวใหญ่',
  };
  const specialLetters = [...new Set([...word.word].filter(letter => /[äöüÄÖÜßé]/u.test(letter)))];
  const spellingExplanation = (aliases[word.word]?.length ? 'ใช้ได้ทั้ง '+[word.word,...aliases[word.word]].join(' และ ')+' ในบริบทนี้' : spellingNotes[word.word] ?? (word.type === 'noun' ? forms.join(' หรือ ')+' เป็นคำนาม จึงขึ้นต้นด้วยตัวพิมพ์ใหญ่' : 'เขียนคำให้ครบตามรูปที่เรียน'))+(specialLetters.length ? ' ระวังตัว '+specialLetters.join(' และ ')+' ในคำนี้' : '');
  const acceptedAnswers = [...new Set([...forms, ...(aliases[word.word] ?? [])])];
  questions.push({ ...base, id: id+'-spelling', kind: 'cloze', subskill: 'vocabulary_spelling', sentenceLang: 'th', difficulty: 2, prompt: word.type==='noun' ? 'พิมพ์คำศัพท์ต่อจาก Artikel ที่ให้มา' : 'พิมพ์คำภาษาเยอรมัน', sentence: word.meaning+' — ___', acceptedAnswers, explanation: spellingExplanation, translation: word.meaning });
  provenance.push({ itemId: id, originalTitle: word.title, word: word.word, meaning: word.meaning, collection: word.collection, group: group.slug, questionIds: questions.filter(q => q.itemId === id).map(q => q.id), sourceId: 'DEUTSCH_TRAINER_ORIGINAL', repositoryFiles: ['supabase/seed/catalog.json', 'src/lib/vocabulary-image-content.ts'], method: 'repository_inspection', inspectedAt: '2026-10-22', publisherPage: null, note: 'New web tasks derived from existing project learning vocabulary. No claim of a copied or individually inspected publisher exercise.' });
}
assert.equal(new Set(questions.map(q=>q.id)).size, questions.length);
for (const q of questions) { assert(q.acceptedAnswers.length); if(q.options) assert.equal(new Set(q.options).size,q.options.length); }
const template = await read('scripts/exercise-mapping/preview-template.html');
const planner = ts.transpileModule(await read('src/lib/practice-planner.ts'), { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ES2020 } }).outputText.replace(/^export /gm,'');
const nounPresentation = Object.fromEntries(words.filter(word=>word.type==='noun'&&(word.article||word.pluralOnly)).map(word=>[word.id,{label:word.pluralOnly?'die '+word.word:word.article+' '+word.word,color:word.pluralOnly?'plural':word.article}]));
const base = { title: 'คำศัพท์บท 13', requireLearned: true, historySkill: 'vocabulary', nounPresentation, articleColors, manualHref: '/practice/L13/vocabulary', learnHref: '/learn/L13/vocabulary', dailyHref: '/practice/L13/vocabulary/daily', skillLabels, thaiSupport: { translations: Object.fromEntries(questions.map(q=>[q.id,q.translation])), glossary: {}, phrases: [] } };
const banks = groups.map(group => ({ slug: group.slug, title: group.title, defaultCount: 5, questions: questions.filter(q=>q.topicId===topicId(group)) }));
banks.push({ slug:'basic', title:'คำศัพท์บท 13', defaultCount:groups.length*5, workflow:'guided', sections:groups.map(group=>({topicId:topicId(group),title:group.title,count:5})),questions });
banks.push({ slug:'daily', title:'ฝึกคำศัพท์ต่อวันนี้', defaultCount:10, workflow:'daily',questions });
for (const bank of banks) {
 const nextTopics = bank.workflow ? [] : groups.slice(groups.findIndex(group=>group.slug===bank.slug)+1).map(group=>({title:group.title,href:'/practice/L13/vocabulary/'+group.slug,itemIds:group.ids}));
 const publicBank = {...base,...bank,nextTopics,id:'l13-vocab-'+bank.slug+'-v1',storageKey:'deutsch-trainer:review-prototype:l13-vocab-'+bank.slug+':v1'};
 const html=template.replace('__PLANNER__',()=>planner).replace('__BANK__',()=>JSON.stringify(publicBank).replaceAll('<','\\u003c'));
 await writeFile(new URL('src/data/l13-vocab-'+bank.slug+'-preview.json',root),JSON.stringify({html})+'\n');
}
if (process.argv.includes('--previews-only')) {
 console.log('Updated L13 vocabulary previews; catalog and answer definitions unchanged.');
 process.exit(0);
}
await writeFile(new URL('src/data/l13-vocabulary-catalog.json',root),JSON.stringify({groups:groups.map(group=>({...group,topicId:topicId(group)})),questions:questions.map(({id,itemId,topicId,kind,subskill})=>({id,itemId,topicId,kind,subskill}))})+'\n');
await writeFile(new URL('docs/exercise-mapping/l13-vocabulary-bank.json',root),JSON.stringify({wordCount:words.length,questionCount:questions.length,groups,questions,provenance},null,2)+'\n');
console.log('Built L13 vocabulary: '+words.length+' words, '+questions.length+' questions, '+groups.length+' topics; sources kept in internal bank.');

// Keep server answer validation in the same versioned vocabulary catalog.
const definitions = questions.map(({id,version,itemId,topicId,subskill,kind,acceptedAnswers})=>({id,version,itemId,topicId,subskill,kind,acceptedAnswers}));
const validationSQL = await read('scripts/exercise-mapping/vocabulary-session-guard.sql');
const migration = 'begin;\ncreate table if not exists public.vocabulary_practice_questions (id text not null, version integer not null, definition jsonb not null, primary key(id,version));\nalter table public.vocabulary_practice_questions enable row level security;\nrevoke all on public.vocabulary_practice_questions from anon, authenticated;\ninsert into public.vocabulary_practice_questions(id,version,definition) select value->>\'id\',(value->>\'version\')::integer,value from jsonb_array_elements($vocab_catalog$'+JSON.stringify(definitions)+'$vocab_catalog$::jsonb) on conflict(id,version) do nothing;\n'+validationSQL+'\ncommit;\n';
await writeFile(new URL('supabase/migrations/20261022020000_vocabulary_session_validation.sql',root),migration);
