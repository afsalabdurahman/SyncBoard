
import mongoose from "mongoose";
export const connectToMongoDB=async () =>{
    try {
        const MONGO_URI = process.env.MONGO_URI||'mongodb://localhost:27017/mydb';
        if(!MONGO_URI) console.log("mongo uri not working in .env")
            await mongoose.connect(MONGO_URI);
console.log(" Conneted to Mogodb Atles")
    } catch (error) {
      console.log("Error from mongodb Atlas ",error) 
      process.exit(1) 
    }
}