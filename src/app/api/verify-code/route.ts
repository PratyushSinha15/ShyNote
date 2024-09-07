//here we will define the route for the verify code api
//we will check if the user has provided the correct code or not
//if the code is correct then we will update the user as verified
//if the code is incorrect then we will return an error

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import { userNameValidation } from "@/schemas/signUpSchema";

//here we have to create a schema for the verify code
//the verify code will be a 6 digit number
//so we will create a schema for the verify code

const VerifyCodeSchema = z.object({
    verifyCode: z.string().length(6, {message: "Verify code must be 6 characters"})
});

//now we have to write a post method in which we will check if the user has provided the correct code or not
//if the code is correct then we will update the user as verified
//we will make the user verified in database as true and we will also set the verify code to null
//if the code is incorrect then we will return an error

export async function POST(request: Request){
    await dbConnect();
    try {
        //first we will get the verify code from the body
        const { username, code}= await request.json();

        const decodedUsername= decodeURIComponent(username);
        const user = await UserModel.findOneAndUpdate({
            username: decodedUsername,
            verifyCode: code
        },{
            isVerified: true,
            verifyCode: null
        });
        if(!user){
            return new Response(
                JSON.stringify({
                    success:false,
                    message: "User Not Found"
                }),
                {
                    status:404
                }
            )
        }
        const isCodeValid= user.verifyCode === code;
        if(!isCodeValid){
            return new Response(
                JSON.stringify({
                    success:false,
                    message: "Code is incorrect"
                }),
                {
                    status:400
                }
            )
        }
        //matlab jo code user ne diya hai woh wahi hai jo database me hai
        const isCodeNotExpired= new Date(user.verifyCodeExpiry) > new Date();
        //matlab code expire nahi hua hai 
        //code expire tb hoga jb expiry date choti ho current date se
        //current date se choti expiry date ka matlab code expire ho chuka hai

        if(isCodeValid && isCodeNotExpired){
            user.isVerified= true;
            await user.save();
            return new Response(
                JSON.stringify({
                    success:true,
                    message: "User verified"
                }),
                {
                    status:200
                }
            )
        }
        else if(!isCodeNotExpired){
            return new Response(
                JSON.stringify({
                    success:false,
                    message: "Verification code expired please sign-up again to get a new code"
                }),
                {
                    status:400
                }
            )
        }
        else{
            return new Response(
                JSON.stringify({
                    success:false,
                    message: "Code is incorrect"
                }),
                {
                    status:400
                }
            )
        }
    } catch (error: any) {
        return new Response(
            JSON.stringify({
                success:false,
                message: "Error verifying user"
            }),
            {
                status:500
            }
        )
    }
}