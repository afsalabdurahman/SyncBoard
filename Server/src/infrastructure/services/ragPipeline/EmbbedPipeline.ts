// import { pipeline, Pipeline } from "@xenova/transformers";
// import { IEmbeddingProvider } from "../../../domain/interfaces/services/IRagService";

// export class XenovaEmbeddingProvider implements IEmbeddingProvider {
//   private transformer!: Pipeline;

//   constructor(model = "Xenova/all-MiniLM-L6-v2") {
//     this.init(model);
//   }

//   private async init(model: string) {
//     this.transformer = await pipeline("feature-extraction", model);
//   }

//   async embed(text: string): Promise<number[]> {
//     const output = await this.transformer(text, { pooling: "mean", normalize: true });
//     return Array.from(output.data) as number[];
//   }

//   async embedBatch(texts: string[]): Promise<number[][]> {
//     return Promise.all(texts.map(t => this.embed(t)));
//   }
// }