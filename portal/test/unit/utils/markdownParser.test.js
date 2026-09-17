const { renderMarkdown } = require('../../../src/utils/markdownParser');

describe('renderMarkdown', () => {
  it('should render basic markdown to HTML', () => {
    const result = renderMarkdown('# Hello World');
    expect(result).toContain('<h1>Hello World</h1>');
  });

  it('should render paragraphs correctly', () => {
    const result = renderMarkdown('Hello, world!');
    expect(result).toContain('<p>Hello, world!</p>');
  });

  it('should render code blocks', () => {
    const result = renderMarkdown('```js\nconsole.log(1);\n```');
    expect(result).toContain('<code');
  });

  it('should sanitize script tags to prevent XSS', () => {
    const result = renderMarkdown('<script>alert("xss")</script>');
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('alert');
  });

  it('should sanitize onclick attributes', () => {
    const result = renderMarkdown('<a onclick="evil()">click</a>');
    expect(result).not.toContain('onclick');
  });

  it('should return empty string for empty input', () => {
    const result = renderMarkdown('');
    expect(result.trim()).toBe('');
  });

  it('should return empty string for null input', () => {
    const result = renderMarkdown(null);
    expect(result).toBe('');
  });

  it('should return empty string for undefined input', () => {
    const result = renderMarkdown(undefined);
    expect(result).toBe('');
  });

  it('should add rel="noopener noreferrer" to links with target="_blank"', () => {
    const result = renderMarkdown('<a href="https://example.com" target="_blank">link</a>');
    expect(result).toContain('rel="noopener noreferrer"');
  });

  it('should keep allowed tags like strong and em', () => {
    const result = renderMarkdown('**bold** and _italic_');
    expect(result).toContain('<strong>bold</strong>');
    expect(result).toContain('<em>italic</em>');
  });
});
