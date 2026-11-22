import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';
import imageCatalog from '../src/data/release-vocabulary-images.json';
import { a13ReleaseCourses } from '../src/data/a13-release';
import { emptyReleaseState, parseReleaseState, selectReleaseTask } from '../src/lib/a13-release';
import { learnReleaseVocabulary, releaseVocabularyItems } from '../src/lib/release-vocabulary-learning';
import { lessonVocabularyImageGroups, vocabularyImagePages } from '../src/lib/vocabulary-image-content';

test('vocabulary pictures use real raster assets, with complete landscape generated scenes', () => {
  const vectorPictures = imageCatalog.filter(entry => entry.image.endsWith('.svg'));
  assert.equal(vectorPictures.length, 0, 'Replace icon/translated-diagram entries using scripts/build-release-vocabulary-images.mjs after reviewing the scene photographs');
  const generated = imageCatalog.filter(entry => entry.presentation === 'generated-scene-photograph');
  assert.equal(generated.length, 67);
  for (const entry of generated) {
    const bytes = readFileSync(`public${entry.image}`);
    assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', entry.id);
    const width = bytes.readUInt32BE(16), height = bytes.readUInt32BE(20);
    assert.ok(width >= 1200 && height >= 800, entry.id);
    assert.ok(Math.abs(width / height - 1.5) < 0.02, `${entry.id} must show the complete 3:2 scene`);
  }
});

for (const course of a13ReleaseCourses.filter(course => course.skill === 'vocabulary')) {
  test(`${course.lessonId} teaches every existing target through grouped vocabulary with real media`, () => {
    const items = releaseVocabularyItems(course);
    assert.deepEqual(items.map(item => item.id), course.cards.map(card => card.id));
    const groups = lessonVocabularyImageGroups(items, course.lessonId);
    assert.ok(groups.length >= 3);
    assert.equal(new Set(groups.map(group => group.route)).size, groups.length);
    assert.deepEqual(groups.flatMap(group => group.wordOrder).sort(), items.map(item => item.id).sort());
    for (const group of groups) assert.ok(vocabularyImagePages(group.wordOrder).every(page => page.length <= 6));
    for (const item of items) {
      assert.ok(item.image && existsSync(`public${item.image}`), item.id);
      assert.ok(item.audio && existsSync(`public${item.audio}`), item.id);
      if (item.article) assert.ok(item.answer.startsWith(`${item.article} `));
    }
  });
  test(`${course.lessonId} matching unlocks only taught practice and preserves existing trial/history`, () => {
    const unknown = emptyReleaseState();
    assert.equal(selectReleaseTask(course, unknown), null);
    const learned = learnReleaseVocabulary(JSON.stringify(unknown), course, [course.cards[0].id, 'not-a-target']);
    assert.deepEqual(learned.learned, [course.cards[0].id]);
    assert.deepEqual(learned.attempts, []);
    assert.equal(learned.active, null);
    const selected = selectReleaseTask(course, learned);
    assert.ok(selected);
    assert.deepEqual(selected.task.requiredCardIds, [course.cards[0].id]);
    const state = { ...learned,
      attempts: [{ id: 'historical-answer', taskId: selected.task.id, response: selected.task.acceptedAnswers[0], correct: true, helpUsed: true, submittedAt: '2026-11-22T00:00:00Z', selectionReason: 'historical reason' }],
      active: { taskId: selected.task.id, draft: 'saved draft', helpUsed: true, startedAt: '2026-11-23T00:00:00Z', selectionReason: 'saved reason', origin: 'learn' as const, learningCardId: course.cards[0].id } };
    const next = learnReleaseVocabulary(JSON.stringify(state), course, [course.cards[1].id]);
    assert.deepEqual(next.active, state.active);
    assert.deepEqual(next.attempts, state.attempts);
    assert.deepEqual(next.learned, [course.cards[0].id, course.cards[1].id]);
    assert.deepEqual(parseReleaseState(JSON.stringify(next), course), next);
    assert.deepEqual(learnReleaseVocabulary(JSON.stringify(next), course, [course.cards[1].id]), next);
  });
}
