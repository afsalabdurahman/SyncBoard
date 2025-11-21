
import { TaskRequestDTO } from "../../../application/dto/TaskDTOs";

// Global embedder instance (lazy loaded once)
let embedder: any = null;

export const addToVectors = async (task: TaskRequestDTO): Promise<number[]> => {
  try {
    // Load model only once
     const { pipeline } = await import("@xenova/transformers");
    if (!embedder) {
      console.log("Loading embedding model...");
      embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
      console.log("Embedding model loaded");
    }

    const text = `
      Task Name: ${task.name}
      Assigned To: ${task.assignedUser?.toString()}
      Description: ${task.description}
      Deadline: ${task.deadline}
      Priority: ${task.priority}
      Status: ${task.status}
      Project: ${task.project?.toString()}
    `;

    // Generate embedding
    const vector = await embedder(text, {
      pooling: "mean",
      normalize: true,
    });

    return Array.from(vector.data);
    
  } catch (err) {
    console.error("Error generating vectors:", err);
    throw err;
  }
};
