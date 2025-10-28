
import { z } from "zod";

export const adminSignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email format."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Must include uppercase letter.")
    .regex(/[0-9]/, "Must include number."),
});

export type AdminSignupInput = z.infer<typeof adminSignupSchema>;
export const validateSignup = (name,email,password) =>{
if (name.trim() == "") {
      setError((prv) => ({
        ...prv,
        names: "Please enter your name",
      }));
      return false;
    } else {
      setError((prv) => ({
        ...prv,
        names: "",
      }));
    }
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,})/;
    if (!regex.test(password)) {
      setError((prv) => ({
        ...prv,
        passwords:
          "The password must have at least six characters and must include a capital letter, a lowercase letter, and a special character.",
      }));

      return false;
    } else {
      setError((prv) => ({
        ...prv,
        passwords: "",
      }));
    }
}