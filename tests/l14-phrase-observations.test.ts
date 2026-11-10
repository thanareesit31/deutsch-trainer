import assert from 'node:assert/strict';
import test from 'node:test';
import {keepFirstObservation,readPhraseObservations,type PhraseObservation} from '../src/lib/l14-phrase-observations';
const wrong:PhraseObservation={targetId:'ask-help',subskill:'phrase_function_recognition',difficulty:1,response:'thanks',correct:false,submittedAt:'2026-11-08T00:00:00Z',assistance:['function-groups'],context:'sort',coverage:'first-observed-after-upgrade'};
test('retry cannot replace the observed first response, including after account restore',()=>{
 const first=keepFirstObservation(readPhraseObservations(null),'sort:ask-help',wrong);
 const restored=readPhraseObservations(JSON.stringify(first));
 const retry=keepFirstObservation(restored,'sort:ask-help',{...wrong,response:'ask',correct:true});
 assert.deepEqual(retry.first['sort:ask-help'],wrong);
 assert.equal(Object.keys(retry.first).length,1);
 const order=keepFirstObservation(retry,'order:help:post',{...wrong,targetId:'L14-route-help',subskill:'dialogue_order',difficulty:3,response:'[1,0]'});
 assert.equal(order.first['order:help:post'].subskill,'dialogue_order');
 assert.equal(order.first['sort:ask-help'].response,'thanks');
});
test('unknown historical firsts stay absent and malformed records fail explicitly',()=>{
 assert.deepEqual(readPhraseObservations(null),{version:1,first:{}});
 assert.throws(()=>readPhraseObservations('{"version":1,"first":{"x":{"correct":true}}}'));
});
