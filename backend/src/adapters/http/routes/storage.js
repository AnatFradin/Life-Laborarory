import express from 'express';
import { isiCloudAvailable, getiCloudDisplayPath } from '../../../utils/icloud.js';
import storagePathService from '../../../domain/services/StoragePathService.js';

const router = express.Router();

/**
 * GET /api/storage/locations
 * Get available storage locations for user's system
 * 
 * Response:
 * {
 *   data: {
 *     locations: [
 *       { value: 'local', label: 'Local Storage', path: './data', available: true },
 *       { value: 'icloud', label: 'iCloud Drive', path: 'iCloud Drive/Life-Laboratory', available: true/false }
 *     ]
 *   }
 * }
 */
router.get('/locations', async (req, res) => {
  try {
    const iCloudAvailable = await isiCloudAvailable();
    const iCloudDisplayPath = await getiCloudDisplayPath();
    
    const localBasePath = await storagePathService.getBasePath('local');
    
    const locations = [
      {
        value: 'local',
        label: 'Local Storage',
        description: 'Store reflections in the application data folder',
        path: localBasePath,
        displayPath: './data',
        available: true,
        icon: '💾',
      },
      {
        value: 'icloud',
        label: 'iCloud Drive',
        description: 'Sync reflections across your Apple devices',
        path: iCloudAvailable ? await storagePathService.getBasePath('icloud') : null,
        displayPath: iCloudDisplayPath,
        available: iCloudAvailable,
        icon: '☁️',
        requiresMacOS: true,
      },
    ];

    res.json({ data: { locations } });
  } catch (error) {
    console.error('Error fetching storage locations:', error);
    res.status(500).json({
      error: true,
      message: 'Failed to fetch storage locations',
    });
  }
});

export default router;
