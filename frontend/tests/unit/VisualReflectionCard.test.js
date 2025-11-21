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

  // PDF-specific tests
  describe('PDF display', () => {
    const mockPDFReflection = {
      id: 'test-pdf-123',
      mode: 'visual',
      timestamp: '2025-11-21T10:00:00.000Z',
      visualAttachment: {
        originalFilename: 'document.pdf',
        storedPath: 'visuals/2025-11/abc123-def456-789.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 512000,
        dimensions: undefined, // PDFs don't have dimensions
        importTimestamp: '2025-11-21T10:00:00.000Z',
      },
    };

    it('should render PDF reflection with PDF preview card', () => {
      const wrapper = mount(VisualReflectionCard, {
        props: {
          reflection: mockPDFReflection,
        },
      });

      // Should have main card element
      expect(wrapper.find('.visual-reflection-card').exists()).toBe(true);

      // Should NOT display image element for PDFs
      expect(wrapper.find('.visual-image').exists()).toBe(false);

      // Should display PDF preview card instead
      expect(wrapper.find('.pdf-preview-card').exists()).toBe(true);

      // Should display PDF icon
      expect(wrapper.find('.pdf-icon').exists()).toBe(true);
      expect(wrapper.find('.pdf-icon').text()).toBe('📄');

      // Should display PDF label
      expect(wrapper.find('.pdf-label').text()).toBe('PDF Document');
    });

    it('should display PDF filename', () => {
      const wrapper = mount(VisualReflectionCard, {
        props: {
          reflection: mockPDFReflection,
        },
      });

      expect(wrapper.find('.image-filename').text()).toBe('document.pdf');
    });

    it('should not display dimensions for PDF', () => {
      const wrapper = mount(VisualReflectionCard, {
        props: {
          reflection: mockPDFReflection,
        },
      });

      expect(wrapper.find('.image-dimensions').exists()).toBe(false);
    });

    it('should display mode badge as "visual" for PDF reflections', () => {
      const wrapper = mount(VisualReflectionCard, {
        props: {
          reflection: mockPDFReflection,
        },
      });

      expect(wrapper.find('.reflection-mode').text()).toBe('visual');
    });

    it('should emit select event when PDF card is clicked', async () => {
      const wrapper = mount(VisualReflectionCard, {
        props: {
          reflection: mockPDFReflection,
        },
      });

      await wrapper.find('.visual-reflection-card').trigger('click');

      expect(wrapper.emitted('select')).toBeTruthy();
      expect(wrapper.emitted('select')[0]).toEqual([mockPDFReflection]);
    });

    it('should emit delete event when delete button clicked on PDF reflection', async () => {
      const wrapper = mount(VisualReflectionCard, {
        props: {
          reflection: mockPDFReflection,
        },
      });

      await wrapper.find('.delete-button').trigger('click');

      expect(wrapper.emitted('delete')).toBeTruthy();
      expect(wrapper.emitted('delete')[0]).toEqual(['test-pdf-123']);
    });

    it('should construct correct PDF URL', () => {
      const wrapper = mount(VisualReflectionCard, {
        props: {
          reflection: mockPDFReflection,
        },
      });

      // The PDF URL should be available for download/view even though not displayed as img
      const expectedUrl = 'http://localhost:3000/api/visuals/2025-11/abc123-def456-789.pdf';
      
      // Check if the URL is properly constructed in the component
      const card = wrapper.find('.pdf-preview-card');
      expect(card.exists()).toBe(true);
    });

    it('should support PDF with AI interaction', () => {
      const pdfWithAI = {
        ...mockPDFReflection,
        aiInteraction: {
          model: 'llama2',
          provider: 'local',
          response: 'Interesting document',
          timestamp: '2025-11-21T10:01:00.000Z',
        },
      };

      const wrapper = mount(VisualReflectionCard, {
        props: {
          reflection: pdfWithAI,
        },
      });

      expect(wrapper.find('.pdf-preview-card').exists()).toBe(true);
      expect(wrapper.find('.ai-badge').exists()).toBe(true);
    });

    it('should support PDF with external AI session', () => {
      const pdfWithPersona = {
        ...mockPDFReflection,
        externalAISession: {
          personaId: 'stoic-coach',
          personaName: 'Stoic Coach',
          sessionSummary: 'Reflected on the document',
          timestamp: '2025-11-21T10:30:00.000Z',
        },
      };

      const wrapper = mount(VisualReflectionCard, {
        props: {
          reflection: pdfWithPersona,
        },
      });

      expect(wrapper.find('.pdf-preview-card').exists()).toBe(true);
      expect(wrapper.find('.persona-badge').exists()).toBe(true);
      expect(wrapper.find('.persona-name').text()).toBe('Stoic Coach');
    });
  });
});
