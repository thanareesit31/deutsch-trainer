#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build extension audio in a scratch output; never replace the published audio registry."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source-root', required=True, type=Path)
    parser.add_argument('--phrase-manifest', required=True, type=Path)
    args = parser.parse_args()
    source = args.source_root.resolve()
    repo = Path(__file__).resolve().parents[2]
    folder = repo / 'docs/lesson-preparation'
    output = repo / '.tools/practice-extension-media-output'
    scratch = output / '.tools/practice-extension-audio-source'
    target = scratch / 'docs/lesson-preparation'
    target.mkdir(parents=True, exist_ok=True)
    grammar = json.loads((folder / 'grammar-practice-extension-audio.json').read_text())
    phrases = json.loads(args.phrase_manifest.read_text())
    assets = grammar['assets'] + phrases['assets']
    assert len({a['id'] for a in assets}) == len(assets), 'Duplicate extension asset IDs'
    (target / 'l15-l18-asset-manifest.json').write_text(json.dumps(dict(schemaVersion=1, defaultLexicalVoice='de-DE-KatjaNeural', dialoguePauseMs=500, assets=assets), ensure_ascii=False, indent=2) + '\n')
    dependencies = scratch / '.tools'
    dependencies.mkdir(exist_ok=True)
    for name in ['edge-tts', 'phrase-presentation-audio']:
        link = dependencies / name
        if not link.exists() and (source / '.tools' / name).exists():
            link.symlink_to(source / '.tools' / name, target_is_directory=True)
    media = output / 'public/audio/a13-release'
    media.mkdir(parents=True, exist_ok=True)
    baseline = folder / 'l15-l18-audio-assets.json'
    before = baseline.read_bytes()
    original = json.loads(before)['assets']
    old_paths = {a['path'] for a in original.values() if a.get('path')}
    for asset in assets:
        assert asset.get('text') and asset.get('voice'), asset['id']
        key = hashlib.sha256((asset['voice'] + asset['text'] + '-12%').encode()).hexdigest()[:16]
        existing = source / 'public/audio/a13-release' / (key + '.mp3')
        if existing.exists():
            shutil.copyfile(existing, media / existing.name)
    subprocess.run([sys.executable, str(source / 'scripts/exercise-mapping/build-a13-release-audio.py'), '--source-root', str(scratch), '--output-root', str(output)], env=dict(os.environ, PYTHONDONTWRITEBYTECODE='1'), check=True)
    report = json.loads((output / 'docs/lesson-preparation/l15-l18-audio-assets.json').read_text())
    assert set(report['assets']) == {a['id'] for a in assets}
    previous_file = folder / 'l15-l18-practice-extension-audio-assets.json'
    previous = json.loads(previous_file.read_text())['assets'] if previous_file.exists() else {}
    for asset_id, asset in report['assets'].items():
        assert asset['status'] == 'ready' and asset['durationSeconds'] > 0
        generated = output / 'public' / asset['path'].lstrip('/')
        destination = repo / 'public' / asset['path'].lstrip('/')
        if destination.exists():
            assert destination.read_bytes() == generated.read_bytes(), 'Attempt to replace published audio: ' + asset['path']
        else:
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(generated, destination)
        old = previous.get(asset_id)
        if old and all(old.get(k) == asset.get(k) for k in ['path', 'text', 'voice', 'rate']):
            asset['origin'] = old['origin']
    report['scope'] = 'new-practice-extension-assets-only'
    paths = {a['path'] for a in report['assets'].values()}
    report['canonicalReusedFiles'] = sorted(Path(p).name for p in paths & old_paths)
    report['newMediaFiles'] = len(paths - old_paths)
    assert baseline.read_bytes() == before, 'Published audio registry changed'
    previous_file.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(dict(assetIds=len(assets), newMediaFiles=report['newMediaFiles'], canonicalRegistryUnchanged=True)))


if __name__ == '__main__':
    main()
