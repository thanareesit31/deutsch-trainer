#!/usr/bin/env python3
"""Generate and decode-validate content-addressed L15–L18 speech and dialogue pairs."""
import argparse
import asyncio
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import sys
import wave


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source-root', required=True, type=Path)
    parser.add_argument('--output-root', required=True, type=Path)
    args = parser.parse_args()
    source, output = args.source_root.resolve(), args.output_root.resolve()
    sys.path.insert(0, str(source / '.tools/edge-tts'))
    import edge_tts
    manifest = json.loads((source / 'docs/lesson-preparation/l15-l18-asset-manifest.json').read_text())
    assets = [a for a in manifest['assets'] if a['kind'] != 'image_or_context_card']
    folder = output / 'public/audio/a13-release'
    cache = output / '.tools/a13-release-audio'
    folder.mkdir(parents=True, exist_ok=True)
    cache.mkdir(parents=True, exist_ok=True)
    mapping = {}
    locks = {}
    sem = None
    rate = '-12%'

    def convert(source_file, dest):
        temporary = dest.with_name(dest.stem + '.partial' + dest.suffix)
        subprocess.run(['afconvert', '-f', 'WAVE', '-d', 'LEI16@24000', '-c', '1', str(source_file), str(temporary)], check=True, stdout=subprocess.DEVNULL)
        temporary.replace(dest)
        with wave.open(str(dest), 'rb') as stream:
            assert stream.getnchannels() == 1 and stream.getframerate() == 24000
            assert stream.getnframes() > 0
            return stream.getnframes() / 24000

    async def speech(asset):
        voice = asset.get('voice', manifest['defaultLexicalVoice'])
        if asset['kind'] == 'dialogue_turn':
            voice = 'de-DE-KatjaNeural' if asset['speaker'] == 'A' else 'de-DE-ConradNeural'
        text = asset['text']
        key = hashlib.sha256((voice + text + rate).encode()).hexdigest()[:16]
        dest, decoded = folder / (key + '.mp3'), cache / (key + '.wav')
        async with locks.setdefault(key, asyncio.Lock()):
            origin = 'existing_output'
            if not dest.exists():
                reused = next((p for p in [source / '.tools/phrase-presentation-audio' / (key + '.mp3')] if p.exists()), None)
                temporary = dest.with_suffix('.partial.mp3')
                if reused:
                    shutil.copyfile(reused, temporary)
                    temporary.replace(dest)
                    origin = 'compatible_cache'
                else:
                    async with sem:
                        for attempt in range(4):
                            try:
                                await edge_tts.Communicate(text, voice, rate=rate).save(str(temporary))
                                temporary.replace(dest)
                                origin = 'generated'
                                break
                            except Exception:
                                if temporary.exists(): temporary.unlink()
                                if attempt == 3:
                                    print('SPEECH REQUEST FAILED', asset['id'], flush=True)
                                    raise
                                await asyncio.sleep(2 ** attempt)
            duration = convert(dest, decoded)
        mapping[asset['id']] = dict(path='/audio/a13-release/' + dest.name, status='ready', kind=asset['kind'], text=text, voice=voice, rate=rate, durationSeconds=duration, origin=origin)

    def pair(asset):
        turns = [mapping[turn_id] for turn_id in asset['turnIds']]
        pause = manifest.get('dialoguePauseMs', 500)
        identity = json.dumps({'turns': [t['path'] for t in turns], 'pauseMs': pause}, sort_keys=True)
        key = hashlib.sha256(identity.encode()).hexdigest()[:24]
        dest, decoded = folder / (key + '.m4a'), cache / (key + '.wav')
        samples = []
        for turn in turns:
            with wave.open(str(cache / (Path(turn['path']).stem + '.wav')), 'rb') as stream:
                samples.append(stream.readframes(stream.getnframes()))
        with wave.open(str(decoded), 'wb') as stream:
            stream.setnchannels(1)
            stream.setsampwidth(2)
            stream.setframerate(24000)
            stream.writeframes(bytes(24000 * pause // 1000 * 2).join(samples))
        if not dest.exists():
            temporary = dest.with_suffix('.partial.m4a')
            subprocess.run(['afconvert', '-f', 'm4af', '-d', 'aac', str(decoded), str(temporary)], check=True)
            temporary.replace(dest)
        duration = convert(dest, cache / (key + '-validated.wav'))
        mapping[asset['id']] = dict(path='/audio/a13-release/' + dest.name, status='ready', kind=asset['kind'], turnIds=asset['turnIds'], pauseMs=pause, durationSeconds=duration)

    async def build():
        nonlocal sem
        sem = asyncio.Semaphore(3)
        pending = [a for a in assets if a['kind'] != 'dialogue_pair']
        results = await asyncio.gather(*(speech(a) for a in pending), return_exceptions=True)
        errors = []
        for asset, result in zip(pending, results):
            if isinstance(result, BaseException):
                errors.append(asset['id'])
                mapping[asset['id']] = dict(status='failed', error=str(result), kind=asset['kind'])
                print('FAILED', asset['id'], str(result), flush=True)
        for asset in assets:
            if asset['kind'] != 'dialogue_pair': continue
            if any(mapping[t]['status'] != 'ready' for t in asset['turnIds']):
                mapping[asset['id']] = dict(status='blocked', kind='dialogue_pair')
                errors.append(asset['id'])
            else: pair(asset)
        report = output / 'docs/lesson-preparation/l15-l18-audio-assets.json'
        report.parent.mkdir(parents=True, exist_ok=True)
        temporary = report.with_suffix('.partial.json')
        temporary.write_text(json.dumps({'schemaVersion': 1, 'assets': mapping}, ensure_ascii=False, indent=2) + '\n')
        temporary.replace(report)
        print(json.dumps({'assets': len(mapping), 'ready': sum(a['status']=='ready' for a in mapping.values()), 'failed': errors, 'files': len(list(folder.iterdir())), 'mapping': str(report)}), flush=True)
        if errors: raise SystemExit(1)
    asyncio.run(build())

if __name__ == '__main__':
    main()
