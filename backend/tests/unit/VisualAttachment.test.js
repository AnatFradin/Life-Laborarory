/**
 * Unit tests for VisualAttachment entity
 */

import { describe, it, expect } from 'vitest';
import {
  VisualAttachmentSchema,
  createVisualAttachment,
  validateVisualAttachment,
} from '../../src/domain/entities/VisualAttachment.js';

describe('VisualAttachment Entity', () => {
  const validAttachment = {
    originalFilename: 'my-photo.jpg',
    storedPath: 'visuals/2025-11/abc123-def456-789.jpg',
    mimeType: 'image/jpeg',
    sizeBytes: 1024000, // 1MB
    dimensions: {
      width: 1920,
      height: 1080,
    },
    importTimestamp: '2025-11-21T10:00:00.000Z',
  };

  describe('createVisualAttachment', () => {
    it('should create valid visual attachment', () => {
      const attachment = createVisualAttachment(validAttachment);
      
      expect(attachment).toEqual(validAttachment);
      expect(attachment.originalFilename).toBe('my-photo.jpg');
      expect(attachment.mimeType).toBe('image/jpeg');
    });

    it('should accept PNG images', () => {
      const pngAttachment = {
        ...validAttachment,
        storedPath: 'visuals/2025-11/abc123-def456.png',
        mimeType: 'image/png',
      };
      
      const attachment = createVisualAttachment(pngAttachment);
      expect(attachment.mimeType).toBe('image/png');
    });

    it('should accept GIF images', () => {
      const gifAttachment = {
        ...validAttachment,
        storedPath: 'visuals/2025-11/abc-def-789.gif',
        mimeType: 'image/gif',
      };
      
      const attachment = createVisualAttachment(gifAttachment);
      expect(attachment.mimeType).toBe('image/gif');
    });

    it('should accept WebP images', () => {
      const webpAttachment = {
        ...validAttachment,
        storedPath: 'visuals/2025-11/abc123.webp',
        mimeType: 'image/webp',
      };
      
      const attachment = createVisualAttachment(webpAttachment);
      expect(attachment.mimeType).toBe('image/webp');
    });

    it('should allow optional dimensions', () => {
      const { dimensions, ...attachmentWithoutDimensions } = validAttachment;
      
      const attachment = createVisualAttachment(attachmentWithoutDimensions);
      expect(attachment.dimensions).toBeUndefined();
    });
  });

  describe('Validation - Required Fields', () => {
    it('should reject missing originalFilename', () => {
      const { originalFilename, ...incomplete } = validAttachment;
      
      expect(() => createVisualAttachment(incomplete)).toThrow();
    });

    it('should reject empty originalFilename', () => {
      const invalid = { ...validAttachment, originalFilename: '' };
      
      expect(() => createVisualAttachment(invalid)).toThrow(/Original filename is required/);
    });

    it('should reject missing storedPath', () => {
      const { storedPath, ...incomplete } = validAttachment;
      
      expect(() => createVisualAttachment(incomplete)).toThrow();
    });

    it('should reject missing mimeType', () => {
      const { mimeType, ...incomplete } = validAttachment;
      
      expect(() => createVisualAttachment(incomplete)).toThrow();
    });

    it('should reject missing sizeBytes', () => {
      const { sizeBytes, ...incomplete } = validAttachment;
      
      expect(() => createVisualAttachment(incomplete)).toThrow();
    });

    it('should reject missing importTimestamp', () => {
      const { importTimestamp, ...incomplete } = validAttachment;
      
      expect(() => createVisualAttachment(incomplete)).toThrow();
    });
  });

  describe('Validation - MIME Type', () => {
    it('should reject unsupported MIME type', () => {
      const invalid = { ...validAttachment, mimeType: 'image/bmp' };
      
      expect(() => createVisualAttachment(invalid)).toThrow(/Unsupported image format/);
    });

    it('should reject non-image MIME type', () => {
      const invalid = { ...validAttachment, mimeType: 'application/pdf' };
      
      expect(() => createVisualAttachment(invalid)).toThrow();
    });
  });

  describe('Validation - File Size', () => {
    it('should reject negative file size', () => {
      const invalid = { ...validAttachment, sizeBytes: -100 };
      
      expect(() => createVisualAttachment(invalid)).toThrow();
    });

    it('should reject zero file size', () => {
      const invalid = { ...validAttachment, sizeBytes: 0 };
      
      expect(() => createVisualAttachment(invalid)).toThrow(/Size must be positive/);
    });

    it('should reject file size exceeding 10MB', () => {
      const invalid = {
        ...validAttachment,
        sizeBytes: 11 * 1024 * 1024, // 11MB
      };
      
      expect(() => createVisualAttachment(invalid)).toThrow(/must not exceed 10MB/);
    });

    it('should accept file size exactly at 10MB limit', () => {
      const valid = {
        ...validAttachment,
        sizeBytes: 10 * 1024 * 1024, // Exactly 10MB
      };
      
      const attachment = createVisualAttachment(valid);
      expect(attachment.sizeBytes).toBe(10 * 1024 * 1024);
    });
  });

  describe('Validation - Stored Path Format', () => {
    it('should accept valid stored path format', () => {
      const paths = [
        'visuals/2025-11/abc123.jpg',
        'visuals/2025-01/def456-789.jpeg',
        'visuals/2024-12/a1b2-c3d4-e5f6.png',
        'visuals/2025-11/a1b2c3d4.gif',
        'visuals/2025-11/fade.webp',
      ];

      paths.forEach(storedPath => {
        const attachment = createVisualAttachment({
          ...validAttachment,
          storedPath,
        });
        expect(attachment.storedPath).toBe(storedPath);
      });
    });

    it('should reject invalid stored path format', () => {
      const invalidPaths = [
        'images/2025-11/test.jpg', // Wrong directory name
        'visuals/test.jpg', // Missing date directory
        'visuals/2025/11/test.jpg', // Wrong date format
        'visuals/2025-11/test.txt', // Wrong extension
        'visuals/2025-11/', // No filename
      ];

      invalidPaths.forEach(storedPath => {
        expect(() =>
          createVisualAttachment({ ...validAttachment, storedPath })
        ).toThrow(/Invalid stored path format/);
      });
    });
  });

  describe('Validation - Dimensions', () => {
    it('should accept valid dimensions', () => {
      const attachment = createVisualAttachment(validAttachment);
      
      expect(attachment.dimensions).toEqual({
        width: 1920,
        height: 1080,
      });
    });

    it('should reject negative width', () => {
      const invalid = {
        ...validAttachment,
        dimensions: { width: -100, height: 1080 },
      };
      
      expect(() => createVisualAttachment(invalid)).toThrow();
    });

    it('should reject negative height', () => {
      const invalid = {
        ...validAttachment,
        dimensions: { width: 1920, height: -100 },
      };
      
      expect(() => createVisualAttachment(invalid)).toThrow();
    });

    it('should reject zero dimensions', () => {
      const invalidWidth = {
        ...validAttachment,
        dimensions: { width: 0, height: 1080 },
      };
      const invalidHeight = {
        ...validAttachment,
        dimensions: { width: 1920, height: 0 },
      };
      
      expect(() => createVisualAttachment(invalidWidth)).toThrow();
      expect(() => createVisualAttachment(invalidHeight)).toThrow();
    });
  });

  describe('Validation - Import Timestamp', () => {
    it('should accept valid ISO 8601 timestamp', () => {
      const timestamps = [
        '2025-11-21T10:00:00.000Z',
        '2025-11-21T10:00:00Z',
        '2025-11-21T10:00:00.123Z',
      ];

      timestamps.forEach(importTimestamp => {
        const attachment = createVisualAttachment({
          ...validAttachment,
          importTimestamp,
        });
        expect(attachment.importTimestamp).toBe(importTimestamp);
      });
    });

    it('should reject invalid timestamp format', () => {
      const invalid = {
        ...validAttachment,
        importTimestamp: '2025-11-21 10:00:00', // Not ISO 8601
      };
      
      expect(() => createVisualAttachment(invalid)).toThrow();
    });
  });

  describe('validateVisualAttachment (safe validation)', () => {
    it('should return success for valid attachment', () => {
      const result = validateVisualAttachment(validAttachment);
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validAttachment);
      expect(result.errors).toBeUndefined();
    });

    it('should return errors for invalid attachment', () => {
      const invalid = { ...validAttachment, sizeBytes: -100 };
      const result = validateVisualAttachment(invalid);
      
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors).toBeInstanceOf(Array);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should provide error details', () => {
      const invalid = { ...validAttachment, originalFilename: '', sizeBytes: 0 };
      const result = validateVisualAttachment(invalid);
      
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors.some(e => e.path === 'originalFilename')).toBe(true);
      expect(result.errors.some(e => e.path === 'sizeBytes')).toBe(true);
    });
  });

  describe('Filename Validation', () => {
    it('should reject filename longer than 255 characters', () => {
      const longFilename = 'a'.repeat(256) + '.jpg';
      const invalid = { ...validAttachment, originalFilename: longFilename };
      
      expect(() => createVisualAttachment(invalid)).toThrow(/Filename is too long/);
    });

    it('should accept filename exactly 255 characters', () => {
      const longFilename = 'a'.repeat(251) + '.jpg'; // 251 + 4 = 255
      const valid = { ...validAttachment, originalFilename: longFilename };
      
      const attachment = createVisualAttachment(valid);
      expect(attachment.originalFilename).toBe(longFilename);
    });
  });
});
