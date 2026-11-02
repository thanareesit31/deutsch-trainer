import test from 'node:test';
import assert from 'node:assert/strict';
import {speakGermanText} from '../src/components/german-audio.ts';

function device(voices=[]){
 const spoken=[];
 globalThis.window={speechSynthesis:{getVoices:()=>voices,cancel(){},speak(utterance){spoken.push(utterance);}}};
 globalThis.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};
 return spoken;
}
test('a tap can request German speech before the mobile voice list has loaded',()=>{
 const spoken=device();assert.equal(speakGermanText('die Lehrerin',null),true);
 assert.equal(spoken.length,1);assert.equal(spoken[0].text,'die Lehrerin');assert.equal(spoken[0].lang,'de-DE');assert.equal(spoken[0].voice,undefined);
});
test('a newly loaded German voice is selected at the time of the tap',()=>{
 const german={lang:'de-DE',name:'German'};const spoken=device([{lang:'en-US',name:'English'},german]);
 assert.equal(speakGermanText('der Lehrer',null),true);assert.equal(spoken[0].voice,german);
});
test('a browser without speech synthesis does not report successful playback',()=>{
 globalThis.window={};assert.equal(speakGermanText('Hallo',null),false);
});
test('completion is only recorded after the speech end event',()=>{
 const spoken=device();let completed=0;
 assert.equal(speakGermanText('Hallo',null,{onEnd:()=>completed++}),true);assert.equal(completed,0);
 spoken[0].onend();assert.equal(completed,1);
});
test('a synchronous browser refusal is reported without awarding listening completion',()=>{
 device();let failed=0,completed=0;
 window.speechSynthesis.speak=()=>{throw new Error('not allowed');};
 assert.equal(speakGermanText('Hallo',null,{onError:()=>failed++,onEnd:()=>completed++}),false);
 assert.equal(failed,1);assert.equal(completed,0);
});
