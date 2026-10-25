import fs from 'node:fs';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {getAddress} from 'viem';
import {rpc,receipt,source,read,sha,canonical} from './check.mjs';
import {checkSpace} from './reference.mjs';
const accounts=[{name:'studio-proof-deployer',address:getAddress('0x7a413bb4ab62e31d62d4cd9efc8c8a8dae37fb42')},
 {name:'fairresolve-demo',address:getAddress('0x34346773a22564cbcc5f1d67d1c1f9f196daea35')}];
const predicates=['The notice requires a database schema migration.','The notice requires rotating authentication credentials.',
 'The notice announces a planned customer-facing service outage.','The notice requires prior approval.'];
const file='PROOFS.json',commit=process.argv[2];if(!/^[0-9a-f]{40}$/.test(commit??''))throw Error('Supply published fixture commit');
let p=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):{network:'studionet',chain_id:61999,fixture_commit:commit,accounts,predicates,transactions:[],records:[]};
assert.equal(p.fixture_commit,commit);const save=()=>fs.writeFileSync(file,JSON.stringify(p,null,2)+'\n');p.final_readback_verified=false;save();let phase='preflight';
function broadcast(args,account,onHash){return new Promise((resolve,reject)=>{
 const child=spawn(process.execPath,['scripts/run-cli.cjs',...args],{windowsHide:true,env:{...process.env,SHL_TEST_ACCOUNT:account.name},stdio:['ignore','pipe','pipe']});
 let carry='';child.stderr.resume();child.stdout.on('data',data=>{carry+=data.toString();const lines=carry.split(/\r?\n/);carry=lines.pop();
  for(const line of lines)if(/^BROADCAST_HASH 0x[0-9a-fA-F]{64}$/.test(line))onHash(line.split(' ')[1]);});
 child.on('error',()=>reject(Error('CLI launch failed')));child.on('close',resolve);
});}
async function tx(step,args,who=0,expected='SUCCESS',message){
 phase=step;let t=p.transactions.find(x=>x.step===step),account=accounts[who];
 if(!t){
  const latest=await rpc('eth_getTransactionCount',[account.address,'latest']),pending=await rpc('eth_getTransactionCount',[account.address,'pending']);assert.equal(latest,pending,'Pending signer transaction');
  t={step,signer:account.address,expected,cli_arguments:args,nonce_before:latest,verified:false,broadcast_unknown:true,...(message?{expected_message:message}:{})};p.transactions.push(t);save();
  t.cli_exit=await broadcast(args,account,hash=>{t.hash=hash;delete t.broadcast_unknown;save();console.log(step+' '+hash);});save();
 }
 assert.equal(t.signer,account.address);assert.equal(canonical(t.cli_arguments),canonical(args));
 if(!t.hash)throw Error('Unknown broadcast outcome: audit history before retry');
 Object.assign(t,await receipt(t.hash,expected,message),{verified:true});save();console.log(JSON.stringify({step,status:t.status,execution:t.execution,consensus:t.consensus}));
 if(expected==='SUCCESS'&&!t.committed)throw Error('No committed state');return t;
}
const write=(step,method,args,who=0,expected='SUCCESS',message)=>tx(step,['write',p.address,method,'--args',...args.map(String)],who,expected,message);
function request(id,fixture='base',bad=false){return [id,'Starling-spell/semantic-hypothesis-lab/'+commit+'/examples/'+fixture+'.txt',bad?'f'.repeat(64):sha(fs.readFileSync('examples/'+fixture+'.txt'))];}
async function capture(step,id){
 const captured=p.records.find(x=>x.id===id);
 if(captured){assert.equal(canonical(await read(p.address,'get_record',[id])),canonical(captured.record));return {record:captured.record,state:captured.space};}
 const record=await read(p.address,'get_record',[id]),state=await read(p.address,'get_space',[]);
 checkSpace(state,state.active);p.records=p.records.filter(x=>x.id!==id);p.records.push({step,id,record,space:state});save();return {record,state};
}
async function teach(step,id,fixture,status,bad=false){
 await write(step,'teach',request(id,fixture,bad));const c=await capture(step,id);assert.equal(c.record.status,status);return c;
}
try{
 assert.equal(await rpc('eth_chainId',[]),'0xf22f');
 for(const fixture of ['base','migration','contradiction','uncertain']){
  const path='examples/'+fixture+'.txt',url='https://raw.githubusercontent.com/Starling-spell/semantic-hypothesis-lab/'+commit+'/'+path;
  const response=await fetch(url,{signal:AbortSignal.timeout(20000)});assert(response.ok);assert.equal(sha(Buffer.from(await response.arrayBuffer())),sha(fs.readFileSync(path)));
 }
 const deployment=await tx('deploy',['deploy','--contract','contracts/SemanticHypothesisLab.py','--args',...predicates]);
 p.address=deployment.address;p.source=await source(p.address);p.configuration=await read(p.address,'get_configuration',[]);
 if(!p.initial_space){p.initial_space=await read(p.address,'get_space',[]);assert.equal(p.initial_space.revision,0);checkSpace(p.initial_space,[]);save();}
 await teach('teach-negative','base','base','TAUGHT');
 const learned=await teach('teach-positive','positive','migration','TAUGHT');assert.equal(learned.state.queries[1].answer,'YES');
 await teach('unknown-held','uncertain','uncertain','UNCERTAIN');
 await teach('hash-mismatch','mismatch','base','HELD',true);
 await teach('duplicate-held','duplicate','base','DUPLICATE_HELD');
 const conflict=await teach('contradiction','conflict','contradiction','TAUGHT');assert.equal(conflict.state.status,'CONTRADICTORY');
 assert(conflict.state.queries.every(q=>q.answer==='CONTRADICTORY'));assert.deepEqual(conflict.state.conflict_core,['positive','conflict']);
 await write('unauthorized-teach','teach',request('peer'),1,'ERROR','Only teacher');
 await write('unauthorized-withdraw','withdraw',['peer-withdraw','conflict'],1,'ERROR','Only teacher');
 await write('replay','teach',request('base','migration'),0,'ERROR','Action ID already used');
 await write('withdraw-recovery','withdraw',['recover','conflict']);const recovery=await capture('withdraw-recovery','recover');
 assert.deepEqual(recovery.state.candidates,learned.state.candidates);assert.equal(recovery.state.queries[1].answer,'YES');p.recovery_verified=true;save();
 await write('repeat-withdraw','withdraw',['again','conflict'],0,'ERROR','Example is not active');
 await write('unsafe-source','teach',['unsafe','https://evil.invalid/x','a'.repeat(64)],0,'ERROR','Invalid source');
 await write('invalid-id','teach',request('bad id'),0,'ERROR','Invalid action ID');
 assert(p.transactions.length===14&&p.records.length===7&&p.transactions.every(t=>t.verified&&t.hash&&!t.broadcast_unknown));
 p.workflow_complete=true;save();console.log(JSON.stringify({workflow_complete:true,address:p.address,transactions:14,records:7}));
}catch(e){console.error('Workflow stopped at '+phase+' ('+(e instanceof assert.AssertionError?'assertion':'network/receipt check')+'); inspect journal before retry');process.exitCode=1;}
