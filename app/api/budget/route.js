import {NextResponse} from 'next/server';
import {budgetStatus} from '../../../lib/budget.mjs';
import {authorizedRequest} from '../../../lib/access';
export const dynamic='force-dynamic';
export async function GET(req){if(!authorizedRequest(req))return NextResponse.json({error:'Acceso no autorizado.'},{status:401});try{return NextResponse.json(await budgetStatus(),{headers:{'Cache-Control':'no-store'}});}catch{return NextResponse.json({configured:false,error:'No se pudo conectar con el registro de presupuesto. La IA real está bloqueada.',reservedMicro:0,limitMicro:1000000},{headers:{'Cache-Control':'no-store'}});}}
