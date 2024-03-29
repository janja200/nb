import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
 
export async function GET(
    _req:Request,
    {params}:{params:{sizeId:string}}
){
    try {
       
        if(!params.sizeId){
            return new NextResponse("Size id is required",{status:400})  
        }
        const Size=await db.size.findUnique({
            where:{
                id:params.sizeId,
            }})
        return NextResponse.json(Size)
    } catch (error) {
        console.log("[sizeId]",error)
        return new NextResponse("Internal error",{status:500})
    }
}
export async function PATCH(
    req:Request,
    {params}:{params:{storeId:string,sizeId:string}}
){
    try {
        const user=await currentUser()
        if(!user?.id){
            return new NextResponse("Unauthorized",{status:401})
        }
        const StoreId=params.storeId
        const body=await req.json()
        const {name,value}=body
        if(!name && !value){
            return new NextResponse("name and value are required",{status:400});
          }
         if(!params.storeId && !params.sizeId){
             return new NextResponse("StoreId and sizeId are required",{status:400});
           }
           const storeByUserId= await db.store.findFirst({
            where:{
                id:params.storeId
            }
        })
        if(!storeByUserId){
            return new NextResponse("Unauthorized",{status:403})
        }
        const UpdatedSize=await db.size.updateMany({
            where:{
                id:params.sizeId,
                               
            },
            data:{
                name,
                value
            }
        })
        return NextResponse.json(UpdatedSize)
    } catch (error) {
        console.log("[store-patch]/sizeId",error)
        return new NextResponse("Internal error",{status:500})
    }
}

export async function DELETE(
    _req:Request,
    {params}:{params:{storeId:string,sizeId:string}}
){
    try {
        const user=await currentUser()
        if(!user?.id){
            return new NextResponse("Unauthorized",{status:401})
        }
        
        const storeByUserId= await db.store.findFirst({
            where:{
                id:params.storeId
            }
        })
        if(!storeByUserId){
            return new NextResponse("Unauthorized",{status:403})
        }
        if(!params.sizeId){
            return new NextResponse("sizeId  is required",{status:400})  
        }
        const deletedSize=await db.size.deleteMany({
            where:{
                id:params.sizeId,
            }})
        return NextResponse.json(deletedSize)
    } catch (error) {
        console.log("[size-delete]",error)
        return new NextResponse("Internal error",{status:500})
    }
}