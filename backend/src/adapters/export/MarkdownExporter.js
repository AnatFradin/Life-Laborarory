/**
 * MarkdownExporter - Adapter for exporting reflections to Markdown format
 * 
 * Implements IExporter interface
 */

import { IExporter } from '../../domain/ports/IExporter.js';
import { readFile } from 'fs/promises';
import path from 'path';

class MarkdownExporter extends IExporter {
  /**
   * Export reflections to Markdown format
   * 
   * @param {Array<Object>} reflections - Array of validated Reflection entities
   * @param {Object} options - Export options
   * @param {string} options.format - 'single-file' or 'folder' (for images)
   * @param {boolean} [options.includeMetadata=true] - Include AI interaction metadata
   * @param {string} [options.dataDir] - Base directory for reading image files
   * @returns {Promise<Object>} Export bundle
   */
  async exportToMarkdown(reflections, options = {}) {
    const { format = 'folder', includeMetadata = true, dataDir } = options;

    // Handle empty reflections
    if (reflections.length === 0) {
      return {
        content: this._generateEmptyMarkdown(),
        attachments: [],
      };
    }

    // Sort reflections by timestamp (most recent first)
    const sortedReflections = [...reflections].sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    // Collect attachments for folder export
    const attachments = [];

    // Generate markdown content
    let markdown = '# My Reflections\n\n';
    markdown += `*Exported on ${this._formatTimestamp(new Date().toISOString())}*\n\n`;
    markdown += `Total reflections: ${sortedReflections.length}\n\n`;
    markdown += '---\n\n';

    // Add each reflection
    for (const reflection of sortedReflections) {
      const result = await this._formatReflection(
        reflection,
        includeMetadata,
        format,
        dataDir
      );
      markdown += result.markdown;
      markdown += '\n---\n\n';

      // Collect attachments for folder export
      if (result.attachment) {
        attachments.push(result.attachment);
      }
    }

    return {
      content: markdown,
      attachments,
    };
  }

  /**
   * Get supported export formats
   * @returns {Array<string>} Array of format names
   */
  getSupportedFormats() {
    return ['markdown'];
  }

  /**
   * Generate markdown for empty reflections list
   * @private
   */
  _generateEmptyMarkdown() {
    return '# My Reflections\n\nNo reflections yet.\n';
  }

  /**
   * Format a single reflection as markdown
   * @private
   */
  async _formatReflection(reflection, includeMetadata, format, dataDir) {
    let markdown = '';
    let attachment = null;

    // Add timestamp as header
    markdown += `## ${this._formatTimestamp(reflection.timestamp)}\n\n`;

    // Handle text mode
    if (reflection.mode === 'text' && reflection.content) {
      markdown += `${reflection.content}\n\n`;
    }

    // Handle visual mode
    if (reflection.mode === 'visual' && reflection.visualAttachment) {
      const visual = reflection.visualAttachment;
      
      if (format === 'single-file' && dataDir) {
        // Embed image as base64 data URL
        try {
          const imagePath = path.join(dataDir, visual.storedPath);
          const imageBuffer = await readFile(imagePath);
          const base64 = imageBuffer.toString('base64');
          const dataUrl = `data:${visual.mimeType};base64,${base64}`;
          
          markdown += `![${visual.originalFilename}](${dataUrl})\n\n`;
        } catch (error) {
          markdown += `*[Image: ${visual.originalFilename} - file not found]*\n\n`;
        }
      } else {
        // Reference external image file for folder export
        const imageFilename = path.basename(visual.storedPath);
        markdown += `![${visual.originalFilename}](images/${imageFilename})\n\n`;
        
        // Collect attachment info for folder export
        if (dataDir) {
          attachment = {
            sourcePath: path.join(dataDir, visual.storedPath),
            targetPath: `images/${imageFilename}`,
            originalFilename: visual.originalFilename,
          };
        }
      }

      // Add image metadata
      markdown += `*Image: ${visual.originalFilename}*`;
      if (visual.dimensions) {
        markdown += ` (${visual.dimensions.width}×${visual.dimensions.height})`;
      }
      markdown += `\n\n`;
    }

    // Add AI interaction if present and metadata is included
    if (includeMetadata && reflection.aiInteraction) {
      markdown += `### AI Mirror Response\n\n`;
      markdown += `> ${reflection.aiInteraction.response}\n\n`;
      markdown += `*Model: ${reflection.aiInteraction.model}*\n\n`;
    }

    // Add external AI session if present
    if (includeMetadata && reflection.externalAISession) {
      const session = reflection.externalAISession;
      markdown += `### ${session.personaName} Session\n\n`;
      markdown += `${session.sessionSummary}\n\n`;
      markdown += `*Session: ${this._formatTimestamp(session.timestamp)}*\n\n`;
    }

    return { markdown, attachment };
  }

  /**
   * Format ISO 8601 timestamp as human-readable string
   * @private
   */
  _formatTimestamp(isoString) {
    const date = new Date(isoString);
    
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };

    return date.toLocaleString('en-US', options);
  }
}

export default MarkdownExporter;
