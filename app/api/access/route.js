import {NextResponse} from 'next/server';
import {COOKIE,configured,equal,issueToken,verifyToken,cookieOptions} from '../../../lib/access';
import {sameOrigin} from '../../../lib/origin';
const attempts=new Map();
export async function GET(req){return NextResponse.json({authorized:verifyToken(req.cookies.get(COOKIE)?.value),configured:configured()});}
export async function POST(req){
 if(!sameOrigin(req))return NextResponse.json({error:'Origen no autorizado.'},{status:403});
 if(!configured())return NextResponse.json({error:'Configura DEMO_ACCESS_CODE y DEMO_ACCESS_SECRET en .env.'},{status:503});
 if(Number(req.headers.get('content-length')||0)>2000)return NextResponse.json({error:'Solicitud inválida.'},{status:413});
 let b;try{b=await req.json();}catch{return NextResponse.json({error:'Solicitud inválida.'},{status:400});}
 if(verifyToken(b.token)){const r=NextResponse.json({authorized:true,token:b.token});r.cookies.set(COOKIE,b.token,cookieOptions(req));return r;}
 // Single global throttle is intentional for a shared presentation code. No trusted proxy assumptions.
 const now=Date.now();const count=attempts.get('global');
 if(count&&count.until>now&&count.n>=8)return NextResponse.json({error:'Demasiados intentos. Espera 10 minutos.'},{status:429});
 if(!count||count.until<=now)attempts.set('global',{n:0,until:now+600000});
 attempts.get('global').n++;
 if(!/^\d{8}$/.test(String(b.code))||!equal(b.code,process.env.DEMO_ACCESS_CODE))return NextResponse.json({error:'El código no es correcto.'},{status:401});
 attempts.delete('global');const token=issueToken();const r=NextResponse.json({authorized:true,token});r.cookies.set(COOKIE,token,cookieOptions(req));return r;
}
