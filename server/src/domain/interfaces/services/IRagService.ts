import mongoose from "mongoose";


export interface IEmbeddingProvider {
  embed(text: string): Promise<number[]>;
  embedBatch(texts: string[]): Promise<number[][]>;
}
export interface IVectorStore {
  findFromdb(user:string,key:string,value:string,model:mongoose.Model<any>):Promise<any>
  // upsert(userId: string, chunks: {id: string; embedding: number[]; metadata: any}[]): Promise<void>;
  // query(userId: string, vector: number[], topK: number): Promise<Array<{id: string; score: number; metadata: any}>>;
}
export interface ILLMProvider {
  generate(prompt: string, context: string): Promise<string>;
  refinePrompt(name:string,prompt:string,INTENT_PROMPT:string):Promise<string>
  responseMessage(userQuery:string,dbResponse:any[],RESPONSE_PROMPT:string):Promise<string>
}