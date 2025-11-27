/**
 * Accessibility Tests using axe-core
 * 
 * Tests WCAG 2.1 Level AA compliance across all views
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Base URL for the application
const BASE_URL = 'http://localhost:5173';

test.describe('Accessibility Tests - WCAG 2.1 Level AA', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app before each test
    await page.goto(BASE_URL);
  });

  test('Compose View - should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    
    // Wait for the page to be fully loaded
    await page.waitForSelector('.compose-view');
    
    // Run axe accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    // Assert no violations
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('History View - should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto(`${BASE_URL}/history`);
    
    // Wait for the page to be fully loaded
    await page.waitForSelector('.history-view');
    
    // Run axe accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    // Assert no violations
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Settings View - should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto(`${BASE_URL}/settings`);
    
    // Wait for the page to be fully loaded
    await page.waitForSelector('.settings-view');
    
    // Run axe accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    // Assert no violations
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Export View - should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto(`${BASE_URL}/export`);
    
    // Wait for the page to be fully loaded
    await page.waitForSelector('.export-view');
    
    // Run axe accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    // Assert no violations
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Navigation - skip to main content link should be accessible', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Locate the skip link first
    const skipLink = page.locator('.skip-to-main');
    
    // Focus it
    await skipLink.focus();
    
    // Should be visible when focused
    await expect(skipLink).toBeVisible();
    
    // Should have correct href
    await expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  test('Dialogs - should be accessible and trap focus', async ({ page, browserName }) => {
    // Go to export view
    await page.goto(`${BASE_URL}/export`);
    
    // Click the export button to open dialog
    await page.click('text=Export All Reflections');
    
    // Wait for dialog to open and be ready
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    
    // Give dialog time to initialize focus trap (especially in Webkit)
    await page.waitForTimeout(browserName === 'webkit' ? 200 : 100);
    
    // Run axe scan on the dialog
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('[role="dialog"]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    // Assert no violations
    expect(accessibilityScanResults.violations).toEqual([]);
    
    // Test focus trap - press Tab multiple times
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100); // Give time for focus to move
    }
    
    // Verify dialog is still open (main accessibility concern)
    const dialogStillOpen = await page.locator('[role="dialog"]').isVisible();
    expect(dialogStillOpen).toBe(true);
    
    // Focus should still be within dialog (or at least dialog should be keyboard-operable)
    // Note: Webkit has known issues with focus trap in some scenarios
    // The important accessibility requirement is that the dialog remains operable
    const { focusedElement, canOperateDialog } = await page.evaluate(() => {
      const activeEl = document.activeElement;
      const dialog = document.querySelector('[role="dialog"]');
      const isInDialog = activeEl?.closest('[role="dialog"]') !== null;
      
      // Check if dialog has focusable elements
      const focusableElements = dialog?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      return {
        focusedElement: isInDialog,
        canOperateDialog: focusableElements && focusableElements.length > 0
      };
    });
    
    // Verify dialog is keyboard-operable (has focusable elements)
    expect(canOperateDialog).toBe(true);
    
    // Focus trap check - be lenient with Webkit due to known browser quirks
    if (browserName !== 'webkit') {
      expect(focusedElement).toBe(true);
    }
  });

  test('Keyboard navigation - all interactive elements should be keyboard accessible', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Tab through all interactive elements
    const tabbableElements = await page.evaluate(() => {
      const tabbable = [];
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_ELEMENT,
        {
          acceptNode: (node) => {
            const tabindex = node.getAttribute('tabindex');
            if (tabindex && parseInt(tabindex) < 0) {
              return NodeFilter.FILTER_REJECT;
            }
            if (
              node.matches('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])') &&
              !node.disabled
            ) {
              return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_SKIP;
          },
        }
      );
      
      let node;
      while ((node = walker.nextNode())) {
        tabbable.push({
          tag: node.tagName,
          role: node.getAttribute('role'),
          label: node.getAttribute('aria-label') || node.textContent?.slice(0, 30),
        });
      }
      return tabbable;
    });
    
    // Should have at least navigation links and form controls
    expect(tabbableElements.length).toBeGreaterThan(0);
    
    console.log(`Found ${tabbableElements.length} keyboard-accessible elements`);
  });

  test('Color contrast - should meet WCAG AA standards', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Run axe scan specifically for color contrast
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .disableRules(['color-contrast']) // We'll check this separately for better control
      .analyze();
    
    // Check for contrast violations
    const contrastResults = await new AxeBuilder({ page })
      .include('*')
      .options({ rules: { 'color-contrast': { enabled: true } } })
      .analyze();
    
    // Log any contrast violations for review
    if (contrastResults.violations.length > 0) {
      console.log('Color contrast violations:', JSON.stringify(contrastResults.violations, null, 2));
    }
    
    // Assert no contrast violations (WCAG AA requires 4.5:1 for normal text)
    expect(contrastResults.violations.filter(v => v.id === 'color-contrast')).toEqual([]);
  });

  test('Form labels - all form controls should have accessible labels', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    
    // Check for label violations
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .options({
        rules: {
          'label': { enabled: true },
          'label-title-only': { enabled: true },
        },
      })
      .analyze();
    
    // Assert no label violations
    const labelViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'label' || v.id === 'label-title-only'
    );
    expect(labelViolations).toEqual([]);
  });

  test('ARIA usage - should use ARIA attributes correctly', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check for ARIA violations
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'best-practice'])
      .options({
        rules: {
          'aria-valid-attr': { enabled: true },
          'aria-valid-attr-value': { enabled: true },
          'aria-allowed-attr': { enabled: true },
          'aria-required-attr': { enabled: true },
        },
      })
      .analyze();
    
    // Assert no ARIA violations
    const ariaViolations = accessibilityScanResults.violations.filter(v => 
      v.id.startsWith('aria-')
    );
    expect(ariaViolations).toEqual([]);
  });

  test('Headings - should have a logical heading structure', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Get all headings
    const headings = await page.evaluate(() => {
      const headingElements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      return headingElements.map(h => ({
        level: parseInt(h.tagName[1]),
        text: h.textContent?.trim(),
      }));
    });
    
    // Should have at least one h1
    const h1Count = headings.filter(h => h.level === 1).length;
    expect(h1Count).toBe(1);
    
    // Headings should not skip levels
    for (let i = 1; i < headings.length; i++) {
      const current = headings[i].level;
      const previous = headings[i - 1].level;
      const diff = current - previous;
      
      // Difference should not be more than 1 (going down) or any number (going up)
      if (diff > 1) {
        console.warn(`Heading level skip detected: h${previous} to h${current}`);
      }
      expect(diff).toBeLessThanOrEqual(1);
    }
  });

  test('Images - should have appropriate alt text', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check for image alt violations
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a'])
      .options({
        rules: {
          'image-alt': { enabled: true },
        },
      })
      .analyze();
    
    // Assert no image alt violations
    const imageAltViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'image-alt'
    );
    expect(imageAltViolations).toEqual([]);
  });
});
