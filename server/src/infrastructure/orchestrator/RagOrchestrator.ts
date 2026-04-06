
import {  ILLMProvider, IVectorStore } from "../../domain/interfaces/services/IRagService";
import { IRagOrchestartorService } from "../../domain/interfaces/services/IRagOrchestartorService"
import { injectable, inject } from "tsyringe";
import { hybridFilter } from "../services/ragPipeline/filters/hybridFilter"
import { modelMap } from "../services/ragPipeline/filters/chooseModel"
import { INTENT_TASK_PROMPT, RESPONSE_Task_PROMPT } from "../services/ragPipeline/filters/expandPrompts";
@injectable()
export class RagOrchestrator implements IRagOrchestartorService {

  constructor(
    //  @inject("XenovaEmbeddingProvider")private _embeddingProvider:IEmbeddingProvider,
    @inject("GroqLLMProvider") private _llmProvider: ILLMProvider,
    @inject("MongoVectorStore") private _vectorStore: IVectorStore

  ) { }

  async search(user: string, query: string): Promise<string> {
    let refinedPrompt: string = ""
    if (/tasks?/i.test(query)) {
      refinedPrompt = await this._llmProvider.refinePrompt(user, query, INTENT_TASK_PROMPT)
      const { key, value, model }: any = hybridFilter(refinedPrompt)
      if (!key && value && !model) { return value }

      const results = await this._vectorStore.findFromdb(user, key, value, modelMap[model])
      const response = await this._llmProvider.responseMessage(query, results, RESPONSE_Task_PROMPT)

      return response
    } else {
      return "Sorry, I did not find any relevant content."
    }







    // 1. Embed query
    //     const refineQuery = await this._embeddingProvider()
    //     const queryVec = await this.embedder.embed(query);

    //     // 2. Retrieve top-K relevant chunks (user-scoped)
    //     const results = await this.vectorStore.query(userId, queryVec, 5);

    //     // 3. Build context
    //     const context = results
    //       .map(r => r.metadata.text)
    //       .join("\n---\n");

    //     // 4. Prompt engineering (system + user)
    //     const prompt = this.buildPrompt(query, context);

    //     // 5. LLM call
    //     const answer = await this.llm.generate(prompt, context);

    //     return answer.trim();
    //   }

    //   private buildPrompt(query: string, context: string): string {
    //     return `
    // You are an assistant for a Project-Management app. Answer **only** using the provided context.
    // If the answer cannot be found, say "I couldn't find that information."

    // Context:
    // ${context}

    // Question: ${query}
    // Answer:`.trim();
  }
}