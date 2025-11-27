/**
 * Tests for MarkdownPreview component
 * 
 * Tests the preview rendering functionality:
 * - Markdown to HTML conversion
 * - Debounced updates (200ms)
 * - XSS sanitization
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import MarkdownPreview from '@/components/MarkdownPreview.vue'

describe('MarkdownPreview.vue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders Markdown to HTML correctly', async () => {
    const wrapper = mount(MarkdownPreview, {
      props: {
        content: '# Hello\n\n**Bold text**'
      }
    })

    // Wait for debounce
    vi.advanceTimersByTime(200)
    await nextTick()

    const html = wrapper.html()
    expect(html).toContain('<h1>Hello</h1>')
    expect(html).toContain('<strong>Bold text</strong>')
  })

  it('updates preview with debounce (200ms)', async () => {
    const wrapper = mount(MarkdownPreview, {
      props: {
        content: 'Initial content'
      }
    })

    // Initial render (after debounce)
    vi.advanceTimersByTime(200)
    await nextTick()
    expect(wrapper.html()).toContain('Initial content')

    // Update content
    await wrapper.setProps({ content: '# Updated' })
    
    // Should NOT update immediately
    await nextTick()
    expect(wrapper.html()).not.toContain('<h1>Updated</h1>')

    // Should update after 200ms
    vi.advanceTimersByTime(200)
    await nextTick()
    expect(wrapper.html()).toContain('<h1>Updated</h1>')
  })

  it('sanitizes output (no XSS)', async () => {
    const malicious = '<script>alert("XSS")</script>'
    const wrapper = mount(MarkdownPreview, {
      props: {
        content: malicious
      }
    })

    vi.advanceTimersByTime(200)
    await nextTick()

    const html = wrapper.html()
    expect(html).not.toContain('<script>')
    expect(html).not.toContain('alert')
  })

  it('handles empty content gracefully', async () => {
    const wrapper = mount(MarkdownPreview, {
      props: {
        content: ''
      }
    })

    vi.advanceTimersByTime(200)
    await nextTick()

    expect(wrapper.exists()).toBe(true)
    // Should render but be empty or have placeholder
  })

  it('handles rapid content changes with debounce', async () => {
    const wrapper = mount(MarkdownPreview, {
      props: {
        content: 'Content 1'
      }
    })

    // Rapid changes
    await wrapper.setProps({ content: 'Content 2' })
    vi.advanceTimersByTime(50)
    
    await wrapper.setProps({ content: 'Content 3' })
    vi.advanceTimersByTime(50)
    
    await wrapper.setProps({ content: 'Content 4' })
    vi.advanceTimersByTime(50)

    // Only the last content should render after full debounce
    vi.advanceTimersByTime(200)
    await nextTick()
    
    expect(wrapper.html()).toContain('Content 4')
  })

  it('renders complex Markdown correctly', async () => {
    const complexMarkdown = `# Heading 1

## Heading 2

This is **bold** and this is *italic*.

- List item 1
- List item 2

1. Ordered item
2. Another item

> A blockquote

[Link](https://example.com)

\`inline code\``

    const wrapper = mount(MarkdownPreview, {
      props: {
        content: complexMarkdown
      }
    })

    vi.advanceTimersByTime(200)
    await nextTick()

    const html = wrapper.html()
    expect(html).toContain('<h1>Heading 1</h1>')
    expect(html).toContain('<h2>Heading 2</h2>')
    expect(html).toContain('<strong>bold</strong>')
    expect(html).toContain('<em>italic</em>')
    expect(html).toContain('<ul>')
    expect(html).toContain('<ol>')
    expect(html).toContain('<blockquote>')
    expect(html).toContain('<a href="https://example.com">Link</a>')
    expect(html).toContain('<code>inline code</code>')
  })
})
