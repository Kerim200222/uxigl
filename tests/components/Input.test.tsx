// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Input } from '../../src/components/primitives/Input/Input';

describe('Input accessibility label resolution', () => {
  afterEach(() => {
    cleanup();
  });

  it('does not set aria-label when a JSX ReactNode label is provided, resolving accessible name from <label>', () => {
    render(
      <Input
        label={<span>Email</span>}
        placeholder="Enter email"
        value=""
        onChange={() => {}}
      />
    );

    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).not.toHaveAttribute('aria-label');
    expect(input).toHaveAccessibleName('Email');
  });

  it('falls back to placeholder for aria-label when label is omitted', () => {
    render(
      <Input
        placeholder="Search..."
        value=""
        onChange={() => {}}
      />
    );

    const input = screen.getByRole('textbox', { name: 'Search...' });
    expect(input).toHaveAttribute('aria-label', 'Search...');
  });

  it('gives explicit aria-label precedence even when label and placeholder are both provided', () => {
    render(
      <Input
        label={<span>Email</span>}
        placeholder="Enter email"
        aria-label="Custom label"
        value=""
        onChange={() => {}}
      />
    );

    const input = screen.getByRole('textbox', { name: 'Custom label' });
    expect(input).toHaveAttribute('aria-label', 'Custom label');
    expect(input).toHaveAccessibleName('Custom label');
  });
});
