/**
 * Unit tests for RephraseDialog component
 * Tests AI rephrasing dialog UI and interactions
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import RephraseDialog from '@/components/RephraseDialog.vue';

describe('RephraseDialog.vue', () => {
  let wrapper;

  const defaultProps = {
    isOpen: true,
    originalText: 'I feel really confused about everything',
    suggestions: [],
    loading: false,
    error: null,
  };

  beforeEach(() => {
    // Create a div for teleport target if it doesn't exist
    if (!document.getElementById('app')) {
      const app = document.createElement('div');
      app.id = 'app';
      document.body.appendChild(app);
    }

    wrapper = mount(RephraseDialog, {
      props: defaultProps,
      attachTo: document.body,
    });
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  it('should display original text', () => {
    const originalText = document.querySelector('[data-test="original-text"]');
    expect(originalText).toBeTruthy();
    expect(originalText.textContent).toContain('I feel really confused about everything');
  });

  it('should show style selector with three options', () => {
    const styleOptions = document.querySelectorAll('input[type="radio"][name="style"]');
    expect(styleOptions.length).toBe(3);

    const dialogElement = document.querySelector('[data-test="rephrase-dialog"]');
    const dialogText = dialogElement.textContent;
    expect(dialogText).toContain('Clearer');
    expect(dialogText).toContain('More Positive');
    expect(dialogText).toContain('More Constructive');
  });

  it('should have clearer style selected by default', () => {
    const clearerOption = document.querySelector('input[value="clearer"]');
    expect(clearerOption.checked).toBe(true);
  });

  it('should allow changing style selection', async () => {
    const positiveOption = document.querySelector('input[value="more-positive"]');
    positiveOption.checked = true;
    positiveOption.dispatchEvent(new Event('change'));
    await nextTick();

    // Verify the style is now selected
    expect(positiveOption.checked).toBe(true);
    
    // Clicking Rephrase button should emit with the new style
    const rephraseButton = document.querySelector('[data-test="rephrase-button"]');
    rephraseButton.click();
    await nextTick();
    
    expect(wrapper.emitted('rephrase')).toBeTruthy();
    expect(wrapper.emitted('rephrase')[0]).toEqual(['more-positive']);
  });

  it('should display suggestions side-by-side with original', async () => {
    await wrapper.setProps({
      suggestions: [
        'I feel uncertain about several things',
        'I am unsure about many aspects',
      ],
    });

    const suggestionsContainer = document.querySelector('[data-test="suggestions-list"]');
    expect(suggestionsContainer).toBeTruthy();

    const suggestionItems = document.querySelectorAll('[data-test="suggestion-item"]');
    expect(suggestionItems.length).toBe(2);
    expect(suggestionItems[0].textContent).toContain('I feel uncertain about several things');
    expect(suggestionItems[1].textContent).toContain('I am unsure about many aspects');
  });

  it('should show accept button for each suggestion', async () => {
    await wrapper.setProps({
      suggestions: ['Suggestion 1', 'Suggestion 2'],
    });

    const acceptButtons = document.querySelectorAll('[data-test="accept-suggestion"]');
    expect(acceptButtons.length).toBe(2);
  });

  it('should emit accept event when clicking accept button', async () => {
    await wrapper.setProps({
      suggestions: ['Rephrased version 1', 'Rephrased version 2'],
    });

    const firstAcceptButton = document.querySelector('[data-test="accept-suggestion"]');
    firstAcceptButton.click();
    await nextTick();

    expect(wrapper.emitted('accept')).toBeTruthy();
    expect(wrapper.emitted('accept')[0]).toEqual(['Rephrased version 1']);
  });

  it('should emit close event when clicking cancel button', async () => {
    const cancelButton = document.querySelector('[data-test="cancel-button"]');
    cancelButton.click();
    await nextTick();

    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it('should emit close event when pressing Escape key', async () => {
    const overlay = document.querySelector('.rephrase-dialog-overlay');
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    overlay.dispatchEvent(event);
    await nextTick();

    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it('should show loading spinner while AI processes request', async () => {
    await wrapper.setProps({ loading: true });

    const loadingSpinner = document.querySelector('[data-test="loading-spinner"]');
    expect(loadingSpinner).toBeTruthy();

    // Suggestions should be hidden during loading
    const suggestionsList = document.querySelector('[data-test="suggestions-list"]');
    expect(suggestionsList).toBeNull();
  });

  it('should show gentle error message when AI unavailable', async () => {
    await wrapper.setProps({
      error: 'Could not connect to Ollama. Is it running?',
    });

    const errorMessage = document.querySelector('[data-test="error-message"]');
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toContain('AI service unavailable');
    expect(errorMessage.textContent).toContain('Your original text is preserved');
  });

  it('should not render when isOpen is false', async () => {
    // First unmount the existing wrapper to clean up
    if (wrapper) {
      wrapper.unmount();
    }
    
    await nextTick();
    
    const closedWrapper = mount(RephraseDialog, {
      props: { ...defaultProps, isOpen: false },
      attachTo: document.body,
    });

    await nextTick();

    // Dialog should not be visible
    const dialog = document.querySelector('[data-test="rephrase-dialog"]');
    expect(dialog).toBeNull();

    closedWrapper.unmount();
  });

  it('should disable style selector while loading', async () => {
    await wrapper.setProps({ loading: true });

    const styleOptions = document.querySelectorAll('input[type="radio"]');
    styleOptions.forEach(option => {
      expect(option.disabled).toBe(true);
    });
  });

  it('should show empty state when no suggestions yet', () => {
    const testWrapper = mount(RephraseDialog, {
      props: {
        ...defaultProps,
        suggestions: [],
        loading: false,
      },
      attachTo: document.body,
    });

    const emptyState = document.querySelector('[data-test="empty-state"]');
    expect(emptyState).toBeTruthy();
    expect(emptyState.textContent).toContain('Select a style and click Rephrase');

    testWrapper.unmount();
  });

  it('should have Rephrase button to trigger rephrasing', () => {
    const rephraseButton = document.querySelector('[data-test="rephrase-button"]');
    expect(rephraseButton).toBeTruthy();
    expect(rephraseButton.textContent).toContain('Rephrase');
  });

  it('should emit rephrase event when clicking Rephrase button', async () => {
    const rephraseButton = document.querySelector('[data-test="rephrase-button"]');
    rephraseButton.click();
    await nextTick();

    expect(wrapper.emitted('rephrase')).toBeTruthy();
    expect(wrapper.emitted('rephrase')[0]).toEqual(['clearer']); // default selected style
  });

  it('should disable Rephrase button while loading', async () => {
    await wrapper.setProps({ loading: true });

    const rephraseButton = document.querySelector('[data-test="rephrase-button"]');
    expect(rephraseButton.disabled).toBe(true);
  });
});
