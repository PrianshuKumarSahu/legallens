import { describe, it, expect } from 'vitest';
import {
  formatFileSize,
  formatDate,
  formatRelativeTime,
  truncateText,
  isValidFileType,
  getFileExtension,
  hashContent,
  cn,
  LEGAL_DISCLAIMER,
  DOCUMENT_TYPE_LABELS,
  MAX_FILE_SIZE,
} from '@/lib/utils';

describe('Utility Functions', () => {
  describe('cn (classname merger)', () => {
    it('merges class names correctly', () => {
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
    });

    it('handles conditional classes', () => {
      expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
    });

    it('handles empty input', () => {
      expect(cn()).toBe('');
    });
  });

  describe('formatFileSize', () => {
    it('formats bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 B');
      expect(formatFileSize(500)).toBe('500 B');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(1572864)).toBe('1.5 MB');
    });
  });

  describe('formatDate', () => {
    it('formats date strings correctly', () => {
      const result = formatDate('2024-01-15T10:00:00Z');
      expect(result).toContain('Jan');
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });
  });

  describe('formatRelativeTime', () => {
    it('returns "Just now" for very recent dates', () => {
      const now = new Date().toISOString();
      expect(formatRelativeTime(now)).toBe('Just now');
    });

    it('returns minutes for recent dates', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      expect(formatRelativeTime(fiveMinutesAgo)).toBe('5m ago');
    });

    it('returns hours for dates within a day', () => {
      const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
      expect(formatRelativeTime(threeHoursAgo)).toBe('3h ago');
    });
  });

  describe('truncateText', () => {
    it('returns full text when under limit', () => {
      expect(truncateText('Hello', 200)).toBe('Hello');
    });

    it('truncates long text with ellipsis', () => {
      const longText = 'a'.repeat(300);
      const result = truncateText(longText, 200);
      expect(result.length).toBeLessThanOrEqual(203); // 200 + '...'
      expect(result).toContain('...');
    });
  });

  describe('isValidFileType', () => {
    it('accepts valid file types', () => {
      expect(isValidFileType('contract.pdf')).toBe(true);
      expect(isValidFileType('agreement.docx')).toBe(true);
      expect(isValidFileType('terms.txt')).toBe(true);
    });

    it('rejects invalid file types', () => {
      expect(isValidFileType('image.png')).toBe(false);
      expect(isValidFileType('script.js')).toBe(false);
      expect(isValidFileType('data.csv')).toBe(false);
    });

    it('is case insensitive', () => {
      expect(isValidFileType('CONTRACT.PDF')).toBe(true);
      expect(isValidFileType('Agreement.DOCX')).toBe(true);
    });
  });

  describe('getFileExtension', () => {
    it('extracts extensions correctly', () => {
      expect(getFileExtension('file.pdf')).toBe('pdf');
      expect(getFileExtension('file.docx')).toBe('docx');
      expect(getFileExtension('file.name.txt')).toBe('txt');
    });
  });

  describe('hashContent', () => {
    it('generates consistent hashes', () => {
      const hash1 = hashContent('test content');
      const hash2 = hashContent('test content');
      expect(hash1).toBe(hash2);
    });

    it('generates different hashes for different content', () => {
      const hash1 = hashContent('content A');
      const hash2 = hashContent('content B');
      expect(hash1).not.toBe(hash2);
    });

    it('returns a hex string', () => {
      const hash = hashContent('test');
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });
  });

  describe('Constants', () => {
    it('has a legal disclaimer', () => {
      expect(LEGAL_DISCLAIMER).toBeTruthy();
      expect(LEGAL_DISCLAIMER).toContain('not');
      expect(LEGAL_DISCLAIMER).toContain('legal advice');
    });

    it('has document type labels', () => {
      expect(DOCUMENT_TYPE_LABELS.contract).toBe('Contract');
      expect(DOCUMENT_TYPE_LABELS.nda).toBe('Non-Disclosure Agreement');
    });

    it('has max file size of 20MB', () => {
      expect(MAX_FILE_SIZE).toBe(20 * 1024 * 1024);
    });
  });
});
