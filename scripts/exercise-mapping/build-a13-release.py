#!/usr/bin/env python3
"""Build reviewed L15–L18 learner courses and their server grading catalog."""
import argparse
from collections import Counter
import json
from pathlib import Path
import re


def build(root):
    prepared = root / 'docs/lesson-preparation'
    audio = json.loads((prepared / 'l15-l18-audio-assets.json').read_text())['assets']

    def path(asset_id):
        asset = audio[asset_id]
        assert asset['status'] == 'ready', asset_id
        result = asset['path']
        assert (root / 'public' / result.lstrip('/')).is_file(), result
        return result

    def model(text, meaning, sentences, asset_id, speaker=None):
        assert ' '.join(' '.join(p['text'] for p in row) for row in sentences) == text, text
        assert audio[asset_id].get('text') == text, asset_id
        if speaker:
            assert audio[asset_id]['voice'] == ('de-DE-KatjaNeural' if speaker == 'A' else 'de-DE-ConradNeural'), asset_id
        result = dict(text=text, meaning=meaning, sentences=sentences, audio=path(asset_id))
        if speaker: result['speaker'] = speaker
        return result

    def noun(item):
        if item['kind'] != 'noun': return None
        return dict(article=item['article'], word=item['word'], plural=item.get('number') == 'plural')

    def lexical_model(item):
        return model(item['headword'], item['meaning'], [[dict(text=item['headword'], role='other', label='คำหรือวลี')]], item['id'] + '-audio')

    def example_model(item):
        return model(item['example'], item['exampleMeaning'], item['exampleSentences'], item['id'] + '-example-audio')

    def phrase_models(item):
        return [model(item['question'], item['questionMeaning'], item['questionSentences'], item['id'] + '-voice-A', 'A'),
                model(item['reply'], item['replyMeaning'], item['replySentences'], item['id'] + '-voice-B', 'B')]

    courses = []
    for number in range(15, 19):
        lesson = json.loads((prepared / ('l%d-content.json' % number)).read_text())
        lesson_id = lesson['id']
        vocab = {item['id']: item for item in lesson['vocabulary']}
        topics = {item['id']: item for item in lesson['grammar']}
        dialogues = {item['id']: item for item in lesson['phrases']}
        scoped = {}
        for skill, title, purpose in [('vocabulary', 'คำศัพท์', 'เข้าใจความหมาย จำ Artikel และสะกดคำที่เรียน'), ('grammar', 'ไวยากรณ์', 'เข้าใจรูปภาษาและลองใช้จากข้อมูลที่กำหนด'), ('phrases', 'ประโยคและสำนวน', 'เข้าใจบทสนทนาและลองเรียงหรือเลือกประโยคให้ตรงสถานการณ์')]:
            glossary = [dict(text=entry['headword'], meaning=entry['meaning'], noun=noun(entry), audio=path(entry['id'] + '-audio')) for entry in lesson.get('supportLexicon', [])]
            course = dict(lessonId=lesson_id, skill=skill, title=title, purpose=purpose, glossary=glossary, cards=[], tasks=[])
            scoped[skill] = course
            courses.append(course)
        for item in vocab.values():
            notes = []
            if item.get('plural'): notes.append('พหูพจน์: ' + item['plural'])
            if item.get('nouns'): notes.append('คำนามในวลี: ' + ', '.join(item['nouns']))
            models = [example_model(item)]
            for i, variant in enumerate(item.get('variants', []), 1):
                models.append(model(variant, item['meaning'], [[dict(text=variant, role='other', label='รูปวลีอีกแบบ')]], item['id'] + '-variant-%d-audio' % i))
            scoped['vocabulary']['cards'].append(dict(id=item['id'], title=item['headword'], purpose=item['meaning'], notes=notes, context=[], models=models, targetIds=[item['id']], noun=noun(item), wordAudio=path(item['id'] + '-audio')))
        for topic in topics.values():
            context = topic.get('table', []).copy()
            models = []
            for i, item in enumerate(topic['models'], 1):
                models.append(model(item['text'], item['meaning'], item['sentences'], topic['id'] + '-model-%d-audio' % i))
                for label, value in item.get('context', []):
                    context.append(['ตัวอย่าง %d · %s' % (i, label), value])
            scoped['grammar']['cards'].append(dict(id=topic['id'], title=topic['title'], purpose=topic['purpose'], notes=topic['notes'], context=context, models=models, targetIds=[topic['id']] + topic.get('diagnosticTargets', []), noun=None, wordAudio=None))
        for item in dialogues.values():
            scoped['phrases']['cards'].append(dict(id=item['id'], title=item['group'], purpose=item['purpose'], notes=[], context=item['context'], models=phrase_models(item), targetIds=item['requiredItemIds'], noun=None, wordAudio=path(item['id'] + '-pair-audio')))
        for candidate in lesson['practiceCandidates']:
            item = vocab.get(candidate['targetId'])
            public = candidate.get('public', {})
            accepted = candidate.get('acceptedAnswers', [candidate.get('grading', {}).get('answer')])
            assert accepted and all(isinstance(a, str) and a for a in accepted), candidate['id']
            source_kind = candidate['kind']
            kind = 'order' if source_kind in ('order', 'chunk_reconstruction') else 'write' if source_kind in ('cloze', 'spelling') else 'choice'
            task = dict(id=candidate['id'], version=candidate.get('version', 1), targetId=candidate['targetId'], subskill=candidate['subskill'], difficulty=candidate['difficulty'], difficultyRationale=candidate['difficultyRationale'], requiredCardIds=[], kind=kind, prompt='', cue='', context=[], options=candidate.get('options', public.get('options', [])), tokens=candidate.get('tokens', public.get('tokens', [])), startWith=candidate.get('startWith', ''), acceptedAnswers=accepted, assistance=candidate['assistanceAvailable'], feedback={}, noun=None, articleTarget=source_kind == 'article_choice', spelling=source_kind == 'spelling')
            if item:
                skill = 'vocabulary'
                task['requiredCardIds'] = [item['id']]
                task['prompt'] = public['prompt']
                task['noun'] = noun(item)
                if source_kind == 'meaning_choice':
                    task['cue'] = public['german']
                    reason = '“%s” หมายถึง %s' % (item['headword'], item['meaning'])
                elif source_kind == 'article_choice':
                    task['cue'] = public['word']
                    task['context'].append(['จำนวน', 'พหูพจน์' if public['number'] == 'plural' else 'เอกพจน์'])
                    if public['number'] == 'plural':
                        task['prompt'] = 'เลือกคำนำหน้านามพหูพจน์'
                    reason = '%s ใช้ Artikel %s%s' % (item['word'], item['article'], ' ในรูปพหูพจน์นี้' if task['noun']['plural'] else '')
                elif source_kind == 'spelling':
                    task['cue'] = public['meaning']
                    reason = 'รูปคำที่ถูกต้องคือ %s; %s' % (item['headword'], item['meaning'])
                else:
                    assert source_kind == 'chunk_reconstruction'
                    task['cue'] = public['meaning']
                    reason = 'วลี %s หมายถึง %s โดยเรียงคำตามรูปวลีที่เรียน' % (item['headword'], item['meaning'])
                task['feedback'] = dict(reason=reason, models=[lexical_model(item), example_model(item)])
            elif candidate.get('contextId') in dialogues:
                skill = 'phrases'
                dialogue = dialogues[candidate['contextId']]
                task['requiredCardIds'] = [dialogue['id']]
                task['prompt'] = candidate['instruction']
                task['cue'] = candidate['prompt']
                task['context'] = candidate['context']
                reason = candidate['feedback']['reason']
                if candidate['responseSpeaker'] == 'A':
                    parts = dialogue['questionSentences'][0]
                    first = next(part for part in parts if part.get('position') == 'ตำแหน่ง 1')
                    finite = next(part for part in parts if part['role'] in ('verb', 'auxiliary') and part.get('position') in ('ตำแหน่ง 1', 'ตำแหน่ง 2'))
                    reason = 'ใช้ถามว่า “%s” โดยเริ่มด้วย %s' % (dialogue['questionMeaning'], first['text'].rstrip('?!.,'))
                    if first is finite:
                        reason += ' ซึ่งเป็นกริยาที่ผันแล้วในตำแหน่ง 1 ของคำถามนี้'
                    else:
                        reason += ' แล้ววางกริยาที่ผันแล้ว %s ในตำแหน่ง 2' % finite['text']
                    endings = [part['text'].rstrip('?!.,') for part in parts if part.get('position') == 'ท้ายประโยค']
                    if endings: reason += '; %s อยู่ท้ายคำถาม' % ' '.join(endings)
                task['feedback'] = dict(reason=reason, models=phrase_models(dialogue))
            else:
                skill = 'grammar'
                assert candidate['topicId'] in topics
                task['requiredCardIds'] = [candidate['topicId']]
                task['prompt'] = candidate.get('prompt', 'เลือกคำให้ประโยคตรงกับข้อมูลที่กำหนด')
                task['cue'] = candidate.get('sentence', candidate.get('cue', ''))
                if candidate.get('sentence') and candidate.get('cue'): task['context'].append(['คำที่กำหนด', candidate['cue']])
                if candidate.get('context'):
                    assert isinstance(candidate['context'], str)
                    task['context'].append(['ข้อมูล', candidate['context']])
                feedback = candidate['feedback']
                task['feedback'] = dict(reason=feedback['reason'], models=[model(feedback['text'], feedback['meaning'], feedback['sentences'], candidate['id'] + '-feedback-audio')])
            task['assistance'] = ['optional-prior-model' if value == 'optional-first-letter' else value for value in task['assistance']]
            scoped[skill]['tasks'].append(task)
    # Fail at generation if a binding, audio clip, answer or word bank is inconsistent.
    task_ids = []
    for course in courses:
        card_ids = {c['id'] for c in course['cards']}
        assert len(card_ids) == len(course['cards'])
        for task in course['tasks']:
            task_ids.append(task['id'])
            assert set(task['requiredCardIds']) <= card_ids and task['requiredCardIds']
            assert task['feedback']['models'] and task['feedback']['reason']
            if task['articleTarget']:
                assert task['noun'] is not None
                number = 'พหูพจน์' if task['noun']['plural'] else 'เอกพจน์'
                assert ['จำนวน', number] in task['context'], task['id']
                if task['noun']['plural']: assert task['subskill'] == 'plural_article', task['id']
            if task['kind'] == 'choice': assert task['acceptedAnswers'][0] in task['options'], task['id']
            if task['kind'] == 'order':
                assert Counter(task['tokens']) == Counter(task['acceptedAnswers'][0].split()), task['id']
                if task['startWith']: assert task['acceptedAnswers'][0].startswith(task['startWith']), task['id']
    assert len(task_ids) == len(set(task_ids)) == 372
    payload = json.dumps(courses, ensure_ascii=False, indent=2)
    assert not re.search(r'"(?:sources|sourcePage|provenance|auditNotes)"', payload)
    destination = root / 'src/data/a13-release.ts'
    destination.write_text('// Generated by scripts/exercise-mapping/build-a13-release.py.\nimport type { ReleaseCourse } from "@/lib/a13-release";\n\nexport const a13ReleaseCourses: ReleaseCourse[] = ' + payload + ' satisfies ReleaseCourse[];\n')

    def sql(value): return "'" + value.replace("'", "''") + "'"
    card_rows, task_rows, phrase_rows = [], [], []
    for course in courses:
        for card in course['cards']:
            card_rows.append('(' + ','.join(sql(v) for v in [course['lessonId'], course['skill'], card['id']]) + ')')
        for task in course['tasks']:
            definition = dict(id=task['id'], version=task['version'], targetId=task['targetId'], topicId=course['lessonId'] + '-' + course['skill'], subskill=task['subskill'], kind='cloze' if task['kind'] == 'write' else task['kind'], acceptedAnswers=task['acceptedAnswers'])
            encoded = sql(json.dumps(definition, ensure_ascii=False, separators=(',', ':'))) + '::jsonb'
            task_rows.append('(' + ','.join(sql(v) for v in [course['lessonId'], course['skill'], task['id']]) + ',' + str(task['version']) + ',' + sql(json.dumps(task['acceptedAnswers'], ensure_ascii=False)) + '::jsonb,' + sql(json.dumps(task['requiredCardIds'])) + '::jsonb,' + ('true' if task['spelling'] else 'false') + ',' + encoded + ')')
            if course['skill'] == 'phrases':
                phrase_rows.append('(' + sql(task['id']) + ',' + str(task['version']) + ',' + encoded + ')')
    assert len(phrase_rows) == 64
    migration = root / 'supabase/migrations/20261109001000_a13_release_course_catalog.sql'
    migration.write_text('-- Generated by scripts/exercise-mapping/build-a13-release.py.\n-- Existing task IDs and versions retain their canonical grading.\n-- Changed grading or prerequisites require a new task ID; never reuse an ID to rewrite history.\nbegin;\ninsert into public.release_course_cards (lesson_id,skill,card_id) values\n' + ',\n'.join(card_rows) + '\non conflict (lesson_id,skill,card_id) do nothing;\n\ninsert into public.release_course_tasks (lesson_id,skill,task_id,version,accepted_answers,required_card_ids,case_sensitive,definition) values\n' + ',\n'.join(task_rows) + '\non conflict (lesson_id,skill,task_id,version) do nothing;\n\ninsert into public.phrase_practice_questions (id,version,definition) values\n' + ',\n'.join(phrase_rows) + '\non conflict (id,version) do nothing;\ncommit;\n')
    print(json.dumps({'courses': len(courses), 'cards': len(card_rows), 'tasks': len(task_rows), 'counts': {c['lessonId'] + '-' + c['skill']: {'cards': len(c['cards']), 'tasks': len(c['tasks'])} for c in courses}}))

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parents[2])
    build(parser.parse_args().root.resolve())
