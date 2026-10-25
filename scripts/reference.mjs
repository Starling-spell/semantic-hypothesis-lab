import assert from 'node:assert/strict';
export function family(){
 // Enumerate clauses as sets of satisfying bit tuples, independently of production literal arithmetic.
 const universe=Array.from({length:8},(_,n)=>[Boolean(n&1),Boolean(n&2),Boolean(n&4)]),terms=[new Set()];
 for(const a of [null,false,true])for(const b of [null,false,true])for(const c of [null,false,true]){
  const clause=[a,b,c];terms.push(new Set(universe.flatMap((tuple,i)=>clause.every((v,j)=>v===null||v===tuple[j])?[i]:[])));
 }
 return [...new Set(terms.flatMap(a=>terms.map(b=>[...new Set([...a,...b])].reduce((n,i)=>n+2**i,0))))].sort((a,b)=>a-b);
}
export function solve(rows){
 const candidates=family().filter(h=>rows.every(r=>Boolean(h & 2**r.pattern)===Boolean(r.label)));
 const queries=Array.from({length:8},(_,pattern)=>{
  const yes=candidates.filter(h=>Boolean(h&2**pattern)).length,no=candidates.length-yes;
  return {pattern,yes,no,answer:!candidates.length?'CONTRADICTORY':!no?'YES':!yes?'NO':'UNDETERMINED'};
 });
 const ranked=queries.filter(q=>q.yes&&q.no).sort((a,b)=>Math.min(b.yes,b.no)-Math.min(a.yes,a.no)||a.pattern-b.pattern);
 let core=candidates.length?[]:[...rows];
 const consistent=rr=>family().some(h=>rr.every(r=>Boolean(h&2**r.pattern)===Boolean(r.label)));
 for(const row of [...core]){const trial=core.filter(r=>r.id!==row.id);if(!consistent(trial))core=trial;}
 return {status:!candidates.length?'CONTRADICTORY':candidates.length===1?'IDENTIFIED':'LEARNING',candidates,count:candidates.length,queries,next_pattern:ranked[0]?.pattern??-1,conflict_core:core.map(r=>r.id)};
}
export function checkSpace(actual,rows){
 const expected=solve(rows);
 for(const[k,v]of Object.entries(expected))assert.deepEqual(actual[k],v,k);
 assert.deepEqual(actual.active,rows);
 return expected;
}
