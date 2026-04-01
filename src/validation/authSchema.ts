
import { z } from "zod";

export const loginSchema = z.object({

    username: z.string().min(3,"Enter valid username"),
    password: z.string().min(6, "Password must be at least 6 characters"),

});
export const signupSchema = z.object({
    name: z.string().min(2, "Name is required"),
    username: z.string().min(3, "Username should be at least 3 characters"),
    email: z.string().email("Enter valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type signupFormData = z.infer<typeof signupSchema>;