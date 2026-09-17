const { marked } = require('marked');
const sanitizeHtml = require('sanitize-html');

const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'ul', 'ol', 'li',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'code', 'pre', 'blockquote',
  'strong', 'em', 'a', 'img',
  'hr', 'br', 'div', 'span',
];

const ALLOWED_ATTRIBUTES = {
  'a': ['href', 'title', 'target', 'rel'],
  'img': ['src', 'alt', 'title'],
  'code': ['class'],
  'pre': ['class'],
  'th': ['align'],
  'td': ['align'],
};

/**
 * Renders Markdown source to sanitized HTML.
 * @param {string} markdownContent - Raw markdown string
 * @returns {string} Safe HTML string
 */
const renderMarkdown = (markdownContent) => {
  if (typeof markdownContent !== 'string') return '';
  const rawHtml = marked.parse(markdownContent);
  return sanitizeHtml(rawHtml, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    transformTags: {
      'a': (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          ...(attribs.target === '_blank' ? { rel: 'noopener noreferrer' } : {}),
        },
      }),
    },
  });
};

module.exports = { renderMarkdown };
