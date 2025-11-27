/**
 * Tests for Markdown parsing and sanitization utilities
 * 
 * Covers:
 * - Basic Markdown syntax (headings, bold, italic, lists, links, blockquotes, code)
 * - XSS security (malicious script tags)
 * - Edge cases (invalid syntax, empty input, large documents)
 * - Performance (rendering time)
 */

import { describe, it, expect } from 'vitest'
import { parseMarkdown, hasMarkdownSyntax, stripMarkdown } from '@/utils/markdown'

describe('markdown.js', () => {
  describe('parseMarkdown', () => {
    describe('Basic Markdown syntax', () => {
      it('parses headings (h1-h6)', () => {
        expect(parseMarkdown('# Heading 1')).toContain('<h1>Heading 1</h1>')
        expect(parseMarkdown('## Heading 2')).toContain('<h2>Heading 2</h2>')
        expect(parseMarkdown('### Heading 3')).toContain('<h3>Heading 3</h3>')
        expect(parseMarkdown('#### Heading 4')).toContain('<h4>Heading 4</h4>')
        expect(parseMarkdown('##### Heading 5')).toContain('<h5>Heading 5</h5>')
        expect(parseMarkdown('###### Heading 6')).toContain('<h6>Heading 6</h6>')
      })

      it('parses bold text (**text**)', () => {
        const result = parseMarkdown('This is **bold text**')
        expect(result).toContain('<strong>bold text</strong>')
      })

      it('parses italic text (*text*)', () => {
        const result = parseMarkdown('This is *italic text*')
        expect(result).toContain('<em>italic text</em>')
      })

      it('parses bold with alternative syntax (__text__)', () => {
        const result = parseMarkdown('This is __bold text__')
        expect(result).toContain('<strong>bold text</strong>')
      })

      it('parses italic with alternative syntax (_text_)', () => {
        const result = parseMarkdown('This is _italic text_')
        expect(result).toContain('<em>italic text</em>')
      })

      it('parses unordered lists', () => {
        const markdown = '- Item 1\n- Item 2\n- Item 3'
        const result = parseMarkdown(markdown)
        expect(result).toContain('<ul>')
        expect(result).toContain('<li>Item 1</li>')
        expect(result).toContain('<li>Item 2</li>')
        expect(result).toContain('<li>Item 3</li>')
        expect(result).toContain('</ul>')
      })

      it('parses ordered lists', () => {
        const markdown = '1. First\n2. Second\n3. Third'
        const result = parseMarkdown(markdown)
        expect(result).toContain('<ol>')
        expect(result).toContain('<li>First</li>')
        expect(result).toContain('<li>Second</li>')
        expect(result).toContain('<li>Third</li>')
        expect(result).toContain('</ol>')
      })

      it('parses links [text](url)', () => {
        const result = parseMarkdown('[Click here](https://example.com)')
        expect(result).toContain('<a href="https://example.com">Click here</a>')
      })

      it('parses blockquotes', () => {
        const result = parseMarkdown('> This is a quote')
        expect(result).toContain('<blockquote>')
        expect(result).toContain('This is a quote')
        expect(result).toContain('</blockquote>')
      })

      it('parses inline code `code`', () => {
        const result = parseMarkdown('This is `inline code`')
        expect(result).toContain('<code>inline code</code>')
      })

      it('parses code blocks', () => {
        const markdown = '```\nconst x = 1\n```'
        const result = parseMarkdown(markdown)
        expect(result).toContain('<pre>')
        expect(result).toContain('<code>')
        expect(result).toContain('const x = 1')
      })
    })

    describe('Combined Markdown', () => {
      it('parses complex Markdown with multiple elements', () => {
        const markdown = `# My Day

Today was **great**! I learned about *Markdown*.

- Morning walk
- Work session
- Evening reflection

> Remember to stay calm.`

        const result = parseMarkdown(markdown)
        expect(result).toContain('<h1>My Day</h1>')
        expect(result).toContain('<strong>great</strong>')
        expect(result).toContain('<em>Markdown</em>')
        expect(result).toContain('<ul>')
        expect(result).toContain('<li>Morning walk</li>')
        expect(result).toContain('<blockquote>')
      })
    })

    describe('XSS Security', () => {
      it('removes script tags', () => {
        const malicious = '<script>alert("XSS")</script>'
        const result = parseMarkdown(malicious)
        expect(result).not.toContain('<script>')
        expect(result).not.toContain('alert')
      })

      it('removes onclick attributes', () => {
        const malicious = '<a onclick="alert(\'XSS\')">Click</a>'
        const result = parseMarkdown(malicious)
        expect(result).not.toContain('onclick')
      })

      it('removes iframe tags', () => {
        const malicious = '<iframe src="evil.com"></iframe>'
        const result = parseMarkdown(malicious)
        expect(result).not.toContain('<iframe>')
      })

      it('removes object tags', () => {
        const malicious = '<object data="evil.swf"></object>'
        const result = parseMarkdown(malicious)
        expect(result).not.toContain('<object>')
      })

      it('allows safe href in links', () => {
        const safe = '[Link](https://example.com)'
        const result = parseMarkdown(safe)
        expect(result).toContain('href="https://example.com"')
      })

      it('removes javascript: protocol in links', () => {
        const malicious = '[Evil](javascript:alert("XSS"))'
        const result = parseMarkdown(malicious)
        expect(result).not.toContain('javascript:')
      })
    })

    describe('Edge Cases', () => {
      it('handles empty string', () => {
        expect(parseMarkdown('')).toBe('')
      })

      it('handles null input', () => {
        expect(parseMarkdown(null)).toBe('')
      })

      it('handles undefined input', () => {
        expect(parseMarkdown(undefined)).toBe('')
      })

      it('handles plain text without Markdown', () => {
        const plain = 'Just plain text'
        const result = parseMarkdown(plain)
        expect(result).toContain('Just plain text')
      })

      it('handles unclosed bold markers gracefully', () => {
        const invalid = '**unclosed bold'
        const result = parseMarkdown(invalid)
        // Should render something (not crash)
        expect(result).toBeTruthy()
        // marked.js typically keeps the markers visible
        expect(result).toContain('unclosed bold')
      })

      it('handles unclosed italic markers gracefully', () => {
        const invalid = '*unclosed italic'
        const result = parseMarkdown(invalid)
        expect(result).toBeTruthy()
        expect(result).toContain('unclosed italic')
      })

      it('handles broken link syntax', () => {
        const broken = '[text without closing](url'
        const result = parseMarkdown(broken)
        expect(result).toBeTruthy()
        // Should handle gracefully without crashing
      })

      it('handles very long text (10,000 words)', () => {
        // Generate ~10K word document
        const longText = Array(10000).fill('word').join(' ')
        const markdown = `# Long Document\n\n${longText}`
        
        const startTime = performance.now()
        const result = parseMarkdown(markdown)
        const endTime = performance.now()
        const duration = endTime - startTime
        
        expect(result).toBeTruthy()
        expect(result).toContain('<h1>Long Document</h1>')
        // Should parse within reasonable time (< 1 second for 10K words)
        expect(duration).toBeLessThan(1000)
      })

      it('handles multiple consecutive newlines', () => {
        const markdown = 'Line 1\n\n\n\nLine 2'
        const result = parseMarkdown(markdown)
        expect(result).toBeTruthy()
        expect(result).toContain('Line 1')
        expect(result).toContain('Line 2')
      })
    })

    describe('Performance', () => {
      it('parses typical reflection (500 words) in under 200ms', () => {
        // Generate typical 500-word reflection
        const words = Array(500).fill('word').join(' ')
        const markdown = `# Today's Reflection\n\n${words}\n\n## Learnings\n\n- **Point 1**\n- *Point 2*`
        
        const startTime = performance.now()
        parseMarkdown(markdown)
        const endTime = performance.now()
        const duration = endTime - startTime
        
        // Should meet SC-001 requirement (< 200ms preview update)
        // Note: This is single parse, debouncing will add 200ms delay
        expect(duration).toBeLessThan(200)
      })
    })
  })

  describe('hasMarkdownSyntax', () => {
    it('detects heading syntax', () => {
      expect(hasMarkdownSyntax('# Heading')).toBe(true)
      expect(hasMarkdownSyntax('## Heading')).toBe(true)
    })

    it('detects bold syntax', () => {
      expect(hasMarkdownSyntax('**bold**')).toBe(true)
      expect(hasMarkdownSyntax('__bold__')).toBe(true)
    })

    it('detects italic syntax', () => {
      expect(hasMarkdownSyntax('*italic*')).toBe(true)
      expect(hasMarkdownSyntax('_italic_')).toBe(true)
    })

    it('detects list syntax', () => {
      expect(hasMarkdownSyntax('- List item')).toBe(true)
      expect(hasMarkdownSyntax('* List item')).toBe(true)
      expect(hasMarkdownSyntax('1. Ordered item')).toBe(true)
    })

    it('detects link syntax', () => {
      expect(hasMarkdownSyntax('[text](url)')).toBe(true)
    })

    it('detects blockquote syntax', () => {
      expect(hasMarkdownSyntax('> Quote')).toBe(true)
    })

    it('detects inline code syntax', () => {
      expect(hasMarkdownSyntax('`code`')).toBe(true)
    })

    it('returns false for plain text', () => {
      expect(hasMarkdownSyntax('Just plain text')).toBe(false)
    })

    it('handles empty string', () => {
      expect(hasMarkdownSyntax('')).toBe(false)
    })

    it('handles null/undefined', () => {
      expect(hasMarkdownSyntax(null)).toBe(false)
      expect(hasMarkdownSyntax(undefined)).toBe(false)
    })
  })

  describe('stripMarkdown', () => {
    it('strips heading syntax', () => {
      expect(stripMarkdown('# Heading')).toBe('Heading')
    })

    it('strips bold syntax', () => {
      expect(stripMarkdown('**bold text**')).toBe('bold text')
    })

    it('strips italic syntax', () => {
      expect(stripMarkdown('*italic text*')).toBe('italic text')
    })

    it('strips list syntax', () => {
      const markdown = '- Item 1\n- Item 2'
      const result = stripMarkdown(markdown)
      expect(result).toContain('Item 1')
      expect(result).toContain('Item 2')
      expect(result).not.toContain('-')
    })

    it('strips link syntax, keeps text', () => {
      const result = stripMarkdown('[Click here](https://example.com)')
      expect(result).toBe('Click here')
    })

    it('strips blockquote syntax', () => {
      const result = stripMarkdown('> Quote')
      expect(result).toBe('Quote')
    })

    it('preserves text content', () => {
      const markdown = `# My Day

Today was **great**! I learned about *Markdown*.`
      
      const result = stripMarkdown(markdown)
      expect(result).toContain('My Day')
      expect(result).toContain('Today was great')
      expect(result).toContain('Markdown')
      expect(result).not.toContain('#')
      expect(result).not.toContain('**')
      expect(result).not.toContain('*')
    })

    it('handles empty string', () => {
      expect(stripMarkdown('')).toBe('')
    })

    it('handles null/undefined', () => {
      expect(stripMarkdown(null)).toBe('')
      expect(stripMarkdown(undefined)).toBe('')
    })
  })
})
