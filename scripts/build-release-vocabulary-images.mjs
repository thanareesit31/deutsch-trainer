// Validate all replacement photographs before publishing their catalog paths.
import { readFile, writeFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const metadata = JSON.parse(await readFile('src/data/release-vocabulary-images.json', 'utf8'));
const jobs = JSON.parse(await readFile('artifacts/vocabulary-image-correction/jobs.json', 'utf8'));
const reviews = JSON.parse(await readFile('artifacts/vocabulary-image-correction/visual-review.json', 'utf8'));
const replacements = new Map(jobs.map(job => [job.id, job]));
const next = [];
for (const entry of metadata) {
  const job = replacements.get(entry.id);
  if (!job) {
    await access(`public${entry.image}`);
    next.push(entry);
    continue;
  }
  const bytes = await readFile(job.destination);
  if (reviews[job.id]?.status !== 'reviewed' || reviews[job.id]?.sha256 !== createHash('sha256').update(bytes).digest('hex')) throw Error(`Review the actual picture before publishing it: ${job.id}`);
  if (bytes.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') throw Error(`Expected a real PNG photograph: ${job.id}`);
  const width = bytes.readUInt32BE(16), height = bytes.readUInt32BE(20);
  if (width < 1200 || height < 800 || Math.abs(width / height - 1.5) > 0.02) throw Error(`Expected a complete landscape 3:2 image: ${job.id} (${width}x${height})`);
  next.push({ ...entry, image: '/' + job.destination.replace(/^public\//, ''), presentation: 'generated-scene-photograph', promptSource: 'artifacts/vocabulary-image-correction/jobs.json' });
}
if (next.length !== 97 || next.some(entry => entry.image.endsWith('.svg'))) throw Error('All 97 vocabulary targets need reviewed raster illustrations; do not substitute icons or labeled diagrams.');
await writeFile('src/data/release-vocabulary-images.json', JSON.stringify(next, null, 2) + '\n');
console.log(`Published ${next.length} verified vocabulary image paths`);
