import {NextResponse} from 'next/server';
import {writing,startSession,voice,finishSession} from '../../../lib/ai.mjs';
import {sameOrigin} from '../../../lib/origin';
import {authorizedRequest} from '../../../lib/access';
export const runtime='nodejs';export const maxDuration=45;
export async function POST(req){
 if(!authorizedRequest(req))return NextResponse.json({error:'Acceso no autorizado.'},{status:401});
 if(!sameOrigin(req))return NextResponse.json({error:'Origen no autorizado.'},{status:403});
 try{
  if(Number(req.headers.get('content-length')||0)>1_350_000)return NextResponse.json({error:'Solicitud demasiado grande.'},{status:413});
  const raw=await req.text();if(raw.length>1_350_000)return NextResponse.json({error:'Solicitud demasiado grande.'},{status:413});
  const b=JSON.parse(raw);let data;
  switch(b.action){case 'writing':data=await writing(b.text);break;case 'start':data=await startSession(b.student,b.variant);break;case 'voice':data=await voice(b.session,b.audio);break;case 'finish':data=await finishSession(b.session);break;default:return NextResponse.json({error:'Acción no disponible.'},{status:400});}
  return NextResponse.json(data,{headers:{'Cache-Control':'no-store'}});
 }catch(e){const known=/presupuesto|intentos|turnos|configur|deshabilitada|sesión|Audio|writing|Espera|Responde|OpenAI|conexión|respuesta|resultado/i.test(e.message);return NextResponse.json({error:known?e.message:'No se pudo completar la solicitud. La IA se mantiene bloqueada si no se puede registrar el presupuesto.'},{status:503});}
}
