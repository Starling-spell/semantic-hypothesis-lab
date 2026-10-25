import assert from 'node:assert/strict';
import {abi} from 'genlayer-js';
for(const [method,args] of [['get_configuration',[]],['get_space',[]],['teach',['demo','Starling-spell/semantic-hypothesis-lab/'+'a'.repeat(40)+'/examples/base.txt','b'.repeat(64)]],['withdraw',['remove','demo']],['get_record',['demo']],['query',[0]]]){
 const bytes=abi.calldata.encode(abi.calldata.makeCalldataObject(method,args,{}));assert.deepEqual(abi.calldata.encode(abi.calldata.decode(bytes)),bytes);
}console.log('6 SDK calldata roundtrips passed');
