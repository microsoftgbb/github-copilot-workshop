import { fetchModules, fetchModule } from './api.js';

const LS_KEY = 'workshop-language';

/** All modules list for prev/next navigation. @type {Array} */
let allModules = [];

/**
 * Escapes HTML special characters in a string.
 * @param {string} str
 * @returns {string}
 */
const escapeHtml = (str) =>
  str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Renders the code files section.
 * @param {Array} codeFiles
 */
const renderCodeFiles = (codeFiles) => {
  const section  = document.getElementById('code-files-section');
  const container = document.getElementById('code-files');

  if (!codeFiles || codeFiles.length === 0) {
    section.classList.add('hidden');
    return;
  }

  container.innerHTML = '';
  codeFiles.forEach(({ filename, language, content }) => {
    const block = document.createElement('div');
    block.className = 'code-file-block';
    block.innerHTML = `
      <div class="code-file-header">
        <span class="badge badge-${language}">${language}</span>
        <span>${escapeHtml(filename)}</span>
      </div>
      <div class="code-file-content"><code>${escapeHtml(content)}</code></div>
    `;
    container.appendChild(block);
  });
  section.classList.remove('hidden');
};

/**
 * Updates the prev/next navigation buttons.
 * @param {string} currentId
 */
const updateNavigation = (currentId) => {
  const idx     = allModules.findIndex(m => m.id === currentId);
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');

  if (idx > 0) {
    btnPrev.disabled = false;
    btnPrev.onclick  = () => { window.location.href = `/module.html?id=${encodeURIComponent(allModules[idx - 1].id)}`; };
  }
  if (idx < allModules.length - 1) {
    btnNext.disabled = false;
    btnNext.onclick  = () => { window.location.href = `/module.html?id=${encodeURIComponent(allModules[idx + 1].id)}`; };
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  const params   = new URLSearchParams(window.location.search);
  const moduleId = params.get('id');
  const loading  = document.getElementById('loading');
  const errorEl  = document.getElementById('error-message');
  const readme   = document.getElementById('readme-content');

  if (!moduleId) {
    loading.classList.add('hidden');
    errorEl.classList.remove('hidden');
    errorEl.textContent = 'No module ID specified.';
    return;
  }

  const savedLang = localStorage.getItem(LS_KEY) || '';
  let currentLang = params.get('language') || savedLang || undefined;

  // Set active language button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === (currentLang || ''));
    btn.addEventListener('click', () => {
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const lang = btn.dataset.lang || undefined;
      if (lang) localStorage.setItem(LS_KEY, lang);
      else      localStorage.removeItem(LS_KEY);
      window.location.href = `/module.html?id=${encodeURIComponent(moduleId)}${lang ? `&language=${lang}` : ''}`;
    });
  });

  try {
    // Load module detail + all modules (for nav) in parallel
    const [moduleData, allData] = await Promise.all([
      fetchModule(moduleId, currentLang),
      fetchModules(undefined),
    ]);

    allModules = allData.modules;
    const mod  = moduleData.module;

    document.title = `${mod.title} — GitHub Copilot Workshop`;
    document.getElementById('module-title').textContent = mod.title;

    // Render meta sidebar using DOM API to prevent XSS
    const meta = document.getElementById('module-meta');
    const metaItems = [
      mod.duration ? ['Duration', mod.duration] : null,
      mod.format   ? ['Format',   mod.format]   : null,
    ].filter(Boolean);
    if (metaItems.length > 0) {
      const dl = document.createElement('dl');
      for (const [k, v] of metaItems) {
        const dt = document.createElement('dt');
        dt.textContent = k;
        const dd = document.createElement('dd');
        dd.textContent = v;
        dl.append(dt, dd);
      }
      meta.appendChild(dl);
    }

    loading.classList.add('hidden');

    if (mod.readmeHtml) {
      readme.innerHTML = mod.readmeHtml;
      readme.classList.remove('hidden');
    }

    renderCodeFiles(mod.codeFiles);
    updateNavigation(moduleId);
  } catch (err) {
    loading.classList.add('hidden');
    errorEl.classList.remove('hidden');
    errorEl.textContent = `Error: ${err.message}`;
  }
});
