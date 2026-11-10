#!/usr/bin/env python3
"""Build deterministic dialogue/voice assets, reusing existing cached speech."""
import asyncio,hashlib,json,re,subprocess,wave,shutil
from pathlib import Path
import edge_tts
R=Path(__file__).resolve().parents[2]
manifest=json.loads((R/'docs/exercise-mapping/phrase-presentation-audio.json').read_text())
cache=R/'.tools/phrase-presentation-audio';cache.mkdir(parents=True,exist_ok=True)
letters=dict(zip('ABCDEFGHIJKLMNOPQRSTUVWXYZ',['A','Be','Tse','De','E','Ef','Ge','Ha','I','Jot','Ka','El','Em','En','O','Pe','Ku','Er','Es','Te','U','Fau','We','X','Ypsilon','Tsett']))
def spoken(text):return re.sub(r'\b[A-Z](?:-[A-Z]){2,}\b',lambda m:'. '.join(letters[c] for c in m.group().split('-'))+'.',text)
index={p.stem:p for p in (R/'.tools/phrase-dialogue-audio').glob('*/*.mp3')}
for name,folder in [('l02-phrase-audio.json','l02-audio')]:
 for clip in json.loads((R/'docs/exercise-mapping'/name).read_text())['clips']:
  for i,turn in enumerate(clip['turns']):
   path=R/'.tools'/folder/Path(clip['path']).stem/(str(i)+'.mp3')
   if path.exists():index[hashlib.sha256((turn['voice']+spoken(turn['text'])+'-12%').encode()).hexdigest()[:16]]=path
locks={};sem=None
async def turn_asset(turn):
 text=spoken(turn['text']);key=hashlib.sha256((turn['voice']+text+'-12%').encode()).hexdigest()[:16]
 mp3=cache/(key+'.mp3');wav=cache/(key+'.wav')
 async with locks.setdefault(key,asyncio.Lock()):
  if not mp3.exists():
   if key in index:shutil.copyfile(index[key],mp3)
   else:
    async with sem:
     for attempt in range(3):
      try:
       temporary=mp3.with_suffix('.partial.mp3')
       await edge_tts.Communicate(text,turn['voice'],rate='-12%').save(str(temporary));temporary.replace(mp3);break
      except Exception:
       if temporary.exists():temporary.unlink()
       if attempt==2:raise
       await asyncio.sleep(attempt+1)
  if not wav.exists():subprocess.run(['afconvert','-f','WAVE','-d','LEI16@24000','-c','1',str(mp3),str(wav)],check=True)
 return mp3,wav
async def build_clip(clip):
 out=R/'public'/clip['path'].lstrip('/')
 if out.exists():return
 samples=[]
 for turn in clip['turns']:
  _,wav=await turn_asset(turn)
  with wave.open(str(wav),'rb')as audio:samples.append(audio.readframes(audio.getnframes()))
 source=cache/(out.stem+'.wav')
 with wave.open(str(source),'wb')as audio:audio.setnchannels(1);audio.setsampwidth(2);audio.setframerate(24000);audio.writeframes(bytes(24000).join(samples))
 out.parent.mkdir(parents=True,exist_ok=True);temporary=out.with_suffix('.partial.m4a')
 subprocess.run(['afconvert','-f','m4af','-d','aac',str(source),str(temporary)],check=True);temporary.replace(out)
 print('Built',clip['path'],flush=True)
async def main():
 global sem
 sem=asyncio.Semaphore(3)
 async def publish_turn(turn):
  out=R/'public'/turn['path'].lstrip('/')
  if out.exists():return
  mp3,_=await turn_asset(turn);out.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(mp3,out)
 await asyncio.gather(*(publish_turn(turn)for turn in manifest['turns']))
 async def guarded(clip):
  async with sem:await build_clip(clip)
 # Speech has already been cached by the turn pass, so conversion needs no network slot.
 await asyncio.gather(*(guarded(clip)for clip in manifest['clips']))
asyncio.run(main())
