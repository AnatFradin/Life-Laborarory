import { z } from 'zod';

/**
 * VisualAttachment Schema
 * Reference to an imported image file
 */
export const VisualAttachmentSchema = z.object({
  originalFilename: z.string().min(1, 'Original filename is required'),
  storedPath: z.string().min(1, 'Stored path is required'),
  mimeType: z.enum(['image/jpeg', 'image/png', 'image/gif', 'image/webp'], {
    errorMap: () => ({ message: 'Unsupported image format' }),
  }),
  sizeBytes: z.number().positive('File size must be positive'),
  dimensions: z
    .object({
      width: z.number().positive(),
      height: z.number().positive(),
    })
    .optional(),
  importTimestamp: z.string().datetime('Invalid import timestamp'),
});

/**
 * AIInteraction Schema
 * A request-response pair with the AI mirror
 */
export const AIInteractionSchema = z.object({
  model: z.string().min(1, 'Model identifier is required'),
  provider: z.enum(['local', 'online'], {
    errorMap: () => ({ message: 'Provider must be local or online' }),
  }),
  prompt: z.string().min(1, 'Prompt is required'),
  response: z.string().min(1, 'Response is required'),
  timestamp: z.string().datetime('Invalid AI interaction timestamp'),
  systemPromptVersion: z.string().regex(/^\d+\.\d+\.\d+$/, 'Invalid version format (expected X.Y.Z)'),
});

/**
 * Reflection Schema
 * Core entity for a single unit of self-expression
 */
export const ReflectionSchema = z
  .object({
    id: z.string().uuid('Invalid reflection ID'),
    timestamp: z.string().datetime('Invalid timestamp'),
    mode: z.enum(['text', 'visual'], {
      errorMap: () => ({ message: 'Mode must be text or visual' }),
    }),
    content: z.string().optional(),
    visualAttachment: VisualAttachmentSchema.optional(),
    aiInteraction: AIInteractionSchema.optional(),
    metadata: z.record(z.unknown()).optional(),
  })
  .refine(
    data => {
      // Conditional validation: text mode requires content
      if (data.mode === 'text') {
        return data.content && data.content.length > 0;
      }
      // Visual mode requires visualAttachment
      if (data.mode === 'visual') {
        return data.visualAttachment !== undefined;
      }
      return false;
    },
    {
      message: 'Text mode requires content, visual mode requires visualAttachment',
    }
  );

/**
 * Validate and parse a reflection
 * @param {Object} data - Raw reflection data
 * @returns {Object} Validated reflection
 * @throws {z.ZodError} If validation fails
 */
export function validateReflection(data) {
  return ReflectionSchema.parse(data);
}

/**
 * Safely validate a reflection (returns error instead of throwing)
 * @param {Object} data - Raw reflection data
 * @returns {Object} { success: boolean, data?: Object, error?: ZodError }
 */
export function safeValidateReflection(data) {
  return ReflectionSchema.safeParse(data);
}
