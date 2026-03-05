import { fetchModules } from './api.js';

const LS_KEY = 'workshop-language';

/**
 * Escapes HTML special characters to prevent XSS.
 * @param {string} str
 * @returns {string}
 */
const escapeHtml = (str) =>
  String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * Renders a single module card element using DOM APIs to prevent XSS.
 * @param {Object} mod - Module metadata
 * @returns {HTMLLIElement}
 */
const renderModuleCard = (mod) => {
  const li = document.createElement('li');
  li.className = 'module-card';

  const orderDiv = document.createElement('div');
  orderDiv.className = 'module-card-order';
  orderDiv.textContent = `Module ${String(mod.order).padStart(2, '0')}`;

  const titleDiv = document.createElement('div');
  titleDiv.className = 'module-card-title';
  const titleLink = document.createElement('a');
  titleLink.href = `/module.html?id=${encodeURIComponent(mod.id)}`;
  titleLink.textContent = mod.title;
  titleDiv.appendChild(titleLink);

  li.appendChild(orderDiv);
  li.appendChild(titleDiv);

  const metaParts = [mod.duration, mod.format].filter(Boolean);
  if (metaParts.length > 0) {
    const metaDiv = document.createElement('div');
    metaDiv.className = 'module-card-meta';
    metaDiv.textContent = metaParts.join(' · ');
    li.appendChild(metaDiv);
  }

  if (mod.description) {
    const descDiv = document.createElement('div');
    descDiv.className = 'module-card-description';
    descDiv.textContent = mod.description;
    li.appendChild(descDiv);
  }

  const badgesDiv = document.createElement('div');
  badgesDiv.className = 'module-card-badges';
  mod.languages.forEach(lang => {
    const badge = document.createElement('span');
    badge.className = `badge badge-${escapeHtml(lang)}`;
    badge.textContent = lang;
    badgesDiv.appendChild(badge);
  });
  li.appendChild(badgesDiv);

  return li;
};

/**
 * Loads and renders the modules list for the given language filter.
 * @param {string|undefined} language
 */
const loadModules = async (language) => {
  const grid    = document.getElementById('module-grid');
  const loading = document.getElementById('loading');
  const errorEl = document.getElementById('error-message');

  grid.innerHTML = '';
  errorEl.classList.add('hidden');
  loading.classList.remove('hidden');

  try {
    const { modules } = await fetchModules(language);
    loading.classList.add('hidden');
    if (modules.length === 0) {
      grid.innerHTML = '<li style="color:var(--color-text-muted);padding:1rem 0">No modules found for this filter.</li>';
      return;
    }
    modules.forEach(mod => grid.appendChild(renderModuleCard(mod)));
  } catch (err) {
    loading.classList.add('hidden');
    errorEl.classList.remove('hidden');
    errorEl.textContent = `Error loading modules: ${err.message}`;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem(LS_KEY) || '';

  // Restore active button state
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === savedLang);
    btn.addEventListener('click', () => {
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const lang = btn.dataset.lang || undefined;
      if (lang) localStorage.setItem(LS_KEY, lang);
      else      localStorage.removeItem(LS_KEY);
      loadModules(lang);
    });
  });

  loadModules(savedLang || undefined);
});
