import express from 'express';
import { LocalPreferencesRepository } from '../../storage/LocalPreferencesRepository.js';
import { validateUserPreferences, canUseOnlineAI } from '../../../domain/entities/UserPreferences.js';
import config from '../../../config/index.js';

const router = express.Router();

// Initialize preferences repository
const preferencesRepo = new LocalPreferencesRepository(config.preferencesFile());

/**
 * GET /api/preferences
 * Get current user preferences
 * 
 * Per User Story 4 (T074):
 * - Returns current preferences or defaults if not set
 * - No authentication (single-user local app)
 */
router.get('/', async (req, res, next) => {
  try {
    const preferences = await preferencesRepo.getPreferences();
    
    res.json({
      success: true,
      data: preferences,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/preferences
 * Update user preferences
 * 
 * Per User Story 4 (T074):
 * - Validates preferences against schema
 * - Enforces privacy rules (cannot use online AI without acknowledgment)
 * - Returns updated preferences
 * 
 * Request body: Partial or complete UserPreferences object
 */
router.put('/', async (req, res, next) => {
  try {
    const updates = req.body;

    // Get current preferences
    const current = await preferencesRepo.getPreferences();

    // Merge updates with current
    const merged = { ...current, ...updates };

    // Validate merged preferences (will throw if invalid)
    const validated = validateUserPreferences(merged);

    // Additional business logic checks
    if (validated.aiProvider === 'online') {
      if (!validated.hasAcknowledgedOnlineWarning) {
        return res.status(400).json({
          success: false,
          error: 'Cannot use online AI without acknowledging privacy warning. Please review the privacy implications in settings.',
        });
      }

      if (!validated.onlineModel || !validated.onlineProvider) {
        return res.status(400).json({
          success: false,
          error: 'Please select an online AI model and provider.',
        });
      }
    }

    // Save validated preferences
    const saved = await preferencesRepo.savePreferences(validated);

    res.json({
      success: true,
      data: saved,
      message: 'Preferences updated successfully',
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid preferences',
        details: error.errors,
      });
    }

    next(error);
  }
});

/**
 * POST /api/preferences/reset
 * Reset preferences to defaults
 * 
 * Per User Story 4 (T074):
 * - Resets all preferences to safe defaults
 * - Returns default preferences
 */
router.post('/reset', async (req, res, next) => {
  try {
    const defaults = await preferencesRepo.resetPreferences();
    
    res.json({
      success: true,
      data: defaults,
      message: 'Preferences reset to defaults',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
