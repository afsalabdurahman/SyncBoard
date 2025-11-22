import { pipeline, Tensor } from "@xenova/transformers";
import { TaskModel } from "../src/infrastructure/database/models/TaskModel";
import mongoose from "mongoose";
import { envConfig } from "../src/infrastructure/config/env.config";


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


let embedder: any = null;

/*** 1. Load the model (call once at startup) ***/
async function loadEmbedder() {
    console.log("Loading embedding model...");
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    console.log("Embedding model loaded");
}

/*** 2. Get a 384-dim vector ***/
async function getEmbedding(text: string): Promise<number[]> {
    if (!embedder) throw new Error("Embedder not loaded");

    const output = await embedder(text, {
        pooling: "mean",      // mean-pool over tokens → single vector
        normalize: true,      // cosine similarity works best with unit vectors
    });

    // `output.data` is a Float32Array of length 384
    const vector: number[] = Array.from(output.data as Float32Array);

    console.log("Embedding length:", vector.length);   // → 384
    return vector;
}

/*** 3. Vector search ***/
async function searchTasks(query: string, username: string) {
    const qEmbed = await getEmbedding(query);

    // sanity check – never send an empty array
    if (qEmbed.length !== 384) {
        throw new Error(`Embedding has wrong size: ${qEmbed.length}`);
    }

    const results = await TaskModel.aggregate([
        {
            $vectorSearch: {
                index: "embedding_vectorSearch",
                path: "embedding",
                queryVector: qEmbed,
                numCandidates: 100,
                limit: 1,
                filter: { assignedUser: username },
            },
        },
        {
            $project: {
                name: 1,
                priority: 1,
                description: 1,
                assignedUser: 1,
                deadline:1,
                score: { $meta: "vectorSearchScore" },
            },
        },
    ]);
    results.forEach((r, i) => {
        console.log(`${i + 1}. [${r.score.toFixed(3)}] ${r.name} → ${r.assignedUser}`);
        console.log(`    ${r.description?.slice(0, 80)}...\n`);
    });

    console.log("Vector search results:", results);
    return results;
}

/*** 4. Startup ***/
(async () => {
    await connectToMongoDB()
    await loadEmbedder();                     // load once
    await searchTasks("tell which project added last", "Afsal");
})();