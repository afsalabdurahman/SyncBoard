import { PlanRequestDTO } from "../dto/PlanDTO";
import { z } from "zod";
export class PlanMapper {
    static inputPlanValidator(input:PlanRequestDTO){
     

    const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

    const isValid = z.object({

      key: z.string().optional(),

      stripePriceId: z.string().optional(),

      name: z
        .string()
        .regex(nameRegex, "Name must contain only letters and spaces (no leading or trailing spaces)"),

      description: z
        .string()
        .regex(nameRegex, "Description must contain only letters and spaces"),

      priceCents: z
        .number()
        .positive(),

      billingInterval: z.enum(["month", "year"]),

      features: z
        .array(z.string().min(1))
        .min(1),

      status: z.enum(["Active", "Inactive"])

    });

    
  
         return isValid.safeParse(input);
}   
}