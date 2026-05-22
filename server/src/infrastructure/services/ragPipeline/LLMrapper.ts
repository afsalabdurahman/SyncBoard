// src/infrastructure/groq/groq-llm.provider.ts
import { Groq } from "groq-sdk";
import { ILLMProvider } from "../../../domain/interfaces/services/IRagService";
import { envConfig } from "../../config/env.config";
import {LLmFormateDate} from "../../../utils/dateCoverter"
export class GroqLLMProvider implements ILLMProvider {
                      constructor(){}                             
     client = new Groq({ apiKey: envConfig.GROKE_API_KEY });
    

    async refinePrompt(name: string,prompt:string,INTENT_PROMPT:string): Promise<string> {
    const refineprompt = INTENT_PROMPT.replace("{{QUERY}}", prompt);

    const completion = await this.client.chat.completions.create({
        model: envConfig.LLM_MODEL , 
        
        messages: [
            { role: "system", content: refineprompt },
            { role: "user", content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 100,
    });

    return completion.choices[0]?.message?.content ?? "";
};

async responseMessage(userQuery: string, dbResponse: Record<string,string>[],RESPONSE_PROMPT:string): Promise<string> {
    const count = dbResponse.length;
    const plural = count === 1 ? "" : "s";
    if (!count) {
    return "Great! No tasks match your request right now. You're all clear!";
  }
  const prettyData = dbResponse.map(t => ({
    ...t,
    due_pretty: LLmFormateDate(t.deadline ), // e.g. "Mon 21", "Dec 7"
    short_description: t.description?.split(".")[0].slice(0, 80) + (t.description?.length > 80 ? "..." : "")
  }));
   const prompt = RESPONSE_PROMPT
    .replace(/{{USER_QUERY}}/g, userQuery)
    .replace(/{{TASK_COUNT}}/g, count.toString())
    .replace(/{{PLURAL}}/g, plural)
    .replace(/{{TASKS_JSON}}/g, JSON.stringify(prettyData, null, 2));
    const completion = await this.client.chat.completions.create({
        model: envConfig.LLM_MODEL , 
        
        messages: [
            { role: "system", content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 200,
    });
  
    
     return completion.choices[0]?.message?.content ?? "";
}


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async generate(prompt: string, context: string): Promise<string> {
         return "hiii"
        
        
    }
//   private client: Groq;

//   constructor(apiKey: string, model = "llama3-8b-8192") {
//     this.client = new Groq({ apiKey });
//   }

//   async generate(prompt: string, context: string): Promise<string> {
//     const completion = await this.client.chat.completions.create({
//       model: "llama3-8b-8192",
//       messages: [
//         { role: "system", content: prompt },
//         { role: "user", content: `Context:\n${context}` },
//       ],
//       temperature: 0.2,
//       max_tokens: 500,
//     });
//     return completion.choices[0]?.message?.content ?? "";
//   }
}