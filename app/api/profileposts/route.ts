import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req:Request,
) {
 
  try {
      const User = await currentUser();
      if(!User?.id){
        return new NextResponse("unauthenticated",{status:401});
     }

    
      const  posts = await db.post.findMany({
          include: {
            user: true,
            comments: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          where:{
            userId:User.id
          }
        });

        return NextResponse.json(posts);
  } catch (error) {
    console.log(error);
    return new NextResponse("internal error",{status:500});
  }
}