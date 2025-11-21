/**
 * Unit tests for VisualReflectionCard component
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VisualReflectionCard from '../../src/components/VisualReflectionCard.vue';

describe('VisualReflectionCard', () => {
  const mockReflection = {
    id: 'test-123',
    mode: 'visual',
    timestamp: '2025-11-19T12:00:00.000Z',
    visualAttachment: {
      originalFilename: 'sunset.jpg',
      storedPath: 'visuals/2025-11/abc123-def456.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 1024000,
      dimensions: { width: 1920, height: 1080 },
      importTimestamp: '2025-11-19T12:00:00.000Z',
    },
  };

  it('should render visual reflection with image', () => {
    const wrapper = mount(VisualReflectionCard, {
      props: {
        reflection: mockReflection,
      },
    });

    // Should have main card element
    expect(wrapper.find('.visual-reflection-card').exists()).toBe(true);

    // Should display timestamp
    expect(wrapper.find('.reflection-time').exists()).toBe(true);

    // Should display mode badge
    expect(wrapper.find('.reflection-mode').text()).toBe('visual');

    // Should display image
    const img = wrapper.find('.visual-image');
    expect(img.exists()).toBe(true);
    expect(img.attributes('alt')).toBe('sunset.jpg');

    // Should display filename
    expect(wrapper.find('.image-filename').text()).toBe('sunset.jpg');

    // Should display dimensions
    expect(wrapper.find('.image-dimensions').text()).toBe('1920×1080');
  });

  it('should not display dimensions if not provided', () => {
    const reflectionWithoutDimensions = {
      ...mockReflection,
      visualAttachment: {
        ...mockReflection.visualAttachment,
        dimensions: undefined,
      },
    };

    const wrapper = mount(VisualReflectionCard, {
      props: {
        reflection: reflectionWithoutDimensions,
      },
    });

    expect(wrapper.find('.image-dimensions').exists()).toBe(false);
  });

  it('should emit select event when clicked', async () => {
    const wrapper = mount(VisualReflectionCard, {
      props: {
        reflection: mockReflection,
      },
    });

    await wrapper.find('.visual-reflection-card').trigger('click');

    expect(wrapper.emitted('select')).toBeTruthy();
    expect(wrapper.emitted('select')[0]).toEqual([mockReflection]);
  });

  it('should emit delete event when delete button clicked', async () => {
    const wrapper = mount(VisualReflectionCard, {
      props: {
        reflection: mockReflection,
      },
    });

    await wrapper.find('.delete-button').trigger('click');

    expect(wrapper.emitted('delete')).toBeTruthy();
    expect(wrapper.emitted('delete')[0]).toEqual(['test-123']);
  });

  it('should stop propagation when delete button clicked', async () => {
    const wrapper = mount(VisualReflectionCard, {
      props: {
        reflection: mockReflection,
      },
    });

    await wrapper.find('.delete-button').trigger('click');

    // Should not emit select event when delete is clicked
    expect(wrapper.emitted('select')).toBeFalsy();
    expect(wrapper.emitted('delete')).toBeTruthy();
  });

  it('should display AI interaction badge if present', () => {
    const reflectionWithAI = {
      ...mockReflection,
      aiInteraction: {
        model: 'llama2',
        provider: 'local',
        response: 'Interesting visual',
        timestamp: '2025-11-19T12:01:00.000Z',
      },
    };

    const wrapper = mount(VisualReflectionCard, {
      props: {
        reflection: reflectionWithAI,
      },
    });

    expect(wrapper.find('.ai-badge').exists()).toBe(true);
    expect(wrapper.find('.reflection-footer').exists()).toBe(true);
  });

  it('should display persona badge if external AI session present', () => {
    const reflectionWithPersona = {
      ...mockReflection,
      externalAISession: {
        personaId: 'stoic-coach',
        personaName: 'Stoic Coach',
        sessionSummary: 'Focus on what you can control',
        timestamp: '2025-11-19T12:30:00.000Z',
      },
    };

    const wrapper = mount(VisualReflectionCard, {
      props: {
        reflection: reflectionWithPersona,
      },
    });

    expect(wrapper.find('.persona-badge').exists()).toBe(true);
    expect(wrapper.find('.persona-name').text()).toBe('Stoic Coach');
  });

  it('should format timestamps correctly', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayReflection = {
      ...mockReflection,
      timestamp: today.toISOString(),
    };

    const wrapper = mount(VisualReflectionCard, {
      props: {
        reflection: todayReflection,
      },
    });

    const timeText = wrapper.find('.reflection-time').text();
    expect(timeText).toContain('Today at');
  });

  it('should have proper accessibility attributes', () => {
    const wrapper = mount(VisualReflectionCard, {
      props: {
        reflection: mockReflection,
        tabindex: 0,
      },
    });

    const card = wrapper.find('.visual-reflection-card');
    expect(card.attributes('role')).toBe('listitem');
    expect(card.attributes('aria-label')).toContain('Visual reflection from');
    expect(card.attributes('tabindex')).toBe('0');

    const deleteButton = wrapper.find('.delete-button');
    expect(deleteButton.attributes('aria-label')).toBe('Delete this reflection');
  });

  it('should construct correct image URL', () => {
    const wrapper = mount(VisualReflectionCard, {
      props: {
        reflection: mockReflection,
      },
    });

    const img = wrapper.find('.visual-image');
    expect(img.attributes('src')).toBe('http://localhost:3000/api/visuals/2025-11/abc123-def456.jpg');
  });
});
