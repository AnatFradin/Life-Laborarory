import { API_BASE_URL } from '../services/api.js';

/**
 * Get the full URL for a visual attachment stored path
 * @param {string} storedPath - The stored path from the backend (e.g., 'visuals/abc123.png')
 * @returns {string} Full URL to the image
 */
export function getVisualUrl(storedPath) {
  if (!storedPath) return '';
  
  // Remove 'visuals/' prefix if present
  const filename = storedPath.replace(/^visuals\//, '');
  
  // Construct the full URL by removing /api suffix and adding /api/visuals
  const baseUrl = API_BASE_URL.replace(/\/api$/, '');
  return `${baseUrl}/api/visuals/${filename}`;
}
