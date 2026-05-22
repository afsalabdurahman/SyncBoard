import mongoose, {  } from "mongoose"
export const stringToMongoObj = (id:string) =>{
return  new mongoose.Types.ObjectId(id)
}




