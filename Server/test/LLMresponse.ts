// test-groq-answer.ts
import Groq from "groq-sdk";

// Put your real Groq key here (or use env)
const client = new Groq({
  apiKey: "apiKey", // ← YOUR KEY HERE
});

const ANSWER_PROMPT = `
You are a friendly project assistant. 
Use ONLY the task list below to give a natural, concise answer in 1–3 sentences.
Do NOT hallucinate. If nothing matches, say "I couldn't find any matching tasks."

Current user tasks (most relevant first):
{{CONTEXT}}

User question: {{QUERY}}

Answer naturally (no bullet points unless >4 tasks):
`.trim();

/**
 * TEST FUNCTION — just call it directly
 */
async function testNaturalAnswer() {
  // Simulate vector search result (you can paste any real context here)
  const context = `
1. "Recheck the work" [High] – Due: 18 Nov – Status: pending
   Description: git latest push implement latest push verify
2. "Fix payment gateway" [High] – Due: 20 Nov – Status: in-progress
3. "Add RBAC for customers" [Medium] – Due: 22 Nov
4. "Update documentation" [Low] – Due: 25 Nov
5. "Socket connection for collab" [Low] – Due: no due date
`.trim();

  const userQuery = "which is the highest priority task";

  const finalPrompt = ANSWER_PROMPT
    .replace("{{CONTEXT}}", "You dont have any high priortity task")
    .replace("{{QUERY}}", userQuery);

  console.log("Sending to Groq...\n");
  console.log(finalPrompt);
  console.log("\nWaiting for answer...\n");

  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",   // works perfectly
      // model: "llama3-70b-8192",       // also works
      messages: [{ role: "user", content: finalPrompt }],
      temperature: 0.2,
      max_tokens: 400,
    });

    const answer = completion.choices[0]?.message?.content?.trim() ?? "No response";

    console.log("ANSWER:");
    console.log("=".repeat(50));
    console.log(answer);
    console.log("=".repeat(50));
  } catch (error: any) {
    console.error("Error:", error.message || error);
  }
}

// Run it
testNaturalAnswer();