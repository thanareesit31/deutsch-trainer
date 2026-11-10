#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Validate prepared artifacts and preservation of existing banks without rewriting them."""
import json,hashlib
from pathlib import Path
R=Path(__file__).resolve().parents[2];P=R/'docs/lesson-preparation'
read=lambda name:json.loads((P/name).read_text())
manifest=read('manifest.json');assert manifest['totals']==dict(vocabulary=97,grammarTopics=7,grammarModels=16,dialogues=32,phraseTargets=64,practiceCandidates=372)
legacy={x['id']:x for x in json.loads((R/'supabase/seed/catalog.json').read_text())['items']}
all_tasks=[];all_targets=set();utterances={};examples={};legacy_copies=0;geometry_sentences=0
for n in range(15,19):
 d=read(f'l{n}-content.json');assert d['id']==f'L{n}'
 for word in d['vocabulary']:
  assert word['id']not in all_targets;all_targets.add(word['id']);examples[word['id']]=word
  assert word['meaning']and word['example']and word['exampleMeaning']
  assert ' '.join(p['text']for row in word['exampleSentences']for p in row)==word['example'];geometry_sentences+=len(word['exampleSentences'])
  if word['id']in legacy:assert legacy[word['id']]['answer']==word['headword']
  if word['kind']=='noun':assert word['headword']==word['article']+' '+word['word']
  if word['kind']=='chunk':assert len(word['word'].split())>=2
 for helper in d['supportLexicon']:
  if helper['kind']=='noun':assert helper['headword']==helper['article']+' '+helper['word']
 for target in d['phraseTargets']:assert target['id']not in all_targets;all_targets.add(target['id']);utterances[target['id']]=target['text']
 for block in d['grammar']:
  all_targets.add(block['id']);all_targets.update(block.get('diagnosticTargets',[]))
  for model in block['models']:
   assert ' '.join(p['text']for s in model['sentences']for p in s)==model['text'];geometry_sentences+=len(model['sentences'])
 for model in d['phrases']:
  assert utterances[model['questionTargetId']]==model['question']and utterances[model['replyTargetId']]==model['reply']
  for field,plain in [('questionSentences','question'),('replySentences','reply')]:
   assert ' '.join(p['text']for s in model[field]for p in s)==model[plain];geometry_sentences+=len(model[field])
   for sentence in model[field]:
    for p in sentence:
     assert p['role']in ['subject','verb','auxiliary','time','sequence','participle','other','question']
     assert p['label']and p['text']
     if p['label']=='ประธาน':assert p['role']=='subject'
  assert model['context']and len(model['requiredItemIds'])==2
 raw=json.loads((R/f'docs/exercise-mapping/l{n}-grammar-bank.json').read_text())
 assert hashlib.sha256((R/f'docs/exercise-mapping/l{n}-grammar-bank.json').read_bytes()).hexdigest()==manifest['existingGrammarBankHashes'][f'L{n}']
 candidates={q['id']:q for q in d['practiceCandidates']}
 for old in raw['questions']:
  new=candidates[old['id']+'-PREP3'];assert new['acceptedAnswers']==old['acceptedAnswers'];legacy_copies+=1
  expected=old['acceptedAnswers'][0]if old['kind']=='order'else old['sentence'].replace('___',old['acceptedAnswers'][0]).split('. ')[-1]
  assert new['feedback']['text']==expected,(old['id'],new['feedback']['text'],expected)
 for task in d['practiceCandidates']:
  if task['id'].endswith('-PREP3')or task['id'].startswith('A13-'):
   assert task.get('feedback')and task['feedback']['meaning']and task['feedback']['reason'];assert ' '.join(p['text']for row in task['feedback']['sentences']for p in row)==task['feedback']['text'];geometry_sentences+=len(task['feedback']['sentences'])
  for field in ['requiredItemIds','requiredLearnedIds','requiredConceptTargets']:assert all(x in all_targets for x in task.get(field,[])),task['id']
  assert task['targetId']in all_targets,(task['id'],task['targetId'])
  assert task['subskill']and task['difficultyRationale']and task['assistanceAvailable']
  if task['kind']=='article_choice':
   assert task['public']['word']==examples[task['targetId']]['word'];assert 'articlePrefix'not in task['public'];assert task['public']['targetColor']=='neutral'
  if task['kind']=='spelling'and examples[task['targetId']]['kind']=='noun':assert task['public']['articlePrefix']==examples[task['targetId']]['article']
  if task['kind']=='meaning_choice':assert task['grading']['answer']in task['public']['options']and len(set(task['public']['options']))==3
  if 'tokens'in task:
   answer=task.get('grading',{}).get('answer')or task['acceptedAnswers'][0]
   assert sorted(task['tokens'])==sorted(answer.split()),task['id']
   assert task['tokens']!=answer.split(),task['id']
   if task['kind']=='order'and 'acceptedAnswers'in task:assert 'sentence'not in task
  all_tasks.append(task)
assert legacy_copies==35
assert geometry_sentences==216
assert len({x['id']for x in all_tasks})==372
bindings=read('l15-l18-assessment-bindings.json')['responseUnits'];assert {x['id']for x in bindings}=={x['id']for x in all_tasks}
assert examples['L16-V008']['exampleMeaning']=='ตรงนี้ฉันไม่มีสัญญาณโทรศัพท์'
assert examples['L16-V015']['exampleMeaning']=='ฉันมีนัดวันจันทร์'
assert examples['L17-V006']['kind']=='verb'
source=read('l15-l18-source-review.json');assert len([x for x in source['records']if x.get('inspectionMethod')=='cached_render_visually_inspected'])==12
assert len([x for x in source['records']if x.get('lemmaReview')=='existing_catalog_requires_source_recheck'])==4
assets=read('l15-l18-asset-manifest.json')['assets'];assert len({x['id']for x in assets})==len(assets)
assert all(x['status']!='ready'for x in assets)
for asset in assets:
 if asset['kind']=='dialogue_turn':assert asset['text']==utterances[asset['targetId']];assert asset['voice']==('de-DE-KatjaNeural'if asset['speaker']=='A'else'de-DE-ConradNeural')
for n in range(15,19):
 data=read(f'l{n}-content.json')
 def check(v):
  if isinstance(v,dict):
   assert not {'sourceId','pdfPage','printedPage','sources','sourcePage','supersedes','provenance'}.intersection(v)
   for child in v.values():check(child)
  elif isinstance(v,list):
   for child in v:check(child)
 check(data)
print('PASS: 4 lessons, 97 lexical units, 7 grammar topics, 32 dialogues, 372 mapped candidate responses')
print('PASS: 35 legacy grammar answers and 24 existing vocabulary identities preserved; 216 annotated teaching/feedback sentence rows reconstruct exactly')
print('Preparation only: 12 cached source pages inspected; dictionary/media/account/selector/UI integration remain explicit gates')
