export type PhraseObservation = {
  targetId:string;
  subskill:'phrase_function_recognition'|'route_dialogue_selection'|'dialogue_order';
  difficulty:1|2|3;
  response:string;
  correct:boolean;
  submittedAt:string;
  assistance:string[];
  context:string;
  coverage:'first-observed-after-upgrade';
};
export type PhraseObservations={version:1;first:Record<string,PhraseObservation>};
export const l14ObservationKey='deutsch-trainer-phrase-observations-v1-L14';
export function readPhraseObservations(raw:string|null):PhraseObservations{
  if(raw===null)return {version:1,first:{}};
  const value:unknown=JSON.parse(raw);
  if(!value||typeof value!=='object'||!('version'in value)||value.version!==1||!('first'in value)||!value.first||typeof value.first!=='object'||Array.isArray(value.first))throw Error('Invalid observations');
  const first:Record<string,PhraseObservation>={};
  for(const[id,entry]of Object.entries(value.first)){
    if(!entry||typeof entry!=='object')throw Error('Invalid observation');
    const e=entry as Record<string,unknown>;
    if(typeof e.targetId!=='string'||typeof e.response!=='string'||typeof e.correct!=='boolean'||typeof e.submittedAt!=='string'||!Number.isFinite(Date.parse(e.submittedAt))||typeof e.context!=='string'||e.coverage!=='first-observed-after-upgrade'||!Array.isArray(e.assistance)||!e.assistance.every(x=>typeof x==='string')||(e.difficulty!==1&&e.difficulty!==2&&e.difficulty!==3)||(e.subskill!=='phrase_function_recognition'&&e.subskill!=='route_dialogue_selection'&&e.subskill!=='dialogue_order'))throw Error('Invalid observation');
    first[id]={targetId:e.targetId,response:e.response,correct:e.correct,submittedAt:e.submittedAt,context:e.context,coverage:e.coverage,assistance:e.assistance,subskill:e.subskill,difficulty:e.difficulty};
  }
  return {version:1,first};
}
export function keepFirstObservation(history:PhraseObservations,id:string,evidence:PhraseObservation):PhraseObservations{
  return history.first[id]?history:{version:1,first:{...history.first,[id]:evidence}};
}
