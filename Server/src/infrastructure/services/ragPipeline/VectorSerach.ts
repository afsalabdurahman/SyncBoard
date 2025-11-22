// src/infrastructure/mongodb/vector-store.mongo.ts
import { MongoClient, Collection } from "mongodb";
import { IVectorStore } from "../../../domain/interfaces/services/IRagService";
// import { TaskModel } from "../../database/models/TaskModel";
import mongoose from "mongoose";
interface ChunkDoc {
  userId: string;
  chunkId: string;
  embedding: number[];
  metadata: { text: string; taskId?: string; projectId?: string };
}

export class MongoVectorStore implements IVectorStore {
  // private collection: Collection<ChunkDoc>;

  // constructor(client: MongoClient, dbName = "pmdb", coll = "rag_chunks") {
  //   this.collection = client.db(dbName).collection(coll);
  // }

  // async upsert(userId: string, chunks: {id: string; embedding: number[]; metadata: any}[]) {
  //   const ops = chunks.map(c => ({
  //     replaceOne: {
  //       filter: { userId, chunkId: c.id },
  //       replacement: {
  //         userId,
  //         chunkId: c.id,
  //         embedding: c.embedding,
  //         metadata: c.metadata,
  //       },
  //       upsert: true,
  //     },
  //   }));
  //   await this.collection.bulkWrite(ops);
  // }

  // async query(userId: string, vector: number[], topK: number) {
  //   const pipeline = [
  //     {
  //       $vectorSearch: {
  //         index: "rag_vector_index",
  //         path: "embedding",
  //         queryVector: vector,
  //         limit: topK,
  //         filter: { userId },
  //       },
  //     },
  //     { $project: { _id: 0, chunkId: 1, score: { $meta: "vectorSearchScore" }, metadata: 1 } },
  //   ];

  //   return this.collection.aggregate(pipeline).toArray();
  // }
  async findFromdb(user: string, key:string,value:string,model:mongoose.Model<any>): Promise<any> {
 
    const result = await model
    .find({ assignedUser: user, [key]: value },{name:1,deadline:1,description:1,status:1,project:1,_id:0,rejectionMsg:1,approvalStatus:1})
    .limit(3)
    .sort({ createdAt: 1 });

  console.log("Result:", result);
  return result;

  }
}