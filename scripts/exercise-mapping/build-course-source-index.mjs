import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../../', import.meta.url);
const inventory = JSON.parse(await readFile(new URL('docs/exercise-mapping/all-lessons-inventory.json', root), 'utf8'));

// The printed lesson starts come from the contents pages of the two Momente course books.
// The A1.1 scan omits pages later in the book; a single offset is unsafe there.
const printedStarts = [9, 13, 17, 27, 31, 35, 45, 49, 53, 63, 67, 71, 9, 13, 17, 27, 31, 35];
const entries = Array.from({ length: 18 }, (_, index) => {
  const number = index + 1;
  const lessonId = `L${String(number).padStart(2, '0')}`;
  const first = printedStarts[index];
  const last = first + 3;
  const a11 = number <= 12;
  const slots = inventory.slots.filter(slot => slot.lessonId === lessonId);
  return {
    lessonId,
    title: slots[0]?.lessonTitle ?? '',
    level: slots[0]?.level ?? '',
    courseBookSourceId: a11 ? 'MOMENTE_A1_1_KB' : 'MOMENTE_A1_2_KB',
    printedPages: [first, last],
    pdfPages: a11 ? (number === 1 ? [11, 14] : null) : [first, last],
    locatorEvidence: a11 ? 'A1.1 contents PDF pages 8–9; PDF 12 contains printed 10. Later scan pages are omitted, so other PDF ranges require individual checks.' : 'A1.3 contents PDF page 6; printed and PDF page numbers cross checked at 33 and 36',
    scopeStatus: a11 && number !== 1 ? 'printed_range_verified_pdf_locator_pending' : 'contents_verified',
    skills: slots.map(slot => ({
      skill: slot.skill,
      knownTopics: [...new Set([...slot.curriculumTopics, ...slot.catalogGroups])],
      contentStatus: slot.status,
      exerciseAuditStatus: slot.status === 'pilot_bank' ? 'pilot_bank_only' : 'pending_activity_review',
    })),
  };
});

await writeFile(
  new URL('docs/exercise-mapping/course-source-page-index.json', root),
  JSON.stringify({
    schemaVersion: 1,
    generatedAt: '2026-10-20',
    purpose: 'Internal source page locator and 108-slot scope index; not a verified question bank',
    numbering: 'Printed book page, with PDF page kept separately',
    entries,
  }, null, 2) + '\n',
);
console.log(`Indexed ${entries.length} lessons and ${entries.reduce((sum, entry) => sum + entry.skills.length, 0)} skill slots.`);
