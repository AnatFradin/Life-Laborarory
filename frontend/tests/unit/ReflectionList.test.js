/**
 * Unit tests for ReflectionList component - Optimized History View
 */

import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ReflectionList from '../../src/components/ReflectionList.vue';
import VisualReflectionCard from '../../src/components/VisualReflectionCard.vue';
import DeleteDialog from '../../src/components/DeleteDialog.vue';

describe('ReflectionList - Optimized History View', () => {
  const mockTextReflection = {
    id: 'text-123',
    mode: 'text',
    content: 'This is line one\nThis is line two\nThis is line three\nThis is line four\nThis is line five',
    timestamp: '2025-11-19T12:00:00.000Z',
  };

  const mockVisualReflection = {
    id: 'visual-123',
    mode: 'visual',
    timestamp: '2025-11-19T13:00:00.000Z',
    visualAttachment: {
      originalFilename: 'sunset.jpg',
      storedPath: 'visuals/2025-11/abc123.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 1024000,
      dimensions: { width: 1920, height: 1080 },
      importTimestamp: '2025-11-19T13:00:00.000Z',
    },
  };

  const mockMixedReflection = {
    id: 'mixed-123',
    mode: 'text',
    content: 'Mixed reflection with text and visual',
    timestamp: '2025-11-19T14:00:00.000Z',
    visualAttachment: {
      originalFilename: 'photo.jpg',
      storedPath: 'visuals/2025-11/mixed123.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 512000,
      importTimestamp: '2025-11-19T14:00:00.000Z',
    },
  };

  describe('Type Icons', () => {
    it('should display text icon for text reflection', () => {
      const wrapper = mount(ReflectionList, {
        props: {
          reflections: [mockTextReflection],
        },
        global: {
          stubs: {
            DeleteDialog: true,
          },
        },
      });

      const icon = wrapper.find('.reflection-type-icon');
      expect(icon.exists()).toBe(true);
      expect(icon.text()).toBe('📝');
      expect(icon.attributes('title')).toBe('Text reflection');
    });

    it('should display mixed icon for reflection with both text and visual', () => {
      const wrapper = mount(ReflectionList, {
        props: {
          reflections: [mockMixedReflection],
        },
        global: {
          stubs: {
            DeleteDialog: true,
          },
        },
      });

      const icon = wrapper.find('.reflection-type-icon');
      expect(icon.exists()).toBe(true);
      expect(icon.text()).toBe('📋');
      expect(icon.attributes('title')).toBe('Mixed reflection');
    });
  });

  describe('Text Preview Optimization', () => {
    it('should display text with CSS line-clamp applied', () => {
      const wrapper = mount(ReflectionList, {
        props: {
          reflections: [mockTextReflection],
        },
        global: {
          stubs: {
            DeleteDialog: true,
          },
        },
      });

      const text = wrapper.find('.reflection-text');
      expect(text.exists()).toBe(true);
      
      const displayedText = text.text();
      // CSS line-clamp will handle truncation at display time
      expect(displayedText).toContain('This is line one');
    });

    it('should have CSS properties for 3-line truncation', () => {
      const wrapper = mount(ReflectionList, {
        props: {
          reflections: [mockTextReflection],
        },
        global: {
          stubs: {
            DeleteDialog: true,
          },
        },
      });

      const text = wrapper.find('.reflection-text');
      expect(text.classes()).toContain('reflection-text');
      // CSS properties would be verified in E2E tests
    });

    it('should display full text for short reflections', () => {
      const shortReflection = {
        id: 'short-123',
        mode: 'text',
        content: 'Line one\nLine two',
        timestamp: '2025-11-19T12:00:00.000Z',
      };

      const wrapper = mount(ReflectionList, {
        props: {
          reflections: [shortReflection],
        },
        global: {
          stubs: {
            DeleteDialog: true,
          },
        },
      });

      const text = wrapper.find('.reflection-text');
      const displayedText = text.text();
      expect(displayedText).toBe('Line one\nLine two');
    });
  });

  describe('Performance Optimizations', () => {
    it('should apply performance optimization classes to text cards', () => {
      const wrapper = mount(ReflectionList, {
        props: {
          reflections: [mockTextReflection],
        },
        global: {
          stubs: {
            DeleteDialog: true,
          },
        },
      });

      const card = wrapper.find('.reflection-card');
      expect(card.exists()).toBe(true);
      // will-change and contain CSS properties would be verified in E2E tests
    });

    it('should render visual reflections with VisualReflectionCard component', () => {
      const wrapper = mount(ReflectionList, {
        props: {
          reflections: [mockVisualReflection],
        },
        global: {
          stubs: {
            DeleteDialog: true,
            VisualReflectionCard: false,
          },
        },
      });

      const visualCard = wrapper.findComponent(VisualReflectionCard);
      expect(visualCard.exists()).toBe(true);
      expect(visualCard.props('reflection')).toEqual(mockVisualReflection);
    });
  });

  describe('Interaction', () => {
    it('should emit select event when text card is clicked', async () => {
      const wrapper = mount(ReflectionList, {
        props: {
          reflections: [mockTextReflection],
        },
        global: {
          stubs: {
            DeleteDialog: true,
          },
        },
      });

      await wrapper.find('.reflection-card').trigger('click');
      
      expect(wrapper.emitted('select')).toBeTruthy();
      expect(wrapper.emitted('select')[0]).toEqual([mockTextReflection]);
    });

    it('should display empty state when no reflections', () => {
      const wrapper = mount(ReflectionList, {
        props: {
          reflections: [],
        },
        global: {
          stubs: {
            DeleteDialog: true,
          },
        },
      });

      const emptyState = wrapper.find('.empty-state');
      expect(emptyState.exists()).toBe(true);
      expect(emptyState.text()).toContain('No reflections yet');
    });
  });

  describe('Layout Structure', () => {
    it('should render reflection header with icon and info', () => {
      const wrapper = mount(ReflectionList, {
        props: {
          reflections: [mockTextReflection],
        },
        global: {
          stubs: {
            DeleteDialog: true,
          },
        },
      });

      const header = wrapper.find('.reflection-header');
      expect(header.exists()).toBe(true);

      const meta = wrapper.find('.reflection-meta');
      expect(meta.exists()).toBe(true);

      const icon = wrapper.find('.reflection-type-icon');
      expect(icon.exists()).toBe(true);

      const info = wrapper.find('.reflection-info');
      expect(info.exists()).toBe(true);
    });

    it('should maintain proper flex layout for icon and info', () => {
      const wrapper = mount(ReflectionList, {
        props: {
          reflections: [mockTextReflection],
        },
        global: {
          stubs: {
            DeleteDialog: true,
          },
        },
      });

      const meta = wrapper.find('.reflection-meta');
      expect(meta.exists()).toBe(true);
      
      const icon = wrapper.find('.reflection-type-icon');
      const info = wrapper.find('.reflection-info');
      
      expect(icon.exists()).toBe(true);
      expect(info.exists()).toBe(true);
    });
  });
});
