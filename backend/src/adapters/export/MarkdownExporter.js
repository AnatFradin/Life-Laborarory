/**
 * MarkdownExporter - Adapter for exporting reflections to Markdown format
 * 
 * Implements IExporter interface
 */

import { IExporter } from '../../domain/ports/IExporter.js';

class MarkdownExporter extends IExporter {
  /**
   * Export reflections to Markdown format
   * 
   * @param {Array<Object>} reflections - Array of validated Reflection entities
   * @param {Object} options - Export options
   * @param {string} options.format - 'single-file' or 'folder' (for images)
   * @param {boolean} [options.includeMetadata=true] - Include AI interaction metadata
   * @returns {Promise<Object>} Export bundle
   */
  async exportToMarkdown(reflections, options = {}) {
    const { format = 'single-file', includeMetadata = true } = options;

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

    // Generate markdown content
    let markdown = '# My Reflections\n\n';
    markdown += `*Exported on ${this._formatTimestamp(new Date().toISOString())}*\n\n`;
    markdown += `Total reflections: ${sortedReflections.length}\n\n`;
    markdown += '---\n\n';

    // Add each reflection
    for (const reflection of sortedReflections) {
      markdown += this._formatReflection(reflection, includeMetadata);
      markdown += '\n---\n\n';
    }

    return {
      content: markdown,
      attachments: [], // TODO: Handle visual attachments in T089
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
  _formatReflection(reflection, includeMetadata) {
    let markdown = '';

    // Add timestamp as header
    markdown += `## ${this._formatTimestamp(reflection.timestamp)}\n\n`;

    // Add content
    if (reflection.mode === 'text' && reflection.content) {
      markdown += `${reflection.content}\n\n`;
    }

    // Add AI interaction if present and metadata is included
    if (includeMetadata && reflection.aiInteraction) {
      markdown += `### AI Mirror Response\n\n`;
      markdown += `> ${reflection.aiInteraction.response}\n\n`;
      markdown += `*Model: ${reflection.aiInteraction.model}*\n\n`;
    }

    return markdown;
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
