import { z } from 'zod';

export const userNameValidation= z.string()
                                    .min(3,"User Mmust be at least 3 characters")
                                    .max(20, "User must be at most 20 characters").regex(/^[a-zA-Z0-9_]*$/, 
                                        "User must contain only letters, numbers, and underscores");

export const signUpSchema = z.object({
    username: userNameValidation,
    email: z.string().email({message:"Invalid email"}),
    password: z.string().min(6,{message:"Password must be at least 6 characters"}),
    
})