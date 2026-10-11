import test from 'node:test';import assert from 'node:assert/strict';
import {issueToken,verifyToken,equal} from '../lib/access.js';
import {sameOrigin} from '../lib/origin.js';
test('access tokens cannot be forged or reused after secret rotation',()=>{
 process.env.DEMO_ACCESS_CODE='12345678';process.env.DEMO_ACCESS_SECRET='test-secret';
 const token=issueToken();assert.equal(verifyToken(token),true);assert.equal(verifyToken(token+'x'),false);assert.equal(verifyToken('garbage'),false);
 process.env.DEMO_ACCESS_SECRET='changed-secret';assert.equal(verifyToken(token),false);assert.equal(equal('1','12'),false);
});
test('same origin checks respect the incoming host and block foreign sites',()=>{
 const req=(origin,host)=>({headers:new Headers({origin,host})});
 assert.equal(sameOrigin(req('http://127.0.0.1:3012','127.0.0.1:3012')),true);
 assert.equal(sameOrigin(req('https://evil.example','127.0.0.1:3012')),false);
 assert.equal(sameOrigin(req('null','127.0.0.1:3012')),false);
});
