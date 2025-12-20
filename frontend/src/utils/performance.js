/**
 * Performance monitoring utility (T101, FR-033, FR-034)
 * 
 * Tracks:
 * - App load time (< 2 seconds per FR-033)
 * - UI interaction response time (< 100ms per FR-034)
 * 
 * Usage:
 *   import { trackPageLoad, trackInteraction } from '@/utils/performance';
 *   
 *   // Track page load
 *   trackPageLoad('ComposeView');
 *   
 *   // Track user interaction
 *   await trackInteraction('save-reflection', async () => {
 *     await saveReflection();
 *   });
 */

// Performance thresholds (from spec)
const LOAD_TIME_THRESHOLD = 2000; // 2 seconds
const INTERACTION_THRESHOLD = 100; // 100ms

// Store metrics for debugging
const metrics = {
  pageLoads: [],
  interactions: [],
};

/**
 * Track page load time
 * @param {string} pageName - Name of the page/view
 */
export function trackPageLoad(pageName) {
  // Use Performance API if available
  if (typeof window !== 'undefined' && window.performance) {
    const loadTime = window.performance.now();
    
    const metric = {
      type: 'page-load',
      page: pageName,
      duration: loadTime,
      timestamp: new Date().toISOString(),
      meetsThreshold: loadTime < LOAD_TIME_THRESHOLD,
    };

    metrics.pageLoads.push(metric);

    // Log warning if threshold exceeded
    if (!metric.meetsThreshold) {
      console.warn(
        `[Performance] Page load slow: ${pageName} took ${Math.round(loadTime)}ms (threshold: ${LOAD_TIME_THRESHOLD}ms)`
      );
    } else {
      console.log(
        `[Performance] Page load: ${pageName} in ${Math.round(loadTime)}ms`
      );
    }

    return metric;
  }

  return null;
}

/**
 * Track user interaction performance
 * @param {string} actionName - Name of the action (e.g., 'save-reflection')
 * @param {Function} action - Async function to track
 * @returns {Promise<any>} Result of the action
 */
export async function trackInteraction(actionName, action) {
  const startTime = performance.now();
  
  try {
    const result = await action();
    const endTime = performance.now();
    const duration = endTime - startTime;

    const metric = {
      type: 'interaction',
      action: actionName,
      duration,
      timestamp: new Date().toISOString(),
      meetsThreshold: duration < INTERACTION_THRESHOLD,
      success: true,
    };

    metrics.interactions.push(metric);

    // Log warning if threshold exceeded
    if (!metric.meetsThreshold) {
      console.warn(
        `[Performance] Interaction slow: ${actionName} took ${Math.round(duration)}ms (threshold: ${INTERACTION_THRESHOLD}ms)`
      );
    } else if (duration > 50) {
      // Log info if over 50ms but under threshold
      console.log(
        `[Performance] Interaction: ${actionName} in ${Math.round(duration)}ms`
      );
    }

    return result;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;

    const metric = {
      type: 'interaction',
      action: actionName,
      duration,
      timestamp: new Date().toISOString(),
      meetsThreshold: duration < INTERACTION_THRESHOLD,
      success: false,
      error: error.message,
    };

    metrics.interactions.push(metric);

    // Re-throw the error
    throw error;
  }
}

/**
 * Get performance metrics summary
 * @returns {Object} Performance metrics
 */
export function getPerformanceMetrics() {
  const slowLoads = metrics.pageLoads.filter((m) => !m.meetsThreshold);
  const slowInteractions = metrics.interactions.filter((m) => !m.meetsThreshold);

  return {
    pageLoads: {
      total: metrics.pageLoads.length,
      slow: slowLoads.length,
      average: metrics.pageLoads.length > 0
        ? Math.round(
            metrics.pageLoads.reduce((sum, m) => sum + m.duration, 0) /
              metrics.pageLoads.length
          )
        : 0,
      threshold: LOAD_TIME_THRESHOLD,
      details: metrics.pageLoads,
    },
    interactions: {
      total: metrics.interactions.length,
      slow: slowInteractions.length,
      average: metrics.interactions.length > 0
        ? Math.round(
            metrics.interactions.reduce((sum, m) => sum + m.duration, 0) /
              metrics.interactions.length
          )
        : 0,
      threshold: INTERACTION_THRESHOLD,
      details: metrics.interactions,
    },
  };
}

/**
 * Clear performance metrics
 */
export function clearPerformanceMetrics() {
  metrics.pageLoads = [];
  metrics.interactions = [];
}

/**
 * Print performance report to console
 */
export function printPerformanceReport() {
  const report = getPerformanceMetrics();

  console.group('🔍 Performance Report');
  
  console.group('📄 Page Loads');
  console.log(`Total: ${report.pageLoads.total}`);
  console.log(`Average: ${report.pageLoads.average}ms`);
  console.log(`Threshold: ${report.pageLoads.threshold}ms`);
  console.log(`Slow loads: ${report.pageLoads.slow}`);
  if (report.pageLoads.slow > 0) {
    console.warn('Slow page loads detected:', report.pageLoads.details.filter(m => !m.meetsThreshold));
  }
  console.groupEnd();

  console.group('⚡ Interactions');
  console.log(`Total: ${report.interactions.total}`);
  console.log(`Average: ${report.interactions.average}ms`);
  console.log(`Threshold: ${report.interactions.threshold}ms`);
  console.log(`Slow interactions: ${report.interactions.slow}`);
  if (report.interactions.slow > 0) {
    console.warn('Slow interactions detected:', report.interactions.details.filter(m => !m.meetsThreshold));
  }
  console.groupEnd();

  console.groupEnd();
}

// Make metrics available in dev mode
if (import.meta.env.DEV) {
  if (typeof window !== 'undefined') {
    window.__performanceMetrics = {
      getMetrics: getPerformanceMetrics,
      clearMetrics: clearPerformanceMetrics,
      printReport: printPerformanceReport,
    };
    console.log('[Performance] Metrics available at window.__performanceMetrics');
  }
}
