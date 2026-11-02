import assert from 'node:assert/strict';
import test from 'node:test';
import type { Item, Lesson } from '../src/lib/content';
import { l02VocabularyProgress } from '../src/lib/l02-vocabulary-progress';

test('L02 completed Learn shows 100% without counting retired numbers or creating exposures', async () => {
  const {createDatabase}=await import('./learning-database.mjs');
  const db=await createDatabase();
  try {
    const items=(await db.query<{data:Item}>('select data from public.content_items where status=\'published\'')).rows.map(row=>row.data);
    const lesson=(await db.query<{data:Lesson}>("select data from public.content_lessons where id='L02'")).rows[0].data;
    const vocabulary=items.filter(item=>item.lessonId==='L02'&&item.skill==='vocabulary');
    assert.equal(vocabulary.length,99);
    const retired=new Set([28,32,35,43,54,65,72,76,87,98,99].map(n=>'L02-number-'+n));
    const imageLearnedIds=vocabulary.filter(item=>item.id.startsWith('L02-family-status-')).map(item=>item.id);
    const exposureIds=vocabulary.filter(item=>!retired.has(item.id)&&!imageLearnedIds.includes(item.id)).map(item=>item.id);
    assert.equal(exposureIds.length,81);
    assert.equal(Math.round(exposureIds.length*100/vocabulary.length),82);
    const result=l02VocabularyProgress({items,flow:lesson.learningFlows?.vocabulary,exposureIds,imageLearnedIds});
    assert.equal(result.total,88);
    assert.equal(result.learned,88);
    assert.equal(result.percentage,100);
    assert(!result.targets.some(item=>retired.has(item.id)));
    const partial=l02VocabularyProgress({items,flow:lesson.learningFlows?.vocabulary,exposureIds:exposureIds.slice(1),imageLearnedIds});
    assert.equal(partial.learned,87);
    assert.equal(partial.percentage,99);
    assert.equal(l02VocabularyProgress({items,flow:lesson.learningFlows?.vocabulary,exposureIds:[],imageLearnedIds:[]}).percentage,0);
  }finally{await db.close();}
});
