const record = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
export function isProgressivePhraseBank(bank: string) {
  return /^a11-phrases-l(0[1-9]|1[0-2])-(basic|daily)$/.test(bank) || /^phrases-(rating|city|favorite|opinions|basic|daily)$/.test(bank) || /^phrase-l14-(ask|describe|unknown|thanks|basic|mixed|daily)$/.test(bank);
}

/** Keep the selected first answer while accumulating assistance from either device. */
export function mergePhrasePracticeAssistance(chosen: Record<string, unknown>, local: Record<string, unknown>, remote: Record<string, unknown>) {
  const sources = [chosen, local, remote];
  const words = new Set<string>();
  const knownWords = Array.isArray(chosen.wordHelpTokens) || record(chosen.attempt) && Array.isArray(chosen.attempt.wordHelpTokens);
  for (const source of sources) for (const tokens of [source.wordHelpTokens, record(source.attempt) ? source.attempt.wordHelpTokens : undefined]) {
    if (Array.isArray(tokens) && tokens.every(token => typeof token === 'string')) { tokens.forEach(token => words.add(token)); }
  }
  const hintUsed = sources.some(source => source.hintUsed === true);
  const translationUsed = sources.some(source => source.translationUsed === true || record(source.attempt) && source.attempt.translationUsed === true);
  const assisted = hintUsed || translationUsed || words.size > 0 || sources.some(source => record(source.attempt) && source.attempt.assisted === true);
  return { ...chosen, ...(knownWords || words.size > 0 ? { wordHelpTokens: [...words] } : {}), ...(hintUsed ? { hintUsed: true } : {}), ...(translationUsed ? { translationUsed: true } : {}), attempt: record(chosen.attempt) ? { ...chosen.attempt, ...(knownWords || words.size > 0 ? { wordHelpTokens: [...words] } : {}), ...(assisted ? { assisted: true } : {}) } : chosen.attempt };
}
