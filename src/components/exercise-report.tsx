"use client";
import {createPortal} from 'react-dom';
import {useEffect,useRef,useState} from 'react';
import {supabase} from '@/lib/supabase';
import {parseExerciseReportContext,reportCategories,type ExerciseReportContext} from '@/lib/exercise-report';

export function ExerciseReportButton({context}:{context:ExerciseReportContext}) {
 const [snapshot,setSnapshot]=useState<ExerciseReportContext|null>(null);
 return <><button type="button" className="exercise-report-button" onClick={event=>{event.stopPropagation();setSnapshot(parseExerciseReportContext(context));}}>รายงานข้อนี้</button>{snapshot&&<ExerciseReportDialog context={snapshot} onClose={()=>setSnapshot(null)}/>}</>;
}
export function ExerciseReportDialog({context,onClose}:{context:ExerciseReportContext;onClose:()=>void}) {
 const dialog=useRef<HTMLDialogElement>(null),requestId=useRef<string|null>(null),busy=useRef(false);
 const [category,setCategory]=useState('answer_key'),[description,setDescription]=useState(''),[suggested,setSuggested]=useState(''),[saving,setSaving]=useState(false),[error,setError]=useState(''),[sent,setSent]=useState(false);
 useEffect(()=>{const el=dialog.current;el?.showModal();return()=>{el?.close();};},[]);
 const changed=()=>{requestId.current=null;setError('');};
 async function submit(event:React.FormEvent){event.preventDefault();if(busy.current)return;if(!supabase){setError('ยังเชื่อมต่อระบบไม่ได้ กรุณาลองใหม่');return;}if(!description.trim()){setError('กรุณาอธิบายปัญหาหรือข้อเสนอแนะสั้น ๆ');return;}
  busy.current=true;setSaving(true);setError('');requestId.current??=crypto.randomUUID();
  try{const snapshot=parseExerciseReportContext(context);if(!snapshot)throw Error('Invalid question context');const result=await supabase.rpc('submit_exercise_report',{p_id:requestId.current,p_category:category,p_description:description.trim(),p_suggested_answer:category==='alternative_answer'?suggested.trim():'',p_context:{...snapshot,route:window.location.pathname}});if(result.error)throw result.error;setSent(true);}catch{setError('ส่งรายงานไม่สำเร็จ ข้อความยังอยู่ กดส่งเพื่อลองใหม่ได้');}finally{busy.current=false;setSaving(false);}
 }
 return typeof document==='undefined'?null:createPortal(<dialog onClick={event=>event.stopPropagation()} onKeyDown={event=>event.stopPropagation()} ref={dialog} className="exercise-report-dialog" aria-labelledby="exercise-report-title" onCancel={event=>{event.preventDefault();if(!busy.current)onClose();}}><h2 id="exercise-report-title">{sent?'ได้รับรายงานแล้ว':'รายงานข้อนี้'}</h2>{sent?<><p>ขอบคุณสำหรับข้อมูล ผู้ดูแลจะตรวจสอบ คุณฝึกต่อได้เลย</p><button className="button primary" type="button" onClick={onClose}>กลับไปฝึกต่อ</button></>:<form onSubmit={submit}><p className="exercise-report-summary">{context.prompt.slice(0,180)}</p><p>แนบข้อมูลของข้อนี้และคำตอบที่คุณกรอก เพื่อให้ตรวจสอบได้ตรงจุด</p><label>เรื่องที่ต้องการแจ้ง<select value={category} disabled={saving} onChange={event=>{setCategory(event.target.value);changed();}}>{Object.entries(reportCategories).map(([key,label])=><option value={key} key={key}>{label}</option>)}</select></label><label htmlFor="exercise-report-description">รายละเอียด</label><textarea id="exercise-report-description" rows={4} maxLength={4000} required value={description} disabled={saving} onChange={event=>{setDescription(event.target.value);changed();}} placeholder="เช่น คิดว่าคำตอบนี้ใช้ได้ด้วย เพราะ…"/>{category==='alternative_answer'&&<div><label htmlFor="exercise-report-suggestion">คำตอบที่คิดว่าควรรับ</label><textarea id="exercise-report-suggestion" rows={2} maxLength={1000} value={suggested} disabled={saving} onChange={event=>{setSuggested(event.target.value);changed();}} lang="de"/></div>}{error&&<p role="alert">{error}</p>}<div className="exercise-report-actions"><button className="button secondary" type="button" disabled={saving} onClick={onClose}>ยกเลิก</button><button className="button primary" type="submit" disabled={saving||!description.trim()}>{saving?'กำลังส่ง…':'ส่งรายงาน'}</button></div></form>}</dialog>,document.body);
}
