import mongoose, {Schema, Document} from "mongoose";  //dockument for time type safety


// Interface for the Message Schema

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

//Intterface for user schema
export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages:  Message[];
}

// Schema for the Message
const MessageSchema : Schema<Message> = new Schema({
    content: {
        type: String, 
        required: true
    },
    createdAt: {
        type: Date, 
        required: true,
        default: Date.now
    }
})


// Schema for the User
const UserSchema: Schema<User>= new Schema({
    username:{
        type : String,
        required: [true, "Please provide a username"],
        trim: true,
        unique: true
    },
    email:{
        type : String,
        required: [true, "Please provide an email"],
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/ , "Please provide a valid email"],
    },
    password:{
        type : String,
        required: [true, "Please provide a password"],
    },
    verifyCode: {
        type: String,
        required: [true, "Please provide a verification code"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Please provide a verification code expiry date"],
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true
    },
    messages: [MessageSchema]
})

// Export the User model
//this how we create a model in mongoose in typescript mongoose.Model<User> this is the type of the model and we are exporting it
const UserModel= (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel; 