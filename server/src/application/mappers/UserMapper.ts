import { User } from "../../domain/entities/User";
import { z } from "zod";
import { ProfileUpdateDTO } from "../dto/UserDTO";
import { Member } from "../../types/workpaceTypes";
export class UserMapper{
    static userResponseDTO(user:User){
        return{
             email: user.email,
                name: user.name,
               
                _id: user._id,
              
                profileImage: user.imageUrl,
                workspace: user.workspace,
                location: user.location,
                imageUrl: user.imageUrl,
                about: user.about,
                phone: user.phone,
                
                isSuperAdmin: user.isSuperAdmin,
              
           
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
        }
    }
   static updateProfileValidator(
  merge: Partial<ProfileUpdateDTO>
) {

  const onlyLettersNumbersWithSpace = z
  .string()
  .trim()
  .min(2, { message: "Must be at least 2 characters" })
  .max(50, { message: "Too long" })
  .regex(/^[A-Za-z][A-Za-z0-9]*(?: [A-Za-z0-9]+)*$/, {
    message:
      "Must start with a letter. Only letters, numbers, and single spaces allowed.",
  });



  const addressValidation = z
    .string()
    .regex(/^[A-Za-z0-9][A-Za-z0-9\s,-]*[A-Za-z0-9]$/, {
      message: "Address cannot start or end with special characters",
    })
    .trim()
    .optional()
    .nullable();

  const schema = z.object({
    name: onlyLettersNumbersWithSpace,
    // role: onlyLettersNumbersWithSpace,
    // title: onlyLettersNumbersWithSpace,
    location: addressValidation,
    status: onlyLettersNumbersWithSpace,

    email: z.string().email({ message: "Invalid email format" }),

    joinDate: z.string().min(3, {
      message: "Join date is required",
    }),

     address: addressValidation,

about: z
  .string()
  .max(500, { message: "About section too long" })
  .regex(/^[A-Za-z0-9][A-Za-z0-9\s.,!@#$%^&*()_\-+=?/:;"'`~]*$/, {
    message:
      "About must start with a letter or number and cannot begin with space or special character",
  })
  .optional()
  .nullable(),


phone: z
  .string({ required_error: "Phone number is required" })
  .trim()
  .refine(
    (val) => val === "" || /^[6-9]\d{9}$/.test(val),
    {
      message: "Phone number must be 10 digits or Invalid phone number"
    }
  )
  .optional()
  .nullable()
  .transform((val) => (val === "" || val === null ? undefined : val)),

    imageUrl: z
      .string()
      .url({ message: "Invalid image URL" })
      .optional()
      .nullable(),

    
  }).partial(); 

  return schema.safeParse(merge);
}
static mapUserBasedWorkspace (user:User,members:Member){
  return{
    _id:members.userId.toString() || "",
    name:user.name,
    email:user.email,
    title:members.title,
    permission:members.permissions || "Viewer",
    role:members.role||"Member",
    isBlocked:members.isBlocked || false,
    isDeleted:members.isDeleted || false,
    isOnline:members.isOnline || false
  }
}
}