import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createClient} from '@supabase/supabase-js';
import {startTestApi,password} from '../scripts/test-workspace-api.mjs';
const packet=JSON.parse(readFileSync('docs/exercise-mapping/l01-l13-practice-extensions.json')).find(p=>p.lessonId==='L11'),q=packet.questions.find(q=>q.practice.stage===3);
const account={id:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',email:'tester@deutsch.test',role:'authenticated',aud:'authenticated'};
const time='2026-11-11T00:00:00Z',state={id:'existing-advanced-round',createdAt:time,updatedAt:time,position:0,completed:true,items:[{question:q,response:q.acceptedAnswers[0],selected:[],tokenOrder:[],hintUsed:false,translationUsed:false,wordHelpTokens:[],attempt:{response:q.acceptedAnswers[0],correct:true,status:'completed',submittedAt:time,confidence:null}}]};
const api=await startTestApi({port:0,restore:{accounts:[account],rows:{item_exposures:[{user_id:account.id,item_id:q.targetId,seen_at:time}],learner_practice_sessions:[{user_id:account.id,bank_key:'a11-phrases-l11-daily',session_id:state.id,state}]}}});
const client=createClient(api.url,'local-test-key',{auth:{persistSession:false,autoRefreshToken:false}});
try{
 const login=await client.auth.signInWithPassword({email:account.email,password});assert.ifError(login.error);
 const saved=await client.from('learner_practice_sessions').select('state');assert.ifError(saved.error);assert.equal(saved.data[0].state.id,state.id);assert.equal(saved.data[0].state.items[0].attempt.response,q.acceptedAnswers[0]);
 const denied=await client.rpc('sync_practice_session',{p_bank_key:'a11-phrases-l11-daily',p_state:{...state,id:'new-advanced-round'}});assert.match(denied.error?.message??'',/earlier response|independent/u,'normal requests still enforce gates after recovery');
 console.log('Existing advanced queue restored with canonical answer; new advanced queue remains gated.');
}finally{await client.auth.stopAutoRefresh();await api.close();}
