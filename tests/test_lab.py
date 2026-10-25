import ast
import copy
import hashlib
import itertools
import json
import re
from pathlib import Path
from types import SimpleNamespace
import pytest

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'contracts/SemanticHypothesisLab.py'
HELPERS = [x for x in ast.parse(SOURCE.read_text()).body if isinstance(x, (ast.Assign, ast.FunctionDef))]
ARGS = ['The notice requires a database schema migration.', 'The notice requires rotating authentication credentials.',
        'The notice announces a planned customer-facing service outage.', 'The notice requires prior approval.']
LABELS = {'base': ['NO','NO','NO','NO'], 'migration': ['YES','NO','NO','YES'],
          'contradiction': ['YES','NO','NO','NO'], 'uncertain': ['UNKNOWN','NO','NO','YES']}
COORD = 'Starling-spell/semantic-hypothesis-lab/' + 'a'*40 + '/examples/'


def namespace(gl=None):
    ns = dict(hashlib=hashlib, json=json, re=re, product=itertools.product, gl=gl)
    exec(compile(ast.Module(body=HELPERS, type_ignores=[]), str(SOURCE), 'exec'), ns)
    return ns


NS = namespace()


def reference_family():
    # Independent set-of-inputs construction, rather than production bit evaluation.
    cube = list(itertools.product([False, True], repeat=3))
    sets = []
    for chosen in itertools.product([None,False,True], repeat=3):
        sets.append({sum(int(b)<<i for i,b in enumerate(x)) for x in cube if all(v is None or x[i]==v for i,v in enumerate(chosen))})
    return sorted({sum(2**x for x in a|b) for a in [set()]+sets for b in [set()]+sets})


def deploy(vm, factory, actor):
    vm.sender = actor
    return factory(str(SOURCE), *ARGS)


def teach(c, vm, action, fixture='base', labels=None, bad=False, alias=None):
    data = (ROOT/'examples'/(fixture+'.txt')).read_bytes()
    vm.clear_mocks()
    vm.mock_web(r'.*raw\.githubusercontent\.com.*', {'response':{'status':200,'headers':{},'body':data},'method':'GET'})
    vm.mock_llm('.*HYPOTHESIS_LAB_V1.*', json.dumps({'vector':LABELS[fixture] if labels is None else labels}))
    root = c.teach(action, COORD+(alias or fixture+'.txt'), 'f'*64 if bad else hashlib.sha256(data).hexdigest())
    assert root == c.get_space()['root']
    row = c.get_record(action)
    assert row['root'] == NS['digest']({k:v for k,v in row.items() if k!='root'})
    return row


def test_family_and_all_ternary_partial_labelings():
    family = reference_family()
    assert NS['hypotheses']() == family
    assert len(family) < 256 and 0 in family and 255 in family
    # Every possible partial assignment: each of 8 input patterns is absent/NO/YES.
    for labels in itertools.product([-1,0,1], repeat=8):
        rows = [{'id':str(i),'pattern':i,'label':v} for i,v in enumerate(labels) if v>=0]
        expected = [h for h in family if all(bool(h & (1<<r['pattern']))==bool(r['label']) for r in rows)]
        assert NS['surviving'](rows) == expected


def test_next_query_is_maximin_and_never_a_probability():
    rows = [{'id':'a','pattern':0,'label':0},{'id':'b','pattern':1,'label':1}]
    s = NS['space'](rows)
    scores = [min(q['yes'],q['no']) for q in s['queries']]
    assert s['next_pattern'] == scores.index(max(scores))
    assert all(q['yes']+q['no']==s['count'] for q in s['queries'])


def test_every_member_can_be_identified_with_adaptive_queries():
    for target in reference_family():
        rows=[]
        for _ in range(8):
            s=NS['space'](rows)
            if s['count']==1: break
            x=s['next_pattern']; assert x>=0
            rows.append({'id':str(x),'pattern':x,'label':(target>>x)&1})
        assert NS['surviving'](rows)==[target]


def test_conflict_core_is_deletion_minimal_not_claimed_minimum():
    rows=[{'id':'a','pattern':0,'label':0},{'id':'irrelevant','pattern':7,'label':1},{'id':'b','pattern':0,'label':1}]
    s=NS['space'](rows)
    core=[r for r in rows if r['id'] in s['conflict_core']]
    assert s['status']=='CONTRADICTORY' and s['next_pattern']==-1 and not s['candidates']
    assert all(q['answer']=='CONTRADICTORY' for q in s['queries'])
    assert not NS['surviving'](core)
    assert all(NS['surviving']([r for r in core if r['id']!=c['id']]) for c in core)


def test_out_of_family_parity_cannot_be_misreported_as_identified():
    rows=[{'id':str(x),'pattern':x,'label':x.bit_count()%2} for x in range(8)]
    assert NS['space'](rows)['status']=='CONTRADICTORY'


def test_live_teaching_conflict_and_recovery(direct_vm,direct_deploy,direct_alice):
    c=deploy(direct_vm,direct_deploy,direct_alice)
    initial=c.get_space()['count']
    assert teach(c,direct_vm,'base')['status']=='TAUGHT'
    assert c.get_space()['count']<initial and c.query(0)['answer']=='NO'
    teach(c,direct_vm,'positive','migration')
    before=c.get_space()
    assert c.query(1)['answer']=='YES'
    teach(c,direct_vm,'conflict','contradiction')
    assert c.get_space()['status']=='CONTRADICTORY'
    assert all(c.query(x)['answer']=='CONTRADICTORY' for x in range(8))
    c.withdraw('withdraw','conflict')
    assert c.get_space()['candidates']==before['candidates']
    assert c.get_record('conflict')['status']=='TAUGHT'  # history immutable
    assert c.query(1)['answer']=='YES'


@pytest.mark.parametrize('fixture,bad,status',[('uncertain',False,'UNCERTAIN'),('base',True,'HELD')])
def test_indeterminate_examples_do_not_constrain(fixture,bad,status,direct_vm,direct_deploy,direct_alice):
    c=deploy(direct_vm,direct_deploy,direct_alice)
    before=c.get_space()
    assert teach(c,direct_vm,'held',fixture,bad=bad)['status']==status
    after=c.get_space()
    assert after['candidates']==before['candidates'] and after['active']==[]


def test_duplicate_alias_and_semantic_drift_cannot_change_learning(direct_vm,direct_deploy,direct_alice):
    c=deploy(direct_vm,direct_deploy,direct_alice)
    teach(c,direct_vm,'a')
    before=c.get_space()['candidates']
    assert teach(c,direct_vm,'alias',alias='alias.txt')['status']=='DUPLICATE_HELD'
    assert teach(c,direct_vm,'drift',labels=['YES']*4)['status']=='DRIFT_HELD'
    assert c.get_space()['candidates']==before
    c.withdraw('remove','a')
    assert teach(c,direct_vm,'later-drift',labels=['YES']*4)['status']=='DRIFT_HELD'
    assert teach(c,direct_vm,'re-teach')['status']=='TAUGHT'


def test_teacher_and_replay_guards(direct_vm,direct_deploy,direct_alice,direct_bob):
    c=deploy(direct_vm,direct_deploy,direct_alice)
    teach(c,direct_vm,'a')
    direct_vm.sender=direct_bob
    with direct_vm.expect_revert('Only teacher'): teach(c,direct_vm,'b')
    with direct_vm.expect_revert('Only teacher'): c.withdraw('b','a')
    direct_vm.sender=direct_alice
    with direct_vm.expect_revert('Action ID already used'): teach(c,direct_vm,'a')
    with direct_vm.expect_revert('Invalid action ID'): teach(c,direct_vm,'bad id')
    with direct_vm.expect_revert('Example is not active'): c.withdraw('b','missing')
    c.withdraw('b','a')
    with direct_vm.expect_revert('Example is not active'): c.withdraw('c','a')
    with direct_vm.expect_revert('Action ID already used'): c.withdraw('b','a')


def test_active_bound_has_recovery_and_is_not_a_lifetime_cap(direct_vm,direct_deploy,direct_alice):
    c=deploy(direct_vm,direct_deploy,direct_alice)
    for i in range(16):
        body=('Distinct authored example '+str(i)).encode()
        direct_vm.clear_mocks()
        direct_vm.mock_web(r'.*raw\.githubusercontent\.com.*',{'response':{'status':200,'headers':{},'body':body},'method':'GET'})
        direct_vm.mock_llm('.*HYPOTHESIS_LAB_V1.*',json.dumps({'vector':['NO']*4}))
        c.teach('s'+str(i),COORD+'sample.txt',hashlib.sha256(body).hexdigest())
    with direct_vm.expect_revert('Active example limit'): teach(c,direct_vm,'full')
    c.withdraw('release','s0')
    assert teach(c,direct_vm,'after-cap')['status']=='TAUGHT'
    for i in range(1,16): c.withdraw('w'+str(i),'s'+str(i))
    for i in range(18):
        c.withdraw('round-w'+str(i),'after-cap' if i==0 else 'round-t'+str(i-1))
        assert teach(c,direct_vm,'round-t'+str(i))['status']=='TAUGHT'
    assert len(c.get_space()['active'])==1


@pytest.mark.parametrize('x',[-1,8,True])
def test_query_bounds(x,direct_vm,direct_deploy,direct_alice):
    c=deploy(direct_vm,direct_deploy,direct_alice)
    with direct_vm.expect_revert('Pattern must be'): c.query(x)


@pytest.mark.parametrize('value',[None,{}, {'vector':['YES']*3},{'vector':['YES']*5},{'vector':['YES']*3+[True]}, {'vector':['yes']*4},'{"vector":[],"vector":[]}'])
def test_strict_model_parser(value):
    with pytest.raises((ValueError,TypeError)): NS['vector'](value)


@pytest.mark.parametrize('status,body,reason',[(404,b'not found','HTTP_ERROR'),(200,b'x'*4097,'SIZE_ERROR'),(200,b'\xff','ENCODING_ERROR')])
def test_source_fail_closed(status,body,reason):
    gl=SimpleNamespace(nondet=SimpleNamespace(web=SimpleNamespace(get=lambda _:SimpleNamespace(status=status,body=body))))
    ns=namespace(gl); spec=ns['source_spec'](COORD+'base.txt','f'*64)
    row=ns['fetch_source'](spec)
    assert row['status']==reason and not ns['source_ok'](spec,row)


def test_actual_validator_independently_rejects_forged_target():
    class Return:
        def __init__(self,value):self.calldata=value
    body=b'Migration yes, credentials no, outage no, approval no.'
    count={'fetch':0,'llm':0}
    def get(_): count['fetch']+=1;return SimpleNamespace(status=200,body=body)
    def llm(*args,**kwargs): count['llm']+=1;return {'vector':['YES','NO','NO','NO']}
    def run(leader,validator):
        honest=leader(); forged=copy.deepcopy(honest);forged['vector'][3]='YES'
        assert validator(Return(honest)) is True
        assert validator(Return(forged)) is False
        changed=copy.deepcopy(honest);changed['spec']['action_id']='other'
        assert validator(Return(changed)) is False
        assert validator(Exception('LLM_ERROR')) is False
        return honest
    gl=SimpleNamespace(nondet=SimpleNamespace(web=SimpleNamespace(get=get),exec_prompt=llm),vm=SimpleNamespace(Return=Return,run_nondet_unsafe=run,UserError=RuntimeError))
    ns=namespace(gl)
    spec={'source':ns['source_spec'](COORD+'base.txt',hashlib.sha256(body).hexdigest()),'configuration':{'features':ARGS[:3],'target':ARGS[3]},'action_id':'x'}
    ns['classify'](spec)
    assert count=={'fetch':3,'llm':3}


def test_malformed_model_changes_no_state(direct_vm,direct_deploy,direct_alice):
    c=deploy(direct_vm,direct_deploy,direct_alice)
    before=c.get_space()
    with direct_vm.expect_revert('LLM_ERROR'): teach(c,direct_vm,'bad',labels=['YES'])
    assert c.get_space()==before
    assert teach(c,direct_vm,'bad')['status']=='TAUGHT'  # nonce not consumed on revert
