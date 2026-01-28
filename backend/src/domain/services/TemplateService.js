/**
 * TemplateService - Service for loading and managing reflection templates
 * 
 * Handles loading templates from markdown files in data/reflection-templates/,
 * validation, and CRUD operations
 */

import { readFile, writeFile, readdir, mkdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { validateTemplate, createTemplate } from '../entities/Template.js';

class TemplateService {
  constructor(templatesDir) {
    this.templatesDir = templatesDir;
    this.templates = null;
    this.lastLoadTime = null;
  }

  /**
   * Ensure templates directory exists
   * @private
   */
  async _ensureTemplatesDir() {
    if (!existsSync(this.templatesDir)) {
      await mkdir(this.templatesDir, { recursive: true });
    }
  }

  /**
   * Load all templates from markdown files
   * @returns {Promise<Array>} Array of template objects
   */
  async loadTemplates() {
    try {
      await this._ensureTemplatesDir();

      const files = await readdir(this.templatesDir);
      const templates = [];

      for (const file of files) {
        if (!file.endsWith('.md')) {
          continue;
        }

        try {
          const filePath = join(this.templatesDir, file);
          const content = await readFile(filePath, 'utf-8');
          
          // Parse markdown frontmatter if present
          const template = this._parseMarkdownTemplate(file, content);
          
          // Validate template
          const validated = validateTemplate(template);
          templates.push(validated);
        } catch (error) {
          console.error(`[TemplateService] Error loading template ${file}:`, error.message);
          // Continue loading other templates
        }
      }

      this.templates = templates;
      this.lastLoadTime = Date.now();
      
      console.log(`[TemplateService] Loaded ${templates.length} templates`);
      return templates;
    } catch (error) {
      console.error('[TemplateService] Error loading templates:', error.message);
      this.templates = [];
      this.lastLoadTime = Date.now();
      return [];
    }
  }

  /**
   * Parse a markdown file into a template object
   * Supports frontmatter format:
   * ---
   * name: Template Name
   * description: Template description
   * tags: tag1, tag2
   * ---
   * # Template content here...
   * 
   * @param {string} filename - Markdown filename
   * @param {string} content - File content
   * @returns {Object} Template object
   * @private
   */
  _parseMarkdownTemplate(filename, content) {
    const id = filename.replace('.md', '');
    let name = id;
    let description = '';
    let tags = [];
    let isDefault = false;
    let markdownContent = content;

    // Parse frontmatter if present
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      markdownContent = frontmatterMatch[2].trim();

      // Parse frontmatter lines
      const lines = frontmatter.split('\n');
      for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) continue;

        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();

        switch (key) {
          case 'name':
            name = value;
            break;
          case 'description':
            description = value;
            break;
          case 'tags':
            tags = value.split(',').map(t => t.trim()).filter(t => t.length > 0);
            break;
          case 'isDefault':
            isDefault = value.toLowerCase() === 'true';
            break;
        }
      }
    } else {
      // If no frontmatter, try to extract name from first heading
      const headingMatch = content.match(/^#\s+(.+)$/m);
      if (headingMatch) {
        name = headingMatch[1].trim();
      }
    }

    const now = new Date().toISOString();

    return createTemplate({
      id,
      name,
      description,
      content: markdownContent,
      tags,
      isDefault,
      createdAt: now,
    });
  }

  /**
   * Get all templates
   * @returns {Promise<Array>} Array of templates
   */
  async getAllTemplates() {
    if (!this.templates || !this.lastLoadTime) {
      await this.loadTemplates();
    }
    return this.templates || [];
  }

  /**
   * Get template by ID
   * @param {string} id - Template ID
   * @returns {Promise<Object|null>} Template or null if not found
   */
  async getTemplateById(id) {
    const templates = await this.getAllTemplates();
    return templates.find(t => t.id === id) || null;
  }

  /**
   * Save a new template from markdown content
   * @param {Object} templateData - Template data (name, description, content, tags)
   * @returns {Promise<Object>} Created template
   */
  async saveTemplate(templateData) {
    await this._ensureTemplatesDir();

    const now = new Date().toISOString();
    const template = createTemplate({
      ...templateData,
      createdAt: now,
    });

    // Validate template
    const validated = validateTemplate(template);

    // Generate markdown file with frontmatter
    const markdown = this._generateMarkdownFile(validated);
    const filename = `${validated.id}.md`;
    const filePath = join(this.templatesDir, filename);

    await writeFile(filePath, markdown, 'utf-8');

    // Reload templates to update cache
    await this.loadTemplates();

    console.log(`[TemplateService] Template ${validated.id} saved successfully`);
    return validated;
  }

  /**
   * Generate markdown file content with frontmatter
   * @param {Object} template - Template object
   * @returns {string} Markdown content
   * @private
   */
  _generateMarkdownFile(template) {
    const frontmatter = [
      '---',
      `name: ${template.name}`,
    ];

    if (template.description) {
      frontmatter.push(`description: ${template.description}`);
    }

    if (template.tags && template.tags.length > 0) {
      frontmatter.push(`tags: ${template.tags.join(', ')}`);
    }

    if (template.isDefault) {
      frontmatter.push('isDefault: true');
    }

    frontmatter.push('---');
    frontmatter.push('');
    frontmatter.push(template.content);

    return frontmatter.join('\n');
  }

  /**
   * Delete a template by ID
   * @param {string} id - Template ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  async deleteTemplate(id) {
    const filename = `${id}.md`;
    const filePath = join(this.templatesDir, filename);

    if (!existsSync(filePath)) {
      return false;
    }

    await unlink(filePath);

    // Reload templates to update cache
    await this.loadTemplates();

    console.log(`[TemplateService] Template ${id} deleted successfully`);
    return true;
  }

  /**
   * Update an existing template
   * @param {string} id - Template ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated template
   */
  async updateTemplate(id, updates) {
    const existing = await this.getTemplateById(id);
    if (!existing) {
      const error = new Error('Template not found');
      error.statusCode = 404;
      throw error;
    }

    const now = new Date().toISOString();
    const updated = {
      ...existing,
      ...updates,
      id: existing.id, // Preserve ID
      createdAt: existing.createdAt, // Preserve creation timestamp
      updatedAt: now,
    };

    // Validate updated template
    const validated = validateTemplate(updated);

    // Delete old file if ID changed
    if (updates.id && updates.id !== existing.id) {
      await this.deleteTemplate(existing.id);
    }

    // Save updated template
    const markdown = this._generateMarkdownFile(validated);
    const filename = `${validated.id}.md`;
    const filePath = join(this.templatesDir, filename);

    await writeFile(filePath, markdown, 'utf-8');

    // Reload templates to update cache
    await this.loadTemplates();

    console.log(`[TemplateService] Template ${id} updated successfully`);
    return validated;
  }
}

export default TemplateService;
