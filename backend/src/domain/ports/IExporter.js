/**
 * IExporter - Port/Interface for data export formats
 * 
 * Defines the contract for exporting reflections to different formats.
 * Currently supports Markdown, future: PDF, JSON, etc.
 * 
 * @interface
 */
export class IExporter {
  /**
   * Export reflections to Markdown format
   * 
   * @param {Array<Object>} reflections - Array of validated Reflection entities
   * @param {Object} options - Export options
   * @param {string} options.format - 'single-file' or 'folder' (for images)
   * @param {boolean} [options.includeMetadata=true] - Include AI interaction metadata
   * @returns {Promise<Object>} Export bundle
   * @returns {string} return.content - Markdown content
   * @returns {Array<Object>} [return.attachments] - Array of image files (if format='folder')
   */
  async exportToMarkdown(reflections, options) {
    throw new Error('IExporter.exportToMarkdown() must be implemented');
  }

  /**
   * Get supported export formats
   * @returns {Array<string>} Array of format names (e.g., ['markdown', 'json'])
   */
  getSupportedFormats() {
    throw new Error('IExporter.getSupportedFormats() must be implemented');
  }
}
