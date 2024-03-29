import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";



export async function POST(
  req:Request,
  {params}:{params:{postId:string}}
) {
 
  try {
      const User = await currentUser();
      const values =await req.json();
      const {body}=values
      if(!User?.id){
        return new NextResponse("unauthenticated",{status:401});
     }

    if(!body){
       return new NextResponse("Body is required",{status:400});
     }
     const comment = await db.comment.create({
      data: {
        body,
        userId: User!.id,
        postId:params.postId
      }
    });
     // NOTIFICATION PART START
    try {
      const post = await db.post.findUnique({
        where: {
          id: params.postId,
        }
      });

      if (post?.userId) {
        await db.notification.create({
          data: {
            body: 'Someone replied on your tweet!',
            userId: post.userId
          }
        });

        await db.user.update({
          where: {
            id: post.userId
          },
          data: {
            hasNotification: true
          }
        });
      }
    }
    catch (error) {
      console.log(error);
      return new NextResponse("internal error",{status:500});
    }
    return NextResponse.json(comment);
    }
   catch (error) {
    console.log(error);
    return new NextResponse("internal error",{status:500});
  }
}