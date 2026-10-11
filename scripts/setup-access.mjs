import fs from 'node:fs';import crypto from 'node:crypto';
const path='.env';let text=fs.existsSync(path)?fs.readFileSync(path,'utf8'):'';
if(!/^DEMO_ACCESS_CODE=/m.test(text)){text+='\n# Shared access code for the private product demo\nDEMO_ACCESS_CODE='+crypto.randomInt(10000000,100000000)+'\n';}
if(!/^DEMO_ACCESS_SECRET=/m.test(text))text+='DEMO_ACCESS_SECRET='+crypto.randomBytes(32).toString('hex')+'\n';
fs.writeFileSync(path,text);console.log('Access variables ready. Existing configuration preserved.');
