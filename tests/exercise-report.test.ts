import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseExerciseReportContext} from '../src/lib/exercise-report';
const base={lessonId:'L11',skill:'phrases',questionId:'L11-P002',questionVersion:1,prompt:'Was hast du gemacht?',checked:false,learnerAnswer:'my draft'};
test('report snapshots redact hidden feedback and retain only this question',()=>{
 const context=parseExerciseReportContext({...base,correct:true,expectedAnswers:['secret'],feedback:'secret',token:'private',sessions:[{allHistory:true}]});
 assert.deepEqual(context,base);assert.equal('token' in context!,false);
 const checked=parseExerciseReportContext({...base,checked:true,correct:false,expectedAnswers:['Ich habe gearbeitet.'],feedback:'Partizip II belongs at the end'});
 assert.equal(checked?.correct,false);assert.deepEqual(checked?.expectedAnswers,['Ich habe gearbeitet.']);
});
test('question identity is required and an unknown legacy version is explicit',()=>{
 assert.equal(parseExerciseReportContext({...base,lessonId:'L99'}),null);
 assert.equal(parseExerciseReportContext({...base,questionId:''}),null);
 assert.equal(parseExerciseReportContext({...base,questionVersion:undefined}),null);
 assert.equal(parseExerciseReportContext({...base,questionVersion:0}),null);
 assert.equal(parseExerciseReportContext({...base,questionVersion:null})?.questionVersion,null);
});
