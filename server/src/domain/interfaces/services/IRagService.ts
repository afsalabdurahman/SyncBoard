import { TaskLLM } from "../../../types/LLMtaskTypes";


export interface IEmbeddingProvider {
  embed(text: string): Promise<number[]>;
  embedBatch(texts: string[]): Promise<number[][]>;
}
export interface IVectorStore {
  findFromdb(user: string, key: string, value: string, model: string): Promise<TaskLLM[]>

}
export interface ILLMProvider {
  generate(prompt: string, context: string): Promise<string>;
  refinePrompt(name: string, prompt: string, INTENT_PROMPT: string): Promise<string>
  responseMessage(userQuery: string, dbResponse: Record<string, string>[], RESPONSE_PROMPT: string): Promise<string>
}