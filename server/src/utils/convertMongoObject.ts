import mongoose, { Types,ObjectId } from "mongoose"
export const stringToMongoObj = (id:string) =>{
return  new mongoose.Types.ObjectId(id)
}




const objectId = new mongoose.Types.ObjectId();
const idString = objectId.toString();