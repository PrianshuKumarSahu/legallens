import { createGoogle } from '@ai-sdk/google';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Get Google Gemini model for use with Vercel AI SDK
 * Uses gemini-3.8-flash with explicit GEMINI_API_KEY injection
 */
export function getGeminiModel(modelId: string = 'gemini-3.8-flash') {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';
  const googleProvider = createGoogle({
    apiKey,
  });
  return googleProvider(modelId);
}

/**
 * Get raw Google Generative AI client for embeddings
 */
export function getEmbeddingClient() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');
  return genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
}

/**
 * Generate embeddings for a text chunk using Gemini
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');
  const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
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
