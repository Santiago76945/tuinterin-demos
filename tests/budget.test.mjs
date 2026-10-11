import test from 'node:test';import assert from 'node:assert/strict';
import {MongoMemoryServer} from 'mongodb-memory-server';import {MongoClient} from 'mongodb';
import {LIMIT,BUDGET_ID,reserveFrom} from '../lib/budget.mjs';
import {validAudio,validateText} from '../lib/ai.mjs';
test('concurrent reservations cannot exceed $1 and initialization cannot reset usage',async()=>{
 const server=await MongoMemoryServer.create();const client=new MongoClient(server.getUri());await client.connect();
 try{const c=client.db('isolated_test').collection('tuinterin_demo_budget');
 const r=await Promise.allSettled(Array.from({length:80},()=>reserveFrom(c,20000)));
 assert.equal(r.filter(x=>x.status==='fulfilled').length,50);assert.equal((await c.findOne({_id:BUDGET_ID})).reservedMicro,LIMIT);
 await assert.rejects(()=>reserveFrom(c,1),/presupuesto/);assert.equal((await c.findOne({_id:BUDGET_ID})).reservedMicro,LIMIT);
 await assert.rejects(()=>reserveFrom(c,-1),/Invalid/);await assert.rejects(()=>reserveFrom(c,1.5),/Invalid/);
 }finally{await client.close();await server.stop();}
});
test('voice and writing bounds reject oversized or malformed input before spending',()=>{
 assert.equal(validAudio(Buffer.alloc(4800).toString('base64')),true);
 assert.equal(validAudio(Buffer.alloc(960002).toString('base64')),false);
 assert.equal(validAudio('bad-data'),false);assert.equal(validAudio(Buffer.alloc(4801).toString('base64')),false);
 assert.equal(validateText('hello world'),true);assert.equal(validateText('a'.repeat(4001)),false);
});
