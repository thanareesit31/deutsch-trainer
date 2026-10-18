import type { CodewordQuestion, TextMarkingQuestion } from "./l13-l14-course";

export function gradeTextMarking(question:TextMarkingQuestion,roles:Readonly<Record<string,string>>):boolean {
  const expected=Object.entries(question.answerRoles);
  return Object.keys(roles).length===expected.length && expected.every(([index,role])=>roles[index]===role);
}
const spelling=(value:string)=>value.trim().normalize("NFC").toLocaleLowerCase("de");
const letters=(value:string)=>[...value.trim().normalize("NFC")].map(letter=>letter==="ß"||letter==="ẞ"?"ẞ":letter.toLocaleUpperCase("de"));
export function extractCodeword(question:CodewordQuestion,answers:Readonly<Record<string,string>>):string {
  return question.clues.map(clue=>letters(answers[clue.id]??"")[clue.extractIndex]??"·").join("");
}
export function gradeCodeword(question:CodewordQuestion,answers:Readonly<Record<string,string>>,solution:string):boolean {
  return question.clues.every(clue=>spelling(answers[clue.id]??"")===spelling(clue.answer)) && spelling(solution)===spelling(question.solution) && spelling(extractCodeword(question,answers))===spelling(question.solution);
}
export function validateCodeword(question:CodewordQuestion):string[] {
  const errors:string[]=[];
  const ids=new Set<string>();
  for(const clue of question.clues) {
    if(ids.has(clue.id)) errors.push(`duplicate clue ${clue.id}`);
    ids.add(clue.id);
    if(!Number.isInteger(clue.extractIndex)||clue.extractIndex<0||clue.extractIndex>=[...spelling(clue.answer)].length) errors.push(`invalid extraction ${clue.id}`);
  }
  if(spelling(extractCodeword(question,Object.fromEntries(question.clues.map(clue=>[clue.id,clue.answer]))))!==spelling(question.solution)) errors.push("extracted codeword differs from solution");
  return errors;
}
