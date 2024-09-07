//here we are changing our existing User type to include an _id field.
// This is the field that we will use to store the user's id from the database.


import NextAuth from "next-auth";

declare module "next-auth" {
    interface User {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
    }
    interface Session {
        user: {
            _id?: string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
            username?: string;
        }& DefaultSession['user'];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
    }
}