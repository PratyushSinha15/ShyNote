import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

export async function POST(request: Request): Promise<Response> {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();

        // Check if username already exists and is verified
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if (existingUserVerifiedByUsername) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Username already exists",
                }),
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return new Response(
                    JSON.stringify({
                        success: false,
                        message: "Email already exists",
                    }),
                    { status: 400 }
                );
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 1);

                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = expiryDate;

                await existingUserByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
            });

            await newUser.save();
        }

        // Send the verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);

        if (!emailResponse.success) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: emailResponse.message,
                }),
                { status: 500 }
            );
        } else {
            return new Response(
                JSON.stringify({
                    success: true,
                    message: "User created successfully",
                }),
                { status: 201 }
            );
        }
    } catch (error) {
        console.error("Error creating user:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error creating user",
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }
}
