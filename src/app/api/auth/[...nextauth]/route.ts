import NextAuth from "next-auth";

import { authOptions } from "./options";

const handler = NextAuth(authOptions);




//the routes files are used to define the routes for the api
//we have to export the handler function as we have to pass it to the api route
// here we are exporting the handler function for the GET and POST requests
export {handler as GET,  handler as POST};