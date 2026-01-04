import { ref } from 'vue';

/**
 * Composable for clipboard operations
 */
export function useClipboard() {
  const copying = ref(false);
  const error = ref(null);

  /**
   * Copy text to clipboard
   * @param {string} text - Text to copy
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async function copy(text) {
    if (!text) {
      return { success: false, error: 'No text to copy' };
    }

    copying.value = true;
    error.value = null;

    try {
      // Try modern Clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return { success: true };
      }
      
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          return { success: true };
        } else {
          throw new Error('Copy command failed');
        }
      } catch (err) {
        document.body.removeChild(textArea);
        throw err;
      }
    } catch (err) {
      console.error('Error copying to clipboard:', err);
      error.value = err.message;
      return { success: false, error: err.message };
    } finally {
      copying.value = false;
    }
  }

  return {
    copying,
    error,
    copy,
  };
}
