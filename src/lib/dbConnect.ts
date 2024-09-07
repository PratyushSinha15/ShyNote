import mongoose from "mongoose";

type ConnectionObject ={
    isConnected?: number,
}

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void>{
    if(connection.isConnected){
        console.log("Using existing connection");
        return;
    }
    try {
        const db=await mongoose.connect(process.env.MONGODB_URI || '', {} );
        connection.isConnected=db.connections[0].readyState;// this is used to check if the connection is successful or not
        console.log("Database connected");
    } catch (error) {
        console.log("Error connecting to database", error);
        process.exit(1);// exit the process if the connection is not successful so that the app does not run
    }
}

export default dbConnect;