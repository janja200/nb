import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server"

export async function POST(
    req:Request,
){
   try {
     const user=await currentUser()
     const body=await req.json();
     if(!user?.id){
        return new NextResponse("Unauthorized",{status:401});
     }
    const {name}=body

    if(!name){
       return new NextResponse("name is required",{status:400});
     }
     const store =await db.store.create({
        data:{
            name,
            userId:user.id
        }
      
     })
     return NextResponse.json(store);
   } catch (error) {
     console.log("[store_post",error)
     return new NextResponse("internal error",{status:500});
   }
}