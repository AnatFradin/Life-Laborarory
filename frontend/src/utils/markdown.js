/**
 * Markdown parsing and sanitization utilities
 * 
 * Uses marked.js for Markdown parsing and DOMPurify for XSS protection.
 * Implements multi-layer security as defined in research.md.
 */

import { marked } from 'marked'
import DOMPurify from 'dompurify'

/**
 * Configure marked.js with sanitization options
 */
marked.setOptions({
  breaks: true, // Convert \n to <br>
  gfm: true, // GitHub Flavored Markdown
  headerIds: false, // No auto-generated IDs (security)
  mangle: false, // Don't escape email addresses
})

/**
 * DOMPurify configuration - allow only safe tags
 * Based on research.md section 6: Security Best Practices
 */
const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p',
  'a',
  'ul', 'ol', 'li',
  'strong', 'em',
  'code', 'pre',
  'blockquote',
  'br',
]

const ALLOWED_ATTR = ['href'] // Only for <a> tags

const DOMPURIFY_CONFIG = {
  ALLOWED_TAGS,
  ALLOWED_ATTR,
  KEEP_CONTENT: true, // Preserve text content even if tag is removed
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  RETURN_DOM_IMPORT: false,
}

/**
 * Parse Markdown text to sanitized HTML
 * 
 * Multi-layer security:
 * 1. marked.js parses Markdown to HTML
 * 2. DOMPurify sanitizes HTML to prevent XSS
 * 
 * @param {string} markdownText - The Markdown content to parse
 * @returns {string} Sanitized HTML safe for rendering
 * 
 * @example
 * parseMarkdown('# Hello\n\n**Bold text**')
 * // Returns: '<h1>Hello</h1>\n<p><strong>Bold text</strong></p>'
 * 
 * @example
 * parseMarkdown('<script>alert("XSS")</script>')
 * // Returns: '' (malicious content removed)
 */
export function parseMarkdown(markdownText) {
  if (!markdownText || typeof markdownText !== 'string') {
    return ''
  }

  try {
    // Layer 1: Parse Markdown to HTML
    const rawHtml = marked.parse(markdownText)
    
    // Layer 2: Sanitize HTML
    const sanitizedHtml = DOMPurify.sanitize(rawHtml, DOMPURIFY_CONFIG)
    
    return sanitizedHtml
  } catch (error) {
    console.error('Error parsing Markdown:', error)
    // Return empty string on error to avoid showing unparsed content
    return ''
  }
}

/**
 * Check if text contains Markdown syntax
 * Useful for deciding whether to show Markdown editor vs plain text
 * 
 * @param {string} text - Text to check
 * @returns {boolean} True if text appears to contain Markdown
 * 
 * @example
 * hasMarkdownSyntax('# Heading') // true
 * hasMarkdownSyntax('Plain text') // false
 */
export function hasMarkdownSyntax(text) {
  if (!text || typeof text !== 'string') {
    return false
  }

  // Common Markdown patterns
  const markdownPatterns = [
    /^#{1,6}\s/, // Headings
    /\*\*.*\*\*/, // Bold
    /\*.*\*/, // Italic
    /__.*__/, // Bold (alternative)
    /_.*_/, // Italic (alternative)
    /^\s*[-*+]\s/, // Unordered list
    /^\s*\d+\.\s/, // Ordered list
    /\[.*\]\(.*\)/, // Links
    /^>\s/, // Blockquote
    /`.*`/, // Inline code
  ]

  return markdownPatterns.some(pattern => pattern.test(text))
}

/**
 * Strip Markdown syntax and return plain text
 * Useful for AI mirror (analyze text content, not syntax)
 * 
 * @param {string} markdownText - Markdown content
 * @returns {string} Plain text without Markdown syntax
 * 
 * @example
 * stripMarkdown('# Hello\n\n**Bold**')
 * // Returns: 'Hello\n\nBold'
 */
export function stripMarkdown(markdownText) {
  if (!markdownText || typeof markdownText !== 'string') {
    return ''
  }

  try {
    // Parse to HTML first
    const html = marked.parse(markdownText)
    
    // Create temporary DOM element to extract text
    const temp = document.createElement('div')
    temp.innerHTML = DOMPurify.sanitize(html, DOMPURIFY_CONFIG)
    
    // Get text content (strips all HTML tags)
    const text = temp.textContent || temp.innerText || ''
    
    // Trim trailing newlines but preserve internal spacing
    return text.trim()
  } catch (error) {
    console.error('Error stripping Markdown:', error)
    // Fallback: return original text
    return markdownText
  }
}
