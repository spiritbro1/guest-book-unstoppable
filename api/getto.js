import { Deta } from "deta";


export default async function handler(request, response) {
   

    // add your Project Key
    const deta = Deta(process.env.pocin)
    // name your DB
    const db = deta.Base("holcim")
    const all= await db.fetch()
    response.json(all)
  }