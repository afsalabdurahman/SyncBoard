import Groq from "groq-sdk";

// Intent Prompt
const client = new Groq({ apiKey: "Apykey" });

const generate = async (prompt: string, context: string) => {
    const completion = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile", // <-- use a valid model
        messages: [
            { role: "system", content: prompt },
            { role: "user", content: `Context:\n${context}` },
        ],
        temperature: 0.2,
        max_tokens: 500,
    });
console.log(completion,"completeion...")
    return completion.choices[0]?.message?.content ?? "";
};

const INTENT_PROMPT = `
You are a task assistant. Classify the user query into ONE intent:
- show_all
-approvalStatus_Waiting
-approvalStatus_Rejected
-status_Completed
-status_In Progress
-status_To Do
- priority_High 
- priority_Medium
- priority_Low
- current_task
- due_soon
- overdue
- unknown

Return ONLY the intent name.

Examples:
"what are my high priority tasks?" → high_priority
"show all tasks" → show_all
"what am I working on?" → current_task
"fix login bug" → unknown

Query: "{{QUERY}}"
Intent:
`;

const prompt = INTENT_PROMPT.replace("{{QUERY}}", "When is the due date for the task assigned to me");

(async () => {
    console.log(prompt, "PROMPTS");

    const results = await generate(prompt, "Afsal");  // <-- FIXED (await)
    console.log("RESULT:", results);
})();
