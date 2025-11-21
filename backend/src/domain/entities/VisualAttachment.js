/**
 * VisualAttachment Entity
 * 
 * Represents a visual artifact (photo, drawing, sketch) attached to a reflection.
 * 
 * Properties:
 * - originalFilename: The original name of the uploaded file
 * - storedPath: Relative path where the file is stored (e.g., "visuals/2025-11/abc123.jpg")
 * - mimeType: MIME type of the image (e.g., "image/jpeg")
 * - sizeBytes: File size in bytes
 * - dimensions: Optional object with width and height
 * - importTimestamp: ISO 8601 timestamp when the image was imported
 */

import { z } from 'zod';

// Zod schema for VisualAttachment validation
export const VisualAttachmentSchema = z.object({
  originalFilename: z.string()
    .min(1, 'Original filename is required')
    .max(255, 'Filename is too long'),
  
  storedPath: z.string()
    .min(1, 'Stored path is required')
    .regex(/^visuals\/\d{4}-\d{2}\/[a-f0-9-]+\.(jpg|jpeg|png|gif|webp)$/i, 'Invalid stored path format'),
  
  mimeType: z.enum(['image/jpeg', 'image/png', 'image/gif', 'image/webp'], {
    errorMap: () => ({ message: 'Unsupported image format. Supported: JPEG, PNG, GIF, WebP' }),
  }),
  
  sizeBytes: z.number()
    .int('Size must be an integer')
    .positive('Size must be positive')
    .max(10 * 1024 * 1024, 'Image size must not exceed 10MB'),
  
  dimensions: z.object({
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  }).optional(),
  
  importTimestamp: z.string()
    .datetime('Import timestamp must be a valid ISO 8601 datetime'),
});

/**
 * Create a new VisualAttachment
 * @param {Object} data - Visual attachment data
 * @returns {Object} Validated visual attachment
 */
export function createVisualAttachment(data) {
  return VisualAttachmentSchema.parse(data);
}

/**
 * Validate visual attachment data
 * @param {Object} data - Data to validate
 * @returns {Object} Validation result with success boolean and data or errors
 */
export function validateVisualAttachment(data) {
  const result = VisualAttachmentSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return {
    success: false,
    errors: result.error.errors.map(err => ({
      path: err.path.join('.'),
      message: err.message,
    })),
  };
}
