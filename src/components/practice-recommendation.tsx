"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import catalog from '@/data/l13-practice-catalog.json';
import phraseCatalog from '@/data/l13-phrases-catalog.json';
import { useLearning } from './learning-store';
import vocabularyCatalog from '@/data/l13-vocabulary-catalog.json';
import { useL13VocabularyEligibility } from './use-l13-vocabulary-eligibility';
import { readL13PracticeHistory, recommendPractice } from '@/lib/practice-planner';
import { isTestWorkspaceUser, isVocabularyPracticeAvailable, isPhrasePracticeAvailable, isL14PhrasePracticeAvailable, isL14VocabularyPracticeAvailable, useStore } from './store';
import { lessonStateKeys, useLessonState } from './lesson-state-provider';
import { recommendL14PhrasePractice } from './l14-phrase-practice';
import { l14VocabularyLearnedIds, recommendL14VocabularyPractice } from './l14-vocabulary-practice';
import { useContent } from './content-provider';

type RecommendationState =
  | { status: 'loading' }
  | { status: 'ready'; recommendation: ReturnType<typeof recommendPractice> | ReturnType<typeof recommendL14PhrasePractice> | ReturnType<typeof recommendL14VocabularyPractice> }
  | { status: 'error' };

function RecommendationContent({ userId, vocabularyOnly }: { userId: string; vocabularyOnly: boolean }) {
  const lessonState = useLessonState();
  const eligibility = useL13VocabularyEligibility();
  const history = useLearning();
  const { user } = useStore();
  const { items } = useContent();
  const vocabularyEnabled = isVocabularyPracticeAvailable(user);
  const phrasesEnabled = isPhrasePracticeAvailable(user);
  const l14PhrasesEnabled = isL14PhrasePracticeAvailable(user);
  const l14VocabularyEnabled = isL14VocabularyPracticeAvailable(user);
  const phrasesKey = history.exposures.filter(e => e.item_id.startsWith("L13-R")).map(e => e.item_id).join(",");
  const learnedKey = eligibility.ids.join(',');
  const [state, setState] = useState<RecommendationState>({ status: 'loading' });
  useEffect(() => {
    function refresh() {
      try {
        const l14PhrasesRecommendation=l14PhrasesEnabled?recommendL14PhrasePractice(lessonState.read(lessonStateKeys.l14PhrasePractice),lessonState.read(lessonStateKeys.l14Phrases),isTestWorkspaceUser(user)):null;
        const l14VocabularyRecommendation=l14VocabularyEnabled?recommendL14VocabularyPractice(lessonState.read(lessonStateKeys.l14VocabularyPractice),items,l14VocabularyLearnedIds(items,lessonState.read(lessonStateKeys.vocabularyImages('L14')),lessonState.read(lessonStateKeys.l14Vocabulary),history.exposures.map(exposure=>exposure.item_id))):null;
        const l14Candidates=[l14PhrasesRecommendation,l14VocabularyRecommendation].filter((value):value is NonNullable<typeof value>=>value!==null)
          .sort((a,b)=>(b.kind==='resume'?1:0)-(a.kind==='resume'?1:0)||b.activityAt-a.activityAt);
        const l14Recommendation=l14Candidates.find(candidate=>candidate.kind!=='learn')??l14Candidates[0];
        if (vocabularyOnly && !(vocabularyEnabled && learnedKey) && !(phrasesEnabled && phrasesKey) && (!l14Recommendation||l14Recommendation.kind==='learn')) {
          setState({ status: 'ready', recommendation: l14VocabularyRecommendation??l14Recommendation??{ kind: 'learn', title: vocabularyEnabled ? 'เริ่มเรียนคำศัพท์บท 13' : 'เริ่มเรียนประโยคและสำนวนบท 13', description: 'เรียนเนื้อหาก่อน แล้วกลับมาฝึกจากสิ่งที่เรียนแล้ว', href: vocabularyEnabled ? '/learn/L13/vocabulary' : '/learn/L13/phrases', action: vocabularyEnabled ? 'ไปเรียนคำศัพท์' : 'ไปเรียนประโยคและสำนวน' } });
          return;
        }
        const l13Questions=[...(vocabularyOnly ? [] : catalog.questions), ...(vocabularyEnabled ? vocabularyCatalog.questions.filter(q => learnedKey.split(',').includes(q.itemId)) : []), ...(phrasesEnabled ? phraseCatalog.questions.filter(q => q.requiredItemIds.every(id => phrasesKey.split(',').includes(id))) : [])];
        const l13History=readL13PracticeHistory(userId, localStorage).filter(session => !vocabularyOnly || !session.href.includes('/grammar/')).filter(session => vocabularyEnabled || !session.href.includes('/vocabulary/')).filter(session => phrasesEnabled || !session.href.includes('/phrases/'));
        const l13Recommendation=recommendPractice(l13Questions,l13History);
        const l13ActivityAt=Math.max(0,...l13History.flatMap(session=>session.items.map(item=>item.result?.submittedAt??0)));
        const useL14=Boolean(l14Recommendation&&(l14Recommendation.kind==='resume'&&l13Recommendation.kind!=='resume'||l14Recommendation.activityAt>l13ActivityAt||l14Recommendation.kind==='start'&&l13ActivityAt===0||!l13Questions.length&&l14Recommendation.kind!=='learn'));
        setState({ status: 'ready', recommendation: useL14&&l14Recommendation?l14Recommendation:l13Recommendation });
      } catch {
        setState({ status: 'error' });
      }
    }
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener('practice-progress-updated', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('practice-progress-updated', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, [userId, learnedKey, eligibility.ready, vocabularyOnly, phrasesEnabled, phrasesKey, vocabularyEnabled, l14PhrasesEnabled, l14VocabularyEnabled, lessonState, user, items, history.exposures]);

  if (state.status === 'loading') return <div className="practice-recommendation" aria-busy="true">กำลังเตรียมชุดฝึกของคุณ…</div>;
  if (state.status === 'error') return <div className="practice-recommendation" role="status">อ่านประวัติฝึกไม่ได้ กรุณาโหลดหน้าใหม่ หรือลองเลือกฝึกจากหัวข้อด้านล่าง</div>;
  const { recommendation } = state;
  return (
    <section className="practice-recommendation" aria-label="ชุดฝึกแนะนำ">
      <div>
        <span className="eyebrow">{recommendation.kind === 'resume' ? 'ฝึกต่อให้ครบ' : 'ชุดฝึกสำหรับคุณ'}</span>
        <h2>{recommendation.title}</h2>
        <p>{recommendation.description}</p>
      </div>
      <Link href={recommendation.href} className="button primary">{recommendation.action}<ArrowRight size={18} /></Link>
    </section>
  );
}

export function PracticeRecommendation() {
  const { user } = useStore();
  if (!user || (!isTestWorkspaceUser(user) && !isVocabularyPracticeAvailable(user) && !isPhrasePracticeAvailable(user) && !isL14PhrasePracticeAvailable(user) && !isL14VocabularyPracticeAvailable(user))) return null;
  return <RecommendationContent key={user.id} userId={user.id} vocabularyOnly={!isTestWorkspaceUser(user)} />;
}
