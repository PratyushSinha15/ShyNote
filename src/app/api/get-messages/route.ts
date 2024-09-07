import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

//here we will write logic to get all the messages of the user


//1. we need to check if the user is logged in or not

export async function GET(request: Request){
    await dbConnect();
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

    //converting the user id to string as we will use it in the query to get the messages 

    //even if the userid is in string it will be converted to object id in the query
    const userId = new mongoose.Types.ObjectId(user._id);


    //2. we need to get all the messages of the user
    //we will use mongodb aggregation to get the messages of the user

    try {
        const user= await UserModel.aggregate([
            {
                $match:{
                    _id: userId
                }
            },
            {
                $unwind: "$messages"
            },
            {
                $sort:{'messages.createdAt':-1}
            },
            {
                $group:{_id:"$_id", messages:{$push:"$messages"}}
            }
        ]);
        if(!user || user.length === 0){
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
                messages: user[0].messages
            }),
            {
                status:200
            }
        )
    } catch (error) {
        console.log("Error getting messages", error);
        return new Response(
            JSON.stringify({
                success:false,
                message: "Error getting messages"
            }),
            {
                status:500
            }
        )
        
    }
}

