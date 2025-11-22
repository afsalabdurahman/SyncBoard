// run with: npx tsx src/rag/embedTask.ts

import mongoose from "mongoose";
import { pipeline } from "@xenova/transformers";
import { TaskModel } from "../src/infrastructure/database/models/TaskModel";
import dotenv from "dotenv";
import { envConfig } from "../src/infrastructure/config/env.config";
dotenv.config();

export const connectToMongoDB = async () => {
  try {
    const MONGO_URI = envConfig.MONGODB_URI;
    if (!MONGO_URI) console.log("mongo uri not working in .env");
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.log("Error from MongoDB Atlas ", error);
    process.exit(1);
  }
};

// ---------------------
// 2. Initialize Embedder
// ---------------------
let embedder: any;

async function loadEmbedder() {
  console.log("Loading embedding model...");
  embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");  // FIXED
  console.log("Embedding model loaded");
}

// Task → Text
function taskToText(task: any) {
  return `
    Task Name: ${task.name}
    Assigned To: ${task.assignedUser?.toString()}
    Description: ${task.description}
    Deadline: ${task.deadline}
    Priority: ${task.priority}
    Status: ${task.status}
    Project: ${task.project?.toString()}
  `;
}

// Embedding generator
async function embedTasks() {
  const tasks = await TaskModel.find();
  console.log(tasks,"find TAksss")
  console.log(`Found ${tasks.length} tasks`);

  for (const task of tasks) {
    try {
      const text = taskToText(task);
console.log(text)
      // const vector = await embedder(text, {
      //   pooling: "mean",
      //   normalize: true,
      // });

      // const embeddingArray: number[] = Array.from(vector.data);

      // task.embedding = embeddingArray;
      // await task.save();

      console.log(`✔ Vector stored for Task ID: ${task._id}`);
    } catch (error) {
      console.error("Error embedding task:", task._id, error);
    }
  }

  console.log("🎉 Embedding completed for all tasks");
}

// Main
(async () => {
  await connectToMongoDB();
  await loadEmbedder();
  await embedTasks();
  mongoose.disconnect();
})();
