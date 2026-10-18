import type { ContextBankQuestion, WordSearchQuestion } from "./l13-l14-course";

/** A click/tap pair must describe a real straight path inside the grid. */
export function searchPath(grid:readonly string[],start:number,end:number):number[] {
  const width=grid[0]?.length??0;
  if(!width || grid.some(row=>row.length!==width) || !Number.isInteger(start) || !Number.isInteger(end) || start<0 || end<0 || start>=grid.length*width || end>=grid.length*width) return [];
  const rowDelta=Math.floor(end/width)-Math.floor(start/width);
  const colDelta=end%width-start%width;
  if(rowDelta!==0 && colDelta!==0) return [];
  const length=Math.max(Math.abs(rowDelta),Math.abs(colDelta));
  if(!length) return [];
  const step=Math.sign(rowDelta)*width+Math.sign(colDelta);
  return Array.from({length:length+1},(_,index)=>start+index*step);
}
export function searchMatch(question:WordSearchQuestion,start:number,end:number):string|null {
  const path=searchPath(question.grid,start,end);
  const text=path.map(index=>question.grid[Math.floor(index/question.grid[0].length)][index%question.grid[0].length]).join("");
  return question.words.find(entry=>entry.word===text || entry.word===[...text].reverse().join(""))?.word??null;
}
export function gradeSearch(question:WordSearchQuestion,paths:readonly (readonly [number,number])[]):boolean {
  const found=new Set(paths.map(([start,end])=>searchMatch(question,start,end)).filter(word=>word!==null));
  return question.words.every(entry=>found.has(entry.word));
}
const normalize=(text:string)=>text.trim().normalize("NFC").toLocaleLowerCase("de");
export function gradeContext(question:ContextBankQuestion,answers:readonly string[]):boolean {
  if(answers.length!==question.answers.length || question.segments.length!==answers.length+1) return false;
  const keyFor=(value:string)=>question.caseSensitive?value.trim().normalize("NFC"):normalize(value);
  const available=question.bank.map(keyFor);
  return answers.every((answer,index)=>{
    const key=keyFor(answer),bankIndex=available.indexOf(key);
    if(bankIndex<0 || key!==keyFor(question.answers[index])) return false;
    available.splice(bankIndex,1);
    return true;
  });
}
