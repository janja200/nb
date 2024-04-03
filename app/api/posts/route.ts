import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Post } from "@prisma/client";
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
 
  
      const User = await currentUser();
      if(!User?.id){
        return new NextResponse("unauthenticated",{status:401});
     }
     const UserCurrent=await db.user.findFirst({
      where:{
        id:User.id
      },
      include:{
        location:true
      }
     })
     if(!UserCurrent?.location?.latitude &&!UserCurrent?.location?.longitude ){
      return new NextResponse("unauthenticated",{status:401});
     }
     interface UserWithLocation {
      id: string;
      name: string | null;
      username: string | null;
      location: {
        latitude: number | null;
        longitude: number | null;
      } | null;
    }
    
    interface UserPost extends Post {
      distance: number; // Distance from user's location
      username:string;
      name:string;
    }
    
    // Function to calculate distance between two coordinates
    function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
      const R = 6371; // Radius of the earth in km
      const dLat = deg2rad(lat2 - lat1); // deg2rad below
      const dLon = deg2rad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c; // Distance in km
      return parseFloat(d.toFixed(4)); // Convert to 4 decimal places and parse to float
    }
    
    
    function deg2rad(deg: number): number {
      return deg * (Math.PI / 180);
    }
    try {
    const usersWithLocation= await db.user.findMany({
      include: {
        location: true,
        posts: true
      }
    });
    const allPosts: UserPost[] = [];
    // Process the users
    for (const user of usersWithLocation) {
      if (user.name && user.location && user.location.latitude && user.location.longitude) {
        const currentUserLocation = user.location;
        for (const post of user.posts) {
          if (post) { 
          // Calculate distance between user and post
          const distance = calculateDistance(currentUserLocation.latitude, currentUserLocation.longitude, UserCurrent.location.latitude, UserCurrent.location.longitude);
          // Assign the distance to the post
          (post as UserPost).distance = distance;
          
          (post as UserPost).name = user.name;
          allPosts.push(post as UserPost);
          }
        }
        // Sort posts by distance ascending
        
      }
    }
  
    // Now usersWithLocation array contains users along with their posts sorted by distance
    // Sort all posts by distance in ascending order
    allPosts.sort((a, b) => a.distance - b.distance);
    console.log(allPosts);
    return NextResponse.json(allPosts);
  } catch (error) {
    console.log(error);
    return new NextResponse("internal error",{status:500});
  }
}