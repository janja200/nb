import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";



export async function POST(
  req:Request,
) {
 
  try {
      const User = await currentUser();
      const values =await req.json();
      const {body,image}=values
      if(!User?.id){
        return new NextResponse("unauthenticated",{status:401});
     }

    if(!body){
       return new NextResponse("Body is required",{status:400});
     }
      const post = await db.post.create({
        data: {
          body,
          image,
          userId:User.id
        }
      });

      return NextResponse.json(post);
    }
   catch (error) {
    console.log(error);
    return new NextResponse("internal error",{status:500});
  }
}
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
          }
        });

        return NextResponse.json(posts);
  } catch (error) {
    console.log(error);
    return new NextResponse("internal error",{status:500});
  }
}