import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
    _req:Request,
    {params}:{params:{postId:string}}
  ) {
   
    try {
        const User = await currentUser();
        if(!User?.id){
          return new NextResponse("unauthenticated",{status:401});
       }
  
      
       const post = await db.post.findUnique({
        where: {
          id: params.postId,
        },
        include: {
          user: true,
          comments: {
            include: {
              user: true
            },
            orderBy: {
              createdAt: 'desc'
            }
          },
        },
      });
  
      return NextResponse.json(post);
    } catch (error) {
      console.log(error);
      return new NextResponse("internal error",{status:500});
    }
  }

