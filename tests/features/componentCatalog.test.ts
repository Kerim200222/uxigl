import { describe, it, expect } from 'vitest';
import {
  COMPONENT_CATEGORIES,
  COMPONENT_CATALOG,
} from '../../src/features/catalog/componentCatalog';

describe('componentCatalog', () => {
  describe('COMPONENT_CATEGORIES', () => {
    it('defines valid category definitions', () => {
      expect(COMPONENT_CATEGORIES.length).toBeGreaterThanOrEqual(3);
      const categoryIds = COMPONENT_CATEGORIES.map((c) => c.id);
      expect(categoryIds).toContain('inputs');
      expect(categoryIds).toContain('surfaces');
      expect(categoryIds).toContain('feedback');
    });

    it('each category has non-empty label', () => {
      for (const cat of COMPONENT_CATEGORIES) {
        expect(cat.label.trim().length).toBeGreaterThan(0);
      }
    });
  });

  describe('COMPONENT_CATALOG', () => {
    it('contains comprehensive catalog entries', () => {
      expect(COMPONENT_CATALOG.length).toBeGreaterThanOrEqual(15);
    });

    it('has unique ids across all catalog entries', () => {
      const ids = COMPONENT_CATALOG.map((c) => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('all entries belong to valid COMPONENT_CATEGORIES', () => {
      const validCategoryIds = new Set(COMPONENT_CATEGORIES.map((c) => c.id));
      for (const entry of COMPONENT_CATALOG) {
        expect(validCategoryIds.has(entry.category)).toBe(true);
      }
    });

    it('each entry contains essential metadata fields', () => {
      for (const entry of COMPONENT_CATALOG) {
        expect(entry.id).toBeTruthy();
        expect(entry.name).toBeTruthy();
        expect(entry.turkishTitle).toBeTruthy();
        expect(entry.summary).toBeTruthy();
        expect(entry.importPath).toBeTruthy();
        expect(entry.importStatement).toContain('import');
      }
    });

    it('each entry has practical examples with code', () => {
      for (const entry of COMPONENT_CATALOG) {
        expect(entry.examples.length).toBeGreaterThanOrEqual(1);
        for (const ex of entry.examples) {
          expect(ex.id).toBeTruthy();
          expect(ex.title).toBeTruthy();
          expect(ex.code).toBeTruthy();
        }
      }
    });

    it('contains primary UI components in catalog', () => {
      const ids = new Set(COMPONENT_CATALOG.map((c) => c.id));
      expect(ids.has('button')).toBe(true);
      expect(ids.has('input')).toBe(true);
      expect(ids.has('card')).toBe(true);
      expect(ids.has('segmented-control')).toBe(true);
      expect(ids.has('chips-badges')).toBe(true);
    });

    it('includes accessibility and best practice guidelines', () => {
      const buttonEntry = COMPONENT_CATALOG.find((c) => c.id === 'button');
      expect(buttonEntry).toBeDefined();
      expect(buttonEntry?.dos.length).toBeGreaterThan(0);
      expect(buttonEntry?.donts.length).toBeGreaterThan(0);
      expect(buttonEntry?.accessibilityNotes.length).toBeGreaterThan(0);
    });

    it('documents all 8 enterprise page templates including page-settings and EnterpriseSettingsPage', () => {
      const pageTemplatesEntry = COMPONENT_CATALOG.find(
        (c) => c.id === 'page-templates'
      );
      expect(pageTemplatesEntry).toBeDefined();
      expect(pageTemplatesEntry?.summary).toContain('8 hazır tam sayfa şablonu');
      expect(pageTemplatesEntry?.summary).toContain('page-settings');
      expect(pageTemplatesEntry?.importStatement).toContain(
        'EnterpriseSettingsPage'
      );

      const activePageProp = pageTemplatesEntry?.propsTable.find(
        (p) => p.name === 'activePageId'
      );
      expect(activePageProp).toBeDefined();
      expect(activePageProp?.type).toContain("'page-settings'");

      const initialTabProp = pageTemplatesEntry?.propsTable.find((p) =>
        p.name.includes('EnterpriseSettingsPage')
      );
      expect(initialTabProp).toBeDefined();
      expect(initialTabProp?.type).toContain("'appearance'");
    });
  });
});
