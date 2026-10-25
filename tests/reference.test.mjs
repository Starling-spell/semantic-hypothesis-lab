import test from 'node:test';
import assert from 'node:assert/strict';
import {family,solve} from '../scripts/reference.mjs';
test('family is distinct and bounded, not all Boolean functions',()=>{
 const f=family();assert.equal(new Set(f).size,f.length);assert(f.length<256);assert(f.includes(0)&&f.includes(255));
});
test('contradiction blocks all answers and withdrawal recovers',()=>{
 const rows=[{id:'a',pattern:0,label:0},{id:'b',pattern:1,label:1}];const learned=solve(rows);
 assert.equal(learned.queries[1].answer,'YES');const conflict=solve([...rows,{id:'c',pattern:1,label:0}]);
 assert.equal(conflict.status,'CONTRADICTORY');assert(conflict.queries.every(q=>q.answer==='CONTRADICTORY'));
 assert.deepEqual(conflict.conflict_core,['b','c']);
});
test('every hypothesis identified by at most eight adaptive tests',()=>{
 for(const target of family()){
  const rows=[];for(let i=0;i<8&&solve(rows).count>1;i++){const x=solve(rows).next_pattern;assert(x>=0);rows.push({id:String(x),pattern:x,label:(target>>x)&1});}
  assert.deepEqual(solve(rows).candidates,[target]);
 }
});
