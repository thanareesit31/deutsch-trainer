#!/usr/bin/env python3
"""Generate the two-speaker L01 spelling clip; requires edge-tts and macOS afconvert."""
import asyncio
import json
import subprocess
import wave
from pathlib import Path
import edge_tts

ROOT = Path(__file__).resolve().parents[2]
WORK = ROOT / '.tools/l01-dialogue-audio'
OUT = ROOT / 'public/audio/l01/spelling-dialogue-v1.m4a'

async def main():
    WORK.mkdir(parents=True, exist_ok=True)
    turns = [('question', 'de-DE-KatjaNeural', 'Wie schreibt man das?', '+0%'),
             ('reply', 'de-DE-ConradNeural', 'Em. A. El. I.', '-20%')]
    pcm = []
    for role, voice, text, rate in turns:
        mp3 = WORK / f'{role}.mp3'
        await edge_tts.Communicate(text, voice, rate=rate).save(str(mp3))
        wav = WORK / f'{role}.wav'
        subprocess.run(['afconvert', '-f', 'WAVE', '-d', 'LEI16@24000', '-c', '1', str(mp3), str(wav)], check=True)
        with wave.open(str(wav), 'rb') as audio:
            assert audio.getframerate() == 24000 and audio.getnchannels() == 1 and audio.getsampwidth() == 2
            pcm.append(audio.readframes(audio.getnframes()))
    joined = WORK / 'dialogue.wav'
    with wave.open(str(joined), 'wb') as audio:
        audio.setnchannels(1)
        audio.setsampwidth(2)
        audio.setframerate(24000)
        audio.writeframes(pcm[0] + bytes(24000) + pcm[1])
    OUT.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(['afconvert', '-f', 'm4af', '-d', 'aac', str(joined), str(OUT)], check=True)
    metadata = {'asset': '/' + str(OUT.relative_to(ROOT / 'public')), 'origin': 'Synthetic German dialogue generated with edge-tts; no personal voice cloning', 'turns': [{'role': r, 'voice': v, 'text': t, 'rate': speed} for r, v, t, speed in turns], 'gapSeconds': 0.5}
    (ROOT / 'docs/exercise-mapping/l01-dialogue-audio.json').write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + '\n')
    print(OUT)

asyncio.run(main())
