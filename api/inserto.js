import { Deta } from "deta";


export default async function handler(request, response) {
   const {body}=request
   const {message,name,date,address}=body;
   if(message&&name&&date){
    const deta = Deta(process.env.pocin)
    // name your DB
    const db = deta.Base("holcim")
    await db.put({message,name,date,address});
    const all= await db.fetch()
   return response.json(all)
   }else{
return response.status(400)
   }

    // add your Project Key
    
  }