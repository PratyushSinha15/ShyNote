import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();

    const {username, content}= await request.json();

    try {
        
        const user = await UserModel.findOne({username});
        if(!user){
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
        //if user found then check if user is accepting messages or not
        if(!user.isAcceptingMessages){
            return new Response(
                JSON.stringify({
                    success:false,
                    message: "User is not accepting messages"
                }),
                {
                    status:400
                }
            )
        }
        const newMessage = {content, createdAt: new Date()};
        user.messages.push(newMessage as Message); //push the new message to the messages array we check the type of newMessage as Message
        await user.save();

    } catch (error) {
        console.log("Error sending message", error);
        return new Response(
            JSON.stringify({
                success:false,
                message: "Error sending message"
            }),
            {
                status:500
            }
        )
    }
}