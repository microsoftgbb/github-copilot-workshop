'use strict';

const { getAllModules, getModuleById, filterByLanguage } = require('../src/services/moduleService');

describe('moduleService', () => {
  test('should return all 7 modules', () => {
    const modules = getAllModules();
    expect(modules).toHaveLength(7);
  });

  test('should find a module by id', () => {
    const module = getModuleById('module-01-core-experience');
    expect(module).toBeDefined();
    expect(module.title).toBe('Copilot in VS Code Core Experience');
  });

  test('should return undefined for unknown module id', () => {
    const module = getModuleById('module-99-nonexistent');
    expect(module).toBeUndefined();
  });

  test('should filter modules by language', () => {
    const jsModules = filterByLanguage('javascript');
    expect(jsModules.length).toBeGreaterThan(0);
    jsModules.forEach(function(m) {
      expect(
        m.languages.length === 0 || m.languages.includes('javascript')
      ).toBe(true);
    });
  });
});
