import {MongoClient} from 'mongodb';
export const LIMIT=1_000_000;
export const BUDGET_ID='tuinterin-demo-october-2026';
export const COST={writing:20_000,voice:50_000,finish:20_000};
export function isConfigured(){return !!(process.env.OPENAI_API_KEY&&process.env.MONGODB_URI&&process.env.MONGODB_DB_NAME);}
export async function database(){
 if(!isConfigured())throw new Error('IA real deshabilitada: completa OPENAI_API_KEY, MONGODB_URI y MONGODB_DB_NAME.');
 if(!globalThis.tuinterinMongo){const client=new MongoClient(process.env.MONGODB_URI,{serverSelectionTimeoutMS:5000,connectTimeoutMS:5000,maxPoolSize:4});globalThis.tuinterinMongo=client.connect().catch(e=>{globalThis.tuinterinMongo=null;throw e;});}
 return (await globalThis.tuinterinMongo).db(process.env.MONGODB_DB_NAME);
}
export async function initBudget(collection){try{await collection.updateOne({_id:BUDGET_ID},{$setOnInsert:{reservedMicro:0,createdAt:new Date(),attempts:{lucia:0,tomas:0}}},{upsert:true});}catch(e){if(e.code!==11000)throw e;}}
export async function reserveFrom(collection,amount){
 if(!Number.isInteger(amount)||amount<=0||amount>LIMIT)throw new Error('Invalid reservation');
 await initBudget(collection);
 const doc=await collection.findOneAndUpdate({_id:BUDGET_ID,reservedMicro:{$lte:LIMIT-amount}},{$inc:{reservedMicro:amount},$set:{updatedAt:new Date()}},{returnDocument:'after'});
 if(!doc)throw new Error('El presupuesto global de US$1 se agotó. Puedes continuar con el modo ilustrativo.');
 return doc;
}
export async function reserve(action){const db=await database();const doc=await reserveFrom(db.collection('tuinterin_demo_budget'),COST[action]);return {db,doc};}
export async function audit(db,action,data){await db.collection('tuinterin_demo_usage').insertOne({scope:BUDGET_ID,action,reservedMicro:COST[action],at:new Date(),...data});}
export async function budgetStatus(){if(!isConfigured())return {configured:false,reservedMicro:0,limitMicro:LIMIT};const db=await database(),c=db.collection('tuinterin_demo_budget');await initBudget(c);const d=await c.findOne({_id:BUDGET_ID});return {configured:true,reservedMicro:d.reservedMicro,limitMicro:LIMIT,attempts:d.attempts,models:{voice:'gpt-realtime-mini-2025-12-15',writing:'gpt-4.1-mini-2025-04-14'}};}
