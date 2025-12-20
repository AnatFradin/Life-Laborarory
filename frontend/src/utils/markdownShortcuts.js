/**
 * Markdown shortcuts utility
 * 
 * Helper functions for inserting Markdown syntax at cursor or wrapping selected text.
 * Each function returns { text, selectionStart, selectionEnd } for updating editor state.
 */

/**
 * Insert bold formatting (**text**)
 */
export function insertBold(text, selectionStart, selectionEnd) {
  const before = text.substring(0, selectionStart)
  const selected = text.substring(selectionStart, selectionEnd)
  const after = text.substring(selectionEnd)

  if (selected.length > 0) {
    // Wrap selection
    const newText = `${before}**${selected}**${after}`
    return {
      text: newText,
      selectionStart: selectionStart + 2,
      selectionEnd: selectionEnd + 2
    }
  } else {
    // Insert at cursor
    const newText = `${before}****${after}`
    return {
      text: newText,
      selectionStart: selectionStart + 2,
      selectionEnd: selectionStart + 2
    }
  }
}

/**
 * Insert italic formatting (*text*)
 */
export function insertItalic(text, selectionStart, selectionEnd) {
  const before = text.substring(0, selectionStart)
  const selected = text.substring(selectionStart, selectionEnd)
  const after = text.substring(selectionEnd)

  if (selected.length > 0) {
    // Wrap selection
    const newText = `${before}*${selected}*${after}`
    return {
      text: newText,
      selectionStart: selectionStart + 1,
      selectionEnd: selectionEnd + 1
    }
  } else {
    // Insert at cursor
    const newText = `${before}**${after}`
    return {
      text: newText,
      selectionStart: selectionStart + 1,
      selectionEnd: selectionStart + 1
    }
  }
}

/**
 * Insert heading at line start (# text)
 */
export function insertHeading(text, selectionStart, selectionEnd, level = 1) {
  // Find line boundaries without splitting entire text
  let lineStart = text.lastIndexOf('\n', selectionStart - 1) + 1;
  let lineEnd = text.indexOf('\n', selectionStart);
  if (lineEnd === -1) lineEnd = text.length;

  const currentLine = text.substring(lineStart, lineEnd);
  const prefix = '#'.repeat(level) + ' ';
  const existingHeadingMatch = currentLine.match(/^#{1,6} /);

  let newLine;
  if (existingHeadingMatch && existingHeadingMatch[0] === prefix) {
    // Remove existing heading
    newLine = currentLine.replace(/^#{1,6} /, '');
  } else if (existingHeadingMatch) {
    // Replace with different level
    newLine = currentLine.replace(/^#{1,6} /, prefix);
  } else {
    // Add heading
    newLine = prefix + currentLine;
  }

  const before = text.substring(0, lineStart);
  const after = text.substring(lineEnd);
  const newText = before + newLine + after;
  const newSelectionStart = selectionStart + (newLine.length - currentLine.length);

  return {
    text: newText,
    selectionStart: newSelectionStart,
    selectionEnd: newSelectionStart
  };
}

/**
 * Insert unordered list at line start (- text)
 */
export function insertList(text, selectionStart, selectionEnd) {
  return insertLinePrefix(text, selectionStart, '- ')
}

/**
 * Insert ordered list at line start (1. text)
 */
export function insertOrderedList(text, selectionStart, selectionEnd) {
  return insertLinePrefix(text, selectionStart, '1. ')
}

/**
 * Insert blockquote at line start (> text)
 */
export function insertBlockquote(text, selectionStart, selectionEnd) {
  return insertLinePrefix(text, selectionStart, '> ')
}

/**
 * Helper: Insert or remove prefix at line start
 */
function insertLinePrefix(text, selectionStart, prefix) {
  // Find line boundaries without splitting entire text
  let lineStart = text.lastIndexOf('\n', selectionStart - 1) + 1;
  let lineEnd = text.indexOf('\n', selectionStart);
  if (lineEnd === -1) lineEnd = text.length;

  const currentLine = text.substring(lineStart, lineEnd);
  
  let newLine;
  if (currentLine.startsWith(prefix)) {
    // Remove prefix
    newLine = currentLine.substring(prefix.length);
  } else {
    // Add prefix
    newLine = prefix + currentLine;
  }

  const before = text.substring(0, lineStart);
  const after = text.substring(lineEnd);
  const newText = before + newLine + after;
  const newSelectionStart = selectionStart + (newLine.length - currentLine.length);

  return {
    text: newText,
    selectionStart: newSelectionStart,
    selectionEnd: newSelectionStart
  };
}

/**
 * Insert link formatting ([text](url))
 */
export function insertLink(text, selectionStart, selectionEnd, url = '') {
  const before = text.substring(0, selectionStart)
  const selected = text.substring(selectionStart, selectionEnd)
  const after = text.substring(selectionEnd)

  if (selected.length > 0) {
    // Wrap selection
    const newText = `${before}[${selected}](${url})${after}`
    return {
      text: newText,
      selectionStart: selectionStart + 1,
      selectionEnd: selectionStart + 1 + selected.length
    }
  } else {
    // Insert at cursor
    const newText = `${before}[](${url})${after}`
    return {
      text: newText,
      selectionStart: selectionStart + 1,
      selectionEnd: selectionStart + 1
    }
  }
}

/**
 * Insert inline code formatting (`code`)
 */
export function insertCode(text, selectionStart, selectionEnd) {
  const before = text.substring(0, selectionStart)
  const selected = text.substring(selectionStart, selectionEnd)
  const after = text.substring(selectionEnd)

  if (selected.length > 0) {
    // Wrap selection
    const newText = `${before}\`${selected}\`${after}`
    return {
      text: newText,
      selectionStart: selectionStart + 1,
      selectionEnd: selectionEnd + 1
    }
  } else {
    // Insert at cursor
    const newText = `${before}\`\`${after}`
    return {
      text: newText,
      selectionStart: selectionStart + 1,
      selectionEnd: selectionStart + 1
    }
  }
}
