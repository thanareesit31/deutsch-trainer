import {spawn} from 'node:child_process';
import {writeFileSync,readFileSync} from 'node:fs';
const ids=(process.env.LESSONS??'L02,L03,L04,L05,L06,L07,L08,L09,L10,L11,L12,L13-rating,L13-city,L13-favorite,L13-opinions').split(',');
const reports=[];
for(const id of ids){
 const path='.tools/phrase-ui-'+id+'.json';
 console.log('Checking',id);
 const status=await new Promise((resolve,reject)=>{const child=spawn(process.execPath,['--import','tsx','tests/phrase-presentation-browser.mjs'],{stdio:'inherit',env:{...process.env,LESSONS:id,REPORT_PATH:path}});child.on('error',reject);child.on('exit',resolve);});
 if(status!==0)throw Error('Browser audit failed for '+id+' (exit '+status+')');
 reports.push(JSON.parse(readFileSync(path,'utf8')));
 writeFileSync('.tools/phrase-presentation-batch-report.json',JSON.stringify(reports,null,2));
}
