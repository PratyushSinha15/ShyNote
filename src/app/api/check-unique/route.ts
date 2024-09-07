import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { userNameValidation } from "@/schemas/signUpSchema"; 
import {z} from "zod";

//here we have usernamevalidation for validation of username
//so we will create a query schema  which will be used to validate the query parameters
//we will use zod for this purpose

const UserQuerySchema = z.object({
    username: userNameValidation,
});

//now we have to write a get method in which when we get username we will
//check if the username is already present in the database or not
//if the username is present then we will return false
//if the username is not present then we will return true
//this is to provide unique usernames to the users

//to make the user know weather his username is available  or not while he is typing the username
//we will use this api to check if the username is available or not
//for that we will use debounce in the frontend to make the api call after the user stops typing

export async function GET(request: Request){

    await dbConnect();
    console.log("Checking username");
    try {
        //first we will get the username from the query parameters
        //localhost:3000/api/check-unique?username=abc 
        const {searchParams} = new URL(request.url);
        const  queryParam={
            username: searchParams.get("username")
        }
        //now we got our query parameters / username
        //we will validate using zod
        const result = UserQuerySchema.safeParse(queryParam);
        console.log(result);
        if(!result.success){
            //if the query parameters are not valid then we will return an error
            const usernameErrors= result.error.format().username?._errors || [];
            return new Response(
                JSON.stringify({
                    success:false,
                    message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : "Invalid username"
                }),
                {
                    status:400
                }
            )
        }

        //if the query parameters are valid then we will check if the username is already present in the database or not
        const existingVerifiedUser = await UserModel.findOne({
            username: queryParam.username,
            isVerified: true
        });
        if(existingVerifiedUser){
            return new Response(
                JSON.stringify({
                    success:false,
                    message:"Username already exists"
                }),
                {
                    status:400
                }
            )
        }
        else{
            return new Response(
                JSON.stringify({
                    success:true,
                    message:"Username is available"
                })
            )
        }


    } catch (error) {
        console.log("Error checking username", error);
        return new Response(
            JSON.stringify({
                success:false,
                message:"Error error while checking username"
            })
        )
    }
}