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
   * @param {string} options.format - 'single-file' or 'folder' (default: 'single-file')
   * @param {boolean} options.includeMetadata - Include AI interaction metadata (default: true)
   * @returns {Promise<Object>} Export result
   * @returns {string} return.content - Markdown content
   * @returns {Array<Object>} return.attachments - Array of attachments (if format='folder')
   */
  async exportAllToMarkdown(options = {}) {
    // Set default options
    const exportOptions = {
      format: 'single-file',
      includeMetadata: true,
      ...options,
    };

    // Fetch all reflections
    const reflections = await this.repository.findAll();

    // Export to markdown using the exporter adapter
    const result = await this.exporter.exportToMarkdown(reflections, exportOptions);

    return result;
  }
}

export default ExportService;
