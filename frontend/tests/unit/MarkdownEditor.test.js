/**
 * Tests for MarkdownEditor component
 * 
 * Tests the main editor component:
 * - Mode switching (edit/preview)
 * - Textarea display in edit mode
 * - Preview display in preview mode
 * - Keyboard shortcuts
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import MarkdownEditor from '@/components/MarkdownEditor.vue'

describe('MarkdownEditor.vue', () => {
  it('displays textarea in edit mode', () => {
    const wrapper = mount(MarkdownEditor, {
      props: {
        modelValue: '# Test content'
      }
    })

    // Should have textarea in edit mode
    const textarea = wrapper.find('textarea')
    expect(textarea.exists()).toBe(true)
    expect(textarea.element.value).toBe('# Test content')
  })

  it('displays preview in preview mode', async () => {
    const wrapper = mount(MarkdownEditor, {
      props: {
        modelValue: '# Test content'
      }
    })

    // Find and click toggle button
    const toggleButton = wrapper.find('[data-test="mode-toggle"]')
    await toggleButton.trigger('click')
    await nextTick()

    // Should show preview, not textarea
    expect(wrapper.find('textarea').exists()).toBe(false)
    
    // Should have preview component or element
    const preview = wrapper.find('[data-test="markdown-preview"]')
    expect(preview.exists()).toBe(true)
  })

  it('toggle button switches modes', async () => {
    const wrapper = mount(MarkdownEditor, {
      props: {
        modelValue: 'Content'
      }
    })

    const toggleButton = wrapper.find('[data-test="mode-toggle"]')
    
    // Initial: edit mode
    expect(wrapper.find('textarea').exists()).toBe(true)
    
    // Click to preview
    await toggleButton.trigger('click')
    await nextTick()
    expect(wrapper.find('textarea').exists()).toBe(false)
    expect(wrapper.find('[data-test="markdown-preview"]').exists()).toBe(true)
    
    // Click back to edit
    await toggleButton.trigger('click')
    await nextTick()
    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  it('keyboard shortcut (Cmd+P) toggles mode', async () => {
    const wrapper = mount(MarkdownEditor, {
      props: {
        modelValue: 'Content'
      },
      attachTo: document.body // Need for keyboard events
    })

    // Initial: edit mode
    expect(wrapper.find('textarea').exists()).toBe(true)

    // Trigger Cmd+P (metaKey for Mac)
    await wrapper.trigger('keydown', {
      key: 'p',
      metaKey: true,
      preventDefault: () => {}
    })
    await nextTick()

    // Should toggle to preview
    expect(wrapper.find('[data-test="markdown-preview"]').exists()).toBe(true)

    // Trigger again
    await wrapper.trigger('keydown', {
      key: 'p',
      metaKey: true,
      preventDefault: () => {}
    })
    await nextTick()

    // Should toggle back to edit
    expect(wrapper.find('textarea').exists()).toBe(true)

    wrapper.unmount()
  })

  it('keyboard shortcut (Ctrl+P) toggles mode on Windows/Linux', async () => {
    const wrapper = mount(MarkdownEditor, {
      props: {
        modelValue: 'Content'
      },
      attachTo: document.body
    })

    // Initial: edit mode
    expect(wrapper.find('textarea').exists()).toBe(true)

    // Trigger Ctrl+P (ctrlKey for Windows/Linux)
    await wrapper.trigger('keydown', {
      key: 'p',
      ctrlKey: true,
      preventDefault: () => {}
    })
    await nextTick()

    // Should toggle to preview
    expect(wrapper.find('[data-test="markdown-preview"]').exists()).toBe(true)

    wrapper.unmount()
  })

  it('emits update:modelValue when content changes', async () => {
    const wrapper = mount(MarkdownEditor, {
      props: {
        modelValue: 'Initial'
      }
    })

    const textarea = wrapper.find('textarea')
    await textarea.setValue('Updated content')

    // Should emit update event
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['Updated content'])
  })

  it('preserves content when switching modes', async () => {
    const wrapper = mount(MarkdownEditor, {
      props: {
        modelValue: '# My Content'
      }
    })

    // Get initial textarea value
    const textarea = wrapper.find('textarea')
    expect(textarea.element.value).toBe('# My Content')

    // Switch to preview
    const toggleButton = wrapper.find('[data-test="mode-toggle"]')
    await toggleButton.trigger('click')
    await nextTick()

    // Switch back to edit
    await toggleButton.trigger('click')
    await nextTick()

    // Content should be preserved
    const textareaAfter = wrapper.find('textarea')
    expect(textareaAfter.element.value).toBe('# My Content')
  })

  it('toggle button shows correct label for current mode', async () => {
    const wrapper = mount(MarkdownEditor, {
      props: {
        modelValue: 'Content'
      }
    })

    const toggleButton = wrapper.find('[data-test="mode-toggle"]')
    
    // In edit mode, button should say "Preview" (to switch to preview)
    expect(toggleButton.text()).toContain('Preview')
    
    // Click to preview mode
    await toggleButton.trigger('click')
    await nextTick()
    
    // In preview mode, button should say "Edit" (to switch to edit)
    expect(toggleButton.text()).toContain('Edit')
  })

  it('has accessible labels for screen readers', () => {
    const wrapper = mount(MarkdownEditor, {
      props: {
        modelValue: 'Content'
      }
    })

    const textarea = wrapper.find('textarea')
    expect(textarea.attributes('aria-label')).toBeTruthy()

    const toggleButton = wrapper.find('[data-test="mode-toggle"]')
    expect(toggleButton.attributes('aria-label')).toBeTruthy()
  })
})
