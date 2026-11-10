import { gradeReleaseTask, normalizeReleaseAnswer, type ReleaseCourse, type ReleaseTask } from './a13-release';

const lettersOnly = (value: string) => normalizeReleaseAnswer(value).normalize('NFD').replace(/\p{M}/gu, '');
const withoutPunctuation = (value: string) => normalizeReleaseAnswer(value).replace(/[.!?]+$/u, '');

export function releaseResponseFeedback(course: ReleaseCourse, task: ReleaseTask, response: string) {
  if (gradeReleaseTask(task, response)) return { category: 'correct', message: task.feedback.reason };
  const authored = task.feedback.errors?.find(error => normalizeReleaseAnswer(error.response) === normalizeReleaseAnswer(response) || !task.spelling && withoutPunctuation(error.response) === withoutPunctuation(response));
  if (authored) return authored;
  const answer = task.acceptedAnswers[0];
  if (task.articleTarget && task.noun) return { category: 'article', message: task.noun.plural ? `คุณเลือก ${response} แต่ข้อนี้ถามรูปพหูพจน์ จึงใช้ die โดยไม่ได้วัดเพศเอกพจน์ของคำนี้` : `คุณเลือก ${response} แต่ ${task.noun.word} ใช้ ${task.noun.article} ในรูปที่โจทย์ถาม ให้จำพร้อมกันเป็น ${task.noun.article} ${task.noun.word}` };
  if (task.spelling) {
    if (normalizeReleaseAnswer(response) === normalizeReleaseAnswer(answer)) return { category: 'capitalization', message: task.noun ? 'ตัวอักษรตรงแล้ว แต่คำนามภาษาเยอรมันต้องขึ้นต้นด้วยตัวพิมพ์ใหญ่ ลองเทียบตัวแรกกับคำเฉลย' : 'ตัวอักษรตรงแล้ว แต่ตัวพิมพ์ใหญ่และเล็กยังต่างจากรูปคำที่โจทย์ให้ฝึก ลองเทียบกับคำเฉลย' };
    if (lettersOnly(response) === lettersOnly(answer)) return { category: 'umlaut', message: 'คำตอบต่างที่เครื่องหมายบนสระ เช่น ä, ö หรือ ü เครื่องหมายนี้เป็นส่วนหนึ่งของการสะกด ใช้ปุ่มอักษรเยอรมันข้างช่องตอบได้' };
    if (task.noun && normalizeReleaseAnswer(response).startsWith(task.noun.article + ' ')) return { category: 'supplied_article', message: `ช่องนี้ให้ ${task.noun.article} ไว้แล้ว จึงพิมพ์เฉพาะ ${task.noun.word} ส่วน Artikel ไม่ถูกคิดคะแนนในข้อนี้` };
    let at = 0;
    while (at < answer.length && at < response.length && answer[at] === response[at]) at++;
    return { category: 'spelling', message: at >= response.length ? `คำตอบยังขาดส่วนท้าย เริ่มต่างจากคำที่เรียนตรง “${answer.slice(at)}” ลองเทียบกับคำเฉลยและฟังเสียงอีกครั้ง` : `จุดแรกที่ต่างอยู่ตรง “${response[at]}” ในตำแหน่งอักษรที่ ${at + 1} ลองเทียบกับ “${answer[at] ?? 'ท้ายคำ'}” ในคำเฉลย` };
  }
  if (task.subskill === 'word_meaning' || task.subskill === 'lexical_chunk_meaning') {
    const chosen = course.cards.find(card => card.purpose === response);
    const target = course.cards.find(card => card.targetIds.includes(task.targetId));
    return { category: 'meaning', message: chosen && target ? `ความหมายที่เลือกตรงกับ ${chosen.title} แต่คำที่โจทย์ให้คือ ${target.title} ให้เทียบทั้งคำและสถานการณ์ในตัวอย่าง` : `ความหมาย “${response}” ยังไม่ตรงกับคำที่โจทย์ให้ ลองเทียบความหมายและสถานการณ์ในเฉลย` };
  }
  if (task.startWith && !normalizeReleaseAnswer(response).startsWith(normalizeReleaseAnswer(task.startWith))) return { category: 'given_start', message: `คุณเริ่มด้วย “${response.split(/\s+/u)[0]}” แต่ข้อนี้กำหนดให้เริ่มด้วย “${task.startWith}” จากนั้นจัดส่วนที่เหลือตามข้อมูลที่ให้` };
  if (task.kind === 'order' || task.practice?.stage === 3) {
    const parts = task.feedback.models.flatMap(model => model.sentences.flat());
    const tail = parts.find(part => part.role === 'participle' || part.label.includes('Infinitiv') || part.label.includes('ส่วนแยก'));
    if (tail && withoutPunctuation(answer).endsWith(withoutPunctuation(tail.text)) && !withoutPunctuation(response).endsWith(withoutPunctuation(tail.text))) return { category: 'verb_tail', message: `ในรูปประโยคนี้ “${tail.text.replace(/[.!?]+$/u, '')}” อยู่ท้ายประโยค คำตอบของคุณยังวางส่วนนี้ไม่ตรงตำแหน่ง` };
    const finite = parts.find(part => (part.role === 'verb' || part.role === 'auxiliary') && part.position?.includes('2'));
    if (finite) {
      const word = withoutPunctuation(finite.text);
      const suppliedAt = withoutPunctuation(response).split(/\s+/u).indexOf(word);
      const expectedAt = withoutPunctuation(answer).split(/\s+/u).indexOf(word);
      if (suppliedAt >= 0 && expectedAt >= 0 && suppliedAt !== expectedAt) return { category: 'finite_verb_position', message: `คำตอบมี “${finite.text}” แล้ว แต่ตำแหน่งยังต่างจากแบบที่โจทย์กำหนด ดูส่วนแรกของประโยคก่อน แล้ววางกริยาที่ผันแล้วถัดจากส่วนนั้น` };
    }
  }
  return { category: task.kind === 'write' ? 'bounded_response' : 'context', message: task.kind === 'write' ? `ลองเทียบคำตอบกับข้อมูลและรูปแบบที่โจทย์กำหนด ${task.feedback.reason}` : `ตัวเลือก “${response}” ยังไม่ตรงกับข้อมูลในโจทย์ ${task.feedback.reason}` };
}
