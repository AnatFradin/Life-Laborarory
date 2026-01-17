/**
 * ExportService - Domain service for exporting reflections
 * 
 * Orchestrates export operations using the exporter pattern
 */

class ExportService {
  constructor(reflectionRepository, exporter) {
    this.repository = reflectionRepository;
    this.exporter = exporter;
  }

  /**
   * Export all reflections to Markdown format
   * 
   * @param {Object} options - Export options
   * @param {string} options.format - 'single-file' or 'folder' (default: 'folder')
   * @param {boolean} options.includeMetadata - Include AI interaction metadata (default: true)
   * @param {string} options.dataDir - Base directory for reading image files
   * @returns {Promise<Object>} Export result
   * @returns {string} return.content - Markdown content
   * @returns {Array<Object>} return.attachments - Array of attachments (if format='folder')
   */
  async exportAllToMarkdown(options = {}) {
    // Set default options
    const exportOptions = {
      format: 'folder',
      includeMetadata: true,
      ...options,
    };

    // Fetch all reflections
    const reflections = await this.repository.findAll();

    // Export to markdown using the exporter adapter
    const result = await this.exporter.exportToMarkdown(reflections, exportOptions);

    return result;
  }

  /**
   * Export a single reflection to Markdown format
   * 
   * @param {string} reflectionId - ID of the reflection to export
   * @param {Object} options - Export options
   * @param {boolean} options.includeMetadata - Include AI interaction metadata (default: true)
   * @param {string} options.dataDir - Base directory for reading image files
   * @returns {Promise<Object>} Export result
   * @returns {string} return.content - Markdown content
   * @returns {Array<Object>} return.attachments - Array of attachments (if visual reflection)
   */
  async exportSingleToMarkdown(reflectionId, options = {}) {
    // Set default options
    const exportOptions = {
      format: 'single-file',
      includeMetadata: true,
      ...options,
    };

    // Fetch the specific reflection
    const reflection = await this.repository.findById(reflectionId);
    
    if (!reflection) {
      const error = new Error('Reflection not found');
      error.statusCode = 404;
      throw error;
    }

    // Export to markdown using the exporter adapter (as single item array)
    const result = await this.exporter.exportToMarkdown([reflection], exportOptions);

    return result;
  }
}

export default ExportService;
