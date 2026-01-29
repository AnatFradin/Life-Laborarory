import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import { mount } from '@vue/test-utils';
import TemplateSelector from '../../src/components/TemplateSelector.vue';
import { useTemplates } from '../../src/composables/useTemplates';

vi.mock('../../src/composables/useTemplates', () => ({
  useTemplates: vi.fn(),
}));

describe('TemplateSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders templates and emits selection', async () => {
    const templates = ref([
      { id: 'daily', name: 'Daily Reflection' },
      { id: 'weekly', name: 'Weekly Review' },
    ]);

    useTemplates.mockReturnValue({
      templates,
      loading: ref(false),
      error: ref(null),
    });

    const wrapper = mount(TemplateSelector);
    const select = wrapper.find('select');

    await select.setValue('daily');
    await select.trigger('change');

    const emitted = wrapper.emitted('template-selected');
    expect(emitted).toBeTruthy();
    expect(emitted[0][0]).toEqual({ id: 'daily', name: 'Daily Reflection' });
  });

  it('emits clear when clear button clicked', async () => {
    const templates = ref([{ id: 'daily', name: 'Daily Reflection' }]);

    useTemplates.mockReturnValue({
      templates,
      loading: ref(false),
      error: ref(null),
    });

    const wrapper = mount(TemplateSelector);
    const select = wrapper.find('select');

    await select.setValue('daily');
    await select.trigger('change');

    const clearButton = wrapper.find('.clear-template-btn');
    expect(clearButton.exists()).toBe(true);

    await clearButton.trigger('click');

    const emitted = wrapper.emitted('template-cleared');
    expect(emitted).toBeTruthy();
  });

  it('disables select when no templates', () => {
    useTemplates.mockReturnValue({
      templates: ref([]),
      loading: ref(false),
      error: ref(null),
    });

    const wrapper = mount(TemplateSelector);
    const select = wrapper.find('select');

    expect(select.attributes('disabled')).toBeDefined();
  });
});
