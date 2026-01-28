import { z } from 'zod';

/**
 * Template Schema
 * Defines a reflection structure template that can be loaded from markdown files
 */
export const TemplateSchema = z.object({
  id: z.string().min(1, 'Template ID is required'),
  name: z.string().min(1, 'Template name is required'),
  description: z.string().optional(),
  content: z.string().min(1, 'Template content is required'),
  tags: z.array(z.string()).optional().default([]),
  isDefault: z.boolean().optional().default(false),
  createdAt: z.string().datetime('Invalid creation timestamp'),
  updatedAt: z.string().datetime('Invalid update timestamp').optional(),
});

/**
 * Validate and parse a template
 * @param {Object} data - Raw template data
 * @returns {Object} Validated template
 * @throws {z.ZodError} If validation fails
 */
export function validateTemplate(data) {
  return TemplateSchema.parse(data);
}

/**
 * Safely validate a template (returns error instead of throwing)
 * @param {Object} data - Raw template data
 * @returns {Object} { success: boolean, data?: Object, error?: ZodError }
 */
export function safeValidateTemplate(data) {
  return TemplateSchema.safeParse(data);
}

/**
 * Create a new template with default values
 * @param {Object} templateData - Template data (name, description, content, etc.)
 * @returns {Object} Template object with defaults
 */
export function createTemplate(templateData) {
  const now = new Date().toISOString();
  
  return {
    id: templateData.id,
    name: templateData.name,
    description: templateData.description || '',
    content: templateData.content,
    tags: templateData.tags || [],
    isDefault: templateData.isDefault || false,
    createdAt: templateData.createdAt || now,
    updatedAt: templateData.updatedAt,
  };
}
