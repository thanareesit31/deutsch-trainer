export const reportCategories = {answer_key:'เฉลยอาจผิด',alternative_answer:'คำตอบอื่นน่าจะถูกด้วย',unclear:'โจทย์หรือคำอธิบายไม่ชัด',media:'ภาพหรือเสียงมีปัญหา',suggestion:'เสนอแนะการออกแบบ'};
export const reportStatuses = {received:'รับแล้ว',reviewing:'กำลังตรวจ',resolved:'แก้แล้ว',unchanged:'ตรวจแล้วคงเดิม'};
export type ReportCategory = keyof typeof reportCategories;
export type ReportStatus = keyof typeof reportStatuses;
export type ExerciseReportContext = {lessonId:string;skill:'vocabulary'|'grammar'|'phrases'|'writing'|'reading'|'listening';questionId:string;questionVersion:number|null;bankKey?:string;sessionId?:string;prompt:string;learnerAnswer?:string;checked:boolean;correct?:boolean|null;expectedAnswers?:string[];feedback?:string};
const record=(value:unknown):value is Record<string,unknown>=>typeof value==='object'&&value!==null&&!Array.isArray(value);
export function parseExerciseReportContext(value:unknown):ExerciseReportContext|null {
 if(!record(value)||typeof value.lessonId!=='string'||!/^L(0[1-9]|1[0-8])$/.test(value.lessonId)||(value.skill!=='vocabulary'&&value.skill!=='grammar'&&value.skill!=='phrases'&&value.skill!=='writing'&&value.skill!=='reading'&&value.skill!=='listening')||typeof value.questionId!=='string'||!value.questionId||value.questionId.length>200||(value.questionVersion!==null&&(typeof value.questionVersion!=='number'||!Number.isInteger(value.questionVersion)||value.questionVersion<1))||typeof value.prompt!=='string'||typeof value.checked!=='boolean')return null;
 const optional=(key:string,max:number)=>typeof value[key]==='string'?value[key].slice(0,max):undefined;
 return {lessonId:value.lessonId,skill:value.skill,questionId:value.questionId,questionVersion:value.questionVersion,prompt:value.prompt.slice(0,4000),checked:value.checked,...(optional('bankKey',200)?{bankKey:optional('bankKey',200)}:{}),...(optional('sessionId',200)?{sessionId:optional('sessionId',200)}:{}),...(optional('learnerAnswer',4000)?{learnerAnswer:optional('learnerAnswer',4000)}:{}),...(value.checked?{...(typeof value.correct==='boolean'||value.correct===null?{correct:value.correct}:{}),...(Array.isArray(value.expectedAnswers)&&value.expectedAnswers.every(answer=>typeof answer==='string')?{expectedAnswers:value.expectedAnswers.slice(0,10).map(answer=>answer.slice(0,1000))}:{}),...(optional('feedback',4000)?{feedback:optional('feedback',4000)}:{})}:{})};
}
export type ExerciseReport={id:string;category:ReportCategory;status:ReportStatus;description:string;suggested_answer:string;context:ExerciseReportContext&{route:string};review_note:string;created_at:string;updated_at:string};
export function parseExerciseReport(value:unknown):ExerciseReport|null {
 if(!record(value)||typeof value.id!=='string'||typeof value.category!=='string'||!Object.hasOwn(reportCategories,value.category)||typeof value.status!=='string'||!Object.hasOwn(reportStatuses,value.status)||typeof value.description!=='string'||typeof value.suggested_answer!=='string'||typeof value.review_note!=='string'||typeof value.created_at!=='string'||typeof value.updated_at!=='string'||!record(value.context)||typeof value.context.route!=='string')return null;
 const context=parseExerciseReportContext(value.context);if(!context)return null;
 const category=Object.keys(reportCategories).find(key=>key===value.category),status=Object.keys(reportStatuses).find(key=>key===value.status);
 if(!category||!status)return null;
 // Narrow keys using the same explicit variants accepted by the database.
 const categoryKey=category==='answer_key'||category==='alternative_answer'||category==='unclear'||category==='media'||category==='suggestion'?category:null;
 const statusKey=status==='received'||status==='reviewing'||status==='resolved'||status==='unchanged'?status:null;
 if(!categoryKey||!statusKey)return null;
 return {id:value.id,category:categoryKey,status:statusKey,description:value.description,suggested_answer:value.suggested_answer,context:{...context,route:value.context.route},review_note:value.review_note,created_at:value.created_at,updated_at:value.updated_at};
}
