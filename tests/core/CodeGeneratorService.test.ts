import { describe, it, expect } from 'vitest';
import { CodeGeneratorService } from '../../src/core/services/CodeGeneratorService';
import type { CodeGenConfig } from '../../src/core/services/CodeGeneratorService';

describe('CodeGeneratorService.generateSnippet', () => {
  it('generates a self-closing element with no props', () => {
    const config: CodeGenConfig = {
      componentName: 'UxuButton',
      importPath: 'truncgil-uxigl',
      props: {},
    };
    const result = CodeGeneratorService.generateSnippet(config);
    expect(result).toContain("import { UxuButton } from 'truncgil-uxigl'");
    expect(result).toContain('<UxuButton />');
    expect(result).toContain('export function Example()');
  });

  it('renders boolean true prop without value assignment', () => {
    const config: CodeGenConfig = {
      componentName: 'UxuButton',
      importPath: 'truncgil-uxigl',
      props: { disabled: true },
    };
    const result = CodeGeneratorService.generateSnippet(config);
    expect(result).toContain('  disabled');
    expect(result).not.toContain('disabled={true}');
  });

  it('renders boolean false prop with explicit assignment', () => {
    const config: CodeGenConfig = {
      componentName: 'UxuButton',
      importPath: 'truncgil-uxigl',
      props: { disabled: false },
    };
    const result = CodeGeneratorService.generateSnippet(config);
    expect(result).toContain('disabled={false}');
  });

  it('renders number props with curly braces', () => {
    const config: CodeGenConfig = {
      componentName: 'UxuSlider',
      importPath: 'truncgil-uxigl',
      props: { min: 0, max: 100 },
    };
    const result = CodeGeneratorService.generateSnippet(config);
    expect(result).toContain('min={0}');
    expect(result).toContain('max={100}');
  });

  it('renders string props with double quotes', () => {
    const config: CodeGenConfig = {
      componentName: 'UxuButton',
      importPath: 'truncgil-uxigl',
      props: { variant: 'primary', size: 'md' },
    };
    const result = CodeGeneratorService.generateSnippet(config);
    expect(result).toContain('variant="primary"');
    expect(result).toContain('size="md"');
  });

  it('filters out undefined props', () => {
    const config: CodeGenConfig = {
      componentName: 'UxuButton',
      importPath: 'truncgil-uxigl',
      props: { label: undefined, variant: 'ghost' },
    };
    const result = CodeGeneratorService.generateSnippet(config);
    expect(result).not.toContain('label');
    expect(result).toContain('variant="ghost"');
  });

  it('filters out empty string props', () => {
    const config: CodeGenConfig = {
      componentName: 'UxuButton',
      importPath: 'truncgil-uxigl',
      props: { label: '', variant: 'outline' },
    };
    const result = CodeGeneratorService.generateSnippet(config);
    expect(result).not.toContain('label');
    expect(result).toContain('variant="outline"');
  });

  it('renders children with wrapping tags when childrenCode is provided', () => {
    const config: CodeGenConfig = {
      componentName: 'UxuCard',
      importPath: 'truncgil-uxigl',
      props: {},
      childrenCode: 'Hello World',
    };
    const result = CodeGeneratorService.generateSnippet(config);
    expect(result).toContain('<UxuCard');
    expect(result).toContain('</UxuCard>');
    expect(result).toContain('Hello World');
    expect(result).not.toContain('<UxuCard />');
  });

  it('produces valid import statement with correct component name', () => {
    const config: CodeGenConfig = {
      componentName: 'UxuSwitch',
      importPath: 'truncgil-uxigl',
      props: { checked: true },
    };
    const result = CodeGeneratorService.generateSnippet(config);
    expect(result.startsWith("import { UxuSwitch } from 'truncgil-uxigl'")).toBe(true);
  });
});

describe('CodeGeneratorService.tokenize', () => {
  it('tokenizes import keyword', () => {
    const tokens = CodeGeneratorService.tokenize("import { Foo } from 'bar'");
    const keywords = tokens.filter(t => t.type === 'keyword').map(t => t.value);
    expect(keywords).toContain('import');
    expect(keywords).toContain('from');
  });

  it('tokenizes string literals', () => {
    const tokens = CodeGeneratorService.tokenize("const x = 'hello'");
    const strings = tokens.filter(t => t.type === 'string').map(t => t.value);
    expect(strings).toContain("'hello'");
  });

  it('tokenizes numeric literals', () => {
    const tokens = CodeGeneratorService.tokenize('const n = 42');
    const numbers = tokens.filter(t => t.type === 'number').map(t => t.value);
    expect(numbers).toContain('42');
  });

  it('tokenizes JSX tags', () => {
    const tokens = CodeGeneratorService.tokenize('<UxuButton />');
    const tags = tokens.filter(t => t.type === 'tag').map(t => t.value);
    expect(tags.some(t => t.includes('UxuButton'))).toBe(true);
  });

  it('tokenizes comment lines', () => {
    const tokens = CodeGeneratorService.tokenize('// this is a comment');
    const comments = tokens.filter(t => t.type === 'comment').map(t => t.value);
    expect(comments[0]).toContain('this is a comment');
  });

  it('returns plain tokens for unmatched text', () => {
    const tokens = CodeGeneratorService.tokenize('hello world');
    expect(tokens.some(t => t.type === 'plain')).toBe(true);
  });

  it('handles empty string', () => {
    const tokens = CodeGeneratorService.tokenize('');
    expect(tokens).toHaveLength(0);
  });

  it('handles double-quoted strings', () => {
    const tokens = CodeGeneratorService.tokenize('"double quoted"');
    const strings = tokens.filter(t => t.type === 'string');
    expect(strings[0].value).toBe('"double quoted"');
  });
});
