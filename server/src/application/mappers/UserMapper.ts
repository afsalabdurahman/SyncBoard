import { User } from "../../domain/entities/User";
import { z } from "zod";
import { ProfileUpdateDTO } from "../dto/UserDTO";
export class UserMapper{
    static userResponseDTO(user:User){
        return{
             email: user.email,
                name: user.name,
                role: user.role,
                stripeCustomerId: user.stripeCustomerId,
                currentSubscription: user.currentSubscription,
                _id: user._id,
                title: user.title,
                profileImage: user.imageUrl,
                workspace: user.workspace,
                location: user.location,
                imageUrl: user.imageUrl,
                about: user.about,
                phone: user.phone,
                isAdmin: user.isAdmin,
                isSuperAdmin: user.isSuperAdmin,
                isBlocked: user.isBlocked,
                isDeleted:user.isBlocked,
                isOnline: user.isOnline,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
        }
    }
   static updateProfileValidator(
  merge: Partial<ProfileUpdateDTO>
) {

  const onlyLettersWithSpace = z
  .string()

  .min(2, { message: "Must be at least 2 characters" })
  .max(50, { message: "Too long" })
  .regex(/^[A-Za-z]+(?: [A-Za-z]+)*$/, {
    message: "Only letters and single spaces allowed.",
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
    name: onlyLettersWithSpace,
    role: onlyLettersWithSpace,
    title: onlyLettersWithSpace,
    location: onlyLettersWithSpace,
    status: onlyLettersWithSpace,

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
  .string()
  .trim()
  .regex(/^[0-9]{10}$/, {
    message: "Phone must be exactly 10 digits",
  })
  .or(z.literal("")) 
  .optional()
  .nullable(),


    imageUrl: z
      .string()
      .url({ message: "Invalid image URL" })
      .optional()
      .nullable(),

    
  }).partial(); 

  return schema.safeParse(merge);
}

}