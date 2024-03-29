import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
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
        id: params.postId
      }
    });

    if (!post) {
      throw new Error('Invalid ID');
    }

    let updatedLikedIds = [...(post.likedIds || [])];
    updatedLikedIds = updatedLikedIds.filter((likedId) => likedId !== User?.id);
     const updatedPost = await db.post.update({
      where: {
        id: params.postId
      },
      data: {
        likedIds: updatedLikedIds
      }
    });

        return NextResponse.json(updatedPost);
  } catch (error) {
    console.log(error);
    return new NextResponse("internal error",{status:500});
  }
}


export async function POST(
  req:Request,
  {params}:{params:{postId:string}}
) {
 
  try {
      const User = await currentUser();
        if(!User?.id){
         return new NextResponse("unauthenticated",{status:401});
       }
     const post = await db.post.findUnique({
      where: {
        id: params.postId
      }
    });

    if (!post) {
      throw new Error('Invalid ID');
    }

    let updatedLikedIds = [...(post.likedIds || [])];
    updatedLikedIds.push(User?.id);
      
      // NOTIFICATION PART START
      try {
        if (post?.userId) {
          await db.notification.create({
            data: {
              body: 'Someone liked your post!',
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
      } catch(error) {
        console.log(error);
        return new NextResponse("internal error",{status:500});
      }
      // NOTIFICATION PART END
  
      const updatedPost = await db.post.update({
        where: {
          id: params.postId
        },
        data: {
          likedIds: updatedLikedIds
        }
      });
    return NextResponse.json(updatedPost);
    }
   catch (error) {
    console.log(error);
    return new NextResponse("internal error",{status:500});
  }
}