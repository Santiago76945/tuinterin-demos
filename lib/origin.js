// Next normalizes the internal request URL to localhost in development.
// Compare the browser Origin with the actual incoming Host instead.
export function sameOrigin(req){const origin=req.headers.get('origin');if(!origin)return true;try{const u=new URL(origin);return ['http:','https:'].includes(u.protocol)&&u.host===req.headers.get('host');}catch{return false;}}
