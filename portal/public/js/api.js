const API_BASE = '/api';

/**
 * Fetches the list of all modules, optionally filtered by language.
 * @param {string|undefined} language
 * @returns {Promise<{modules: Array}>}
 */
const fetchModules = async (language) => {
  const params = language ? `?language=${encodeURIComponent(language)}` : '';
  const response = await fetch(`${API_BASE}/modules${params}`);
  if (!response.ok) throw new Error(`Failed to fetch modules: ${response.statusText}`);
  return response.json();
};

/**
 * Fetches full detail for a single module.
 * @param {string} moduleId
 * @param {string|undefined} language
 * @returns {Promise<{module: Object}>}
 */
const fetchModule = async (moduleId, language) => {
  const params = language ? `?language=${encodeURIComponent(language)}` : '';
  const response = await fetch(`${API_BASE}/modules/${encodeURIComponent(moduleId)}${params}`);
  if (!response.ok) throw new Error(`Failed to fetch module ${moduleId}: ${response.statusText}`);
  return response.json();
};

export { fetchModules, fetchModule };
