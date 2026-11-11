import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createDatabase,userId} from './learning-database.mjs';
const db=await createDatabase(),other='22222222-2222-4222-8222-222222222222',id='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const context={lessonId:'L11',skill:'phrases',questionId:'L11-P002-practice-v2-s1-c1',questionVersion:1,prompt:'Was hast du gemacht?',route:'/practice/L11/phrases/daily',checked:false,learnerAnswer:'Ich habe gearbeitet.',expectedAnswers:['hidden'],feedback:'hidden',correct:true};
const submit=(reportId=id,snapshot=context)=>db.query('select public.submit_exercise_report($1,$2,$3,$4,$5::jsonb)',[reportId,'alternative_answer','This answer may also be correct.','Other answer',JSON.stringify(snapshot)]);
try{
 await db.exec('reset role');await db.exec(await readFile('supabase/migrations/20261112000000_exercise_issue_reports.sql','utf8'));
 await db.query('insert into public.exercise_report_admins(user_id) values($1)',[other]);
 await db.exec(`set role authenticated;set request.jwt.claim.sub='${userId}'`);
 const before=(await db.query('select count(*) n from public.learner_practice_sessions')).rows[0].n;
 await submit();await submit();
 const own=(await db.query('select * from public.exercise_reports')).rows;assert.equal(own.length,1);assert.equal(own[0].context.checked,false);assert.equal('expectedAnswers' in own[0].context,false);assert.equal('feedback' in own[0].context,false);assert.equal('correct' in own[0].context,false);
 await assert.rejects(db.query("select public.review_exercise_report($1,'resolved','fixed')",[id]),/administrator/);
 await assert.rejects(db.query('insert into public.exercise_report_admins(user_id) values($1)',[userId]),/permission denied/);
 await assert.rejects(db.query("update public.exercise_reports set status='resolved' where id=$1",[id]),/permission denied/);
 await db.exec("set request.jwt.claim.sub='22222222-2222-4222-8222-222222222222'");assert.equal((await db.query('select * from public.exercise_reports')).rows.length,1,'admin sees learner report');
 await assert.rejects(db.query("select public.review_exercise_report($1,'resolved','')",[id]),/explain/);
 await db.query("select public.review_exercise_report($1,'resolved','Accepted variant reviewed')",[id]);
 await submit('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',{...context,checked:true,questionVersion:null});
 await db.exec(`set request.jwt.claim.sub='${userId}'`);const rows=(await db.query('select * from public.exercise_reports')).rows;assert.equal(rows.length,1,'ordinary learner sees only own report');assert.equal(rows[0].status,'resolved');assert.equal(rows[0].review_note,'Accepted variant reviewed');
 assert.equal((await db.query('select count(*) n from public.learner_practice_sessions')).rows[0].n,before,'reporting does not write practice evidence');
 await assert.rejects(submit('cccccccc-cccc-4ccc-8ccc-cccccccccccc',{...context,questionId:''}),/Invalid/);
 await db.exec('reset role;set role anon');await assert.rejects(submit(),/permission denied/);await assert.rejects(db.query('select * from public.exercise_reports'),/permission denied/);
 console.log('Report DB passed: redaction, retry, admin decisions/reasons, account isolation and unchanged practice evidence.');
}finally{await db.close();}
