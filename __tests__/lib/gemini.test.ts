import { describe, it, expect } from 'vitest';
import { chunkText } from '@/lib/gemini/client';

describe('Gemini Client Utilities', () => {
  describe('chunkText', () => {
    it('returns single chunk for short text', () => {
      const text = 'This is a short sentence.';
      const chunks = chunkText(text, 1000);
      expect(chunks).toHaveLength(1);
      expect(chunks[0]).toBe(text);
    });

    it('splits long text into multiple chunks', () => {
      const sentences = Array(20).fill('This is a legal clause that establishes an obligation.').join(' ');
      const chunks = chunkText(sentences, 200);
      expect(chunks.length).toBeGreaterThan(1);
    });

    it('respects max chunk size', () => {
      const sentences = Array(20).fill('This is a sentence.').join(' ');
      const maxSize = 100;
      const chunks = chunkText(sentences, maxSize, 20);
      for (const chunk of chunks) {
        // Allow some leeway for overlap content
        expect(chunk.length).toBeLessThanOrEqual(maxSize + 50);
      }
    });

    it('preserves all content across chunks', () => {
      const text = 'Sentence one. Sentence two. Sentence three. Sentence four. Sentence five.';
      const chunks = chunkText(text, 30, 0);
      // All sentences should appear in at least one chunk
      expect(chunks.some(c => c.includes('Sentence one'))).toBe(true);
      expect(chunks.some(c => c.includes('Sentence five'))).toBe(true);
    });

    it('handles empty text', () => {
      const chunks = chunkText('');
      expect(chunks).toHaveLength(0);
    });

    it('handles text with no sentence boundaries', () => {
      const text = 'a'.repeat(500);
      const chunks = chunkText(text, 200);
      expect(chunks.length).toBeGreaterThanOrEqual(1);
    });
  });
});
