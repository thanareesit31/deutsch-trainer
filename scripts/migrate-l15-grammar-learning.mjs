// Run with Node 20+: node --import tsx --env-file=.env.local scripts/migrate-l15-grammar-learning.mjs
import pg from 'pg';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {l15GuidedTasks} from '../src/lib/l15-grammar-catalog.ts';
import {releasePracticeQuestion} from '../src/lib/a13-release-question.ts';
if(!process.env.DATABASE_URL)throw Error('DATABASE_URL is required');
const client=new pg.Client({connectionString:process.env.DATABASE_URL,connectionTimeoutMillis:15000});
const migrations=['20261125000000_l15_grammar_learning_catalog.sql','20261125001000_l15_grammar_learning_state.sql'];
try {
 await client.connect();await client.query('begin isolation level repeatable read');
 const snapshot=async()=> (await client.query("select count(*)::int as checkpoints,md5(coalesce(string_agg(user_id::text||state::text,E'\\n' order by user_id),'empty')) as fingerprint from public.learner_lesson_states where lesson_key='deutsch-trainer-release-course-v1-L15-grammar'")).rows[0];
 const before=await snapshot();
 for(const file of migrations){const sql=await readFile(new URL('../supabase/migrations/'+file,import.meta.url),'utf8');const lines=sql.split('\n');const controls=lines.filter(line=>['begin;','commit;'].includes(line.trim().toLowerCase()));if(controls.length!==2)throw Error('Unexpected migration transaction structure');await client.query(lines.filter(line=>!['begin;','commit;'].includes(line.trim().toLowerCase())).join('\n'));}
 const registered=(await client.query("select task_id,definition from public.release_course_tasks where lesson_id='L15' and skill='grammar' and task_id like 'A13-L15-GUIDED-%' order by task_id")).rows;
 if(registered.length!==10)throw Error('Expected ten registered questions');
 for(const task of l15GuidedTasks){const row=registered.find(row=>row.task_id===task.id);if(!row||JSON.stringify(Object.entries(row.definition).sort())!==JSON.stringify(Object.entries(releasePracticeQuestion({lessonId:'L15',skill:'grammar'},task)).sort()))throw Error('Registered question mismatch');}
 const after=await snapshot();if(JSON.stringify(before)!==JSON.stringify(after))throw Error('Migration changed existing learner checkpoints');
 await client.query('commit');await mkdir('.audit',{recursive:true});
 const report={date:new Date().toISOString(),migrations,registeredQuestions:10,existingL15Checkpoints:before.checkpoints,existingHistoryUnchanged:true,transaction:'committed'};
 await writeFile('.audit/l15-grammar-database.json',JSON.stringify(report,null,2)+'\n');console.log(report);
}catch(error){await client.query('rollback').catch(()=>{});console.error('L15 migration failed:',error.code??error.message);process.exitCode=1;}
finally{await client.end();}
