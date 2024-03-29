import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";



export async function POST(
  request: Request,
) {
  try {
    const User = await currentUser();
    const body = await request.json();
    const {
      name,
      image,
    } = body;

    if (!User?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const updatedUser = await db.user.update({
      where: {
        id: User.id
      },
      data: {
        image: image,
        name: name
      },
    });

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.log(error, 'ERROR_MESSAGES')
    return new NextResponse('Error', { status: 500 });
  }
}