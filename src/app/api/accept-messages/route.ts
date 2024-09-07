import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request){
    await dbConnect();

    //1 st we have to get currrent logedin user
    const session = await getServerSession(authOptions)
    const user : User = session?.user as User;
    if(!session || !session.user){
        return new Response(
            JSON.stringify({
                success:false,
                message: "You are not logged in"
            }),
            {
                status:401
            }
        )
    }
    const userId = user._id;
    //2nd we have to get the message from the body
    //we have to check if user is accepting the message or not

    const {acceptMessages}=await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessages: acceptMessages},
            {new:true}
        );
        if(!updatedUser){
            return new Response(
                JSON.stringify({
                    success:false,
                    message: "User not updated"
                }),
                {
                    status:401
                }
            )
        }
        return new Response(
            JSON.stringify({
                success:true,
                message: "User updated successfully",
            }),
            {
                status:200
            }
        )

    } catch (error) {
        console.log("Error accepting messages", error);
        return new Response(
            JSON.stringify({
                success:false,
                message: "Error accepting messages"
            }),
            {
                status:500
            }
        )
    }
}

//GET request in this route will be used to get the user details and query the user details from the database

async function GET(request: Request){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user : User = session?.user as User;
    if(!session || !session.user){
        return new Response(
            JSON.stringify({
                success:false,
                message: "You are not logged in"
            }),
            {
                status:401
            }
        )
    }
    const userId = user._id;
    try {
        const foundUser = await UserModel.findById(userId);
        if(!foundUser ){
            return new Response(
                JSON.stringify({
                    success:false,
                    message: "User not found"
                }),
                {
                    status:404
                }
            )
        }
        return new Response(
            JSON.stringify({
                success:true,
                isAcceptingMessages: foundUser.isAcceptingMessages
            }),
            {
                status:200
            }
        )
    } catch (error) {
        console.log("Error getting user", error);
        return new Response(
            JSON.stringify({
                success:false,
                message: "Error getting user"
            }),
            {
                status:500
            }
        )
    }
}