#!/usr/bin/env python3
"""Build reviewed authored dialogue clips with content-addressed caches; macOS afconvert + edge-tts."""
import asyncio,hashlib,json,re,subprocess,wave
from pathlib import Path
import edge_tts
R=Path(__file__).resolve().parents[2]
manifest=json.loads((R/'docs/exercise-mapping/l03-l12-phrase-audio.json').read_text())
letters={'A':'A','B':'Be','C':'Tse','D':'De','E':'E','F':'Ef','G':'Ge','H':'Ha','I':'I','J':'Jot','K':'Ka','L':'El','M':'Em','N':'En','O':'O','P':'Pe','Q':'Ku','R':'Er','S':'Es','T':'Te','U':'U','V':'Fau','W':'We','X':'Iks','Y':'Ypsilon','Z':'Tsett'}
def spoken(text):return re.sub(r'\b[A-Z](?:-[A-Z]){2,}\b',lambda m:'. '.join(letters[c] for c in m.group().split('-'))+'.',text)
async def build(clip):
 signature=hashlib.sha256(json.dumps(clip,sort_keys=True).encode()).hexdigest()
 out=R/'public'/clip['path'].lstrip('/');work=R/'.tools/phrase-dialogue-audio'/out.stem;work.mkdir(parents=True,exist_ok=True);stamp=work/'signature.txt'
 if out.exists() and stamp.exists() and stamp.read_text()==signature:return
 pcm=[]
 for i,turn in enumerate(clip['turns']):
  text=spoken(turn['text']);sig=hashlib.sha256((turn['voice']+text+'-12%').encode()).hexdigest()[:16];mp3=work/(sig+'.mp3');wav=work/(sig+'.wav')
  if not mp3.exists():
   for attempt in range(3):
    try:await edge_tts.Communicate(text,turn['voice'],rate='-12%').save(str(mp3));break
    except Exception:
     if mp3.exists():mp3.unlink()
     if attempt==2:raise
     await asyncio.sleep(1+attempt)
  if not wav.exists():subprocess.run(['afconvert','-f','WAVE','-d','LEI16@24000','-c','1',str(mp3),str(wav)],check=True)
  with wave.open(str(wav),'rb') as f:pcm.append(f.readframes(f.getnframes()))
 combined=work/'dialogue.wav'
 with wave.open(str(combined),'wb') as f:f.setnchannels(1);f.setsampwidth(2);f.setframerate(24000);f.writeframes(bytes(24000).join(pcm))
 out.parent.mkdir(parents=True,exist_ok=True);subprocess.run(['afconvert','-f','m4af','-d','aac',str(combined),str(out)],check=True);stamp.write_text(signature);print('Built',clip['path'],flush=True)
async def main():
 sem=asyncio.Semaphore(3)
 async def guarded(clip):
  async with sem:await build(clip)
 await asyncio.gather(*(guarded(c) for c in manifest['clips']))
asyncio.run(main())
