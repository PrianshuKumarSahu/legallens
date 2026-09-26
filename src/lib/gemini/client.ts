import { google } from '@ai-sdk/google';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Get Google Gemini model for use with Vercel AI SDK
 * Uses gemini-2.0-flash for best free-tier rate limits (15 RPM, 1M TPM)
 */
export function getGeminiModel(modelId: string = 'gemini-2.0-flash') {
  return google(modelId);
}

/**
 * Get raw Google Generative AI client for embeddings
 * Uses text-embedding-004 for 768-dimensional vectors
 */
export function getEmbeddingClient() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  return genAI.getGenerativeModel({ model: 'text-embedding-004' });
}

/**
 * Generate embeddings for a text chunk using Gemini
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

/**
 * Split text into chunks for embedding
 */
export function chunkText(text: string, maxChunkSize: number = 1000, overlap: number = 200): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + ' ' + sentence).length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      // Keep overlap from end of previous chunk
      const words = currentChunk.split(' ');
      const overlapWords = words.slice(-Math.floor(overlap / 5));
      currentChunk = overlapWords.join(' ') + ' ' + sentence;
    } else {
      currentChunk += (currentChunk ? ' ' : '') + sentence;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}
