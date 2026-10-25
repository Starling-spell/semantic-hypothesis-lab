// Read-only: this module has no CLI/signing/send path.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {rpc,receipt,source,read,denied,canonical,digest,sha} from './check.mjs';
import {checkSpace,family} from './reference.mjs';
const p=JSON.parse(fs.readFileSync('PROOFS.json','utf8'));
assert.equal(await rpc('eth_chainId',[]),'0xf22f');assert(p.workflow_complete);assert.equal(p.transactions.length,14);assert.equal(p.records.length,7);
assert.equal(new Set(p.transactions.map(t=>t.hash)).size,14);
for(const t of p.transactions){
 assert(!t.broadcast_unknown&&t.verified);const verified=await receipt(t.hash,t.expected,t.expected_message);assert.equal(verified.address,p.address);assert.equal(verified.committed,t.expected==='SUCCESS');
 const native=await rpc('eth_getTransactionByHash',[t.hash]);assert.equal(native.from_address.toLowerCase(),t.signer.toLowerCase());assert.equal(BigInt(native.nonce),BigInt(t.nonce_before));assert.equal(BigInt(native.value),0n);
}
p.source=await source(p.address);
const config=await read(p.address,'get_configuration',[]);assert.equal(canonical(config),canonical(p.configuration));assert.equal(config.teacher.toLowerCase(),p.accounts[0].address.toLowerCase());assert.equal(config.family_size,family().length);
assert.deepEqual(config.predicates,{features:p.predicates.slice(0,3),target:p.predicates[3],family:'TWO_TERM_SIGNED_DNF_3'});
let previous=p.initial_space;checkSpace(previous,[]);assert.equal(previous.revision,0);assert.equal(previous.configuration_root,digest(config));
assert.equal(previous.root,digest(Object.fromEntries(Object.entries(previous).filter(([k])=>k!=='root'))));
const rows=[],pins=new Map();
const vectors={base:['NO','NO','NO','NO'],migration:['YES','NO','NO','YES'],contradiction:['YES','NO','NO','NO'],uncertain:['UNKNOWN','NO','NO','YES']};
for(const {id,record:r,space:s}of p.records){
 assert.equal(canonical(await read(p.address,'get_record',[id])),canonical(r));assert.equal(r.id,id);assert.equal(r.contract,p.address);assert.equal(r.teacher,config.teacher);
 assert.equal(r.before_root,previous.root);assert.equal(r.revision,previous.revision+1);assert.equal(r.root,digest(Object.fromEntries(Object.entries(r).filter(([k])=>k!=='root'))));
 if(r.action==='TEACH'){
  const spec=r.report.spec,acq=r.report.source;assert.equal(spec.contract,p.address);assert.equal(spec.teacher,config.teacher);assert.equal(spec.action_id,id);assert.equal(spec.before_root,previous.root);
  assert.equal(canonical(spec.configuration),canonical(config.predicates));assert.equal(spec.policy,config.policy);assert.equal(acq.url,spec.source.url);
  const match=acq.url.match(new RegExp('^https://raw\\.githubusercontent\\.com/Starling-spell/semantic-hypothesis-lab/'+p.fixture_commit+'/examples/(base|migration|contradiction|uncertain)\\.txt$'));assert(match);
  const name=match[1],data=fs.readFileSync('examples/'+name+'.txt');assert.equal(acq.body,data.toString('utf8'));assert.equal(acq.hash,sha(data));assert.equal(acq.http,200);
  const remote=await fetch(acq.url,{signal:AbortSignal.timeout(20000)});assert(remote.ok);assert.equal(sha(Buffer.from(await remote.arrayBuffer())),sha(data));
  if(acq.status==='HASH_MISMATCH'){assert.notEqual(acq.hash,spec.source.sha256);assert.equal(r.status,'HELD');assert.deepEqual(r.report.vector,[]);}
  else{
   assert.equal(acq.status,'OK');assert.equal(acq.hash,spec.source.sha256);assert.deepEqual(r.report.vector,vectors[name]);
   if(r.report.vector.includes('UNKNOWN'))assert.equal(r.status,'UNCERTAIN');
   else if(pins.has(acq.hash)&&rows.some(x=>x.hash===acq.hash))assert.equal(r.status,'DUPLICATE_HELD');
   else{
    assert.equal(r.status,'TAUGHT');if(pins.has(acq.hash))assert.deepEqual(pins.get(acq.hash),r.report.vector);pins.set(acq.hash,r.report.vector);
    assert.equal(r.pattern,r.report.vector.slice(0,3).reduce((n,v,i)=>n+(v==='YES'?2**i:0),0));assert.equal(r.label,r.report.vector[3]==='YES'?1:0);
    rows.push({id,pattern:r.pattern,label:r.label,hash:acq.hash});
   }
  }
  if(r.status!=='TAUGHT'){assert.equal(r.pattern,-1);assert.equal(r.label,-1);}
 }else{
  assert.equal(r.action,'WITHDRAW');const i=rows.findIndex(x=>x.id===r.example_id);assert(i>=0);rows.splice(i,1);
 }
 checkSpace(s,rows.map(({id,pattern,label})=>({id,pattern,label})));assert.equal(s.configuration_root,digest(config));assert.equal(s.contract,p.address);assert.equal(s.revision,r.revision);
 assert.equal(s.root,digest(Object.fromEntries(Object.entries(s).filter(([k])=>k!=='root'))));previous=s;
}
assert.equal(canonical(await read(p.address,'get_space',[])),canonical(previous));
for(let i=0;i<8;i++)assert.deepEqual(await read(p.address,'query',[i]),{...previous.queries[i],space_root:previous.root,binding:'FINITE_FAMILY_ONLY_NOT_EXTERNAL_TRUTH'});
for(const id of ['peer','peer-withdraw','again','unsafe','bad id'])assert(await denied(p.address,'get_record',[id]));
const history=await rpc('sim_getTransactionsForAddress',[p.address]);assert.deepEqual(history.map(x=>x.hash).sort(),p.transactions.map(x=>x.hash).sort());
assert(p.recovery_verified);p.contract_history_matched=true;p.final_readback_verified=true;p.final_space=previous;
fs.writeFileSync('PROOFS.json',JSON.stringify(p,null,2)+'\n');console.log(JSON.stringify({verified:true,source:p.source,transactions:14,records:7,remaining:previous.count}));
