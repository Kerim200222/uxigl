// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { Tabs, type TabItem } from '../../src/components/composites/Tabs/Tabs';

const SAMPLE_TABS: TabItem[] = [
  { id: 'overview', label: 'Genel Bakış', count: 4 },
  { id: 'security', label: 'Güvenlik', count: 12 },
  { id: 'audit', label: 'Denetim Kayıtları', disabled: true },
  { id: 'docs', label: 'Dokümantasyon', href: '/docs/getting-started' },
];

describe('Tabs', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders tablist, tabs, active indicator, count badges, roving tabIndex, and variant classes', () => {
    const { container, rerender } = render(
      <Tabs
        id="workspace-tabs"
        items={SAMPLE_TABS}
        activeId="overview"
        onChange={() => {}}
        variant="underline"
        size="sm"
      />
    );

    const tablist = screen.getByRole('tablist');
    expect(tablist).toHaveClass('uxu-tabs--underline', 'uxu-tabs--sm');
    expect(container.querySelector('.uxu-tabs__indicator')).not.toBeNull();

    const overviewTab = screen.getByRole('tab', { name: /Genel Bakış/i });
    const securityTab = screen.getByRole('tab', { name: /Güvenlik/i });
    const auditTab = screen.getByRole('tab', { name: /Denetim Kayıtları/i });
    const docsTab = screen.getByRole('tab', { name: /Dokümantasyon/i });

    expect(overviewTab).toHaveAttribute('aria-selected', 'true');
    expect(overviewTab).toHaveAttribute('tabIndex', '0');
    expect(securityTab).toHaveAttribute('aria-selected', 'false');
    expect(securityTab).toHaveAttribute('tabIndex', '-1');
    expect(auditTab).toBeDisabled();
    expect(auditTab).toHaveAttribute('aria-disabled', 'true');
    expect(docsTab.tagName).toBe('A');
    expect(docsTab).toHaveAttribute('href', '/docs/getting-started');

    rerender(
      <Tabs
        items={SAMPLE_TABS}
        activeId="security"
        onChange={() => {}}
        variant="pill"
      />
    );
    expect(screen.getByRole('tablist')).toHaveClass('uxu-tabs--pill');
    expect(container.querySelector('.uxu-tabs__indicator')).toBeNull();
  });

  it('supports click and WAI-ARIA keyboard navigation (ArrowRight, ArrowLeft, Home, End) skipping disabled tabs', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Tabs items={SAMPLE_TABS} activeId="overview" onChange={onChange} />
    );

    const overviewTab = screen.getByRole('tab', { name: /Genel Bakış/i });
    const securityTab = screen.getByRole('tab', { name: /Güvenlik/i });
    const auditTab = screen.getByRole('tab', { name: /Denetim Kayıtları/i });
    const docsTab = screen.getByRole('tab', { name: /Dokümantasyon/i });

    // Clicking disabled tab does not trigger onChange
    await user.click(auditTab);
    expect(onChange).not.toHaveBeenCalled();

    // Clicking enabled tab triggers onChange
    await user.click(securityTab);
    expect(onChange).toHaveBeenCalledWith('security');

    // ArrowRight from 'security' skips disabled 'audit' -> 'docs'
    securityTab.focus();
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith('docs');
    expect(docsTab).toHaveFocus();

    // ArrowRight from 'docs' wraps around -> 'overview'
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith('overview');
    expect(overviewTab).toHaveFocus();

    // ArrowLeft from 'overview' wraps around -> 'docs'
    await user.keyboard('{ArrowLeft}');
    expect(onChange).toHaveBeenLastCalledWith('docs');
    expect(docsTab).toHaveFocus();

    // Home -> 'overview', End -> 'docs'
    await user.keyboard('{Home}');
    expect(onChange).toHaveBeenLastCalledWith('overview');
    expect(overviewTab).toHaveFocus();

    await user.keyboard('{End}');
    expect(onChange).toHaveBeenLastCalledWith('docs');
    expect(docsTab).toHaveFocus();
  });
});
