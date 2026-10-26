let matchFocus = null;

function phraseQuestionTranslation(question) {
  const translations = {
    'L13-phrases-rating-sequence-1': 'คุณชอบเบอร์ลินไหม',
    'L13-phrases-rating-sequence-2': 'เมืองนี้เหมือนกับเมืองอื่น ๆ ไหม',
    'L13-phrases-rating-sequence-3': 'คุณคิดว่าเมืองนี้ยอดเยี่ยมไหม',
    'L13-phrases-rating-sequence-4': 'เมืองนี้ใหญ่เกินไปไหม',
    'L13-phrases-rating-sequence-5': 'คุณคิดอย่างไรกับเบอร์ลิน',
    'L13-phrases-city-sequence-1': 'ที่นี่มีสวนสาธารณะไหม',
    'L13-phrases-city-sequence-2': 'ที่นี่มีโบสถ์ไหม',
    'L13-phrases-city-sequence-3': 'ที่นี่มีอะไรบ้าง',
    'L13-phrases-city-sequence-4': 'ที่นี่มีท่าเรือไหม',
    'L13-phrases-city-sequence-5': 'ที่นี่มีย่านเมืองเก่าไหม',
    'L13-phrases-favorite-sequence-1': 'สถานที่โปรดของคุณคือที่ไหน',
    'L13-phrases-favorite-sequence-2': 'ทำไมคุณถึงชอบอยู่ท่ามกลางธรรมชาติ',
    'L13-phrases-favorite-sequence-3': 'ที่นั่นเดินเล่นได้ไหม',
    'L13-phrases-favorite-sequence-4': 'ที่นั่นตกปลาได้ด้วยไหม',
    'L13-phrases-favorite-sequence-5': 'พวกคุณทำอะไรด้วยกันที่นั่น',
    'L13-phrases-opinions-sequence-3': 'คุณชอบอะไรมากเป็นพิเศษ',
    'L13-phrases-opinions-sequence-4': 'คุณรู้สึกว่าขาดอะไร',
    'L13-phrases-opinions-sequence-5': 'คุณคิดอย่างไรกับเบอร์ลิน',
  };
  const translation = translations[question.id];
  return translation && translation !== question.translation ? translation : '';
}

function pickPhraseSequence(pool, count, origin) {
  if (origin === 'review') {
    const groups = new Set(pool.filter(q => q.interaction === 'match').map(q => q.matchGroupId));
    pool = [...new Map([...pool, ...BANK.questions.filter(q => groups.has(q.matchGroupId))].map(q => [q.id, q])).values()];
    count = pool.length;
  }
  if (BANK.workflow !== 'daily' || origin === 'review') {
    return pool.slice().sort((a, b) => BANK.topicOrder.indexOf(a.topicId) - BANK.topicOrder.indexOf(b.topicId) || a.sequence - b.sequence).slice(0, count);
  }
  const plan = planDailyPractice(pool, combinedHistory());
  const topics = new Set(plan.questionIds.map(id => pool.find(q => q.id === id)?.topicId));
  const ranked = [...new Set([...plan.questionIds, ...pool.filter(q => topics.has(q.topicId)).map(q => q.id)])];
  const selected = [], used = new Set();
  for (const id of ranked) {
    const q = pool.find(q => q.id === id);
    if (!q) continue;
    const block = q.interaction === 'match' ? pool.filter(item => item.matchGroupId === q.matchGroupId) : [q];
    if (q.interaction === 'match' && block.length !== 2) continue;
    if (selected.length + block.length > count || block.some(item => used.has(item.itemId))) continue;
    selected.push(...block);
    block.forEach(item => used.add(item.itemId));
  }
  return selected.sort((a, b) => BANK.topicOrder.indexOf(a.topicId) - BANK.topicOrder.indexOf(b.topicId) || a.sequence - b.sequence);
}

function matchingQuestion() {
  const session = current(), first = activeItem();
  const block = session.items.slice(session.position, session.position + 2);
  if (block.length !== 2 || block.some(item => item.question.matchGroupId !== first.question.matchGroupId)) return false;
  const ids = block.map(item => item.question.id);
  if (matchFocus?.groupId !== first.question.matchGroupId) matchFocus = null;
  const submitted = block.every(item => item.attempt);
  const done = session.items.filter(item => item.attempt).length;
  if (session.workflow === 'guided') {
    const index = BANK.sections.findIndex(topic => topic.topicId === first.question.topicId);
    app.append(node('p', `หัวข้อ ${index + 1} จาก ${BANK.sections.length} · ${first.question.topicName}`, { class: 'muted' }));
  }
  const progress = node('div', undefined, { class: 'practice-progress' });
  progress.append(node('span', `${done} / ${session.items.length} ข้อ`), node('progress', undefined, { value: done, max: session.items.length, 'aria-label': 'ความคืบหน้าชุดฝึก' }));
  app.append(progress);
  const card = node('section', undefined, { class: 'card', 'data-question-id': first.question.id, 'data-match-group': first.question.matchGroupId });
  card.append(node('h1', 'จับคู่คำถามกับคำตอบ', { id: 'q-title', tabindex: '-1', class: 'tag question-instruction' }));
  if (first.question.matchContext) card.append(node('p', first.question.matchContext));
  if (submitted) {
    const rows = node('div', undefined, { class: 'phrase-match-checked' });
    block.forEach(item => {
      const row = node('div', undefined, { class: 'phrase-match-checked-row ' + (item.attempt.correct ? 'correct' : 'incorrect') });
      row.append(node('span', item.question.sentence, { lang: 'de' }), node('span', '→', { 'aria-hidden': 'true' }), node('span', item.response, { lang: 'de' }));
      rows.append(row);
    });
    card.append(rows);
  } else {
    card.append(node('p', 'เลือกกล่องจากฝั่งใดก่อนก็ได้ แล้วเลือกกล่องอีกฝั่งเพื่อจับคู่', { class: 'muted' }));
    const connect = (questionId, answer) => {
      if (commit(state => {
        const rows = current(state).items.filter(item => ids.includes(item.question.id));
        for (const item of rows) if (item.response === answer) item.response = '';
        rows.find(item => item.question.id === questionId).response = answer;
      }, false)) { matchFocus = null; render(); focusTitle(); }
    };
    const remove = questionId => {
      if (commit(state => { current(state).items.find(item => item.question.id === questionId).response = ''; }, false)) { matchFocus = null; render(); }
    };
    const grid = node('div', undefined, { class: 'phrase-match-columns' });
    const questions = node('div', undefined, { class: 'phrase-match-column', 'aria-label': 'คำถาม' });
    block.forEach(item => questions.append(button(item.question.sentence, () => {
      if (matchFocus?.side === 'answer') { connect(item.question.id, matchFocus.value); return; }
      if (matchFocus?.value === item.question.id) { if (item.response) remove(item.question.id); else { matchFocus = null; render(); } return; }
      matchFocus = { side: 'question', value: item.question.id, groupId: first.question.matchGroupId }; render();
    }, { lang: 'de', 'data-match-prompt': item.question.id, 'data-matched': Boolean(item.response), 'aria-pressed': matchFocus?.side === 'question' && matchFocus.value === item.question.id })));
    const lines = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    lines.setAttribute('class', 'phrase-match-lines');
    lines.setAttribute('viewBox', '0 0 100 130');
    lines.setAttribute('preserveAspectRatio', 'none');
    lines.setAttribute('aria-hidden', 'true');
    block.forEach((item, index) => {
      const target = first.question.options.indexOf(item.response);
      if (target < 0) return;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      for (const [key, value] of Object.entries({ x1: 0, y1: index * 72 + 29, x2: 100, y2: target * 72 + 29 })) line.setAttribute(key, String(value));
      lines.append(line);
    });
    const options = node('div', undefined, { class: 'phrase-match-column', 'aria-label': 'คำตอบ' });
    first.question.options.forEach(answer => {
      const assigned = block.find(item => item.response === answer);
      options.append(button(answer, () => {
        if (matchFocus?.side === 'question') { connect(matchFocus.value, answer); return; }
        if (matchFocus?.value === answer) { if (assigned) remove(assigned.question.id); else { matchFocus = null; render(); } return; }
        matchFocus = { side: 'answer', value: answer, groupId: first.question.matchGroupId }; render();
      }, { lang: 'de', 'data-match-answer': answer, 'data-matched': Boolean(assigned), 'aria-pressed': matchFocus?.side === 'answer' && matchFocus.value === answer }));
    });
    grid.append(questions, lines, options);
    card.append(grid);
  }
  const actions = node('div', undefined, { class: 'row actions' });
  actions.append(backButton(first.question));
  if (!submitted) {
    const check = button('ตรวจคำตอบ', () => commit(state => {
      for (const item of current(state).items.filter(item => ids.includes(item.question.id))) {
        if(item.attempt) continue;
        const result = grade(item);
        item.attempt = { ...result, response: item.response, confidence: null, status: 'completed', submittedAt: new Date().toISOString(), hintUsed: false, translationUsed: false };
      }
    }), { class: 'primary', id: 'check' });
    check.disabled = block.some(item => !item.response) || new Set(block.map(item => item.response)).size !== 2;
    actions.append(check);
  } else {
    const feedback = node('div', undefined, { id: 'feedback', role: 'status', class: 'feedback' + (block.some(item => !item.attempt.correct) ? ' wrong' : '') });
    block.forEach((item, index) => {
      feedback.append(node('h2', `คู่ ${index + 1} · ${item.attempt.correct ? 'ถูกต้อง' : 'ยังไม่ถูก'}`), node('p', item.question.sentence, { lang: 'de' }));
      const questionTranslation = phraseQuestionTranslation(item.question);
      if (questionTranslation) feedback.append(node('p', 'คำแปลคำถาม: ' + questionTranslation, { class: 'thai-translation', lang: 'th' }));
      feedback.append(node('p', 'คำตอบ: ' + item.question.feedbackAnswer, { lang: 'de' }), node('p', item.question.translation, { class: 'thai-translation', lang: 'th' }));
      if (item.question.explanation) feedback.append(node('p', item.question.explanation));
    });
    card.append(feedback);
    actions.append(button(session.position + 2 >= session.items.length ? 'จบชุดฝึก' : 'ข้อต่อไป', () => {
      if (commit(state => {
        const round = current(state), next = round.position + 2;
        for (const item of round.items.filter(item => ids.includes(item.question.id))) item.attempt.status = 'completed';
        if (next >= round.items.length) round.completed = true;
        else {
          round.position = next;

        }
      })) focusTitle();
    }, { class: 'primary', id: 'next' }));
  }
  card.append(actions); app.append(card); return true;
}
