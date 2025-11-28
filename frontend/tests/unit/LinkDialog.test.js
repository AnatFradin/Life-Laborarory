/**
 * Tests for LinkDialog component
 * 
 * Tests modal dialog for inserting links:
 * - Opening with pre-filled text
 * - URL input and validation
 * - Keyboard shortcuts (Escape, Enter)
 */

import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import LinkDialog from '@/components/LinkDialog.vue'

describe('LinkDialog.vue', () => {
  let wrapper

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
      wrapper = null
    }
  })

  it('opens with selected text pre-filled', async () => {
    wrapper = mount(LinkDialog, {
      props: {
        isOpen: true,
        selectedText: 'Example Link'
      },
      attachTo: document.body
    })

    await nextTick()
    await nextTick() // Extra tick for watch to complete

    const textInput = document.querySelector('input[data-test="link-text"]')
    expect(textInput.value).toBe('Example Link')
  })

  it('focuses URL input on open', async () => {
    wrapper = mount(LinkDialog, {
      props: {
        isOpen: true,
        selectedText: 'Example'
      },
      attachTo: document.body
    })

    await nextTick()
    await nextTick() // Extra tick for focus

    const urlInput = document.querySelector('input[data-test="link-url"]')
    expect(document.activeElement).toBe(urlInput)
  })

  it('inserts [text](url) on confirm', async () => {
    wrapper = mount(LinkDialog, {
      props: {
        isOpen: true,
        selectedText: 'Example'
      },
      attachTo: document.body
    })

    await nextTick()
    await nextTick()

    const textInput = document.querySelector('input[data-test="link-text"]')
    const urlInput = document.querySelector('input[data-test="link-url"]')
    
    // Set values and trigger input events to update v-model
    textInput.value = 'Example'
    textInput.dispatchEvent(new Event('input'))
    
    urlInput.value = 'https://example.com'
    urlInput.dispatchEvent(new Event('input'))
    
    await nextTick()

    const confirmButton = document.querySelector('[data-test="confirm-button"]')
    confirmButton.click()
    await nextTick()

    expect(wrapper.emitted('confirm')).toBeTruthy()
    expect(wrapper.emitted('confirm')[0]).toEqual([{
      text: 'Example',
      url: 'https://example.com'
    }])
  })

  it('closes on Escape key', async () => {
    wrapper = mount(LinkDialog, {
      props: {
        isOpen: true,
        selectedText: 'Example'
      },
      attachTo: document.body
    })

    await nextTick()

    const dialog = document.querySelector('.link-dialog-overlay')
    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    dialog.dispatchEvent(event)
    await nextTick()

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('closes on cancel button', async () => {
    wrapper = mount(LinkDialog, {
      props: {
        isOpen: true,
        selectedText: 'Example'
      },
      attachTo: document.body
    })

    await nextTick()

    const cancelButton = document.querySelector('[data-test="cancel-button"]')
    cancelButton.click()
    await nextTick()

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('validates URL format', async () => {
    wrapper = mount(LinkDialog, {
      props: {
        isOpen: true,
        selectedText: 'Example'
      },
      attachTo: document.body
    })

    await nextTick()

    const urlInput = document.querySelector('input[data-test="link-url"]')
    urlInput.value = 'invalid-url'
    urlInput.dispatchEvent(new Event('input'))

    const confirmButton = document.querySelector('[data-test="confirm-button"]')
    confirmButton.click()
    await nextTick()

    // Should show validation error
    const errorMessage = document.querySelector('[data-test="error-message"]')
    expect(errorMessage).toBeTruthy()
    expect(wrapper.emitted('confirm')).toBeFalsy()
  })

  it('accepts valid URLs', async () => {
    wrapper = mount(LinkDialog, {
      props: {
        isOpen: true,
        selectedText: 'Example'
      },
      attachTo: document.body
    })

    await nextTick()

    const validUrls = [
      'https://example.com',
      'http://example.com',
      'https://example.com/path',
      'https://example.com/path?query=value'
    ]

    for (const url of validUrls) {
      const urlInput = document.querySelector('input[data-test="link-url"]')
      urlInput.value = url
      urlInput.dispatchEvent(new Event('input'))
      
      const confirmButton = document.querySelector('[data-test="confirm-button"]')
      confirmButton.click()
      await nextTick()
      
      expect(wrapper.emitted('confirm')).toBeTruthy()
    }
  })

  it('confirms on Enter key in URL input', async () => {
    wrapper = mount(LinkDialog, {
      props: {
        isOpen: true,
        selectedText: 'Example'
      },
      attachTo: document.body
    })

    await nextTick()

    const urlInput = document.querySelector('input[data-test="link-url"]')
    urlInput.value = 'https://example.com'
    urlInput.dispatchEvent(new Event('input'))

    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    urlInput.dispatchEvent(event)
    await nextTick()

    expect(wrapper.emitted('confirm')).toBeTruthy()
  })

  it('renders nothing when closed', async () => {
    wrapper = mount(LinkDialog, {
      props: {
        isOpen: false,
        selectedText: 'Example'
      },
      attachTo: document.body
    })

    await nextTick()

    const dialog = document.querySelector('[data-test="link-dialog"]')
    expect(dialog).toBeFalsy()
  })

  it('resets form on close', async () => {
    wrapper = mount(LinkDialog, {
      props: {
        isOpen: true,
        selectedText: 'Example'
      },
      attachTo: document.body
    })

    await nextTick()

    const urlInput = document.querySelector('input[data-test="link-url"]')
    urlInput.value = 'https://example.com'
    urlInput.dispatchEvent(new Event('input'))

    await wrapper.setProps({ isOpen: false })
    await nextTick()
    await wrapper.setProps({ isOpen: true })
    await nextTick()

    // URL should be cleared on reopen
    const urlInputAfter = document.querySelector('input[data-test="link-url"]')
    expect(urlInputAfter.value).toBe('')
  })
})
