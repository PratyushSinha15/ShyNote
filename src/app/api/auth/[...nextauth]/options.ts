import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

//we have to import dbconnect from lib/dbConnect to connect to the database
import dbConnect from "@/lib/dbConnect";

import UserModel from "@/model/User";
import { AnyTxtRecord } from "dns";


//we have to export the authOptions object as we have to pass it to the next-auth function in the api/auth/[...nextauth].ts file to initialize the next-auth
export const authOptions: NextAuthOptions = {
    
    // providers are the different ways in which a user can authenticate themselves in this array we have only one provider which is the credentials provider
    providers: [

        //credentials provider is used to authenticate the user using the email and password it is itself a method which gives us objects to validate the user

        //all these things we are doing
        //basically what next auth does is it takes the credentials from the user and then it passes it to the authorize function and then we have to check if the user is present in the database or not
        //
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            //here we have to write the authorize function which will be called when the user tries to login with the credentials
            //here we have to access the credentials object which will have the username and password
            //we can access the username and password using credentials.identifier.username and credentials.identifier.password
            //int the authorize function we have to check if the user is present in the database or not
            //so first we connected to our database using the dbConnect function
            //then we check if the user is present in the database or not
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user= await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier.email},
                            {username: credentials.identifier.username}
                        ]
                    });
                    if(!user){
                        throw new Error("No user found witgh this email");
                    }
                    if(!user.isVerified){
                        throw new Error("User not verified");
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if(!isPasswordCorrect){
                        throw new Error("Password is incorrect");
                    }else{
                        return user;
                    }
                } catch (error: any) {
                    throw new Error("Error connecting to database");
                    return null;
                }
            }

        })
    ],
     //here we have to write the callbacks object which will have the session function which will be called when the user logs in
    callbacks: {
        async jwt({token, user}: any){
            if(user){
                token._id = user._id?.toString(); 
                token.isVerified= user.isVerified;
                token.isAcceptingMessages= user.isAcceptingMessages;
                token.username= user.username;
            }
            return token;
        },
        async session({session, token}: any){
            if(token){
                session.user._id= token._id;
                session.user.isVerified= token.isVerified;
                session.user.isAcceptingMessages= token.isAcceptingMessages;
                session.user.username= token.username;
            }
            return session;
        }
    },
    pages:{
        signIn: "/sign-in",
    },
    session:{
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
}
