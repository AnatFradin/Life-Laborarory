import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import PersonaCard from '../../src/components/PersonaCard.vue';

describe('PersonaCard Component', () => {
  const mockPersona = {
    id: 'stoic-coach',
    name: 'Stoic Coach',
    style: 'Stoic Philosophy',
    description: 'Marcus Aurelius-inspired guidance focusing on control and acceptance',
    icon: '🏛️',
    color: '#4A5568',
    tags: ['philosophy', 'resilience'],
  };

  describe('Rendering', () => {
    it('should render persona information correctly', () => {
      const wrapper = mount(PersonaCard, {
        props: {
          persona: mockPersona,
        },
      });

      expect(wrapper.text()).toContain('Stoic Coach');
      expect(wrapper.text()).toContain('Stoic Philosophy');
      expect(wrapper.text()).toContain('Marcus Aurelius-inspired guidance');
      expect(wrapper.text()).toContain('🏛️');
    });

    it('should apply color styling', () => {
      const wrapper = mount(PersonaCard, {
        props: {
          persona: mockPersona,
        },
      });

      const card = wrapper.find('[data-testid="persona-card"]');
      expect(card.exists()).toBe(true);
    });

    it('should render tags if provided', () => {
      const wrapper = mount(PersonaCard, {
        props: {
          persona: mockPersona,
        },
      });

      expect(wrapper.text()).toContain('philosophy');
      expect(wrapper.text()).toContain('resilience');
    });

    it('should render without tags', () => {
      const personaNoTags = { ...mockPersona, tags: [] };
      const wrapper = mount(PersonaCard, {
        props: {
          persona: personaNoTags,
        },
      });

      expect(wrapper.find('[data-testid="persona-tags"]').exists()).toBe(false);
    });
  });

  describe('Selection State', () => {
    it('should show selected state', () => {
      const wrapper = mount(PersonaCard, {
        props: {
          persona: mockPersona,
          selected: true,
        },
      });

      const card = wrapper.find('[data-testid="persona-card"]');
      expect(card.classes()).toContain('persona-card--selected');
    });

    it('should not show selected state by default', () => {
      const wrapper = mount(PersonaCard, {
        props: {
          persona: mockPersona,
        },
      });

      const card = wrapper.find('[data-testid="persona-card"]');
      expect(card.classes()).not.toContain('selected');
    });
  });

  describe('Events', () => {
    it('should emit select event on click', async () => {
      const wrapper = mount(PersonaCard, {
        props: {
          persona: mockPersona,
        },
      });

      await wrapper.trigger('click');

      expect(wrapper.emitted('select')).toBeTruthy();
      expect(wrapper.emitted('select')[0]).toEqual([mockPersona.id]);
    });

    it('should emit view-prompt event when View Prompt button clicked', async () => {
      const wrapper = mount(PersonaCard, {
        props: {
          persona: mockPersona,
        },
      });

      const viewPromptButton = wrapper.find('[data-testid="view-prompt-button"]');
      await viewPromptButton.trigger('click');

      expect(wrapper.emitted('view-prompt')).toBeTruthy();
      expect(wrapper.emitted('view-prompt')[0]).toEqual([mockPersona]);
    });

    it('should prevent card selection when View Prompt button clicked', async () => {
      const wrapper = mount(PersonaCard, {
        props: {
          persona: mockPersona,
        },
      });

      const viewPromptButton = wrapper.find('[data-testid="view-prompt-button"]');
      await viewPromptButton.trigger('click');

      expect(wrapper.emitted('select')).toBeFalsy();
      expect(wrapper.emitted('view-prompt')).toBeTruthy();
    });
  });

  describe('Keyboard Accessibility', () => {
    it('should emit select on Enter key', async () => {
      const wrapper = mount(PersonaCard, {
        props: {
          persona: mockPersona,
        },
      });

      await wrapper.trigger('keydown.enter');

      expect(wrapper.emitted('select')).toBeTruthy();
      expect(wrapper.emitted('select')[0]).toEqual([mockPersona.id]);
    });

    it('should emit select on Space key', async () => {
      const wrapper = mount(PersonaCard, {
        props: {
          persona: mockPersona,
        },
      });

      await wrapper.trigger('keydown.space');

      expect(wrapper.emitted('select')).toBeTruthy();
      expect(wrapper.emitted('select')[0]).toEqual([mockPersona.id]);
    });

    it('should have proper tabindex', () => {
      const wrapper = mount(PersonaCard, {
        props: {
          persona: mockPersona,
        },
      });

      expect(wrapper.attributes('tabindex')).toBe('0');
    });

    it('should have proper role attribute', () => {
      const wrapper = mount(PersonaCard, {
        props: {
          persona: mockPersona,
        },
      });

      expect(wrapper.attributes('role')).toBe('button');
    });
  });

  describe('Accessibility - ARIA', () => {
    it('should have proper aria-label', () => {
      const wrapper = mount(PersonaCard, {
        props: {
          persona: mockPersona,
          selected: false,
        },
      });

      const ariaLabel = wrapper.attributes('aria-label');
      expect(ariaLabel).toContain('Stoic Coach');
      expect(ariaLabel).toContain('Stoic Philosophy');
    });

    it('should indicate selected state in aria-label', () => {
      const wrapper = mount(PersonaCard, {
        props: {
          persona: mockPersona,
          selected: true,
        },
      });

      const ariaLabel = wrapper.attributes('aria-label');
      expect(ariaLabel).toContain('selected');
    });

    it('should have aria-pressed attribute', () => {
      const wrapperSelected = mount(PersonaCard, {
        props: {
          persona: mockPersona,
          selected: true,
        },
      });

      expect(wrapperSelected.attributes('aria-pressed')).toBe('true');

      const wrapperNotSelected = mount(PersonaCard, {
        props: {
          persona: mockPersona,
          selected: false,
        },
      });

      expect(wrapperNotSelected.attributes('aria-pressed')).toBe('false');
    });
  });

  describe('Props Validation', () => {
    it('should require persona prop', () => {
      expect(() => {
        mount(PersonaCard, {
          props: {},
        });
      }).toThrow();
    });

    it('should accept optional selected prop', () => {
      const wrapper = mount(PersonaCard, {
        props: {
          persona: mockPersona,
        },
      });

      expect(wrapper.props('selected')).toBe(false);
    });
  });

  describe('Focus Management', () => {
    it('should be focusable', () => {
      const wrapper = mount(PersonaCard, {
        props: {
          persona: mockPersona,
        },
        attachTo: document.body,
      });

      const element = wrapper.element;
      element.focus();

      expect(document.activeElement).toBe(element);

      wrapper.unmount();
    });
  });
});
