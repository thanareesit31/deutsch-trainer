# -*- coding: utf-8 -*-
"""Build exact A/B practice audio without replacing any published media."""
from pathlib import Path
import json,hashlib,shutil,subprocess,sys,os
root=Path(__file__).resolve().parents[2]
packets=json.loads((root/'docs/exercise-mapping/l01-l13-practice-extensions.json').read_text())
l14=json.loads((root/'src/data/l14-practice-extensions.json').read_text())
assets=[]
for packet in packets:
 for q in packet['questions']:
  for speaker,text in [('A',q['dialoguePrompt']['text']),('B',q['acceptedAnswers'][0])]:
   assets.append(dict(id=q['id']+'-'+speaker,kind='dialogue_turn',speaker=speaker,text=text,voice='de-DE-KatjaNeural' if speaker=='A' else 'de-DE-ConradNeural'))
for q in l14:assets.append(dict(id=q['id']+'-B',kind='dialogue_turn',speaker='B',text=q['answer'],voice='de-DE-ConradNeural'))
output=root/'.tools/phrase-practice-media-output';scratch=output/'source';folder=scratch/'docs/lesson-preparation';folder.mkdir(parents=True,exist_ok=True)
(folder/'l15-l18-asset-manifest.json').write_text(json.dumps(dict(schemaVersion=1,defaultLexicalVoice='de-DE-KatjaNeural',assets=assets),ensure_ascii=False))
(scratch/'.tools').mkdir(exist_ok=True)
for name in ['edge-tts','phrase-presentation-audio']:
 link=scratch/'.tools'/name
 if not link.exists():link.symlink_to(root/'.tools'/name,target_is_directory=True)
media=output/'public/audio/a13-release';media.mkdir(parents=True,exist_ok=True)
for a in assets:
 key=hashlib.sha256((a['voice']+a['text']+'-12%').encode()).hexdigest()[:16];existing=root/'public/audio/a13-release'/(key+'.mp3')
 if existing.exists():shutil.copyfile(existing,media/existing.name)
subprocess.run([sys.executable,str(root/'scripts/exercise-mapping/build-a13-release-audio.py'),'--source-root',str(scratch),'--output-root',str(output)],env=dict(os.environ,PYTHONDONTWRITEBYTECODE='1'),check=True)
report=json.loads((output/'docs/lesson-preparation/l15-l18-audio-assets.json').read_text())
for asset in report['assets'].values():
 assert asset['status']=='ready' and asset['durationSeconds']>0
 generated=output/'public'/asset['path'].lstrip('/');dest=root/'public'/asset['path'].lstrip('/')
 if dest.exists():assert dest.read_bytes()==generated.read_bytes(),'Attempt to replace published media'
 else:shutil.copyfile(generated,dest)
(root/'src/data/phrase-practice-upgrade-audio.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print('Validated audio references',len(report['assets']),'unique files',len({a['path'] for a in report['assets'].values()}))
