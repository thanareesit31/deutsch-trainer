import ts from 'typescript';
import { readFile } from 'node:fs/promises';
const root = new URL('../../', import.meta.url);
export async function phrasePracticeExtensions(lessonId) {
  let packets;
  try { packets = JSON.parse(await readFile(new URL('docs/exercise-mapping/l01-l13-practice-extensions.json', root), 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') return []; throw error; }
  const audio = JSON.parse(await readFile(new URL('src/data/phrase-practice-upgrade-audio.json',root),'utf8')).assets;
  return (packets.find(packet => packet.lessonId === lessonId)?.questions ?? []).map(q => ({...q, questionAudio:audio[q.id+'-A'].path,answerAudio:audio[q.id+'-B'].path}));
}

const palette = ts.transpileModule(await readFile(new URL('src/lib/profession-learning.ts',root),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.ES2020}}).outputText;
export const {articleColors:phraseArticleColors}=await import('data:text/javascript;base64,'+Buffer.from(palette).toString('base64'));
