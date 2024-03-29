import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server"

export async function POST(
    req:Request,
    {params}:{params:{storeId:string}}
){
   try {
     const user=await currentUser()
     const body=await req.json();
     if(!user?.id){
        return new NextResponse("unauthenticated",{status:401});
     }
    const {name,value}=body

    if(!name && !value){
       return new NextResponse("Name and value are required",{status:400});
     }
    if(!params.storeId){
        return new NextResponse("StoreId is required",{status:400});
      }
    const storeByUserId= await db.store.findFirst({
        where:{
            id:params.storeId
        }
    })
    if(!storeByUserId){
        return new NextResponse("Unauthorized",{status:403})
    }
     const size =await db.size.create({
        data:{
            name,
            value,
            storeId:params.storeId
        }
      
     })
     return NextResponse.json(size);
   } catch (error) {
     console.log("[STOREID]/SIZES",error)
     return new NextResponse("internal error",{status:500});
   }
}

export async function GET(
    req:Request,
    {params}:{params:{storeId:string}}
){
   try {
    
    if(!params.storeId){
        return new NextResponse("StoreId is required",{status:400});
      }
  
     const sizes =await db.size.findMany({
        where:{
            storeId:params.storeId
        }
      
     })
     return NextResponse.json(sizes);
   } catch (error) {
     console.log("[STOREID]/SIZESGET",error)
     return new NextResponse("internal error",{status:500});
   }
}