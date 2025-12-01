import fs from 'fs/promises';
import path from 'path';
import os from 'os';

/**
 * iCloud Drive Utilities
 * 
 * Provides utilities to detect and work with iCloud Drive storage on macOS.
 * iCloud Drive location: ~/Library/Mobile Documents/com~apple~CloudDocs/
 */

/**
 * Detect if iCloud Drive is available on this system
 * @returns {Promise<string|null>} iCloud Drive path or null if not available
 */
export async function detectiCloudPath() {
  try {
    // Only available on macOS
    if (os.platform() !== 'darwin') {
      return null;
    }

    const homeDir = os.homedir();
    const iCloudPath = path.join(
      homeDir,
      'Library',
      'Mobile Documents',
      'com~apple~CloudDocs'
    );

    // Check if directory exists and is accessible
    try {
      await fs.access(iCloudPath, fs.constants.R_OK | fs.constants.W_OK);
      return iCloudPath;
    } catch {
      return null;
    }
  } catch (error) {
    console.error('Error detecting iCloud Drive:', error);
    return null;
  }
}

/**
 * Check if iCloud Drive is available
 * @returns {Promise<boolean>}
 */
export async function isiCloudAvailable() {
  const iCloudPath = await detectiCloudPath();
  return iCloudPath !== null;
}

/**
 * Get Life Laboratory storage path in iCloud Drive
 * Creates the directory if it doesn't exist
 * @returns {Promise<string|null>} Path to Life Laboratory folder in iCloud or null if unavailable
 */
export async function getiCloudStoragePath() {
  const iCloudPath = await detectiCloudPath();
  
  if (!iCloudPath) {
    return null;
  }

  const appFolder = path.join(iCloudPath, 'Life-Laboratory');
  
  try {
    // Ensure directory exists
    await fs.mkdir(appFolder, { recursive: true });
    return appFolder;
  } catch (error) {
    console.error('Error creating Life Laboratory folder in iCloud:', error);
    return null;
  }
}

/**
 * Get display path for iCloud Drive (user-friendly)
 * @returns {Promise<string>}
 */
export async function getiCloudDisplayPath() {
  const iCloudPath = await detectiCloudPath();
  
  if (!iCloudPath) {
    return 'iCloud Drive (not available)';
  }

  return `iCloud Drive/Life-Laboratory`;
}
