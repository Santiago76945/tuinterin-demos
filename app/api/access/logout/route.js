import {NextResponse} from 'next/server';
import {COOKIE} from '../../../../lib/access';
import {sameOrigin} from '../../../../lib/origin';
export async function POST(req){if(!sameOrigin(req))return NextResponse.json({error:'Origen no autorizado.'},{status:403});const r=NextResponse.json({authorized:false});r.cookies.set(COOKIE,'',{httpOnly:true,sameSite:'strict',path:'/',maxAge:0});return r;}
