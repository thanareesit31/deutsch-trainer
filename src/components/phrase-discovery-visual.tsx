import Image from 'next/image';
import { ArrowRight, Check, Clock3, Ear, PenLine, UserRound } from 'lucide-react';
import type { DiscoveryVisual } from '@/lib/phrase-discovery';

function NameBadge({ role, givenName, familyName }: { role: string; givenName: string; familyName: string | null }) {
  return <div className="phrase-person-card" aria-label={`ข้อมูลของ${role}`}>
    <div className="phrase-person-header"><UserRound size={30} aria-hidden="true" /><span>{role}</span></div>
    <dl><div><dt>ชื่อ</dt><dd lang="de">{givenName}</dd></div>
      {familyName && <div><dt>นามสกุล</dt><dd lang="de">{familyName}</dd></div>}
    </dl>
  </div>;
}

export function PhraseDiscoveryVisual({ visual }: { visual: DiscoveryVisual }) {
  switch (visual.kind) {
    case 'identity': return <div className="phrase-visual phrase-visual-facts"><NameBadge {...visual} /></div>;
    case 'introduction': return <div className="phrase-visual phrase-visual-introduction" aria-label="คุณกำลังแนะนำอีกคน">
      <NameBadge role="คุณ" givenName={visual.selfName} familyName={null} />
      <ArrowRight className="phrase-introduction-arrow" aria-hidden="true" />
      <NameBadge role="เพื่อนที่คุณแนะนำ" givenName={visual.otherName} familyName={null} />
    </div>;
    case 'origin': return <div className="phrase-visual phrase-visual-origin">
      <NameBadge role={visual.role} givenName={visual.person} familyName={null} />
      <div className="phrase-origin-country"><span>มาจาก</span>
        <span className={`phrase-country-flag ${visual.country.toLowerCase()}`} role="img" aria-label={visual.country === 'TH' ? 'ธงประเทศไทย' : 'ธงประเทศเยอรมนี'} />
        <strong lang="de">{visual.country === 'TH' ? 'Thailand' : 'Deutschland'}</strong>
      </div>
    </div>;
    case 'scene': return <figure className="phrase-visual phrase-visual-scene">
      <div className="phrase-scene-picture">
        <Image src={visual.image} alt={visual.alt} width={480} height={480} sizes="(max-width: 600px) 240px, 300px" />
        {visual.time && <span className="phrase-scene-time"><Clock3 size={18} aria-hidden="true" /><time>{visual.time}</time></span>}
        {visual.cue === 'unclear-name' && <span className="phrase-scene-cue" aria-hidden="true"><Ear size={24} />?</span>}
        {visual.cue === 'spelled-name' && <span className="phrase-scene-cue" aria-hidden="true"><Check size={24} /></span>}
        {visual.cue === 'write-name' && <div className="phrase-scene-name-blank" aria-label="ช่องชื่อที่ยังเขียนไม่ครบ"><PenLine size={18} aria-hidden="true" /><span>ชื่อ</span><strong>… ?</strong></div>}
      </div>
      {visual.caption && <figcaption>{visual.caption}</figcaption>}
    </figure>;
    default: { const exhaustive: never = visual; return exhaustive; }
  }
}
