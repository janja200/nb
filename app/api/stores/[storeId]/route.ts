import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PATCH(
    req:Request,
    {params}:{params:{storeId:string}}
){
    try {
        const user=await currentUser()
        if(!user?.id){
            return new NextResponse("Unauthorized",{status:401})
        }
        const StoreId=params.storeId
        const body=await req.json()
        const {name}=body
        if(!name){
            return new NextResponse("name is required",{status:400})  
        }
        if(!StoreId){
            return new NextResponse("store id is required",{status:400})  
        }
        const UpdatedStore=await db.store.updateMany({
            where:{
                id:StoreId,
                userId:user.id
            },
            data:{
                name
            }
        })
        return NextResponse.json(UpdatedStore)
    } catch (error) {
        console.log("[store-patch]",error)
        return new NextResponse("Internal error",{status:500})
    }
}

export async function DELETE(
    _req:Request,
    {params}:{params:{storeId:string}}
){
    try {
        const user=await currentUser()
        if(!user?.id){
            return new NextResponse("Unauthorized",{status:401})
        }
        const StoreId=params.storeId
        if(!StoreId){
            return new NextResponse("store id is required",{status:400})  
        }
        const deletedStore=await db.store.deleteMany({
            where:{
                id:StoreId,
                userId:user.id
            }})
        return NextResponse.json(deletedStore)
    } catch (error) {
        console.log("[store-delete]",error)
        return new NextResponse("Internal error",{status:500})
    }
}