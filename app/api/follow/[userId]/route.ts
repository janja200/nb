import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  _req:Request,
  {params}:{params:{userId:string}}
) {
 
  try {
      const User = await currentUser();
      if(!User?.id){
        return new NextResponse("unauthenticated",{status:401});
     }

     const user = await db.user.findUnique({
      where: {
        id: params.userId
      }
    });

    if (!user) {
      throw new Error('Invalid ID');
    }

    let updatedFollowingIds = [...(user.followingIds || [])];
    updatedFollowingIds = updatedFollowingIds.filter((followingId) => followingId !== params.userId);

    const updatedUser = await db.user.update({
      where: {
        id: User?.id
      },
      data: {
        followingIds: updatedFollowingIds
      }
    });
        return NextResponse.json(updatedUser);
  } catch (error) {
    console.log(error);
    return new NextResponse("internal error",{status:500});
  }
}


export async function POST(
  req:Request,
  {params}:{params:{userId:string}}
) {
 
  try {
      const User = await currentUser();
        if(!User?.id){
         return new NextResponse("unauthenticated",{status:401});
       }
       const user = await db.user.findUnique({
        where: {
          id: params.userId
        }
      });
  
      if (!user) {
        throw new Error('Invalid ID');
      }
  
      let updatedFollowingIds = [...(user.followingIds || [])];
  
        updatedFollowingIds.push(params.userId);
  
        // NOTIFICATION PART START
        try {
          await db.notification.create({
            data: {
              body: 'Someone followed you!',
              userId:params.userId,
            },
          });
  
          await db.user.update({
            where: {
              id: params.userId,
            },
            data: {
              hasNotification: true,
            }
          });
        } catch (error) {
          console.log(error);
        }
        // NOTIFICATION PART END
  
      const updatedUser = await db.user.update({
        where: {
          id: User?.id
        },
        data: {
          followingIds: updatedFollowingIds
        }
      });
    return NextResponse.json(updatedUser);
    }
   catch (error) {
    console.log(error);
    return new NextResponse("internal error",{status:500});
  }
}