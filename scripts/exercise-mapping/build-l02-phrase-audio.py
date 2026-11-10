#!/usr/bin/env python3
"""Build authored L02 dialogue recordings with distinct voices and a 0.5s turn gap."""
import asyncio,json,subprocess,wave
from pathlib import Path
import edge_tts
R=Path(__file__).resolve().parents[2]
manifest=json.loads((R/'docs/exercise-mapping/l02-phrase-audio.json').read_text())
async def build(clip):
 out=R/'public'/clip['path'].lstrip('/')
 if out.exists():return
 work=R/'.tools/l02-audio'/out.stem;work.mkdir(parents=True,exist_ok=True);pcm=[]
 for i,turn in enumerate(clip['turns']):
  mp3=work/f'{i}.mp3';wav=work/f'{i}.wav'
  if not mp3.exists():await edge_tts.Communicate(turn['text'],turn['voice'],rate='-12%').save(str(mp3))
  subprocess.run(['afconvert','-f','WAVE','-d','LEI16@24000','-c','1',str(mp3),str(wav)],check=True)
  with wave.open(str(wav),'rb') as f:pcm.append(f.readframes(f.getnframes()))
 combined=work/'dialogue.wav'
 with wave.open(str(combined),'wb') as f:
  f.setnchannels(1);f.setsampwidth(2);f.setframerate(24000);f.writeframes(bytes(24000).join(pcm))
 out.parent.mkdir(parents=True,exist_ok=True)
 subprocess.run(['afconvert','-f','m4af','-d','aac',str(combined),str(out)],check=True)
 print('Built',clip['path'],flush=True)
async def main():
 sem=asyncio.Semaphore(2)
 async def guarded(clip):
  async with sem:await build(clip)
 await asyncio.gather(*(guarded(clip) for clip in manifest['clips']))
asyncio.run(main())
