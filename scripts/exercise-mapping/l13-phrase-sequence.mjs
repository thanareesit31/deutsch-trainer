export function buildPhraseSequence(items, groups) {
  const byId = new Map(items.map(item => [item.id, item]));
  const scenarios = [
    [
      ['L13-R001', 'A: Gefällt Ihnen Berlin?\nB: ___', ['Ich liebe die Natur.', 'Es gibt viele Kirchen.']],
      ['L13-R006', 'A: Ist diese Stadt genauso wie andere Städte?\nB: ___', ['Mein Lieblingsort ist der Park.', 'Was gibt es hier?']],
      ['L13-R004', 'Finden Sie die Stadt toll?'],
      ['L13-R007', 'Ist die Stadt zu groß?'],
      ['L13-R005', 'คุณคิดว่าเบอร์ลินน่าสนใจ\nA: Wie finden Sie Berlin?\nB:', 'Ich'],
    ],
    [
      ['L13-R011', 'เมืองนี้มีสวนสาธารณะหนึ่งแห่ง\nA: Gibt es hier einen Park?\nB: ___', ['Ich liebe die Natur.', 'Möchten Sie Berlin besuchen?']],
      ['L13-R012', 'เมืองนี้มีโบสถ์หลายแห่ง\nA: Gibt es hier Kirchen?\nB: ___', ['Dort treffen wir Freunde.', 'Die Stadt ist zu groß.']],
      ['L13-R013', 'Was gibt es hier?'],
      ['L13-R015', 'Gibt es hier einen Hafen?'],
      ['L13-R016', 'เมืองนี้ไม่มีย่านเมืองเก่า\nA: Gibt es eine Altstadt?\nB:', 'Es'],
    ],
    [
      ['L13-R018', 'A: Was ist Ihr Lieblingsort?\nB: ___', ['Es gibt keine Altstadt.', 'Was gibt es hier?']],
      ['L13-R019', 'A: Warum sind Sie gern in der Natur?\nB: ___', ['Möchten Sie Berlin besuchen?', 'Leider gibt es keinen Hafen.']],
      ['L13-R020', 'Kann man dort spazieren gehen?'],
      ['L13-R021', 'Kann man dort auch angeln?'],
      ['L13-R022', 'พวกเราไปพบเพื่อนที่นั่น\nA: Was macht ihr dort zusammen?\nB:', 'Dort'],
    ],
    [
      ['L13-R024', 'A: ___\nB: Ich finde Berlin interessant.', ['Möchten Sie Berlin besuchen?', 'Was fehlt Ihnen?']],
      ['L13-R025', 'A: ___\nB: Ja, ich möchte Berlin besuchen.', ['Wie finden Sie Berlin?', 'Was fehlt Ihnen?']],
      ['L13-R028', 'Das Café am See gefällt mir besonders gut.'],
      ['L13-R029', 'Ein Fußballplatz fehlt mir.'],
      ['L13-R026', 'คุณคิดว่าเบอร์ลินน่าสนใจมาก\nA: Wie finden Sie Berlin?\nB:', 'Ich'],
    ],
  ];
  const matchContexts = [
    'คนหนึ่งชมว่าเมืองนี้ยอดเยี่ยม อีกคนรู้สึกว่าเมืองใหญ่เกินไป จับคู่คำถามกับคำตอบของแต่ละคน',
    'ใจกลางเมืองมีสวนสาธารณะและคาเฟ่ แต่ไม่มีท่าเรือ จับคู่คำถามกับคำตอบ',
    'ที่สถานที่แห่งนี้สามารถเดินเล่นและตกปลาได้ จับคู่คำถามกับกิจกรรมที่ตรงกัน',
    'อ่านคำตอบ แล้วเลือกว่าก่อนหน้านั้นอีกฝ่ายถามว่าอะไร',
  ];
  const questions = groups.flatMap((group, groupIndex) => {
    const specs = scenarios[groupIndex];
    return specs.map(([itemId, sentence, extra], index) => {
      const item = byId.get(itemId);
      const base = {
        id: `${group.topicId}-sequence-${index + 1}`, version: 1,
        itemId, requiredItemIds: [itemId], topicId: group.topicId, topicName: group.title,
        sequence: index + 1, difficulty: index < 2 ? 1 : index < 4 ? 2 : 3,
        acceptedAnswers: [item.answer], feedbackAnswer: item.answer,
        translation: item.meaning, knownErrors: {},
      };
      if (index < 2) return { ...base, kind: 'choice', subskill: 'phrase_context',
        prompt: groupIndex === 3 ? 'เลือกคำถามให้ตรงกับคำตอบ' : 'เลือกคำตอบให้ตรงกับคำถาม',
        sentence, sentenceLang: 'de', options: [item.answer, ...extra],
        explanation: groupIndex === 3 ? 'คำถามนี้ถามถึงข้อมูลที่อีกฝ่ายตอบไว้' : 'ประโยคนี้ตอบตรงกับสิ่งที่อีกฝ่ายถาม',
      };
      if (index < 4) return { ...base, kind: 'choice', interaction: 'match', subskill: 'phrase_match',
        prompt: 'จับคู่คำถามกับคำตอบ', sentence, matchGroupId: group.topicId + '-match',
        matchContext: matchContexts[groupIndex], matchLeftLabel: groupIndex === 3 ? 'คำตอบ' : 'คำถาม',
        matchRightLabel: groupIndex === 3 ? 'คำถาม' : 'คำตอบ',
        options: specs.slice(2, 4).map(([id]) => byId.get(id).answer),
        explanation: '',
      };
      return { ...base, kind: 'order', subskill: 'phrase_order',
        prompt: 'เรียงคำเป็นประโยคตอบ โดยเริ่มด้วย ' + extra,
        context: sentence, tokens: item.answer.split(' '),
        explanation: 'ประโยคนี้สื่อความหมายตามข้อมูลที่ให้ โดยเริ่มด้วย ' + extra + ' และใช้ลำดับคำตามสำนวนที่เรียน',
      };
    });
  });
  const supportingPhrases = new Map([
    ['L13-phrases-city-sequence-3', ['L13-R010']],
    ['L13-phrases-favorite-sequence-1', ['L13-R017']],
    ['L13-phrases-opinions-sequence-1', ['L13-R005']],
    ['L13-phrases-opinions-sequence-5', ['L13-R024']],
  ]);
  return questions.map(q => ({ ...q, coverageItemIds: [q.itemId], requiredItemIds: [q.itemId, ...(supportingPhrases.get(q.id) || [])] }));
}
