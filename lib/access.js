import {createHmac,timingSafeEqual} from 'node:crypto';
export const COOKIE='tuinterin_demo_access';
const ttl=60*60*24*30;
export function configured(){return !!(process.env.DEMO_ACCESS_CODE && process.env.DEMO_ACCESS_SECRET);}
export function equal(a,b){const x=Buffer.from(String(a)),y=Buffer.from(String(b));return x.length===y.length&&timingSafeEqual(x,y);}
export function issueToken(){const payload=Buffer.from(JSON.stringify({exp:Math.floor(Date.now()/1000)+ttl,scope:'tuinterin-demo'})).toString('base64url');return payload+'.'+sign(payload);}
function sign(p){return createHmac('sha256',process.env.DEMO_ACCESS_SECRET||'unconfigured').update(p).digest('base64url');}
export function verifyToken(token){try{if(!configured()||!token||token.length>500)return false;const [p,s]=token.split('.');const data=JSON.parse(Buffer.from(p,'base64url').toString());return equal(sign(p),s)&&data.scope==='tuinterin-demo'&&data.exp>Date.now()/1000;}catch{return false;}}
export function cookieOptions(req){return {httpOnly:true,sameSite:'strict',secure:new URL(req.url).protocol==='https:',path:'/',maxAge:ttl};}
export function authorizedRequest(req){return verifyToken(req.cookies.get(COOKIE)?.value);}
