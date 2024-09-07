import { resend } from "@/lib/resend";
import VerificationEmail from "../../email/varificationEmail";

import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(email: string, username: string, verifyCode: string): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Secret Message Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
          });
        return { success: true, message: "Veification email sent sucessfullt" };

    } catch (emailError) {
        console.log("Error sending verification email", emailError);
        return { success: false, message: "Error sending verification email" };
    }
}