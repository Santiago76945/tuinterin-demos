import {readFile} from 'node:fs/promises';
import path from 'node:path';
export async function GET(){const bytes=await readFile(path.join(process.cwd(),'public/assets/academy-hero.webp'));return new Response(bytes,{headers:{'Content-Type':'image/webp','Cache-Control':'public, max-age=86400'}});}
