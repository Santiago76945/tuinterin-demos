import {NextResponse} from 'next/server';
import {verifyToken,COOKIE} from './lib/access';
export function proxy(req){
 if(verifyToken(req.cookies.get(COOKIE)?.value))return NextResponse.next();
 if(req.nextUrl.pathname.startsWith('/api/'))return NextResponse.json({error:'Introduce el código de acceso a la demo.'},{status:401});
 return NextResponse.redirect(new URL('/',req.url));
}
export const config={matcher:['/api/ai/:path*','/api/budget/:path*','/resources/:path*','/assets/:path*','/source/:path*']};
