import test from 'node:test';
import assert from 'node:assert/strict';
import {speakGermanText} from '../src/components/german-audio.ts';

function device(voices=[]){
 const spoken=[];
 globalThis.window={speechSynthesis:{getVoices:()=>voices,cancel(){},speak(utterance){spoken.push(utterance);}}};
 globalThis.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};
 return spoken;
}
test('an empty voice list fails visibly instead of sending Safari a null voice',()=>{
 const spoken=device();let failed=0;
 assert.equal(speakGermanText('die Lehrerin',null,{onError:()=>failed++}),false);
 assert.equal(spoken.length,0);assert.equal(failed,1);
});
test('a newly loaded German voice is selected at the time of the tap',()=>{
 const german={lang:'de-DE',name:'German'};const spoken=device([{lang:'en-US',name:'English'},german]);
 assert.equal(speakGermanText('der Lehrer',null),true);assert.equal(spoken[0].voice,german);assert.equal(spoken[0].lang,'de-DE');
});
test('a system default voice is explicitly selected when German is unavailable',()=>{
 const fallback={lang:'en-US',name:'Default',default:true};const spoken=device([fallback]);
 assert.equal(speakGermanText('Hallo',null),true);assert.equal(spoken[0].voice,fallback);
});
test('a browser without speech synthesis does not report successful playback',()=>{
 globalThis.window={};assert.equal(speakGermanText('Hallo',null),false);
});
test('completion is only recorded after the speech end event',()=>{
 const spoken=device([{lang:'de-DE',name:'German'}]);let completed=0;
 assert.equal(speakGermanText('Hallo',null,{onEnd:()=>completed++}),true);assert.equal(completed,0);
 spoken[0].onend();assert.equal(completed,1);
});
test('a synchronous browser refusal is reported without awarding listening completion',()=>{
 device([{lang:'de-DE',name:'German'}]);let failed=0,completed=0;
 window.speechSynthesis.speak=()=>{throw new Error('not allowed');};
 assert.equal(speakGermanText('Hallo',null,{onError:()=>failed++,onEnd:()=>completed++}),false);
 assert.equal(failed,1);assert.equal(completed,0);
});
