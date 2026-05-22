import { InternalServerError } from "../../utils/errors";
import { envConfig } from "./env.config";
import mongoose from "mongoose";
export const connectToMongoDB=async () =>{
    try {
        const MONGO_URI =envConfig.MONGODB_URI;
        if(!MONGO_URI) throw new InternalServerError("Database error")
            await mongoose.connect(MONGO_URI);
console.log(" Conneted to Mogodb Atles")
    } catch (error) {
      console.log("Error from mongodb Atlas ",error) 
      process.exit(1) 
    }
}