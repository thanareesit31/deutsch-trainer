# -*- coding: utf-8 -*-
"""Compile authored practice extensions without rewriting the published base catalog."""
import copy
import json
from pathlib import Path


def attach_core_metadata(courses, candidates):
    by_id = {item['id']: item for item in candidates}
    for course in courses:
        for task in course['tasks']:
            original = by_id[task['id']]
            task['practice'] = dict(familyId=task['targetId'] + ':' + task['subskill'], contextId=original.get('contextId') or task['id'], stage=0, unlock=None)


def append_extensions(root, courses, audio, model):
    baseline = copy.deepcopy(courses)
    existing = {task['id'] for course in courses for task in course['tasks']}
    course_map = {(course['lessonId'], course['skill']): course for course in courses}
    extras = []
    for filename in ['grammar-practice-extensions.json', 'phrase-practice-extensions.json']:
        source = root / 'docs/lesson-preparation' / filename
        if not source.exists():
            continue
        packet = json.loads(source.read_text())
        for extension in (packet['courses'] if isinstance(packet, dict) else packet):
            course = course_map[(extension['lessonId'], extension['skill'])]
            known = {target for card in course['cards'] for target in card['targetIds']}
            for authored in extension['tasks']:
                task = copy.deepcopy(authored)
                assert task['id'] not in existing, task['id']
                assert task['targetId'] in known, task['id']
                assert task['practice']['stage'] in [1, 2, 3]
                assert task['practice']['unlock'] is not None
                if task['practice']['stage'] >= 2:
                    assert task['kind'] == 'write' and not task['tokens'] and not task['options']
                    task['answerScope'] = 'sentence' if course['skill'] == 'phrases' or task['practice']['stage'] == 3 else 'fragment'
                    assert task['practice']['unlock']['minCorrectContexts'] >= 2
                    assert task['practice']['unlock']['minPracticeSessions'] >= 2
                task['feedback']['models'] = [model(m['text'], m['meaning'], m['sentences'], m['audio'], m.get('speaker')) for m in task['feedback']['models']]
                for error in task['feedback'].get('errors', []):
                    assert error['response'] not in task['acceptedAnswers'], task['id']
                    assert error['category'] and error['message']
                course['tasks'].append(task)
                existing.add(task['id'])
                extras.append((course, task))
    for course in courses:
        for task in course['tasks']:
            unlock = task['practice']['unlock']
            if unlock:
                dependencies = [q for q in course['tasks'] if q['targetId'] == task['targetId'] and q['subskill'] == unlock['subskill'] and q['practice']['stage'] < task['practice']['stage']]
                assert dependencies, ('Unreachable progression', task['id'])
                assert len({q['practice']['contextId'] for q in dependencies}) >= unlock['minCorrectContexts'], ('Insufficient independent contexts', task['id'])
    return baseline, extras


def write_extension_catalog(root, courses, extras, sql):
    if not extras:
        return
    task_rows, phrase_rows, metadata_rows, bindings = [], [], [], []
    for course in courses:
        for task in course['tasks']:
            meta = task['practice']
            is_extra = meta['stage'] != 0
            metadata_rows.append('(' + ','.join(sql(v) for v in [course['lessonId'], course['skill'], task['id'], meta['contextId'], meta['familyId']]) + ',' + str(meta['stage']) + ',' + ('null' if meta['unlock'] is None else sql(json.dumps(meta['unlock'], ensure_ascii=False)) + '::jsonb') + ',' + ('true' if is_extra else 'false') + ')')
            if not is_extra:
                continue
            definition = dict(id=task['id'], version=task['version'], targetId=task['targetId'], topicId=course['lessonId'] + '-' + course['skill'], subskill=task['subskill'], kind='cloze' if task['kind'] == 'write' else task['kind'], acceptedAnswers=task['acceptedAnswers'])
            encoded = sql(json.dumps(definition, ensure_ascii=False, separators=(',', ':'))) + '::jsonb'
            task_rows.append('(' + ','.join(sql(v) for v in [course['lessonId'], course['skill'], task['id']]) + ',' + str(task['version']) + ',' + sql(json.dumps(task['acceptedAnswers'], ensure_ascii=False)) + '::jsonb,' + sql(json.dumps(task['requiredCardIds'])) + '::jsonb,' + ('true' if task['spelling'] else 'false') + ',' + encoded + ')')
            if course['skill'] == 'phrases':
                phrase_rows.append('(' + sql(task['id']) + ',' + str(task['version']) + ',' + encoded + ')')
            bindings.append(dict(lessonId=course['lessonId'], skill=course['skill'], taskId=task['id'], targetId=task['targetId'], subskill=task['subskill'], requiredCardIds=task['requiredCardIds'], difficulty=task['difficulty'], difficultyRationale=task['difficultyRationale'], assistance=task['assistance'], practice=meta, provenance='product-authored'))
    statements = ['-- Generated extension definitions; existing IDs and grading remain immutable.', 'begin;']
    statements.append('insert into public.release_course_tasks(lesson_id,skill,task_id,version,accepted_answers,required_card_ids,case_sensitive,definition) values\n' + ',\n'.join(task_rows) + '\non conflict(lesson_id,skill,task_id,version) do nothing;')
    if phrase_rows:
        statements.append('insert into public.phrase_practice_questions(id,version,definition) values\n' + ',\n'.join(phrase_rows) + '\non conflict(id,version) do nothing;')
    statements.append('insert into public.release_practice_metadata(lesson_id,skill,task_id,context_id,family_id,stage,unlock,is_extension) values\n' + ',\n'.join(metadata_rows) + '\non conflict(lesson_id,skill,task_id) do nothing;')
    statements += ["notify pgrst,'reload schema';", 'commit;']
    (root / 'supabase/migrations/20261110001000_release_practice_extension_catalog.sql').write_text('\n\n'.join(statements) + '\n')
    stats = dict(schemaVersion=2, coreTasks=372, extensionTasks=len(extras), stages={str(stage): sum(task['practice']['stage'] == stage for _, task in extras) for stage in [1, 2, 3]})
    (root / 'src/data/a13-practice-version.json').write_text(json.dumps(stats, indent=2) + '\n')
    (root / 'docs/lesson-preparation/practice-extension-bindings.json').write_text(json.dumps(dict(schemaVersion=1, responseUnits=bindings), ensure_ascii=False, indent=2) + '\n')
